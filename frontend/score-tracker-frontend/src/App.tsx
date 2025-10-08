import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";

function App() {
  const currentId = "7A7CBA13-0371-4973-8FCA-AAFA6BE084B9" ;

  return (
    <div>
      <h1>ScoreTrack</h1>
      <Routes>
        <Route path="/" element={<HomePage currentUserId={currentId}/>} />
        <Route path="/groups/:id" element={<GroupPage currentUserId={currentId} />} />
      </Routes>
    </div>
  );
}

export default App;
