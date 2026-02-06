import { useCallback, useEffect, useMemo, useState } from "react";
import {
  EMPTY_DISPLAY,
  FOCUS_KEY_MAP,
  HOTKEY_ITEMS,
  INITIAL_FOCUS_SIGNAL,
  RECENT_TRANSACTIONS_LIMIT,
  SCALE_MIN_WEIGHT,
  SCALE_UPDATE_INTERVAL_MS,
  SYNC_OUTBOX_DELAY_MS,
} from "../constants";
import styles from "./POSApp.module.css";
import ThemeToggle from "./ThemeToggle";
import SearchField from "./SearchField";
import CommandPalette, { type PaletteEntity } from "./CommandPalette";
import { customers, historySeed, orders, products, trucks } from "./posData";
import type { Entity, FocusableId, HistoryRecord } from "./posTypes";
import { entityById, formatTime, pounds } from "./posUtils";
import { useTheme } from "../hooks/useTheme";

function isInputFocused(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  return target.getAttribute("contenteditable") === "true";
}

export default function POSApp() {
  const { theme, toggleTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hotkeysOpen, setHotkeysOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const [outbox, setOutbox] = useState<HistoryRecord[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<Entity | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Entity | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Entity | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Entity | null>(null);
  const [gross, setGross] = useState<number | null>(null);
  const [tare, setTare] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>(historySeed);

  const [scaleWeight, setScaleWeight] = useState(64000);
  const [isStable, setIsStable] = useState(true);
  const [focusSignal, setFocusSignal] = useState<Record<FocusableId, number>>(INITIAL_FOCUS_SIGNAL);

  useEffect(() => {
    const interval = setInterval(() => {
      const unstable = Math.random() > 0.72;
      setIsStable(!unstable);

      setScaleWeight((prev) => {
        const jitter = unstable
          ? Math.floor(Math.random() * 800 - 400)
          : Math.floor(Math.random() * 60 - 30);
        return Math.max(SCALE_MIN_WEIGHT, prev + jitter);
      });
    }, SCALE_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const recentForCustomer = useMemo(() => {
    if (!selectedCustomer) return [];
    return history.filter((x) => x.customerId === selectedCustomer.id);
  }, [history, selectedCustomer]);

  const net = useMemo(() => {
    if (gross == null || tare == null) return null;
    return Math.max(0, gross - tare);
  }, [gross, tare]);

  const canFinalize =
    selectedTruck &&
    selectedCustomer &&
    selectedOrder &&
    selectedProduct &&
    net &&
    net > 0;

  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const openHotkeys = useCallback(() => setHotkeysOpen(true), []);
  const closeHotkeys = useCallback(() => setHotkeysOpen(false), []);

  const resetTicket = useCallback(() => {
    setSelectedTruck(null);
    setSelectedCustomer(null);
    setSelectedOrder(null);
    setSelectedProduct(null);
    setGross(null);
    setTare(null);
    setFocusSignal((prev) => ({ ...prev, truck: prev.truck + 1 }));
  }, []);

  const completeTransaction = useCallback(() => {
    if (!canFinalize || gross == null || tare == null || net == null) return;

    const record: HistoryRecord = {
      id: `TX-${String(history.length + 1).padStart(3, "0")}`,
      truckId: selectedTruck.id,
      customerId: selectedCustomer.id,
      orderId: selectedOrder.id,
      productId: selectedProduct.id,
      gross,
      tare,
      net,
      timestamp: new Date().toISOString(),
    };

    if (online) {
      setHistory((prev: HistoryRecord[]) => [record, ...prev]);
    } else {
      setOutbox((prev: HistoryRecord[]) => [record, ...prev]);
    }
    setGross(null);
    setTare(null);
  }, [
    canFinalize,
    gross,
    tare,
    net,
    history.length,
    online,
    selectedTruck,
    selectedCustomer,
    selectedOrder,
    selectedProduct,
  ]);

  const applyHistory = useCallback((record: HistoryRecord) => {
    setSelectedTruck(entityById(trucks, record.truckId) ?? null);
    setSelectedCustomer(entityById(customers, record.customerId) ?? null);
    setSelectedOrder(entityById(orders, record.orderId) ?? null);
    setSelectedProduct(entityById(products, record.productId) ?? null);
  }, []);

  const repeatLast = useCallback(() => {
    const last = history[0] ?? outbox[0];
    if (!last) return;
    applyHistory(last);
    setGross(null);
    setTare(null);
  }, [applyHistory, history, outbox]);

  const repeatProduct = useCallback(() => {
    const last = history[0] ?? outbox[0];
    if (!last) return;
    setSelectedProduct(entityById(products, last.productId) ?? null);
  }, [history, outbox]);

  const handlePalettePick = useCallback((ent: PaletteEntity) => {
    if (ent.kind === "TRUCK") setSelectedTruck(ent.entity);
    if (ent.kind === "CUSTOMER") setSelectedCustomer(ent.entity);
    if (ent.kind === "ORDER") setSelectedOrder(ent.entity);
    if (ent.kind === "PRODUCT") setSelectedProduct(ent.entity);
  }, []);

  const recentTransactions = useMemo(
    () => [...outbox, ...history].slice(0, RECENT_TRANSACTIONS_LIMIT),
    [outbox, history],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isTyping = isInputFocused(event.target);
      const lower = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && lower === "k") {
        event.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (event.key === "Escape" && paletteOpen) {
        event.preventDefault();
        setPaletteOpen(false);
        return;
      }
      if (event.key === "Escape" && hotkeysOpen) {
        event.preventDefault();
        setHotkeysOpen(false);
        return;
      }

      if (isTyping) {
        if (lower === "g") {
          event.preventDefault();
          if (isStable) setGross(scaleWeight);
          return;
        }
        if (lower === "t") {
          event.preventDefault();
          if (isStable) setTare(scaleWeight);
          return;
        }
        if (lower === "f") {
          event.preventDefault();
          completeTransaction();
          return;
        }
        return;
      }

      if (!event.ctrlKey && !event.metaKey) {
        if (event.key === "F2") {
          event.preventDefault();
          if (isStable) setGross(scaleWeight);
        }
        if (event.key === "F3") {
          event.preventDefault();
          if (isStable) setTare(scaleWeight);
        }
        if (lower === "n") {
          event.preventDefault();
          resetTicket();
        }
        if (lower === "g") {
          event.preventDefault();
          if (isStable) setGross(scaleWeight);
        }
        if (lower === "t") {
          event.preventDefault();
          if (isStable) setTare(scaleWeight);
        }
        if (lower === "f") {
          event.preventDefault();
          completeTransaction();
        }
        if (lower === "r") {
          event.preventDefault();
          repeatLast();
        }
        if (lower === "p") {
          event.preventDefault();
          repeatProduct();
        }
        if (lower === "o") {
          event.preventDefault();
          setOnline((prev) => !prev);
        }
        return;
      }

      const focusId = FOCUS_KEY_MAP[lower];
      if (focusId) {
        event.preventDefault();
        setFocusSignal((prev) => ({ ...prev, [focusId]: prev[focusId] + 1 }));
      }

      if (event.key === "Enter") {
        event.preventDefault();
        completeTransaction();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    completeTransaction,
    isStable,
    paletteOpen,
    hotkeysOpen,
    repeatLast,
    repeatProduct,
    resetTicket,
    scaleWeight,
  ]);

  useEffect(() => {
    if (!online || outbox.length === 0) return;
    const syncTimer = window.setTimeout(() => {
      setHistory((prev) => [...outbox, ...prev]);
      setOutbox([]);
    }, SYNC_OUTBOX_DELAY_MS);

    return () => window.clearTimeout(syncTimer);
  }, [online, outbox]);

  return (
    <>
      <div className={styles.themeDock}>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <main className={styles.page}>
        <header className={styles.header}>
          <div>
            <div className={styles.headerTop}>
              <p className={styles.kicker}>FastWeigh Operator Console</p>
              <div className={styles.headerActions}>
                <span className={styles.statusInline}>
                  {online ? "Online" : `Offline - ${outbox.length} queued`}
                </span>
                <button
                  type="button"
                  className={styles.hotkeysButton}
                  onClick={openHotkeys}
                  aria-label="Show keyboard shortcuts"
                >
                  <span className={styles.hotkeysIcon}>?</span>
                  Hotkeys
                </button>
              </div>
            </div>
            <h1 className={styles.title}>Bulk Materials POS</h1>
            <p className={styles.subtitle}>
              Keyboard-first workflow for high-throughput truck processing. Jump
              to fields with ⌘+T/⌘+C/⌘+O/⌘+P, search anything with ⌘+K, capture
              weights with F2/F3 or G/T, and finalize with ⌘+Enter or F.
            </p>
          </div>
          <aside className={styles.headerAside}>
            <div className={styles.statusCard}>
              <div className={styles.statusRow}>
                <span>Scale Link</span>
                <span>{online ? "Online" : "Offline"}</span>
              </div>
              <div className={styles.statusValue}>{pounds(scaleWeight)}</div>
              <span
                className={`${styles.pill} ${
                  isStable ? styles.pillStable : styles.pillUnstable
                }`}
              >
                {isStable
                  ? `Stable - Ready to capture`
                  : `Unstable - Hold truck`}
              </span>
            </div>
            <div className={styles.dataCard}>
              <div className={styles.dataTitle}>Live Data Volume</div>
              <div className={styles.dataGrid}>
                <div>
                  <strong>{trucks.length}</strong>
                  <span>Trucks</span>
                </div>
                <div>
                  <strong>{customers.length}</strong>
                  <span>Customers</span>
                </div>
                <div>
                  <strong>{orders.length}</strong>
                  <span>Orders</span>
                </div>
                <div>
                  <strong>{products.length}</strong>
                  <span>Products</span>
                </div>
              </div>
            </div>
          </aside>
        </header>

        <section className={`${styles.grid} ${styles.gridFour}`}>
          <SearchField
            id="truck"
            label="Truck"
            placeholder="Plate, fleet ID, color..."
            options={trucks}
            selected={selectedTruck}
            onSelect={setSelectedTruck}
            hotkey="⌘+T"
            requestFocusSignal={focusSignal.truck}
          />
          <SearchField
            id="customer"
            label="Customer"
            placeholder="Customer name or account..."
            options={customers}
            selected={selectedCustomer}
            onSelect={setSelectedCustomer}
            hotkey="⌘+C"
            requestFocusSignal={focusSignal.customer}
          />
          <SearchField
            id="order"
            label="Order"
            placeholder="Jobsite, project code..."
            options={orders}
            selected={selectedOrder}
            onSelect={setSelectedOrder}
            hotkey="⌘+O"
            requestFocusSignal={focusSignal.order}
          />
          <SearchField
            id="product"
            label="Product"
            placeholder="Material name/code..."
            options={products}
            selected={selectedProduct}
            onSelect={setSelectedProduct}
            hotkey="⌘+P"
            requestFocusSignal={focusSignal.product}
          />
        </section>

        <section className={`${styles.grid} ${styles.gridThree}`}>
          <article className={styles.card}>
            <h2>Live Scale</h2>
            <p className={styles.scaleWeight}>{pounds(scaleWeight)}</p>
            <div className={styles.indicator}>
              <span
                className={`${styles.indicatorDot} ${
                  isStable ? "" : styles.indicatorDotUnstable
                }`}
                aria-hidden
              />
              <span>
                {isStable ? "Stable" : `Unstable - Wait before capture`}
              </span>
            </div>
            <div className={styles.captureActions}>
              <button
                type="button"
                disabled={!isStable}
                onClick={() => setGross(scaleWeight)}
                className={styles.primaryButton}
              >
                Capture Gross (F2/G)
              </button>
              <button
                type="button"
                disabled={!isStable}
                onClick={() => setTare(scaleWeight)}
                className={styles.secondaryButton}
              >
                Capture Tare (F3/T)
              </button>
            </div>
          </article>

          <article className={styles.card}>
            <h2>Weight Math</h2>
            <div className={styles.mathList}>
              <div className={styles.mathRow}>
                <span>Gross</span>
                <strong>{gross == null ? EMPTY_DISPLAY : pounds(gross)}</strong>
              </div>
              <div className={styles.mathRow}>
                <span>Tare</span>
                <strong>{tare == null ? EMPTY_DISPLAY : pounds(tare)}</strong>
              </div>
              <div className={`${styles.mathRow} ${styles.netRow}`}>
                <span>Net</span>
                <span className={styles.netValue}>
                  {net == null ? EMPTY_DISPLAY : pounds(net)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={completeTransaction}
              disabled={!canFinalize}
              className={styles.finalizeButton}
            >
              Finalize Ticket (⌘+Enter/F)
            </button>
            <p className={styles.finalizeHint}>
              {canFinalize
                ? "Ready to issue ticket and send to dispatch."
                : "Waiting for selections and weight capture."}
            </p>
          </article>

          <article className={styles.card}>
            <h2>Quick Repeat</h2>
            <p className={styles.subtitle}>
              Select a customer to reuse their last order + product pairing.
            </p>
            <div className={styles.quickList}>
              {recentForCustomer.length ? (
                recentForCustomer.map((record) => (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => applyHistory(record)}
                    className={styles.quickItem}
                  >
                    <strong>{record.id}</strong>
                    <div>
                      {entityById(orders, record.orderId)?.code} -{" "}
                      {entityById(products, record.productId)?.name}
                    </div>
                    <div className={styles.muted}>{pounds(record.net)}</div>
                  </button>
                ))
              ) : (
                <p className={styles.muted}>
                  No recent loads for selected customer.
                </p>
              )}
            </div>
          </article>
        </section>

        <section className={styles.tableCard}>
          <h2>Recent Transactions</h2>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.tableCell} scope="col">Ticket</th>
                <th className={styles.tableCell} scope="col">Truck</th>
                <th className={styles.tableCell} scope="col">Customer</th>
                <th className={styles.tableCell} scope="col">Order</th>
                <th className={styles.tableCell} scope="col">Product</th>
                <th className={styles.tableCell} scope="col">Net</th>
                <th className={styles.tableCell} scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((row) => (
                <tr key={row.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <strong>{row.id}</strong>
                  </td>
                  <td className={styles.tableCell}>
                    {entityById(trucks, row.truckId)?.code}
                  </td>
                  <td className={styles.tableCell}>
                    {entityById(customers, row.customerId)?.code}
                  </td>
                  <td className={styles.tableCell}>{row.orderId}</td>
                  <td className={styles.tableCell}>
                    {entityById(products, row.productId)?.code}
                  </td>
                  <td className={styles.tableCell}>{pounds(row.net)}</td>
                  <td className={`${styles.tableCell} ${styles.muted}`}>
                    {formatTime(row.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        trucks={trucks}
        customers={customers}
        orders={orders}
        products={products}
        onPick={handlePalettePick}
      />

      {hotkeysOpen && (
        <div
          className={styles.overlay}
          onMouseDown={closeHotkeys}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hotkeys-title"
        >
          <div
            className={styles.hotkeysModal}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.hotkeysHeader}>
              <div>
                <div id="hotkeys-title" className={styles.hotkeysTitle}>
                  Keyboard Commands
                </div>
                <div className={styles.hotkeysHint}>
                  Click outside or press Esc to close.
                </div>
              </div>
              <button
                type="button"
                className={styles.hotkeysClose}
                onClick={closeHotkeys}
                aria-label="Close keyboard shortcuts"
              >
                Close
              </button>
            </div>
            <div className={styles.hotkeysBody}>
              {HOTKEY_ITEMS.map((item) => (
                <div key={item.key} className={styles.hotkeysItem}>
                  <div className={styles.hotkeysKey}>{item.key}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
