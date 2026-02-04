/** Domain types for POS — trucks, customers, orders, products */

export interface Truck {
  id: string;
  license: string;
  maxCapacity: number;
  lastTare: number;
  lastTareTime: string;
  driver: string;
  truckType: string;
  carrier: string;
  axles: number;
  loadsToday: number;
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  status: string;
  creditRemaining: number;
  city: string;
  state: string;
  phone: string;
  paymentTerms: string;
  taxExempt: boolean;
  ytdTons: number;
}

export interface Order {
  id: string;
  poNumber: string;
  description: string;
  remainingQty: number;
  customerId: string;
  customerName: string;
  jobType: string;
  totalQty: number;
  deliveredQty: number;
  jobSite: string;
  expires: string;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  dotCode: string;
  price: number;
  category: string;
  stockpile: string;
  inStock: number;
  taxCode: string;
  minPrice: number;
  unitWeight: number;
}

export type FieldType = "truck" | "customer" | "order" | "product";

export interface TransactionRecord {
  truck: Truck;
  customer: Customer;
  weight: number;
  timestamp?: number;
}
