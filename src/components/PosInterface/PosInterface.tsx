import { useState, useCallback, useEffect, useRef } from "react";
import { trucks, customers, orders, productsList } from "../../data/seed";
import type { Truck, Customer, Order, Product, FieldType } from "../../types";
import type { TransactionRecord } from "../../types";
import { fuzzyMatchFields } from "../../hooks/useFuzzyMatch";
import { roundToIncrement } from "../../utils/weight";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { Combobox, type ComboboxItem } from "../Combobox";
import { ScaleDisplay } from "../ScaleDisplay";
import { TransactionHistory } from "../TransactionHistory";
import { HotkeysModal } from "../HotkeysModal";
import styles from "./PosInterface.module.css";

const FIELD_CONFIGS: { key: FieldType; label: string; shortcut: string }[] = [
  { key: "truck", label: "Truck", shortcut: "⌘K" },
  { key: "customer", label: "Customer", shortcut: "⌘J" },
  { key: "order", label: "Order", shortcut: "⌘O" },
  { key: "product", label: "Product", shortcut: "⌘P" },
];

function getFilteredItems(field: FieldType, query: string): ComboboxItem[] {
  const q = query.trim().toLowerCase();
  const limit = 50;

  switch (field) {
    case "truck":
      return trucks
        .filter((t) =>
          fuzzyMatchFields(
            [t.id, t.license, t.driver, t.carrier, t.truckType, t.phone],
            q
          )
        )
        .slice(0, limit)
        .map((t) => ({
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
    case "customer":
      return customers
        .filter((c) =>
          fuzzyMatchFields(
            [c.name, c.id, c.city, c.state, c.phone, c.paymentTerms],
            q
          )
        )
        .slice(0, limit)
        .map((c) => ({
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
    case "order":
      return orders
        .filter((o) =>
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
        .slice(0, limit)
        .map((o) => ({
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
    case "product":
      return productsList
        .filter((p) =>
          fuzzyMatchFields(
            [p.name, p.id, p.dotCode, p.category, p.stockpile, p.taxCode],
            q
          )
        )
        .slice(0, limit)
        .map((p) => ({
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
    default:
      return [];
  }
}

export function PosInterface() {
  const [weight, setWeight] = useState(78000);
  const [isStable, setIsStable] = useState(true);
  const [activeField, setActiveField] = useState<FieldType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [hotkeysOpen, setHotkeysOpen] = useState(false);

  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(trucks[42]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    customers[15]
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[23]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    productsList[4]
  );

  const [recentTransactions, setRecentTransactions] = useState<
    TransactionRecord[]
  >(() =>
    Array.from({ length: 10 }, (_, i) => ({
      truck: trucks[i + 50],
      customer: customers[i + 20],
      weight: roundToIncrement(35000 + Math.floor(Math.random() * 20000)),
    }))
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const tareWeight = selectedTruck?.lastTare ?? 32000;
  const grossWeight = roundToIncrement(weight);
  const netWeight = grossWeight - tareWeight;
  const price = selectedProduct?.price ?? 12.5;

  // Scale simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsStable(false);
        const change =
          (Math.random() > 0.5 ? 1 : -1) * 20 * Math.ceil(Math.random() * 3);
        setWeight((prev) => prev + change);
        setTimeout(() => {
          setIsStable(true);
          setWeight(78000);
        }, 800);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  const openField = useCallback((field: FieldType) => {
    setActiveField(field);
    setSearchQuery("");
    setHighlightedIndex(0);
  }, []);

  const closeField = useCallback(() => {
    setActiveField(null);
    setSearchQuery("");
  }, []);

  useKeyboardShortcut("k", () => openField("truck"));
  useKeyboardShortcut("j", () => openField("customer"));
  useKeyboardShortcut("o", () => openField("order"));
  useKeyboardShortcut("p", () => openField("product"));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setHotkeysOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectItem = useCallback(
    (id: string) => {
      if (activeField === "truck")
        setSelectedTruck(trucks.find((t) => t.id === id) ?? null);
      if (activeField === "customer")
        setSelectedCustomer(customers.find((c) => c.id === id) ?? null);
      if (activeField === "order")
        setSelectedOrder(orders.find((o) => o.id === id) ?? null);
      if (activeField === "product")
        setSelectedProduct(productsList.find((p) => p.id === id) ?? null);
      closeField();
    },
    [activeField, closeField]
  );

  const filteredItems = activeField
    ? getFilteredItems(activeField, searchQuery)
    : [];

  const handleComboboxKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = filteredItems;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.min(prev + 1, items.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (items[highlightedIndex]) selectItem(items[highlightedIndex].id);
          break;
        case "Escape":
          e.preventDefault();
          closeField();
          break;
        case "Tab":
          e.preventDefault();
          const idx = FIELD_CONFIGS.findIndex((f) => f.key === activeField);
          const next = FIELD_CONFIGS[(idx + 1) % FIELD_CONFIGS.length];
          openField(next.key);
          break;
      }
    },
    [
      activeField,
      searchQuery,
      highlightedIndex,
      selectItem,
      closeField,
      openField,
    ]
  );

  const getFieldValue = (field: FieldType): string => {
    switch (field) {
      case "truck":
        return selectedTruck?.id ?? "Select...";
      case "customer":
        return selectedCustomer?.name ?? "Select...";
      case "order":
        return selectedOrder?.id ?? "Select...";
      case "product":
        return selectedProduct?.name ?? "Select...";
    }
  };

  type DetailItem = {
    label: string;
    value: string;
    status?: "good" | "warn" | "bad";
  };

  const getFieldDetails = (field: FieldType): DetailItem[] | null => {
    switch (field) {
      case "truck":
        if (!selectedTruck) return null;
        return [
          { label: "License", value: selectedTruck.license },
          { label: "Driver", value: selectedTruck.driver },
          { label: "Type", value: selectedTruck.truckType },
          { label: "Carrier", value: selectedTruck.carrier },
          {
            label: "Tare",
            value: `${(selectedTruck.lastTare / 1000).toFixed(1)}k`,
          },
          { label: "Loads", value: `${selectedTruck.loadsToday}` },
        ];
      case "customer":
        if (!selectedCustomer) return null;
        return [
          { label: "ID", value: selectedCustomer.id },
          {
            label: "Location",
            value: `${selectedCustomer.city}, ${selectedCustomer.state}`,
          },
          {
            label: "Status",
            value: selectedCustomer.status,
            status:
              selectedCustomer.status === "Active"
                ? "good"
                : selectedCustomer.status === "On Hold"
                ? "warn"
                : "bad",
          },
          { label: "Terms", value: selectedCustomer.paymentTerms },
          {
            label: "Credit",
            value:
              selectedCustomer.creditRemaining > 0
                ? `$${(selectedCustomer.creditRemaining / 1000).toFixed(0)}k`
                : "—",
          },
          {
            label: "YTD",
            value: `${(selectedCustomer.ytdTons / 1000).toFixed(1)}kT`,
          },
        ];
      case "order":
        if (!selectedOrder) return null;
        return [
          { label: "PO", value: selectedOrder.poNumber },
          { label: "Project", value: selectedOrder.description },
          { label: "Type", value: selectedOrder.jobType },
          { label: "Site", value: selectedOrder.jobSite },
          {
            label: "Rem",
            value: `${selectedOrder.remainingQty.toLocaleString()}T`,
          },
        ];
      case "product":
        if (!selectedProduct) return null;
        return [
          { label: "DOT", value: selectedProduct.dotCode },
          { label: "Category", value: selectedProduct.category },
          { label: "Stockpile", value: selectedProduct.stockpile },
          { label: "Price", value: `$${selectedProduct.price.toFixed(2)}/T` },
          {
            label: "Stock",
            value: `${selectedProduct.inStock.toLocaleString()}T`,
          },
          { label: "Tax", value: selectedProduct.taxCode },
        ];
      default:
        return null;
    }
  };

  const handleHistorySelect = useCallback((tx: TransactionRecord) => {
    setSelectedTruck(tx.truck);
    setSelectedCustomer(tx.customer);
  }, []);

  const handlePrintTicket = useCallback(() => {
    if (!selectedTruck || !selectedCustomer) return;
    setRecentTransactions((prev) => [
      { truck: selectedTruck, customer: selectedCustomer, weight: netWeight },
      ...prev.slice(0, 19),
    ]);
  }, [selectedTruck, selectedCustomer, netWeight]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (selectedTruck && selectedCustomer) {
          setRecentTransactions((prev) => [
            {
              truck: selectedTruck,
              customer: selectedCustomer,
              weight: netWeight,
            },
            ...prev.slice(0, 19),
          ]);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedTruck, selectedCustomer, netWeight]);

  return (
    <>
      <div className={styles.mockup}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.logo}>FASTWEIGH</span>
            <span className={styles.headerTitle}>Point of Sale</span>
          </div>
          <div className={styles.headerRight}>
            <button
              type="button"
              className={styles.hotkey}
              onClick={() => setHotkeysOpen(true)}
              aria-label="Show keyboard shortcuts"
            >
              ? Hotkeys
            </button>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.mainPanel}>
            <div className={styles.fieldsSection}>
              {FIELD_CONFIGS.map((field) => (
                <div
                  key={field.key}
                  className={`${styles.fieldRow} ${
                    activeField === field.key ? styles.fieldRowActive : ""
                  }`}
                >
                  {activeField === field.key ? (
                    <Combobox
                      label={field.label}
                      shortcut={field.shortcut}
                      displayValue={getFieldValue(field.key)}
                      isOpen={true}
                      onOpen={() => openField(field.key)}
                      onClose={closeField}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      items={filteredItems}
                      highlightedIndex={highlightedIndex}
                      onHighlight={setHighlightedIndex}
                      onSelect={selectItem}
                      onKeyDown={handleComboboxKeyDown}
                      inputRef={inputRef}
                      listRef={listRef}
                      placeholder={`Search ${field.label.toLowerCase()}...`}
                      listboxId={`listbox-${field.key}`}
                      inputId={`combobox-${field.key}`}
                    />
                  ) : (
                    <>
                      <Combobox
                        label={field.label}
                        shortcut={field.shortcut}
                        displayValue={getFieldValue(field.key)}
                        isOpen={false}
                        onOpen={() => openField(field.key)}
                        onClose={closeField}
                        searchQuery=""
                        onSearchChange={() => {}}
                        items={[]}
                        highlightedIndex={0}
                        onHighlight={() => {}}
                        onSelect={() => {}}
                        onKeyDown={() => {}}
                        inputRef={inputRef}
                        listRef={listRef}
                        listboxId={`listbox-${field.key}`}
                        inputId={`combobox-${field.key}`}
                      />
                      <div className={styles.fieldDetails}>
                        {getFieldDetails(field.key)?.map((d) => (
                          <div key={d.label} className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                              {d.label}
                            </span>
                            <span
                              className={`${styles.detailValue} ${
                                d.status === "good"
                                  ? styles.detailGood
                                  : d.status === "warn"
                                  ? styles.detailWarn
                                  : d.status === "bad"
                                  ? styles.detailBad
                                  : ""
                              }`}
                            >
                              {d.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.searchHint}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search • Tab next • Enter select • Esc close</span>
            </div>

            <div className={styles.bottomSection}>
              <ScaleDisplay
                grossLbs={grossWeight}
                tareLbs={tareWeight}
                isStable={isStable}
              />
              <div className={styles.totals}>
                <div className={styles.totalItem}>
                  <span className={styles.totalLabel}>
                    @ ${price.toFixed(2)}/ton
                  </span>
                  <span className={styles.totalValue}>
                    ${((netWeight / 2000) * price).toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.printBtn}
                  onClick={handlePrintTicket}
                >
                  Print Ticket
                  <span className={styles.btnShortcut}>⌘↵</span>
                </button>
              </div>
            </div>
          </div>

          <TransactionHistory
            transactions={recentTransactions}
            onSelect={handleHistorySelect}
          />
        </div>
      </div>

      <HotkeysModal
        isOpen={hotkeysOpen}
        onClose={() => setHotkeysOpen(false)}
      />
    </>
  );
}
