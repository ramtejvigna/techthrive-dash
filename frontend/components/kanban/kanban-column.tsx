"use client";

import { ColumnColorPicker } from "@/components/kanban/column-color-picker";
import { KanbanCardItem } from "@/components/kanban/kanban-card";
import { getColumnTheme } from "@/lib/kanban-themes";
import { stopDragPropagation } from "@/lib/use-sortable-click";
import type { KanbanColumn as KanbanColumnType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";

interface KanbanColumnProps {
  column: KanbanColumnType;
  index: number;
  onAddCard: (columnId: string) => void;
  onCardClick: (cardId: string) => void;
  onColorChange: (columnId: string, color: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

export function KanbanColumnPreview({
  column,
  className,
}: {
  column: KanbanColumnType;
  className?: string;
}) {
  const theme = getColumnTheme(column);

  return (
    <div
      className={cn("flex w-[272px] flex-col rounded-2xl border border-transparent shadow-lg", className)}
      style={theme.columnStyle}
    >
      <div className="flex items-center gap-2 rounded-t-2xl px-3 py-3" style={theme.headerStyle}>
        <div
          className="inline-flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={theme.badgeStyle}
        >
          <span className="h-2 w-2 shrink-0 rounded-full shadow-sm" style={theme.dotStyle} />
          <span className="truncate">{column.name}</span>
          <span className="shrink-0 font-mono opacity-60">{column.cards.length}</span>
        </div>
      </div>
      <div className="min-h-[80px] px-2.5 pb-2.5 pt-2">
        {column.cards.length === 0 && (
          <p className={cn("py-6 text-center text-xs", theme.cardMuted)}>Drop pages here</p>
        )}
      </div>
    </div>
  );
}

export function KanbanColumn({
  column,
  index,
  onAddCard,
  onCardClick,
  onColorChange,
  onDeleteColumn,
}: KanbanColumnProps) {
  const theme = getColumnTheme(column);
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: "column", column } });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${column.id}`,
    data: { type: "column-drop", column },
  });

  const cardIds = column.cards.map((card) => card.id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...theme.columnStyle,
    ...(isOver && !isDragging ? theme.dropRingStyle : {}),
  };

  return (
    <motion.div
      ref={setSortableRef}
      style={style}
      initial={{ opacity: 0, x: 24, scale: 0.98 }}
      animate={{ opacity: isDragging ? 0 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex w-[272px] shrink-0 flex-col rounded-2xl border border-transparent shadow-sm",
        isDragging && "pointer-events-none",
        isOver && !isDragging && "shadow-md",
      )}
    >
      <div
        className="flex items-center justify-between gap-2 rounded-t-2xl px-3 py-3"
        style={theme.headerStyle}
        {...attributes}
        {...listeners}
      >
        <div
          className="inline-flex min-w-0 flex-1 cursor-grab touch-none items-center gap-2 rounded-full px-3 py-1 text-xs font-medium active:cursor-grabbing"
          style={theme.badgeStyle}
        >
          <div onPointerDown={stopDragPropagation}>
            <ColumnColorPicker
              color={theme.color}
              onChange={(color) => onColorChange(column.id, color)}
            />
          </div>
          <span className="truncate">{column.name}</span>
          <span className="shrink-0 font-mono opacity-60">{column.cards.length}</span>
        </div>
        {onDeleteColumn && (
          <button
            type="button"
            onClick={() => onDeleteColumn(column.id)}
            onPointerDown={stopDragPropagation}
            className="rounded-md px-1.5 py-0.5 text-sm text-[var(--muted)] opacity-0 transition-all hover:bg-[var(--surface)]/80 hover:text-red-500 group-hover:opacity-100"
            title="Remove bucket"
          >
            ×
          </button>
        )}
      </div>

      <div
        ref={setDroppableRef}
        className="flex min-h-[140px] flex-1 flex-col gap-2 px-2.5 pb-2.5 pt-2"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence initial={false}>
            {column.cards.map((card) => (
              <KanbanCardItem
                key={card.id}
                card={card}
                theme={theme}
                onClick={() => onCardClick(card.id)}
              />
            ))}
          </AnimatePresence>
        </SortableContext>

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onAddCard(column.id)}
          className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed py-2.5 text-sm transition-colors duration-200 hover:bg-[var(--surface)]/70"
          style={theme.addBtnStyle}
        >
          <span className="text-base leading-none">+</span>
          New page
        </motion.button>
      </div>
    </motion.div>
  );
}
