import type { Entity } from "./posTypes";

export function toDisplay(entity: Entity | null) {
  return entity
    ? `${entity.code} \u00b7 ${entity.name}`
    : "\u2014";
}

export function pounds(value: number) {
  return `${value.toLocaleString()} lb`;
}

export function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function entityById(list: Entity[], id: string) {
  return list.find((item) => item.id === id);
}
