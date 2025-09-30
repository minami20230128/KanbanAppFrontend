import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import axios from "axios";
import { useEffect, useState } from "react";
import type { CardType } from "./Card";
import Column, { type ColumnType } from "./Column";
import "./styles.css";

const TaskBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [draggingFromColumnId, setDraggingFromColumnId] = useState<
    string | null
  >(null);

  useEffect(() => {
    axios
      .get<CardType[]>("/api/tasks")
      .then((res) => {
        const tasks = res.data;
        console.log(res.data);
        const toCard = (list: CardType[]) =>
          list.map((t) => ({
            ...t,
            id: String(t.id),
            version: t.version,
          }));

        const todo = toCard(tasks.filter((t) => t.status === "TODO"));
        const doing = toCard(tasks.filter((t) => t.status === "IN_PROGRESS"));
        const done = toCard(tasks.filter((t) => t.status === "DONE"));

        setColumns([
          { id: "todo", title: "未着手", cards: todo, status: "TODO" },
          { id: "doing", title: "進行中", cards: doing, status: "IN_PROGRESS" },
          { id: "done", title: "完了", cards: done, status: "DONE" },
        ]);

        console.log(tasks);
      })
      .catch((err) => {
        console.error("タスクの取得に失敗しました", err);
      });
  }, []);

  const findColumn = (id: string | null): ColumnType | null => {
    if (!id) return null;
    const directColumn = columns.find((c) => c.id === id);
    if (directColumn) return directColumn;
    for (const column of columns) {
      if (column.cards.some((card) => card.id === id)) {
        return column;
      }
    }
    return null;
  };

  const handleDeleteCard = async (columnId: string, cardId: string) => {
    try {
      // サーバーへの削除リクエストはすでに Card コンポーネント内で行われているため、ここではステートの更新のみを行う
      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                cards: column.cards.filter((card) => card.id !== cardId),
              }
            : column
        )
      );
    } catch (err) {
      // 今回の構成では発生しないが、エラーハンドリングは維持しておく
      console.error("削除に失敗しました", err);
      alert("削除に失敗しました");
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    const fromColumn = findColumn(activeId);
    setDraggingFromColumnId(fromColumn?.id ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromColumn = findColumn(activeId);
    const toColumn = findColumn(overId);

    if (!fromColumn || !toColumn || fromColumn.id === toColumn.id) return;

    setColumns((prev) => {
      const fromIndex = fromColumn.cards.findIndex((c) => c.id === activeId);
      const activeCard = fromColumn.cards[fromIndex];

      return prev.map((column) => {
        if (column.id === fromColumn.id) {
          return {
            ...column,
            cards: column.cards.filter((c) => c.id !== activeId),
          };
        }
        if (column.id === toColumn.id) {
          return {
            ...column,
            cards: [...column.cards, { ...activeCard }],
          };
        }
        return column;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromColumn = findColumn(draggingFromColumnId);
    const toColumn = findColumn(overId);

    if (!fromColumn || !toColumn) return;

    const activeCard = fromColumn.cards.find((c) => c.id === activeId);
    if (!activeCard) {
      console.error("activeCard not found for id:", activeId);
      return;
    }
    console.log("activeCard:", activeCard);

    // ステータス変更が必要ならサーバー更新
    if (fromColumn.id !== toColumn.id) {
      const statusMap: Record<string, "TODO" | "IN_PROGRESS" | "DONE"> = {
        todo: "TODO",
        doing: "IN_PROGRESS",
        done: "DONE",
      };

      const newStatus = statusMap[toColumn.id];
      try {
        await axios.patch(`/api/tasks/${activeId}/status`, {
          status: newStatus,
          version: activeCard.version, // ここでversionを渡す
        });
      } catch (err) {
        console.error("ステータス更新に失敗しました", err);
        alert("ステータス更新に失敗しました");
        alert(err);
        return;
      }

      // フロント側ステートも更新
      setColumns((prev) =>
        prev.map((column) => {
          if (column.id === fromColumn.id) {
            return {
              ...column,
              cards: column.cards.filter((c) => c.id !== activeId),
            };
          }
          if (column.id === toColumn.id) {
            return {
              ...column,
              cards: [...column.cards, { ...activeCard, status: newStatus }],
            };
          }
          return column;
        })
      );
    }

    setDraggingFromColumnId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="App"
        style={{ display: "flex", flexDirection: "row", padding: "20px" }}
      >
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
            status={column.status}
            onDeleteCard={(cardId) => handleDeleteCard(column.id, cardId)}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
