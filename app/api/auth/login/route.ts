import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import GameProgress from "@/models/GameProgress"
import { comparePassword, generateToken } from "@/lib/auth"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  await connectDB()

  const user = await User.findOne({ email })
  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  // Ensure progress record exists
  let progress = await GameProgress.findOne({ userId: user._id })
  if (!progress) {
    progress = await GameProgress.create({ userId: user._id })
  }

  const token = generateToken(user._id.toString())

  return Response.json({
    token,
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
}
