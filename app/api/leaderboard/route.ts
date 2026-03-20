import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import Score from "@/models/Score"

export async function GET() {
  try {
    await connectDB()

    // Aggregate best score per user
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: "scores",
          localField: "_id",
          foreignField: "userId",
          as: "scores",
        },
      },
      {
        $project: {
          username: 1,
          avatar: 1,
          totalBananas: 1,
          totalGames: { $size: "$scores" },
          highestLevel: { $max: "$scores.globalLevel" },
        },
      },
      { $sort: { totalBananas: -1 } },
      { $limit: 20 },
    ])

    return Response.json({ leaderboard })
  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 })
  }
}
