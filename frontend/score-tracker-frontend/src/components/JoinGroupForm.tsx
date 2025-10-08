import { useState } from "react";
import { joinGroup } from "../api/groupsApi";

export default function JoinGroupForm({ currentUserId }: { currentUserId: string }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleJoin = async () => {
    try {
      setError("");
      setSuccess("");
      await joinGroup(passcode, currentUserId);
      setSuccess("Joined group successfully!");
      setPasscode("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        placeholder="Enter group passcode"
        className="border p-2 mr-2"
      />
      <button onClick={handleJoin} className="px-4 py-2 bg-green-500 text-white rounded">
        Join Group
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
}
