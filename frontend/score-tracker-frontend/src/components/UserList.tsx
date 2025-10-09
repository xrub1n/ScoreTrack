import React from "react";

interface GroupMember {
  id: number;
  user: {displayName: string;};
  totalScore: number;
}

interface Props {
  members: GroupMember[];
}

const GroupMembers: React.FC<Props> = ({ members }) => {
  return (
    <div>
      <h3>Members</h3>
      {members.length === 0 ? (
        <p>No members yet.</p>
      ) : (
        members.map((m) => (
          <div key={m.id}>
            {m.user.displayName}: {m.totalScore}
          </div>
        ))
      )}
    </div>
  );
};

export default GroupMembers;
