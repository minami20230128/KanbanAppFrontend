import type { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

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
  status: status,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
  });

  const style = {
    margin: "10px",
    opacity: 1,
    color: "#333",
    background: "white",
    padding: "10px",
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="card"
    >
      <div className="card-title">{title}</div>
      <div className="card-dates">
        開始: {start}
        <br />
        期限: {due}
        <br />
        状態: {status}
      </div>
    </div>
  );
};

export default Card;
