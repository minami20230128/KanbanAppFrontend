import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@mui/material";
import type { CSSProperties, FC } from "react";
import { useNavigate } from "react-router-dom";

export type CardType = {
  id: string;
  title: string;
  startDate: string;
  dueDate: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

const Card: FC<CardType> = ({
  id,
  title,
  startDate: start,
  dueDate: due,
  status: _status,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
  });

  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  const style: CSSProperties = {
    position: "relative",
    margin: "10px",
    opacity: 1,
    color: "#333",
    background: "white",
    padding: "10px",
    transform: CSS.Transform.toString(transform),
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style} className="card" {...attributes}>
      {/* ドラッグハンドル（左上に配置） */}
      <div
        {...listeners}
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          cursor: "grab",
          padding: "2px 6px",
          fontSize: 16,
          backgroundColor: "#e2e8f0",
          borderRadius: 4,
          zIndex: 10,
          userSelect: "none",
        }}
      >
        ≡
      </div>
      <Button onClick={() => handleClick(id)}>
        <div style={{ textAlign: "center" }}>
          <div className="card-title">{title}</div>
          <div className="card-dates">
            開始: {start}
            <br />
            期限: {due}
          </div>
        </div>
      </Button>
    </div>
  );
};

export default Card;
