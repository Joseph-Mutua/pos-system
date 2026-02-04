/**
 * Seed data for POS challenge — trucks, customers, orders, products.
 * Matches structure and variety of uiux PosMockup data.
 */

import type { Truck, Customer, Order, Product } from "../types/index";

const firstNames = [
  "ABC",
  "Acme",
  "Smith",
  "River",
  "Metro",
  "Quick",
  "Delta",
  "Pro",
  "Summit",
  "Valley",
  "Peak",
  "Stone",
  "Rock",
  "Hill",
  "Oak",
  "Pine",
  "Cedar",
  "Maple",
  "Lake",
  "Creek",
  "Mountain",
  "Prairie",
  "Forest",
  "Coastal",
  "Central",
  "Northern",
  "Southern",
  "Eastern",
  "Western",
  "Pacific",
  "Atlantic",
  "Midwest",
  "Golden",
  "Silver",
  "Iron",
  "Steel",
  "Diamond",
  "Crystal",
  "Blue",
  "Red",
];
const lastNames = [
  "Concrete",
  "Hauling",
  "Transport",
  "Gravel",
  "Materials",
  "Builders",
  "Paving",
  "Grading",
  "Construction",
  "Excavating",
  "Trucking",
  "Supply",
  "Industries",
  "Services",
  "Solutions",
  "Enterprises",
  "Corp",
  "Inc",
  "LLC",
  "Co",
];
const statuses = [
  "Active",
  "Active",
  "Active",
  "Active",
  "Active",
  "Active",
  "Active",
  "Active",
  "On Hold",
  "COD Only",
];

const products = [
  { name: "Limestone #57", dot: "AASHTO #57", category: "Aggregate" },
  { name: "Limestone #67", dot: "AASHTO #67", category: "Aggregate" },
  { name: "Limestone #8", dot: "AASHTO #8", category: "Aggregate" },
  { name: "Limestone #4", dot: "AASHTO #4", category: "Aggregate" },
  { name: "Gravel #57", dot: "AASHTO #57", category: "Aggregate" },
  { name: "Gravel #67", dot: "AASHTO #67", category: "Aggregate" },
  { name: "Crushed Stone", dot: "AASHTO #1", category: "Aggregate" },
  { name: "Pea Gravel", dot: "AASHTO #8", category: "Aggregate" },
  { name: "Sand - Concrete", dot: "ASTM C33", category: "Sand" },
  { name: "Sand - Mason", dot: "ASTM C144", category: "Sand" },
  { name: "Sand - Fill", dot: "Non-Spec", category: "Sand" },
  { name: "Rip Rap - Small", dot: "Class A", category: "Rip Rap" },
  { name: "Rip Rap - Medium", dot: "Class B", category: "Rip Rap" },
  { name: "Rip Rap - Large", dot: "Class C", category: "Rip Rap" },
  { name: "Asphalt Millings", dot: "RAP", category: "Recycled" },
  { name: "Recycled Concrete", dot: "RCA", category: "Recycled" },
  { name: "Topsoil - Screened", dot: "Non-Spec", category: "Soil" },
  { name: "Topsoil - Unscreened", dot: "Non-Spec", category: "Soil" },
  { name: "Clay Fill", dot: "Non-Spec", category: "Soil" },
  { name: "Surge Stone", dot: "AASHTO #2", category: "Aggregate" },
];

const projectDescriptions = [
  "Highway 41 Resurfacing",
  "Downtown Plaza Project",
  "Riverside Apartments",
  "Oak Street Bridge",
  "Industrial Park Phase 2",
  "Municipal Water Line",
  "Airport Runway Ext",
  "School Parking Lot",
  "Shopping Center Dev",
  "Hospital Expansion",
  "Warehouse Foundation",
  "Subdivision Grading",
  "Sewer Line Replacement",
  "Storm Drain Install",
  "Road Widening Project",
  "Bike Path Extension",
  "Park Pavilion Build",
  "Church Parking Lot",
  "Bank Drive-Through",
  "Gas Station Rebuild",
  "Restaurant Pad Site",
  "Office Complex",
  "Data Center Foundation",
  "Solar Farm Access",
  "Wind Farm Roads",
  "Pipeline Right-of-Way",
  "Rail Yard Expansion",
  "Port Terminal",
  "Grain Elevator Pad",
  "Feed Mill Project",
  "Dairy Farm Expansion",
  "Poultry House Pad",
];

const driverFirstNames = [
  "John",
  "Mike",
  "Dave",
  "Steve",
  "Tom",
  "Bill",
  "Jim",
  "Bob",
  "Joe",
  "Dan",
  "Rick",
  "Mark",
  "Paul",
  "Chris",
  "Matt",
  "Jeff",
  "Tim",
  "Kevin",
  "Brian",
  "Scott",
];
const driverLastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Martinez",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Thompson",
  "White",
  "Harris",
];

const truckTypes = [
  "Dump Truck",
  "End Dump",
  "Belly Dump",
  "Side Dump",
  "Transfer",
  "Super Dump",
  "Tandem",
  "Tri-Axle",
  "Quad-Axle",
  "Quint-Axle",
];
const carriers = [
  "Owner Operator",
  "ABC Trucking",
  "Delta Transport",
  "Metro Haulers",
  "Quick Haul",
  "Valley Trucking",
  "Peak Logistics",
  "Stone Transport",
  "River Freight",
  "Mountain Movers",
];

