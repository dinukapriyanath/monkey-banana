"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Entry {
  _id: string; username: string; avatar: string
  totalBananas: number; totalGames: number; highestLevel: number
}

const LEVEL_NAMES = ["","Small Banana Stall","Village Fruit Shop","Mini Market","City Fruit Market","Big Supermarket","Storage Depot","Wholesale Banana Store","Shipping Warehouse","Mega Banana Factory","Golden Banana Vault"]

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [me, setMe] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setMe(JSON.parse(stored))
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(d => setEntries(d.leaderboard || []))
      .finally(() => setLoading(false))
  }, [])

  const top3Styles = [
    { size: "text-6xl", label: "🥇", color: "#FFD700", bg: "rgba(255,215,0,0.12)", border: "rgba(255,215,0,0.4)", glow: "rgba(255,215,0,0.3)", order: 2, mt: 0 },
    { size: "text-5xl", label: "🥈", color: "#C0C0C0", bg: "rgba(192,192,192,0.08)", border: "rgba(192,192,192,0.3)", glow: "rgba(192,192,192,0.15)", order: 1, mt: 32 },
    { size: "text-5xl", label: "🥉", color: "#CD7F32", bg: "rgba(205,127,50,0.08)", border: "rgba(205,127,50,0.3)", glow: "rgba(205,127,50,0.15)", order: 3, mt: 48 },
  ]

  return (
    <div className="min-h-screen">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{background:"radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 70%)"}} />
      </div>

      {/* HUD */}
      <div className="hud sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="font-game text-3xl text-yellow-400">🏆</span>
            <div>
              <h1 className="font-game text-2xl text-yellow-400">LEADERBOARD</h1>
              <p className="text-xs" style={{color:"rgba(255,255,255,0.35)"}}>Top banana thieves in the jungle</p>
            </div>
          </div>
          <div className="flex gap-2">
            {me && (
              <Link href="/game">
                <button className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{background:"rgba(255,217,61,0.1)", border:"1px solid rgba(255,217,61,0.2)", color:"rgba(255,217,61,0.8)"}}>
                  🎮 Play
                </button>
              </Link>
            )}
            <Link href="/">
              <button className="px-4 py-2 rounded-xl text-sm transition-all"
                style={{border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)"}}>
                ← Home
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center gap-4 mt-24">
            <img src="/images/monkey-idle.png" className="w-24 animate-float" />
            <p className="font-game text-2xl text-yellow-400">Loading rankings...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center mt-24">
            <p className="text-6xl mb-4">🐒</p>
            <p className="font-game text-2xl text-yellow-400 mb-2">NO SCORES YET</p>
            <p className="mb-6" style={{color:"rgba(255,255,255,0.4)"}}>Be the first to steal bananas!</p>
            <Link href="/game"><button className="btn-banana text-xl py-4 px-10">🍌 START HEIST</button></Link>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            {entries.length >= 3 && (
              <div className="flex items-end justify-center gap-4 mb-12 mt-4">
                {[1, 0, 2].map(rankIdx => {
                  if (!entries[rankIdx]) return null
                  const e = entries[rankIdx]
                  const s = top3Styles[rankIdx]
                  const isMe = me?.username === e.username
                  return (
                    <div key={e._id}
                      className={`flex flex-col items-center rounded-3xl p-5 transition-all ${rankIdx === 0 ? "flex-[1.2]" : "flex-1"}`}
                      style={{
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                        boxShadow: `0 8px 40px ${s.glow}`,
                        marginTop: s.mt,
                        order: s.order,
                      }}>
                      <span className={`${s.size} mb-2`}>{e.avatar || "🐒"}</span>
                      <span className="text-2xl mb-1">{s.label}</span>
                      <p className="font-bold text-white text-sm text-center leading-tight">{e.username}</p>
                      {isMe && <span className="text-xs mt-1 px-2 py-0.5 rounded-full font-bold"
                        style={{background:"rgba(74,222,128,0.2)", color:"#4ade80"}}>YOU</span>}
                      <p className="font-game text-2xl mt-2" style={{color: s.color}}>{e.totalBananas}</p>
                      <p className="text-xs" style={{color:"rgba(255,255,255,0.35)"}}>🍌 bananas</p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Rest of list */}
            <div className="flex flex-col gap-2">
              {entries.slice(3).map((e, i) => {
                const rank = i + 4
                const isMe = me?.username === e.username
                return (
                  <div key={e._id}
                    className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all"
                    style={{
                      background: isMe ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.04)",
                      border: isMe ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.07)",
                    }}>
                    <span className="font-game text-xl w-8 text-center" style={{color:"rgba(255,255,255,0.3)"}}>#{rank}</span>
                    <span className="text-2xl">{e.avatar || "🐒"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm truncate">{e.username}</p>
                        {isMe && <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                          style={{background:"rgba(74,222,128,0.2)", color:"#4ade80"}}>YOU</span>}
                      </div>
                      <p className="text-xs truncate" style={{color:"rgba(255,255,255,0.35)"}}>
                        Best: {LEVEL_NAMES[e.highestLevel] || "—"} · {e.totalGames} games
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-game text-xl text-yellow-400">{e.totalBananas} 🍌</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
