"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { STAGES } from "@/config/gameConfig"

interface Progress { unlockedLevel: number; completedLevel: number; livesRemaining: number; totalBananasCollected: number }

const stageStyles = [
  { bg: "linear-gradient(135deg, #0f2a10 0%, #070f07 100%)", accent: "#4ade80", glow: "rgba(74,222,128," },
  { bg: "linear-gradient(135deg, #0f1f2a 0%, #07080f 100%)", accent: "#38bdf8", glow: "rgba(56,189,248," },
  { bg: "linear-gradient(135deg, #2a0f0f 0%, #0f0707 100%)", accent: "#fb923c", glow: "rgba(251,146,60," },
]

export default function StagePage() {
  const params = useParams()
  const router = useRouter()
  const stageId = Number(params.stageId)
  const stage = STAGES.find(s => s.id === stageId)
  const style = stageStyles[(stageId - 1) % 3]

  const [progress, setProgress] = useState<Progress | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    fetch("/api/game/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.push("/login"); return }
        setUser(data.user); setProgress(data.progress)
      })
      .finally(() => setLoading(false))
  }, [])

  if (!stage) return null
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <img src="/images/monkey-idle.png" className="w-24 animate-float" />
    </div>
  )

  const isLevelUnlocked = (gl: number) => progress ? gl <= progress.unlockedLevel : false
  const isLevelCompleted = (gl: number) => progress ? gl <= progress.completedLevel : false

  return (
    <div className="min-h-screen" style={{background: style.bg}}>
      {/* Top glow */}
      <div className="absolute inset-x-0 top-0 h-64 pointer-events-none"
        style={{background:`radial-gradient(ellipse 60% 100% at 50% 0%, ${style.glow}0.15) 0%, transparent 100%)`}} />

      {/* HUD */}
      <div className="hud sticky top-0 z-40">
        <div className="max-w-xl mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{user?.avatar || "🐒"}</span>
            <div>
              <p className="font-bold text-white text-sm leading-none">{user?.username}</p>
              <p className="text-xs" style={{color:"rgba(255,255,255,0.4)"}}>Stage {stageId} · {stage.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{background:"rgba(255,217,61,0.1)", border:"1px solid rgba(255,217,61,0.2)"}}>
              <span>🍌</span>
              <span className="font-game text-lg text-yellow-400">{user?.totalBananas || 0}</span>
            </div>
            <Link href="/game">
              <button className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/10"
                style={{border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.5)"}}>
                ← Back
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-xl mx-auto px-4 py-10">
        {/* Stage header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4"
            style={{background:`${style.glow}0.15)`, border:`2px solid ${style.accent}40`}}>
            {stage.emoji}
          </div>
          <h1 className="font-game text-4xl mb-1" style={{color: style.accent, textShadow:`0 0 24px ${style.glow}0.5)`}}>
            {stage.name.toUpperCase()}
          </h1>
          <p className="text-sm" style={{color:"rgba(255,255,255,0.4)"}}>{stage.description}</p>
          <div className="flex justify-center gap-4 mt-3">
            <span className="text-xs px-3 py-1.5 rounded-full" style={{background:"rgba(0,0,0,0.4)", color:"rgba(255,255,255,0.4)"}}>
              ⏱ {stage.timer}s per puzzle
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full" style={{background:"rgba(0,0,0,0.4)", color:"rgba(255,255,255,0.4)"}}>
              📍 {stage.levels.length} levels
            </span>
          </div>
        </div>

        {/* Level cards */}
        <div className="flex flex-col gap-4">
          {stage.levels.map((level, i) => {
            const unlocked = isLevelUnlocked(level.globalLevel)
            const completed = isLevelCompleted(level.globalLevel)

            return (
              <div key={level.globalLevel}
                className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  background: completed ? `${style.glow}0.08)` : unlocked ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.3)",
                  border: completed ? `1px solid ${style.accent}50` : unlocked ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.05)",
                  boxShadow: completed ? `0 4px 24px ${style.glow}0.15)` : "none",
                }}>
                <div className="flex items-center gap-4 p-5">
                  {/* Number circle */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-game text-2xl"
                    style={{
                      background: completed ? style.accent : unlocked ? `${style.glow}0.15)` : "rgba(255,255,255,0.05)",
                      color: completed ? "#0f1f0f" : unlocked ? style.accent : "rgba(255,255,255,0.2)",
                      border: `2px solid ${completed ? "transparent" : unlocked ? style.accent+"50" : "rgba(255,255,255,0.08)"}`,
                    }}>
                    {completed ? "✓" : unlocked ? level.id : "🔒"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm leading-none mb-1 truncate">{level.name}</p>
                    <p className="text-xs" style={{color: completed ? style.accent : unlocked ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"}}>
                      {completed ? "✅ Completed" : unlocked ? "🍌 Ready to rob!" : "🔒 Complete previous level first"}
                    </p>
                  </div>

                  {/* Action */}
                  {unlocked && (
                    <Link href={`/game/level/${level.globalLevel}`}>
                      <button className="px-5 py-2.5 rounded-xl font-game tracking-wide transition-all hover:scale-105 active:scale-95 text-base"
                        style={{
                          background: completed
                            ? `linear-gradient(135deg, ${style.accent}cc, ${style.accent})`
                            : `linear-gradient(135deg, #FFD93D, #F4A926)`,
                          color: "#0f1f0f",
                          boxShadow: `0 4px 16px ${completed ? style.glow : "rgba(255,217,61,"}0.3)`,
                        }}>
                        {completed ? "REPLAY" : "PLAY →"}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
