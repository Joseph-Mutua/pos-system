export type Entity = {
  id: string;
  code: string;
  name: string;
  aliases?: string[];
};

export type HistoryRecord = {
  id: string;
  truckId: string;
  customerId: string;
  orderId: string;
  productId: string;
  gross: number;
  tare: number;
  net: number;
  timestamp: string;
};

export type FocusableId = "truck" | "customer" | "order" | "product";
