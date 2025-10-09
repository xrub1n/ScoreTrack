// src/components/GroupButtons.tsx
import React from "react";

interface ScoreButton {
  id: number;
  label: string;
  points: number;
}

interface Props {
  buttons: ScoreButton[];
  isCreator: boolean;
  onClick: (points: number) => void;
  onDelete?: (id: number) => void;
}

const GroupButtons: React.FC<Props> = ({ buttons, isCreator, onClick, onDelete }) => {
  return (
    <div>
      {buttons.length === 0 ? (
        <p>No buttons yet.</p>
      ) : (
        <div>
          {buttons.map((b) => (
            <div key={b.id} style={{ position: "relative" }}>
              <button
                onClick={() => onClick(b.points)}>{b.label} (+{b.points})
              </button>
              {isCreator && onDelete && (
                <button
                  onClick={() => onDelete(b.id)}>✕</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupButtons;
