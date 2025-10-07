import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";

function App() {
  const currentId = "3F1CFBBE-EAF3-4BB6-9F45-0D66943669EE" ;

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