const cities = [
  "Nashville",
  "Memphis",
  "Knoxville",
  "Chattanooga",
  "Louisville",
  "Lexington",
  "Atlanta",
  "Birmingham",
  "Charlotte",
  "Raleigh",
];
const states = ["TN", "KY", "GA", "AL", "NC", "VA", "SC", "FL", "OH", "IN"];

const jobTypes = [
  "Commercial",
  "Residential",
  "Municipal",
  "State DOT",
  "Federal",
  "Industrial",
  "Agricultural",
];
const paymentTerms = [
  "Net 30",
  "Net 15",
  "Net 45",
  "Net 60",
  "Due on Receipt",
  "COD",
];

const stockpiles = [
  "Pit A",
  "Pit B",
  "Pit C",
  "Stockpile 1",
  "Stockpile 2",
  "Stockpile 3",
  "Quarry North",
  "Quarry South",
  "Yard 1",
  "Yard 2",
];
const taxCodes = ["Taxable", "Tax Exempt", "Resale", "Government"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTrucks(count: number): Truck[] {
  const out: Truck[] = [];
  for (let i = 0; i < count; i++) {
    const truckNum = 1000 + i;
    const tare = randomInt(28000, 36000);
    const hoursAgo = randomInt(1, 72);
    out.push({
      id: `TRK-${truckNum}`,
      license: `${randomFrom(states)}-${randomInt(
        1000,
        9999
      )}-${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(
        65 + randomInt(0, 25)
      )}`,
      maxCapacity: randomInt(48000, 58000),
      lastTare: tare,
      lastTareTime:
        hoursAgo < 24
          ? `${hoursAgo} hrs ago`
          : `${Math.floor(hoursAgo / 24)} days ago`,
      driver: `${randomFrom(driverFirstNames)} ${randomFrom(driverLastNames)}`,
      truckType: randomFrom(truckTypes),
      carrier: randomFrom(carriers),
      axles: randomInt(3, 7),
      loadsToday: randomInt(0, 12),
      phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(
        1000,
        9999
      )}`,
    });
  }
  return out;
}

function generateCustomers(count: number): Customer[] {
  const out: Customer[] = [];
  const usedNames = new Set<string>();
  for (let i = 0; i < count; i++) {
    let name = "";
    do {
      name = `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;
    } while (usedNames.has(name));
    usedNames.add(name);
    const status = randomFrom(statuses);
    const isCOD = status === "COD Only";
    out.push({
      id: `CUST-${1000 + i}`,
      name,
      status,
      creditRemaining: isCOD ? 0 : randomInt(5000, 100000),
      city: randomFrom(cities),
      state: randomFrom(states),
      phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(
        1000,
        9999
      )}`,
      paymentTerms: isCOD ? "COD" : randomFrom(paymentTerms),
      taxExempt: Math.random() > 0.8,
      ytdTons: randomInt(100, 50000),
    });
  }
  return out;
}

function generateOrders(count: number, customerList: Customer[]): Order[] {
  const out: Order[] = [];
  for (let i = 0; i < count; i++) {
    const customer = randomFrom(customerList);
    const totalQty = randomInt(500, 10000);
    const remainingQty = randomInt(100, totalQty);
    out.push({
      id: `ORD-${10000 + i}`,
      poNumber: `PO-${randomInt(10000, 99999)}`,
      description: randomFrom(projectDescriptions),
      remainingQty,
      customerId: customer.id,
      customerName: customer.name,
      jobType: randomFrom(jobTypes),
      totalQty,
      deliveredQty: totalQty - remainingQty,
      jobSite: `${randomInt(100, 9999)} ${randomFrom([
        "Main",
        "Oak",
        "Elm",
        "Pine",
        "Cedar",
        "Maple",
        "Industrial",
        "Commerce",
        "Highway",
      ])} ${randomFrom(["St", "Ave", "Rd", "Blvd", "Dr", "Ln"])}`,
      expires: `${randomInt(1, 12)}/${randomInt(24, 26)}`,
      notes:
        Math.random() > 0.7
          ? randomFrom([
              "Call before delivery",
              "Gate code: 1234",
              "Check in at office",
              "Use back entrance",
              "Weight tickets required",
              "",
            ])
          : "",
    });
  }
  return out;
}

function generateProducts(count: number): Product[] {
  const out: Product[] = [];
  for (let i = 0; i < count; i++) {
    const base = products[i % products.length];
    out.push({
      id: `PROD-${String(i + 1).padStart(4, "0")}`,
      name: base.name,
      dotCode: base.dot,
      price: randomInt(800, 2500) / 100,
      category: base.category,
      stockpile: randomFrom(stockpiles),
      inStock: randomInt(100, 10000),
      taxCode: randomFrom(taxCodes),
      minPrice: randomInt(500, 800) / 100,
      unitWeight: randomInt(2600, 2900),
    });
  }
  return out;
}

export const trucks = generateTrucks(200);
export const customers = generateCustomers(200);
export const orders = generateOrders(200, customers);
export const productsList = generateProducts(200);
