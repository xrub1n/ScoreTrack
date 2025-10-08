import { useState } from "react";
import { joinGroup } from "../api/groupsApi";
import { useNavigate } from "react-router-dom";

export default function JoinGroupForm({ currentUserId }: { currentUserId: string }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      setError("");
      setSuccess("");
      const group = await joinGroup(passcode, currentUserId);
      setSuccess("Joined group successfully!");
      window.location.reload();
      setPasscode("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        placeholder="Enter group passcode"
      />
      <button onClick={handleJoin}>
        Join Group
      </button>
    </div>
  );
}
