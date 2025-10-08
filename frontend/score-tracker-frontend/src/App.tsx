import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";

function App() {
  //const currentId = "7A7CBA13-0371-4973-8FCA-AAFA6BE084B9" ;
  const currentId = "3F1CFBBE-EAF3-4BB6-9F45-0D66943669EE" ;
  //const currentId = "CFCB289D-BAB1-4CEB-A816-C211B9FA1420" ;
  

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
