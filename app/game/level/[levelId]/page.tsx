"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getLevelInfo, getNextLevel } from "@/config/gameConfig"

// ─── Timer Ring ────────────────────────────
function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 40, circ = 2 * Math.PI * r
  const pct = Math.max(0, seconds / total)
  const danger = seconds <= 5
  const warn = seconds <= Math.floor(total * 0.4)
  const color = danger ? "#ef4444" : warn ? "#f59e0b" : "#4ade80"

  return (
    <div className="relative inline-flex items-center justify-center w-28 h-28">
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full transition-all duration-1000"
        style={{boxShadow: danger ? "0 0 30px rgba(239,68,68,0.5)" : warn ? "0 0 20px rgba(245,158,11,0.4)" : "0 0 20px rgba(74,222,128,0.3)"}} />
      <svg className="absolute -rotate-90" width="112" height="112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
        <circle cx="56" cy="56" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeLinecap="round"
          style={{transition:"stroke-dasharray 1s linear, stroke 0.3s"}} />
      </svg>
      <div className="z-10 text-center">
        <span className={`font-game text-3xl ${danger ? "text-red-400" : warn ? "text-yellow-400" : "text-white"}`}
          style={danger ? {animation:"pulse 0.5s ease-in-out infinite"} : {}}>
          {seconds}
        </span>
        <p className="text-xs" style={{color:"rgba(255,255,255,0.3)"}}>sec</p>
      </div>
    </div>
  )
}

// ─── Confetti ──────────────────────────────
function Confetti() {
  const pieces = Array.from({length: 30}, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ["#FFD93D","#4ade80","#38bdf8","#fb923c","#f472b6"][Math.floor(Math.random() * 5)],
    size: 8 + Math.random() * 8,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    shape: Math.random() > 0.5 ? "circle" : "rect",
  }))
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size, height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }} />
      ))}
    </div>
  )
}

