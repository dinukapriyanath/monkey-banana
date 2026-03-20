export async function getBananaPuzzle() {
  const res = await fetch("https://marcconrad.com/uob/banana/api.php?out=json", {
    cache: "no-store",
  })
  const data = await res.json()
  return {
    question: data.question as string,
    solution: data.solution as number,
  }
}
