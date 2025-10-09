import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupById } from "../api/groupsApi";
import { createScoreButton, deleteScoreButton } from "../api/scorebuttonsApi";
import { addScore, getMembersForGroup } from "../api/groupMembersApi";
import GroupButtons from "../components/ScoreButtons";
import UserList from "../components/UserList";

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

  const handleDeleteButton = async (buttonId: number) => {
    if (!group) return;
    try {
      await deleteScoreButton(buttonId);
      // Refresh group data to reflect deletion
      const updatedGroup = await getGroupById(group.id);
      setGroup(updatedGroup);
    } catch (err) {
      console.error("Failed to delete button:", err);
    }
  };

  if (!group) return <div>Loading group...</div>;

  const isCreator = group.creatorId === myUserId;

  return (
    <div>
      
      <UserList members={members} />
      <div style={{ flexGrow: 1 }}>
        <h2>{group.name}</h2>
        <p>Passcode: <strong>{group.passcode}</strong></p>

        <h3>{currentMember?.user.displayName}</h3>
        <h3>Your score: {currentMember?.totalScore}</h3>

        <GroupButtons
          buttons={group.scoreButtons}
          isCreator={isCreator}
          onClick={handleButtonClick}
          onDelete={isCreator ? handleDeleteButton : undefined}
        />
      </div>
    </div>
  );
}
