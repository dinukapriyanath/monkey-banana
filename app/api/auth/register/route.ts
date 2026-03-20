import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import GameProgress from "@/models/GameProgress"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(req: Request) {
  const { username, email, password, avatar } = await req.json()

  if (!username || !email || !password) {
    return Response.json({ error: "All fields required" }, { status: 400 })
  }

  await connectDB()

  const existing = await User.findOne({ $or: [{ email }, { username }] })
  if (existing) {
    return Response.json({ error: "User already exists" }, { status: 400 })
  }

  const hashed = await hashPassword(password)

  const user = await User.create({
    username,
    email,
    password: hashed,
    avatar: avatar || "🐒",
  })

  // Create game progress record
  await GameProgress.create({ userId: user._id })

  const token = generateToken(user._id.toString())

  return Response.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      totalBananas: user.totalBananas,
    },
  })
}
