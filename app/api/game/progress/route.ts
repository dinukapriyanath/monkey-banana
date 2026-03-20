import { connectDB } from "@/lib/mongodb"
import GameProgress from "@/models/GameProgress"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 })
    const token = authHeader.replace("Bearer ", "")
    const decoded = verifyToken(token) as any
    if (!decoded) return Response.json({ error: "Invalid token" }, { status: 401 })

    await connectDB()

    const userId = decoded.userId
    let progress = await GameProgress.findOne({ userId })
    if (!progress) {
      progress = await GameProgress.create({ userId })
    }
    const user = await User.findById(userId).select("-password")

    return Response.json({
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar || "🐒",
        totalBananas: user.totalBananas,
      },
      progress: {
        unlockedLevel: progress.unlockedLevel,
        completedLevel: progress.completedLevel,
        totalBananasCollected: progress.totalBananasCollected,
        livesRemaining: progress.livesRemaining,
      },
    })
  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 })
  }
}

// Reset lives (e.g. when retrying)
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 })
    const token = authHeader.replace("Bearer ", "")
    const decoded = verifyToken(token) as any
    if (!decoded) return Response.json({ error: "Invalid token" }, { status: 401 })

    await connectDB()
    const { action } = await req.json()

    if (action === "resetLives") {
      await GameProgress.findOneAndUpdate(
        { userId: decoded.userId },
        { $set: { livesRemaining: 3 } },
        { upsert: true }
      )
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 })
  }
}
