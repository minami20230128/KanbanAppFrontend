import type { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
export type CardType = {
  id: string;
  title: string;
  start: string;
  due: string;
};

const Card: FC<CardType> = ({ id, title, start, due }) => {
  // useSortableに指定するidは一意になるよう設定する必要があります。s
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id
  });

  const style = {
    margin: "10px",
    opacity: 1,
    color: "#333",
    background: "white",
    padding: "10px",
    transform: CSS.Transform.toString(transform)
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
      </div>
    </div>
  );
};

export default Card;
