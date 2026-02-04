import { trucks, customers, orders, productsList } from "../data/seed";
import type { Truck, Customer, Order, Product, FieldType } from "../types";
import { fuzzyMatchFields } from "../hooks/useFuzzyMatch";

export type { FieldType };

export interface FieldConfig {
  key: FieldType;
  label: string;
  shortcut: string;
}

export const FIELD_CONFIGS: FieldConfig[] = [
  { key: "truck", label: "Truck", shortcut: "⌘K" },
  { key: "customer", label: "Customer", shortcut: "⌘J" },
  { key: "order", label: "Order", shortcut: "⌘O" },
  { key: "product", label: "Product", shortcut: "⌘P" },
];

export interface ComboboxOptionField {
  label: string;
  value: string;
  mono?: boolean;
}

export interface ComboboxOption {
  id: string;
  fields: ComboboxOptionField[];
}

const FILTER_LIMIT = 50;

export function getFilteredOptions(
  field: FieldType,
  query: string
): ComboboxOption[] {
  const q = query.trim().toLowerCase();

  switch (field) {
    case "truck": {
      const list = q
        ? trucks.filter((t) =>
            fuzzyMatchFields(
              [t.id, t.license, t.driver, t.carrier, t.truckType, t.phone],
              q
            )
          )
        : trucks;
      return list.slice(0, FILTER_LIMIT).map((t) => ({
        id: t.id,
        fields: [
          { label: "ID", value: t.id, mono: true },
          { label: "License", value: t.license, mono: true },
          { label: "Driver", value: t.driver },
          { label: "Type", value: t.truckType },
          { label: "Carrier", value: t.carrier },
          {
            label: "Tare",
            value: `${(t.lastTare / 1000).toFixed(1)}k`,
            mono: true,
          },
        ],
      }));
    }
    case "customer": {
      const list = q
        ? customers.filter((c) =>
            fuzzyMatchFields(
              [c.name, c.id, c.city, c.state, c.phone, c.paymentTerms],
              q
            )
          )
        : customers;
      return list.slice(0, FILTER_LIMIT).map((c) => ({
        id: c.id,
        fields: [
          { label: "Name", value: c.name },
          { label: "ID", value: c.id, mono: true },
          { label: "Location", value: `${c.city}, ${c.state}` },
          { label: "Status", value: c.status },
          { label: "Terms", value: c.paymentTerms },
          {
            label: "Credit",
            value:
              c.creditRemaining > 0
                ? `$${(c.creditRemaining / 1000).toFixed(0)}k`
                : "—",
            mono: true,
          },
        ],
      }));
    }
    case "order": {
      const list = q
        ? orders.filter((o) =>
            fuzzyMatchFields(
              [
                o.id,
                o.poNumber,
                o.description,
                o.customerName,
                o.jobSite,
                o.jobType,
              ],
              q
            )
          )
        : orders;
      return list.slice(0, FILTER_LIMIT).map((o) => ({
        id: o.id,
        fields: [
          { label: "Order", value: o.id, mono: true },
          { label: "PO", value: o.poNumber, mono: true },
          { label: "Project", value: o.description },
          { label: "Customer", value: o.customerName },
          { label: "Job Site", value: o.jobSite },
          {
            label: "Remaining",
            value: `${o.remainingQty.toLocaleString()}T`,
            mono: true,
          },
        ],
      }));
    }
    case "product": {
      const list = q
        ? productsList.filter((p) =>
            fuzzyMatchFields(
              [p.name, p.id, p.dotCode, p.category, p.stockpile, p.taxCode],
              q
            )
          )
        : productsList;
      return list.slice(0, FILTER_LIMIT).map((p) => ({
        id: p.id,
        fields: [
          { label: "Product", value: p.name },
          { label: "ID", value: p.id, mono: true },
          { label: "DOT", value: p.dotCode, mono: true },
          { label: "Category", value: p.category },
          { label: "Stockpile", value: p.stockpile },
          { label: "Price", value: `$${p.price.toFixed(2)}/T`, mono: true },
        ],
      }));
    }
    default:
      return [];
  }
}

/** Resolve selected entity by field type and id. */
export function findSelectedById(
  field: FieldType,
  id: string
): Truck | Customer | Order | Product | null {
  switch (field) {
    case "truck":
      return trucks.find((t) => t.id === id) ?? null;
    case "customer":
      return customers.find((c) => c.id === id) ?? null;
    case "order":
      return orders.find((o) => o.id === id) ?? null;
    case "product":
      return productsList.find((p) => p.id === id) ?? null;
    default:
      return null;
  }
}
