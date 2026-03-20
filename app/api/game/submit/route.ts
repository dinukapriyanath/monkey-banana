import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import Score from "@/models/Score"
import GameProgress from "@/models/GameProgress"
import { verifyToken } from "@/lib/auth"
import { getLevelInfo, STAGES } from "@/config/gameConfig"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 })
    const token = authHeader.replace("Bearer ", "")
    const decoded = verifyToken(token) as any
    if (!decoded) return Response.json({ error: "Invalid token" }, { status: 401 })

    const { answer, correctAnswer, timeRemaining, globalLevel } = await req.json()

    const correct = Number(answer) === Number(correctAnswer)
    let bananasEarned = 0

    if (correct) {
      bananasEarned = 10 + (timeRemaining || 0) * 2
    }

    await connectDB()

    const levelInfo = getLevelInfo(globalLevel)
    if (!levelInfo) return Response.json({ error: "Invalid level" }, { status: 400 })

    const userId = decoded.userId

    if (correct) {
      // Save score
      await Score.create({
        userId,
        globalLevel,
        stage: levelInfo.stage.id,
        level: levelInfo.level.id,
        bananasEarned,
        timeRemaining: timeRemaining || 0,
      })

      // Update user total bananas
      await User.findByIdAndUpdate(userId, { $inc: { totalBananas: bananasEarned } })

      // Update progress: unlock next level if this is their highest
      const nextLevel = globalLevel + 1
      await GameProgress.findOneAndUpdate(
        { userId },
        {
          $max: { completedLevel: globalLevel, unlockedLevel: Math.min(nextLevel, 10) },
          $inc: { totalBananasCollected: bananasEarned },
        },
        { upsert: true }
      )
    } else {
      // Lose a life
      await GameProgress.findOneAndUpdate(
        { userId },
        { $inc: { livesRemaining: -1 } },
        { upsert: true }
      )
    }

    return Response.json({ correct, bananasEarned })
  } catch (err) {
    console.error(err)
    return Response.json({ error: "Submit failed" }, { status: 500 })
  }
}
