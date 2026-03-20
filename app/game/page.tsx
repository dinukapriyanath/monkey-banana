"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { STAGES } from "@/config/gameConfig"

interface UserData { id: string; username: string; avatar: string; totalBananas: number }
interface Progress { unlockedLevel: number; completedLevel: number; totalBananasCollected: number; livesRemaining: number }

export default function GameHome() {
  const [user, setUser] = useState<UserData | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    fetch("/api/game/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.push("/login"); return }
        setUser(data.user); setProgress(data.progress)
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("progress", JSON.stringify(data.progress))
      })
      .finally(() => setLoading(false))
  }, [])

  const isStageUnlocked = (id: number) => {
    if (!progress) return false
    if (id === 1) return true
    if (id === 2) return progress.completedLevel >= 2
    if (id === 3) return progress.completedLevel >= 5
    return false
  }

  const getStageProgress = (id: number) => {
    const stage = STAGES.find(s => s.id === id)!
    const done = progress ? stage.levels.filter(l => progress.completedLevel >= l.globalLevel).length : 0
    return { done, total: stage.levels.length }
  }

  const stageColors = [
    { from: "#1a4a1a", to: "#0f2a0f", accent: "#4ade80", glow: "rgba(74,222,128,0.2)" },
    { from: "#1a3a4a", to: "#0f202a", accent: "#38bdf8", glow: "rgba(56,189,248,0.2)" },
    { from: "#3a1a1a", to: "#2a0f0f", accent: "#fb923c", glow: "rgba(251,146,60,0.2)" },
  ]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <img src="/images/monkey-idle.png" className="w-28 mx-auto animate-float mb-4" />
        <p className="font-game text-2xl text-yellow-400">Loading your jungle...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* HUD */}
      <div className="hud sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{background:"rgba(255,217,61,0.1)", border:"1px solid rgba(255,217,61,0.3)"}}>
              {user?.avatar || "🐒"}
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-none">{user?.username}</p>
              <p className="text-xs mt-0.5" style={{color:"rgba(255,255,255,0.4)"}}>
                Level {progress?.unlockedLevel || 1} of 10
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{background:"rgba(255,217,61,0.1)", border:"1px solid rgba(255,217,61,0.25)"}}>
              <span className="text-lg">🍌</span>
              <span className="font-game text-xl text-yellow-400">{user?.totalBananas || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{background:"rgba(255,68,68,0.1)", border:"1px solid rgba(255,68,68,0.2)"}}>
              {Array.from({length: 3}).map((_, i) => (
                <span key={i} className="text-lg" style={{opacity: i < (progress?.livesRemaining || 3) ? 1 : 0.2}}>❤️</span>
              ))}
            </div>
            <Link href="/leaderboard">
              <button className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-yellow-400/10"
                style={{border:"1px solid rgba(255,217,61,0.2)", color:"rgba(255,217,61,0.7)"}}>
                🏆
              </button>
            </Link>
            <button onClick={() => { localStorage.clear(); router.push("/") }}
              className="px-3 py-2 rounded-xl text-sm transition-all hover:bg-red-500/10"
              style={{border:"1px solid rgba(255,68,68,0.2)", color:"rgba(255,100,100,0.7)"}}>
              ⬅
            </button>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="h-1 w-full" style={{background:"rgba(255,255,255,0.05)"}}>
          <div className="h-full progress-fill transition-all duration-700"
            style={{width: `${((progress?.completedLevel || 0) / 10) * 100}%`}} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-game text-5xl text-yellow-400 mb-2" style={{textShadow:"0 0 30px rgba(255,217,61,0.4)"}}>
            CHOOSE YOUR HEIST
          </h1>
          <p style={{color:"rgba(255,255,255,0.4)"}}>
            {progress?.completedLevel || 0} / 10 levels completed
          </p>
        </div>

        {/* Stages */}
        <div className="flex flex-col gap-5">
          {STAGES.map((stage, idx) => {
            const unlocked = isStageUnlocked(stage.id)
            const sp = getStageProgress(stage.id)
            const colors = stageColors[idx]
            const completed = sp.done === sp.total && sp.total > 0

            return (
              <div key={stage.id}
                className={`rounded-3xl overflow-hidden transition-all duration-300 ${!unlocked ? "locked-stage" : ""}`}
                style={{
                  background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
                  border: `1px solid ${unlocked ? colors.accent + "40" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: unlocked ? `0 8px 40px ${colors.glow}` : "none",
                }}>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                        style={{background: unlocked ? `${colors.accent}20` : "rgba(255,255,255,0.05)", border:`1px solid ${unlocked ? colors.accent+"40" : "rgba(255,255,255,0.1)"}` }}>
                        {unlocked ? stage.emoji : "🔒"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-game text-xs tracking-widest" style={{color: colors.accent + "99"}}>STAGE {stage.id}</span>
                          {completed && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:`${colors.accent}25`, color:colors.accent}}>✓ DONE</span>}
                          {!unlocked && <span className="text-xs px-2 py-0.5 rounded-full" style={{background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)"}}>LOCKED</span>}
                        </div>
                        <h2 className="font-game text-2xl text-white">{stage.name}</h2>
                        <p className="text-xs mt-0.5" style={{color:"rgba(255,255,255,0.4)"}}>{stage.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info row */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs px-3 py-1.5 rounded-full" style={{background:"rgba(0,0,0,0.3)", color:"rgba(255,255,255,0.5)"}}>
                      ⏱ {stage.timer}s/puzzle
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full" style={{background:"rgba(0,0,0,0.3)", color:"rgba(255,255,255,0.5)"}}>
                      📍 {stage.levels.length} levels
                    </span>
                  </div>

                  {/* Level dots */}
                  <div className="flex gap-2 mb-4">
                    {stage.levels.map(lvl => {
                      const lvlDone = progress && progress.completedLevel >= lvl.globalLevel
                      const lvlUnlocked = progress && lvl.globalLevel <= progress.unlockedLevel
                      return (
                        <div key={lvl.globalLevel}
                          className="flex-1 h-2 rounded-full transition-all duration-500"
                          style={{
                            background: lvlDone ? colors.accent : lvlUnlocked ? `${colors.accent}50` : "rgba(255,255,255,0.1)"
                          }} />
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{color:"rgba(255,255,255,0.35)"}}>
                      {sp.done}/{sp.total} levels cleared
                    </p>
                    {unlocked ? (
                      <Link href={`/game/stage/${stage.id}`}>
                        <button className="px-6 py-2.5 rounded-2xl font-game tracking-wide text-lg transition-all hover:scale-105 active:scale-95"
                          style={{
                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)`,
                            color: "#0f1f0f",
                            boxShadow: `0 4px 20px ${colors.glow}`,
                          }}>
                          {completed ? "🔁 REPLAY" : "→ ENTER"}
                        </button>
                      </Link>
                    ) : (
                      <p className="text-xs" style={{color:"rgba(255,255,255,0.25)"}}>
                        Complete Stage {stage.id - 1} to unlock
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
