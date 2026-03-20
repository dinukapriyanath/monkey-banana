"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AVATARS } from "@/config/gameConfig"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [avatar, setAvatar] = useState("🐒")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, avatar }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/game")
      } else {
        setError(data.error || "Registration failed")
      }
    } catch { setError("Something went wrong") }
    finally { setLoading(false) }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-10">
      <div className="absolute inset-0 bg-[url('/images/jungle.jpg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0" style={{background:"radial-gradient(ellipse 120% 80% at 50% 100%, rgba(45,106,45,0.35) 0%, transparent 70%)"}} />

      <span className="absolute top-16 right-20 text-5xl animate-float opacity-20 select-none">🍌</span>
      <span className="absolute bottom-16 left-16 text-4xl animate-float-b opacity-20 select-none" style={{animationDelay:"0.8s"}}>🍌</span>

      <div className="relative z-10 w-[420px] px-4 animate-slide-up">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm hover:text-yellow-400 transition-colors" style={{color:"rgba(255,255,255,0.4)"}}>
          ← Back to home
        </Link>

        <div className="glass rounded-3xl p-8 shadow-2xl" style={{border:"1px solid rgba(255,217,61,0.2)", boxShadow:"0 0 60px rgba(0,0,0,0.5)"}}>
          <div className="text-center mb-6">
            <span className="text-5xl block mb-2" style={{filter:"drop-shadow(0 0 12px rgba(255,217,61,0.5))"}}>{avatar}</span>
            <h1 className="font-game text-4xl text-yellow-400" style={{textShadow:"0 0 20px rgba(255,217,61,0.4)"}}>JOIN THE JUNGLE</h1>
            <p className="text-sm mt-1" style={{color:"rgba(255,255,255,0.4)"}}>Choose your avatar and start stealing</p>
          </div>

          {/* Avatar picker */}
          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 tracking-wider uppercase" style={{color:"rgba(255,255,255,0.4)"}}>Your Avatar</label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map(a => (
                <button key={a} type="button" onClick={() => setAvatar(a)}
                  className="text-3xl py-2 rounded-2xl transition-all duration-200"
                  style={{
                    background: avatar === a ? "rgba(255,217,61,0.2)" : "rgba(255,255,255,0.05)",
                    border: avatar === a ? "2px solid rgba(255,217,61,0.7)" : "2px solid transparent",
                    transform: avatar === a ? "scale(1.15)" : "scale(1)",
                    boxShadow: avatar === a ? "0 0 16px rgba(255,217,61,0.3)" : "none",
                  }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-center animate-shake"
              style={{background:"rgba(255,68,68,0.15)", border:"1px solid rgba(255,68,68,0.35)", color:"#ff8888"}}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-wider uppercase" style={{color:"rgba(255,255,255,0.4)"}}>Username</label>
              <input placeholder="CoolMonkey123" required value={username}
                onChange={e => setUsername(e.target.value)} className="input-game" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-wider uppercase" style={{color:"rgba(255,255,255,0.4)"}}>Email</label>
              <input type="email" placeholder="monkey@jungle.com" required value={email}
                onChange={e => setEmail(e.target.value)} className="input-game" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-wider uppercase" style={{color:"rgba(255,255,255,0.4)"}}>Password</label>
              <input type="password" placeholder="••••••••" required value={password}
                onChange={e => setPassword(e.target.value)} className="input-game" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-banana w-full mt-2 text-xl py-4 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : `${avatar} CREATE ACCOUNT`}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{color:"rgba(255,255,255,0.35)"}}>
            Already a monkey?{" "}
            <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors">Login →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