// ─── Level Complete Screen ─────────────────
function LevelCompleteScreen({ bananasEarned, onNext, nextLevelId, isLastLevel }: {
  bananasEarned: number; onNext: () => void; nextLevelId: number | null; isLastLevel: boolean
}) {
  return (
    <>
      <Confetti />
      <div className="fixed inset-0 z-40 flex items-center justify-center" style={{background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)"}}>
        <div className="animate-pop text-center max-w-sm w-full mx-4">
          <div className="glass rounded-3xl p-10 shadow-2xl" style={{border:"2px solid rgba(255,217,61,0.5)", boxShadow:"0 0 80px rgba(255,217,61,0.25)"}}>
            {/* Trophy */}
            <div className="text-8xl mb-2 block" style={{filter:"drop-shadow(0 0 20px rgba(255,215,0,0.6))"}}>🏆</div>
            <h2 className="font-game text-4xl text-yellow-400 mb-1" style={{textShadow:"0 0 20px rgba(255,217,61,0.5)"}}>
              LEVEL COMPLETE!
            </h2>
            <p className="text-green-400 font-bold mb-6">Congrats, monkey thief! 🐒</p>

            <div className="rounded-2xl p-5 mb-6" style={{background:"rgba(255,217,61,0.08)", border:"1px solid rgba(255,217,61,0.2)"}}>
              <p className="text-sm mb-1" style={{color:"rgba(255,255,255,0.5)"}}>Bananas Stolen</p>
              <p className="font-game text-6xl text-yellow-400" style={{textShadow:"0 0 20px rgba(255,217,61,0.5)"}}>
                +{bananasEarned} 🍌
              </p>
            </div>

            {isLastLevel ? (
              <div className="flex flex-col gap-3">
                <p className="font-game text-2xl text-yellow-400 mb-2">🎉 ALL LEVELS DONE!</p>
                <Link href="/leaderboard">
                  <button className="btn-banana w-full text-xl py-4">🏆 VIEW LEADERBOARD</button>
                </Link>
                <Link href="/game">
                  <button className="btn-green w-full text-xl py-3">🏠 HOME</button>
                </Link>
              </div>
            ) : (
              <button onClick={onNext} className="btn-banana w-full text-xl py-4">
                NEXT LEVEL →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Game Over Screen ──────────────────────
function GameOverScreen({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{background:"rgba(0,0,0,0.9)", backdropFilter:"blur(8px)"}}>
      <div className="animate-pop text-center max-w-sm w-full mx-4">
        <div className="rounded-3xl p-10 shadow-2xl" style={{background:"rgba(30,0,0,0.9)", border:"2px solid rgba(255,68,68,0.4)", boxShadow:"0 0 60px rgba(255,68,68,0.2)"}}>
          <div className="text-8xl mb-3" style={{filter:"drop-shadow(0 0 16px rgba(255,68,68,0.5))"}}>💀</div>
          <h2 className="font-game text-4xl text-red-400 mb-2">CAUGHT!</h2>
          <p className="mb-8" style={{color:"rgba(255,255,255,0.5)"}}>The security caught you. No bananas this run...</p>
          <div className="flex flex-col gap-3">
            <button onClick={onRetry} className="btn-banana w-full text-xl py-4">🔄 TRY AGAIN</button>
            <button onClick={onHome} className="btn-green w-full text-xl py-3">🏠 HOME</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Feedback Banner ──────────────────────
function FeedbackBanner({ phase, earned }: { phase: string; earned: number }) {
  if (phase === "correct") return (
    <div className="rounded-2xl px-6 py-3 text-center animate-pop"
      style={{background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.4)"}}>
      <span className="font-game text-2xl text-green-400">✓ CORRECT! +{earned} 🍌</span>
    </div>
  )
  if (phase === "wrong") return (
    <div className="rounded-2xl px-6 py-3 text-center animate-pop animate-shake"
      style={{background:"rgba(255,68,68,0.15)", border:"1px solid rgba(255,68,68,0.4)"}}>
      <span className="font-game text-2xl text-red-400">✗ WRONG! −1 ❤️</span>
    </div>
  )
  if (phase === "timeUp") return (
    <div className="rounded-2xl px-6 py-3 text-center animate-pop"
      style={{background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.4)"}}>
      <span className="font-game text-2xl text-yellow-400">⏰ TIME'S UP! −1 ❤️</span>
    </div>
  )
  return null
}

// ─── Main ─────────────────────────────────
type Phase = "loading" | "playing" | "correct" | "wrong" | "levelComplete" | "gameOver" | "timeUp"
const PUZZLES_TO_WIN = 3

export default function LevelPage() {
  const params = useParams()
  const router = useRouter()
  const globalLevel = Number(params.levelId)
  const levelInfo = getLevelInfo(globalLevel)
  const nextLevelId = getNextLevel(globalLevel)
  const timerDuration = levelInfo?.stage.timer || 20

  const [phase, setPhase] = useState<Phase>("loading")
  const [puzzle, setPuzzle] = useState<{question: string; solution: number} | null>(null)
  const [answer, setAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(timerDuration)
  const [sessionBananas, setSessionBananas] = useState(0)
  const [totalBananas, setTotalBananas] = useState(0)
  const [lastEarned, setLastEarned] = useState(0)
  const [lives, setLives] = useState(3)
  const [user, setUser] = useState<any>(null)
  const [solved, setSolved] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!token) { router.push("/login"); return }
    if (!levelInfo) { router.push("/game"); return }
    fetch("/api/game/progress", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.push("/login"); return }
        setUser(data.user)
        setLives(data.progress.livesRemaining)
        setTotalBananas(data.user.totalBananas)
        if (globalLevel > data.progress.unlockedLevel) { router.push(`/game/stage/${levelInfo.stage.id}`); return }
        loadPuzzle()
      })
  }, [globalLevel])

  useEffect(() => {
    if (phase !== "playing") { if (timerRef.current) clearTimeout(timerRef.current); return }
    if (timeLeft <= 0) { handleTimeUp(); return }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timeLeft, phase])

  // Auto-focus input when playing
  useEffect(() => {
    if (phase === "playing") setTimeout(() => inputRef.current?.focus(), 100)
  }, [phase])

  async function loadPuzzle() {
    setPhase("loading"); setAnswer("")
    try {
      const res = await fetch("/api/game/puzzle", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ globalLevel }),
      })
      const data = await res.json()
      setPuzzle(data); setTimeLeft(timerDuration); setPhase("playing")
    } catch { setPhase("gameOver") }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (phase !== "playing" || !puzzle) return
    if (timerRef.current) clearTimeout(timerRef.current)

    const res = await fetch("/api/game/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ answer: Number(answer), correctAnswer: puzzle.solution, timeRemaining: timeLeft, globalLevel }),
    })
    const result = await res.json()

    if (result.correct) {
      const earned = result.bananasEarned
      setLastEarned(earned); setSessionBananas(b => b + earned); setTotalBananas(b => b + earned)
      const newSolved = solved + 1; setSolved(newSolved)
      setPhase("correct")
      if (newSolved >= PUZZLES_TO_WIN) { setTimeout(() => setPhase("levelComplete"), 1500) }
      else { setTimeout(() => loadPuzzle(), 1500) }
    } else {
      const newLives = lives - 1; setLives(newLives); setPhase("wrong")
      if (newLives <= 0) { setTimeout(() => setPhase("gameOver"), 1200) }
      else { setTimeout(() => loadPuzzle(), 1200) }
    }
  }

  function handleTimeUp() {
    if (timerRef.current) clearTimeout(timerRef.current)
    const newLives = lives - 1; setLives(newLives); setPhase("timeUp")
    if (newLives <= 0) { setTimeout(() => setPhase("gameOver"), 1200) }
    else { setTimeout(() => loadPuzzle(), 1200) }
  }

  function handleRetry() {
    fetch("/api/game/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "resetLives" }),
    }).then(() => { setLives(3); setSolved(0); setSessionBananas(0); loadPuzzle() })
  }

  if (!levelInfo) return null

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg, #070f07 0%, #0f1a0f 40%, #07070f 100%)"}}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
          style={{background:"radial-gradient(ellipse, rgba(255,217,61,0.06) 0%, transparent 70%)"}} />
      </div>

      {/* Overlays */}
      {phase === "levelComplete" && (
        <LevelCompleteScreen
          bananasEarned={sessionBananas}
          onNext={() => nextLevelId ? router.push(`/game/level/${nextLevelId}`) : router.push("/leaderboard")}
          nextLevelId={nextLevelId}
          isLastLevel={!nextLevelId}
        />
      )}
      {phase === "gameOver" && <GameOverScreen onRetry={handleRetry} onHome={() => router.push("/game")} />}

      {/* HUD */}
      <div className="hud sticky top-0 z-30">
        <div className="max-w-xl mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{user?.avatar || "🐒"}</span>
            <div>
              <p className="font-bold text-white text-sm leading-none">{user?.username}</p>
              <p className="text-xs" style={{color:"rgba(255,255,255,0.4)"}}>
                {levelInfo.stage.name} · Level {levelInfo.level.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{background:"rgba(255,217,61,0.1)", border:"1px solid rgba(255,217,61,0.2)"}}>
              <span>🍌</span>
              <span className="font-game text-lg text-yellow-400">{totalBananas}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({length: 3}).map((_, i) => (
                <span key={i} className="text-xl transition-all duration-300"
                  style={{opacity: i < lives ? 1 : 0.15, transform: i < lives ? "scale(1)" : "scale(0.8)"}}>❤️</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative max-w-lg mx-auto px-4 py-6 text-center">
        {/* Level header */}
        <div className="mb-5">
          <p className="font-game tracking-widest text-sm mb-1" style={{color:"rgba(255,217,61,0.5)"}}>
            STAGE {levelInfo.stage.id} · LEVEL {levelInfo.level.id}
          </p>
          <h1 className="font-game text-3xl text-white">{levelInfo.level.name.toUpperCase()}</h1>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({length: PUZZLES_TO_WIN}).map((_, i) => (
            <div key={i} className="w-10 h-2.5 rounded-full transition-all duration-500"
              style={{
                background: i < solved ? "#4ade80" : i === solved && phase === "playing" ? "rgba(255,217,61,0.6)" : "rgba(255,255,255,0.1)",
                boxShadow: i < solved ? "0 0 8px rgba(74,222,128,0.6)" : "none",
              }} />
          ))}
        </div>

        {/* Feedback */}
        <div className="h-14 flex items-center justify-center mb-4">
          <FeedbackBanner phase={phase} earned={lastEarned} />
        </div>

        {/* Timer + Monkey */}
        <div className="flex items-center justify-center gap-10 mb-6">
          <TimerRing seconds={timeLeft} total={timerDuration} />
          <div className="w-28 h-28 flex-shrink-0">
            {phase === "correct" || phase === "levelComplete" ? (
              <img src="/images/monkey-happy.png" alt="Happy monkey" className="w-full h-full object-contain animate-bounce" />
            ) : (
              <img src="/images/monkey-idle.png" alt="Monkey" className="w-full h-full object-contain"
                style={{
                  animation: phase === "playing" ? "float 3s ease-in-out infinite" :
                             phase === "wrong" || phase === "timeUp" ? "shake 0.4s ease" : "none",
                  opacity: phase === "wrong" || phase === "timeUp" ? 0.7 : 1,
                  filter: phase === "wrong" || phase === "timeUp" ? "hue-rotate(140deg) brightness(0.8)" : "none",
                }} />
            )}
          </div>
        </div>

        {/* Puzzle card */}
        <div className="rounded-3xl overflow-hidden mb-6"
          style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          {phase === "loading" ? (
            <div className="h-48 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
                <p className="text-sm" style={{color:"rgba(255,255,255,0.3)"}}>Fetching puzzle...</p>
              </div>
            </div>
          ) : puzzle ? (
            <img src={puzzle.question} alt="Banana puzzle" className="w-full object-contain"
              style={{maxHeight:"280px", objectFit:"contain"}} />
          ) : null}
        </div>

        {/* Answer input */}
        {phase === "playing" && puzzle && (
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 animate-slide-up">
            <div className="relative">
              <input ref={inputRef} type="number" value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Enter the missing number"
                className="input-game text-center text-2xl font-bold w-56 py-4"
                style={{fontSize:"1.5rem"}} />
            </div>
            <button type="submit" className="btn-banana text-xl px-12 py-4">
              SUBMIT 🍌
            </button>
          </form>
        )}

        {/* Loading puzzle indicator */}
        {(phase === "correct" || phase === "wrong" || phase === "timeUp") && (
          <div className="flex items-center justify-center gap-2 mt-4" style={{color:"rgba(255,255,255,0.3)"}}>
            <div className="w-4 h-4 rounded-full border border-current border-t-transparent animate-spin" />
            <span className="text-sm">Loading next puzzle...</span>
          </div>
        )}
      </div>
    </div>
  )
}
