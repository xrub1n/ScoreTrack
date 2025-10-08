import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupById } from "../api/groupsApi";
import { addScore, getMembersForGroup } from "../api/groupMembersApi";

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
  passcode: string;
  id: number;
  name: string;
  scoreButtons: ScoreButton[];
}

export default function GroupPage(currentUserId: { currentUserId: string }) {
  const { id } = useParams(); // group ID from URL
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [currentMember, setCurrentMember] = useState<GroupMember | null>(null);

  const myUserId = currentUserId.currentUserId; // Hardcoded test user ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch group info (score buttons)
        const groupData = await getGroupById(Number(id));
        setGroup(groupData);

        // Fetch members of this group
        const membersData = await getMembersForGroup(Number(id));
        setMembers(membersData);

        // Set current user's GroupMember object
        const me = membersData.find((m: GroupMember) => m.user.id === myUserId);
        setCurrentMember(me || null);
      } catch (err) {
        console.error("Failed to load group data:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleButtonClick = async (points: number) => {
    if (!currentMember) return;

    try {
      // Increment current user's score
      const updatedMember = await addScore(currentMember.id, points);
      setCurrentMember(updatedMember);

      // Refresh all members to update displayed scores
      const refreshedMembers = await getMembersForGroup(Number(id));
      setMembers(refreshedMembers);
    } catch (err) {
      console.error("Failed to add score:", err);
    }
  };

  if (!group) return <div>Loading group...</div>;

  return (
    <div style={{ display: "flex" }}>
      <p>Passcode: <strong>{group.passcode}</strong></p>
      {/* Left Panel: Members */}
      <div style={{ width: "200px", marginRight: "20px" }}>
        <h3>Members</h3>
        {members.map((m) => (
          <div key={m.id}>
            {m.user.displayName}: {m.totalScore}
          </div>
        ))}
      </div>

      {/* Center Panel: Score Buttons */}
      <div style={{ flexGrow: 1 }}>
        <h2>{group.name}</h2>
        <h3>{currentMember?.user.displayName}</h3>
        <h3>Your score: {currentMember?.totalScore}</h3>
        <div>
          {group.scoreButtons.map((b) => (
            <button
              key={b.id}
              onClick={() => handleButtonClick(b.points)}
              style={{ margin: "5px", padding: "10px" }}
            >
              {b.label} (+{b.points})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
