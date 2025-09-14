import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import Card, { type CardType } from "./Card";

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
  status: string;
  onDeleteCard?: (cardId: string) => void;
};

const Column: FC<ColumnType> = ({ id, title, cards, status, onDeleteCard }) => {
  const { setNodeRef } = useDroppable({ id });
  const navigate = useNavigate();

  const handleClick = (status: string) => {
    navigate(`/tasks/new/${status}`);
  };

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "#abf3abff";
      case "IN_PROGRESS":
        return "#ffff99";
      case "DONE":
        return "#ffc0cb";
      default:
        return "rgba(245,247,249,1.00)";
    }
  };

  return (
    <SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        style={{
          width: "200px",
          background: getBackgroundColor(status),
          marginRight: "10px",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {/* カラムヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 0 10px 0",
          }}
        >
          <p
            style={{
              textAlign: "left",
              fontWeight: "500",
              color: "#575757",
              margin: 0,
            }}
          >
            {title}
          </p>
          <button
            onClick={() => handleClick(status)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#575757",
            }}
            title="タスクを追加"
          >
            ＋
          </button>
        </div>

        {/* カード一覧 */}
        {cards.map((card) => (
          <Card key={card.id} {...card} onDeleteSuccess={onDeleteCard} />
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;
