"use client"

export default function PuzzleBoard({ image }: { image: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Solve the Puzzle</h2>

      <img
        src={image}
        alt="banana puzzle"
        style={{ width: "300px" }}
      />
    </div>
  )
}