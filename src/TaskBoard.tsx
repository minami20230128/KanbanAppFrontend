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
        const toCard = (list: CardType[]) =>
          list.map((t) => ({
            ...t,
            id: String(t.id),
          }));

        const todo = toCard(tasks.filter((t) => t.status === "TODO"));
        const doing = toCard(tasks.filter((t) => t.status === "IN_PROGRESS"));
        const done = toCard(tasks.filter((t) => t.status === "DONE"));

        setColumns([
          { id: "todo", title: "未着手", cards: todo, status: "TODO" },
          { id: "doing", title: "進行中", cards: doing, status: "IN_PROGRESS" },
          { id: "done", title: "完了", cards: done, status: "DONE" },
        ]);
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

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id);
    const fromColumn = findColumn(activeId);
    setDraggingFromColumnId(fromColumn?.id ?? null);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // 状態変更は onDragEnd に集中させるため、ここでは何もしない
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;

    const overColumn = findColumn(overId);
    const fromColumn = findColumn(draggingFromColumnId);

    if (!fromColumn || !overColumn) return;

    const activeIndex = fromColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
    const task = fromColumn.cards[activeIndex];

    const isColumnChanged = fromColumn.id !== overColumn.id;

    if (isColumnChanged) {
      const statusMap: Record<string, "TODO" | "IN_PROGRESS" | "DONE"> = {
        todo: "TODO",
        doing: "IN_PROGRESS",
        done: "DONE",
      };

      const newStatus = statusMap[overColumn.id];

      try {
        await axios.patch(`/api/tasks/${task.id}/status`, {
          status: newStatus,
        });
      } catch (err) {
        console.error("ステータス更新に失敗しました", err);
        return;
      }

      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column.id === fromColumn.id) {
            return {
              ...column,
              cards: column.cards.filter((i) => i.id !== activeId),
            };
          } else if (column.id === overColumn.id) {
            const insertIndex =
              overIndex >= 0 ? overIndex + 1 : column.cards.length;
            return {
              ...column,
              cards: [
                ...column.cards.slice(0, insertIndex),
                { ...task, status: newStatus },
                ...column.cards.slice(insertIndex),
              ],
            };
          } else {
            return column;
          }
        });
      });
    } else if (activeIndex !== overIndex) {
      setColumns((prevState) =>
        prevState.map((column) => {
          if (column.id === fromColumn.id) {
            const updatedCards = [...column.cards];
            const [moved] = updatedCards.splice(activeIndex, 1);
            updatedCards.splice(overIndex, 0, moved);
            return { ...column, cards: updatedCards };
          }
          return column;
        })
      );
    }

    // cleanup
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
          />
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;
