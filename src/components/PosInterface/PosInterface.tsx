import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { trucks, customers, orders, productsList } from "../../data/seed";
import type { Truck, Customer, Order, Product, FieldType } from "../../types";
import type { TransactionRecord } from "../../types";
import { roundToIncrement } from "../../utils/weight";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import {
  FIELD_CONFIGS,
  getFilteredOptions,
  findSelectedById,
} from "../../lib/posFieldConfig";
import { Combobox } from "../Combobox";
import { ScaleDisplay } from "../ScaleDisplay";
import { TransactionHistory } from "../TransactionHistory";
import { HotkeysModal } from "../HotkeysModal";
import styles from "./PosInterface.module.css";

const EMPTY_ITEMS: {
  id: string;
  fields: { label: string; value: string; mono?: boolean }[];
}[] = [];

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

  const filteredItems = useMemo(
    () =>
      activeField ? getFilteredOptions(activeField, searchQuery) : EMPTY_ITEMS,
    [activeField, searchQuery]
  );

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
      const field = activeField;
      if (!field) return;
      const entity = findSelectedById(field, id);
      if (entity) {
        if (field === "truck") setSelectedTruck(entity as Truck);
        if (field === "customer") setSelectedCustomer(entity as Customer);
        if (field === "order") setSelectedOrder(entity as Order);
        if (field === "product") setSelectedProduct(entity as Product);
      }
      closeField();
    },
    [activeField, closeField]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setHighlightedIndex(0);
  }, []);

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
      filteredItems,
      highlightedIndex,
      selectItem,
      closeField,
      openField,
    ]
  );

  const getFieldValue = useCallback(
    (field: FieldType): string => {
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
    },
    [selectedTruck, selectedCustomer, selectedOrder, selectedProduct]
  );

  type DetailItem = {
    label: string;
    value: string;
    status?: "good" | "warn" | "bad";
  };

  const getFieldDetails = useCallback(
    (field: FieldType): DetailItem[] | null => {
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
    },
    [selectedTruck, selectedCustomer, selectedOrder, selectedProduct]
  );

  const handleHistorySelect = useCallback((tx: TransactionRecord) => {
    setSelectedTruck(tx.truck);
    setSelectedCustomer(tx.customer);
  }, []);

  const handlePrintTicket = useCallback(() => {
    if (!isStable || !selectedTruck || !selectedCustomer) return;
    setRecentTransactions((prev) => [
      { truck: selectedTruck, customer: selectedCustomer, weight: netWeight },
      ...prev.slice(0, 19),
    ]);
  }, [isStable, selectedTruck, selectedCustomer, netWeight]);

  const closeHotkeys = useCallback(() => setHotkeysOpen(false), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isStable && selectedTruck && selectedCustomer) {
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
  }, [isStable, selectedTruck, selectedCustomer, netWeight]);

  const noop = useCallback(() => {}, []);

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
                      onSearchChange={handleSearchChange}
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
                        onSearchChange={noop}
                        items={EMPTY_ITEMS}
                        highlightedIndex={0}
                        onHighlight={noop}
                        onSelect={noop}
                        onKeyDown={noop}
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
              <div className={styles.bottomSectionScale}>
                <ScaleDisplay
                  grossLbs={grossWeight}
                  tareLbs={tareWeight}
                  isStable={isStable}
                />
              </div>
              <div className={styles.bottomSectionActions}>
                <div className={styles.totals}>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue}>
                      ${((netWeight / 2000) * price).toFixed(2)}
                    </span>
                  </div>
                  <span className={styles.totalMeta}>
                    @ ${price.toFixed(2)}/ton
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.printBtn}
                  onClick={handlePrintTicket}
                  disabled={!isStable}
                  title={isStable ? undefined : "Wait for scale to be stable"}
                  aria-disabled={!isStable}
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

      <HotkeysModal isOpen={hotkeysOpen} onClose={closeHotkeys} />
    </>
  );
}
