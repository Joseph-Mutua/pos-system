import type { Entity, HistoryRecord } from "./posTypes";

const seedTrucks: Entity[] = [
  {
    id: "TRK-1024",
    code: "1024",
    name: "Kenworth T880",
    aliases: ["blue", "east gate"],
  },
  {
    id: "TRK-2021",
    code: "2021",
    name: "Freightliner Cascadia",
    aliases: ["white", "hopper"],
  },
  {
    id: "TRK-3141",
    code: "3141",
    name: "Peterbilt 567",
    aliases: ["hauler", "cement"],
  },
  { id: "TRK-8810", code: "8810", name: "Volvo VNL", aliases: ["north run"] },
];

const seedCustomers: Entity[] = [
  {
    id: "CUST-1",
    code: "ACME",
    name: "Acme Ready Mix",
    aliases: ["acme", "ready mix"],
  },
  {
    id: "CUST-2",
    code: "REDR",
    name: "Red Rock Aggregates",
    aliases: ["rock", "red"],
  },
  {
    id: "CUST-3",
    code: "SKYE",
    name: "Skyline Earthworks",
    aliases: ["earth", "sky"],
  },
  {
    id: "CUST-4",
    code: "METR",
    name: "Metro Paving",
    aliases: ["paving", "asphalt"],
  },
];

const seedOrders: Entity[] = [
  {
    id: "ORD-4401",
    code: "4401",
    name: "I-95 Expansion Phase 2",
    aliases: ["highway"],
  },
  {
    id: "ORD-7730",
    code: "7730",
    name: "Airport Taxiway Rehab",
    aliases: ["airport"],
  },
  {
    id: "ORD-9012",
    code: "9012",
    name: "County Drainage Upgrade",
    aliases: ["drain", "county"],
  },
  {
    id: "ORD-0210",
    code: "0210",
    name: "West Loop Commercial Park",
    aliases: ["west loop"],
  },
];

const seedProducts: Entity[] = [
  {
    id: "PRD-A1",
    code: "A1",
    name: '3/4" Crushed Stone',
    aliases: ["stone", "aggregate"],
  },
  { id: "PRD-S2", code: "S2", name: "Concrete Sand", aliases: ["sand"] },
  {
    id: "PRD-B3",
    code: "B3",
    name: "Hot Mix Asphalt",
    aliases: ["asphalt", "mix"],
  },
  { id: "PRD-F4", code: "F4", name: "Fill Dirt", aliases: ["fill", "dirt"] },
];

const makeEntities = (
  prefix: string,
  count: number,
  base: Entity[],
  make: (index: number) => Omit<Entity, "id">,
): Entity[] => {
  const generated = Array.from({ length: count }, (_, index) => {
    const id = `${prefix}-${String(index + 1).padStart(4, "0")}`;
    return { id, ...make(index) };
  });
  return [...base, ...generated];
};

export const trucks: Entity[] = makeEntities(
  "TRK",
  120,
  seedTrucks,
  (index) => ({
    code: String(3000 + index),
    name: `Fleet Truck ${index + 1}`,
    aliases: [`lane ${index % 8}`, `bay ${index % 12}`],
  }),
);

export const customers: Entity[] = makeEntities(
  "CUST",
  120,
  seedCustomers,
  (index) => ({
    code: `C${String(index + 10).padStart(3, "0")}`,
    name: `Customer Group ${index + 1}`,
    aliases: [`region ${index % 6}`, `acct ${index + 100}`],
  }),
);

export const orders: Entity[] = makeEntities(
  "ORD",
  120,
  seedOrders,
  (index) => ({
    code: String(5000 + index),
    name: `Project Load ${index + 1}`,
    aliases: [`zone ${index % 10}`, `route ${index % 14}`],
  }),
);

export const products: Entity[] = makeEntities(
  "PRD",
  120,
  seedProducts,
  (index) => ({
    code: `M${String(index + 1).padStart(3, "0")}`,
    name: `Material Blend ${index + 1}`,
    aliases: [`mix ${index % 9}`, `grade ${index % 5}`],
  }),
);

const seedHistory: HistoryRecord[] = [
  {
    id: "TX-001",
    truckId: "TRK-2021",
    customerId: "CUST-1",
    orderId: "ORD-4401",
    productId: "PRD-A1",
    gross: 73340,
    tare: 31200,
    net: 42140,
    timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
  },
  {
    id: "TX-002",
    truckId: "TRK-1024",
    customerId: "CUST-3",
    orderId: "ORD-9012",
    productId: "PRD-F4",
    gross: 65980,
    tare: 29880,
    net: 36100,
    timestamp: new Date(Date.now() - 1000 * 60 * 86).toISOString(),
  },
  {
    id: "TX-003",
    truckId: "TRK-8810",
    customerId: "CUST-2",
    orderId: "ORD-7730",
    productId: "PRD-S2",
    gross: 70220,
    tare: 31940,
    net: 38280,
    timestamp: new Date(Date.now() - 1000 * 60 * 121).toISOString(),
  },
];

const generatedHistory: HistoryRecord[] = Array.from({ length: 40 }, (_, i) => {
  const truck = trucks[(i + 4) % trucks.length];
  const customer = customers[(i + 7) % customers.length];
  const order = orders[(i + 9) % orders.length];
  const product = products[(i + 11) % products.length];
  const tare = 28000 + (i % 8) * 350;
  const gross = tare + 24000 + (i % 12) * 520;
  return {
    id: `TX-${String(i + 4).padStart(3, "0")}`,
    truckId: truck.id,
    customerId: customer.id,
    orderId: order.id,
    productId: product.id,
    gross,
    tare,
    net: gross - tare,
    timestamp: new Date(Date.now() - 1000 * 60 * (150 + i * 6)).toISOString(),
  };
});

export const historySeed: HistoryRecord[] = [...seedHistory, ...generatedHistory];
