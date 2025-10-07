const API_BASE = "http://localhost:5156/api";

export async function getGroups() {
  const res = await fetch(`${API_BASE}/groups`);
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
}

export async function getGroupById(id: number) {
  const res = await fetch(`${API_BASE}/groups/${id}`);
  if (!res.ok) throw new Error("Failed to fetch group");
  return res.json();
}

export async function createGroup(data: { name: string }) {
  const res = await fetch(`${API_BASE}/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create group");
  return res.json();
}
