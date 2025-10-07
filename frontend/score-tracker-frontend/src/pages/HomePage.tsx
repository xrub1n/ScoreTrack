import React, { useEffect, useState } from "react";
import { getGroups } from "../api/groupsApi";
import { useNavigate } from "react-router-dom";

interface Group {
  id: number;
  name: string;
}

export default function HomePage(currentUserId: { currentUserId: string }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getGroups()
      .then((data) => setGroups(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Groups</h1>
      <ul>
        {groups.map((g) => (
          <li key={g.id} className="mb-2">
            <button
              onClick={() => navigate(`/groups/${g.id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {g.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
