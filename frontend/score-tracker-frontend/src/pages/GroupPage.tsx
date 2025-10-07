import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupById } from "../api/groupsApi";
import { addScore } from "../api/groupMembersApi";

interface User {
  id: string;
  displayName: string;
}

interface GroupMember {
  id: number;
  user: User;
  totalScore: number;
}

interface ScoreButton {
  id: number;
  label: string;
  points: number;
}

interface Group {
  id: number;
  name: string;
  members: GroupMember[];
  scoreButtons: ScoreButton[];
}

export default function GroupPage() {
  const { id } = useParams(); // group ID from URL
  const [group, setGroup] = useState<Group | null>(null);
  const [currentMember, setCurrentMember] = useState<GroupMember | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      const data = await getGroupById(Number(id));
      setGroup(data);

      // Find current user's GroupMember
      const myUserId = "b4dcc563-4ee8-4be6-ab9e-ee1d32af584e"; // TODO: get from auth context
      const me = data.members.find((m: GroupMember) => m.user.id === myUserId);
      setCurrentMember(me || null);
    };
    fetchGroup();
  }, [id]);

    const handleButtonClick = async (points: number) => {
    if (!currentMember) return;
    const updated = await addScore(currentMember.id, points);
    setCurrentMember(updated);

    // Optional: refresh full group to update other users' scores
    const refreshedGroup = await getGroupById(Number(id));
    setGroup(refreshedGroup);
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex" }}>
      {/* Left Panel: Members */}
      <div style={{ width: "200px", marginRight: "20px" }}>
        <h3>Members</h3>
        {group.members.map((m) => (
          <div key={m.id}>
            {m.user.displayName}: {m.totalScore}
          </div>
        ))}
      </div>

      {/* Center Panel: Buttons */}
      <div style={{ flexGrow: 1 }}>
        <h2>{group.name}</h2>
        <h3>Your score: {currentMember?.totalScore}</h3>
        <div>
          {group.scoreButtons.map((b) => (
            <button key={b.id} onClick={() => handleButtonClick(b.points)}>
              {b.label} (+{b.points})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

