"use client"

type Mood = "idle" | "thinking" | "happy" | "sad"

export default function Monkey({ mood }: { mood: Mood }) {
  const getImage = () => {
    switch (mood) {
      case "happy":
        return "/images/monkey-happy.png"
      case "sad":
        return "/images/monkey-sad.png"
      case "thinking":
        return "/images/monkey-thinking.png"
      default:
        return "/images/monkey-idle.png"
    }
  }

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <img src={getImage()} width={150} />

      <p>
        {mood === "happy" && "Yay! Bananas! 🍌"}
        {mood === "sad" && "Oh no! Try again 😢"}
        {mood === "thinking" && "Hmm... thinking 🤔"}
        {mood === "idle" && "I'm hungry... 🍌"}
      </p>
    </div>
  )
}