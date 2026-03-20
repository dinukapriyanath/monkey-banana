"use client"

import { useEffect, useState } from "react"

export default function Timer({
  time,
  onTimeUp,
}: {
  time: number
  onTimeUp: () => void
}) {
  const [seconds, setSeconds] = useState(time)

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp()
      return
    }

    const timer = setTimeout(() => {
      setSeconds(seconds - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds])

  return (
    <h3>⏱ Time: {seconds}</h3>
  )
}