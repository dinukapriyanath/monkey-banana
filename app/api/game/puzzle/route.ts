import { getBananaPuzzle } from "@/lib/bananaApi"
import { verifyToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    const token = authHeader.replace("Bearer ", "")
    const decoded = verifyToken(token)
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    const puzzle = await getBananaPuzzle()
    return Response.json(puzzle)
  } catch (err) {
    return Response.json({ error: "Failed to fetch puzzle" }, { status: 500 })
  }
}
