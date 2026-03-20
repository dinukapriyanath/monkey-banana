"use client"

import { useState } from "react"

export default function AnswerInput({
  onSubmit,
}: {
  onSubmit: (answer: number) => void
}) {
  const [answer, setAnswer] = useState("")

  function handleSubmit(e: any) {
    e.preventDefault()

    onSubmit(Number(answer))
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Enter answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  )
}