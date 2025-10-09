import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupById } from "../api/groupsApi";
import { createScoreButton } from "../api/scorebuttonsApi";
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
  creatorId: string;
  scoreButtons: ScoreButton[];
}

export default function GroupPage(currentUserId: { currentUserId: string }) {
  const { id } = useParams(); // gets group ud from url
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [currentMember, setCurrentMember] = useState<GroupMember | null>(null);
  const [newButtonLabel, setNewButtonLabel] = useState("");
  const [newButtonPoints, setNewButtonPoints] = useState<number>(0);

  const myUserId = currentUserId.currentUserId; // Hardcoded test user ID

  const fetchGroupData = async () => {
    const groupData = await getGroupById(Number(id));
    setGroup(groupData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchGroupData();

        const membersData = await getMembersForGroup(Number(id));
        setMembers(membersData);

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
      const updatedMember = await addScore(currentMember.id, points);
      setCurrentMember(updatedMember);

      const refreshedMembers = await getMembersForGroup(Number(id));
      setMembers(refreshedMembers);
    } catch (err) {
      console.error("Failed to add score:", err);
    }
  };

  const handleAddButton = async () => {
    if (!group) return;
    if (!newButtonLabel || newButtonPoints === 0) return;

    try {
      await createScoreButton({
        label: newButtonLabel,
        points: newButtonPoints,
        groupId: group.id,
      });

      await fetchGroupData();
      setNewButtonLabel("");
      setNewButtonPoints(0);
    } catch (err) {
      console.error("Failed to add button:", err);
    }
  };

  if (!group) return <div>Loading group...</div>;

  const isCreator = group.creatorId === myUserId;

  return (
    <div style={{ display: "flex" }}>
      
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
        <p>
          Passcode: <strong>{group.passcode}</strong>
        </p>

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

        {/* Creator-only section */}
        {isCreator && (
          <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
            <h4>Add New Button</h4>
            <input
              type="text"
              placeholder="Label"
              value={newButtonLabel}
              onChange={(e) => setNewButtonLabel(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="number"
              placeholder="Points"
              value={newButtonPoints}
              onChange={(e) => setNewButtonPoints(Number(e.target.value))}
              style={{ marginRight: "10px", padding: "5px", width: "80px" }}
            />
            <button onClick={handleAddButton} style={{ padding: "5px 10px" }}>
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
