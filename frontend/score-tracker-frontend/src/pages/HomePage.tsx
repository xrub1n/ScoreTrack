import React, { useEffect, useState } from "react";
import { getGroups } from "../api/groupsApi";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

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
      <ul className="list1">
        {groups.map((g) => (
          <li key={g.id} className="mb-2">
            <button
              onClick={() => navigate(`/groups/${g.id}`)}
              className="homeButton">
              {g.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
