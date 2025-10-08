import React, { useEffect, useState } from "react";
import { createGroup, getGroupByUserId } from "../api/groupsApi";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import JoinGroupForm from "../components/JoinGroupForm";

interface Group {
  id: number;
  name: string;
}

export default function HomePage(currentUserId: { currentUserId: string }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupPassword, setNewGroupPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getGroupByUserId(currentUserId.currentUserId)
      .then((data) => setGroups(data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return alert("Please enter a group name.");
    try {
      const group = await createGroup(newGroupName, currentUserId.currentUserId, newGroupPassword);
      navigate(`/groups/${group.id}`); // Navigate to the new group's page
    } catch (err) {
      alert("Failed to create group.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>All Groups</h1>

      <div className="mb-6">
        <input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter new group name"
          />
        <input
          value={newGroupPassword}
          onChange={(e) => setNewGroupPassword(e.target.value)}
          placeholder="Enter a password for your new group"
          />
        <button
          onClick={handleCreateGroup}>Create Group
        </button>
      </div>

      {/* Join Group Form */}
      <JoinGroupForm currentUserId={currentUserId.currentUserId} />

      
      <ul className="list1">
        {groups.map((g) => (
          <li key={g.id} >
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
