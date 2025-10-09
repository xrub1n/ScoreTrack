const API_BASE = "http://localhost:5156/api";

export async function createScoreButton(button: {
  label: string;
  points: number;
  groupId: number;
}) {
  const response = await fetch(`${API_BASE}/scorebuttons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(button),
  });

  if (!response.ok) throw new Error("Failed to create button");
  return response.json();
}


export async function deleteScoreButton(buttonId: number) {
  const res = await fetch(`${API_BASE}/scorebuttons/${buttonId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete score button");
}
