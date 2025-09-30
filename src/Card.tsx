import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@mui/material";
import axios from "axios";
import type { CSSProperties, FC } from "react";
import { useNavigate } from "react-router-dom";

export type CardType = {
  id: string;
  title: string;
  startDate: string;
  dueDate: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  version: number;
};

type CardProps = CardType & {
  onDeleteSuccess?: (id: string) => void;
};

const Card: FC<CardProps> = (props) => {
  console.log("Card props:", props); // ← ここで props を全部確認

  const {
    id,
    title,
    startDate: start,
    dueDate: due,
    status: _status,
    version,
    onDeleteSuccess,
  } = props;

  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  const handleDelete = async (id: string, version: number) => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      await axios.delete(`/api/tasks/${id}`, {
        data: { version },
      });
      alert("削除しました。");
      onDeleteSuccess?.(id);
    } catch (err) {
      alert("削除に失敗しました");
      console.error("削除エラー:", err);
    }
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
      <button
        onClick={() => handleDelete(id, version)}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "2px 6px",
          cursor: "pointer",
          fontSize: "12px",
          zIndex: 10,
        }}
      >
        削除
      </button>
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
