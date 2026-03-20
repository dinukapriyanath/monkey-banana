import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET!

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}


export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed)
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}