const API_BASE = "http://localhost:5156/api";


export async function addScore(groupMemberId: number, points: number) {
  const res = await fetch(
    `http://localhost:5156/api/groupmembers/${groupMemberId}/addscore`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(points),
    }
  );

  if (!res.ok) throw new Error("Failed to add score");
  return res.json();
}

