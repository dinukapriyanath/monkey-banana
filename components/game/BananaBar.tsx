"use client"


export default function BananaBar({ bananas }: { bananas: number }) {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-black/70 backdrop-blur-md border-b border-yellow-400 z-50">

      <h1 className="text-yellow-400 font-bold text-lg">
        🐒 Monkey Heist
      </h1>

      <div className="text-xl font-bold text-yellow-300">
        🍌 {bananas}
      </div>

    </div>
  )
}