import type { FC } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { type CardType } from "./Card";

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

const Column: FC<ColumnType> = ({ id, title, cards }) => {
  const { setNodeRef } = useDroppable({ id: id });

  return (
    <SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        style={{
          width: "200px",
          background: "rgba(245,247,249,1.00)",
          marginRight: "10px",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
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
            onClick={() => alert(`「${title}」に新しいタスクを追加します`)}
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

        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            startDate={card.startDate}
            dueDate={card.dueDate}
            status={card.status}
          />
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;
