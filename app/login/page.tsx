"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        if (data.progress) localStorage.setItem("progress", JSON.stringify(data.progress))
        router.push("/game")
      } else {
        setError(data.error || "Login failed")
      }
    } catch { setError("Something went wrong") }
    finally { setLoading(false) }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/jungle.jpg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0" style={{background:"radial-gradient(ellipse 120% 80% at 50% 100%, rgba(45,106,45,0.35) 0%, transparent 70%)"}} />

      <span className="absolute top-20 left-16 text-5xl animate-float opacity-25 select-none">🍌</span>
      <span className="absolute bottom-20 right-16 text-4xl animate-float-b opacity-20 select-none" style={{animationDelay:"1.2s"}}>🍌</span>

      <div className="relative z-10 w-[400px] px-4 animate-slide-up">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm hover:text-yellow-400 transition-colors" style={{color:"rgba(255,255,255,0.4)"}}>
          ← Back to home
        </Link>

        <div className="glass rounded-3xl p-8 shadow-2xl" style={{border:"1px solid rgba(255,217,61,0.2)", boxShadow:"0 0 60px rgba(0,0,0,0.5)"}}>
          {/* Header */}
          <div className="text-center mb-7">
            <img src="/images/monkey-idle.png" alt="Monkey" className="w-20 h-20 object-contain mx-auto mb-3 animate-float" />
            <h1 className="font-game text-4xl text-yellow-400" style={{textShadow:"0 0 20px rgba(255,217,61,0.4)"}}>WELCOME BACK</h1>
            <p className="text-sm mt-1" style={{color:"rgba(255,255,255,0.4)"}}>Sign in to continue your heist</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl text-sm text-center animate-shake"
              style={{background:"rgba(255,68,68,0.15)", border:"1px solid rgba(255,68,68,0.35)", color:"#ff8888"}}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-wider uppercase" style={{color:"rgba(255,255,255,0.4)"}}>Email</label>
              <input type="email" required placeholder="monkey@jungle.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="input-game" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5 tracking-wider uppercase" style={{color:"rgba(255,255,255,0.4)"}}>Password</label>
              <input type="password" required placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                className="input-game" />
            </div>
            <button type="submit" disabled={loading} className="btn-banana w-full mt-2 text-xl py-4 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "🍌 Swinging in..." : "🍌 START HEIST"}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{color:"rgba(255,255,255,0.35)"}}>
            New monkey?{" "}
            <Link href="/register" className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors">
              Join the Jungle →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
