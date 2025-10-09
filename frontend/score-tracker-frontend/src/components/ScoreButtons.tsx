import React, { useState } from "react";

interface ScoreButton {
  id: number;
  label: string;
  points: number;
}

interface Props {
  buttons: ScoreButton[];
  isCreator: boolean;
  onClick: (points: number) => void | Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
  onCreate?: (label: string, points: number) => void | Promise<void>;
}

const GroupButtons: React.FC<Props> = ({ buttons, isCreator, onClick, onDelete, onCreate }) => {
  const [label, setLabel] = useState("");
  const [points, setPoints] = useState<number | "">("");

  return (
    <div>
      {buttons.length === 0 ? (
        <p>No buttons yet.</p>
      ) : (
        <div>
          {buttons.map((b) => (
            <div key={b.id}>
              <button
                onClick={() => onClick(b.points)}>{b.label} (+{b.points})
              </button>

              {isCreator && onDelete && (
                <button
                  onClick={() => onDelete(b.id)}
                  aria-label={`Delete ${b.label}`}>✕
                  </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isCreator && onCreate && (
        <div style={{ marginTop: 18, borderTop: "1px solid #eee", paddingTop: 12 }}>
          <h4 style={{ margin: "6px 0" }}>Add new button</h4>

          <input
            placeholder="Name"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            type="number"
            placeholder="Points"
            value={points}
            onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <button onClick={() => onCreate(label, Number(points))}>
            {"Add"}
          </button>

        </div>
      )}
    </div>
  );
};

export default GroupButtons;
