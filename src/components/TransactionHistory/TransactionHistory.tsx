import type { TransactionRecord } from "../../types";
import styles from "./TransactionHistory.module.css";

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
  onSelect: (tx: TransactionRecord) => void;
}

export function TransactionHistory({
  transactions,
  onSelect,
}: TransactionHistoryProps) {
  return (
    <div className={styles.historyPanel}>
      <div className={styles.historyHeader}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>Recent</span>
      </div>
      <div className={styles.historyList} role="list">
        {transactions.map((tx, i) => (
          <button
            key={i}
            type="button"
            className={styles.historyItem}
            onClick={() => onSelect(tx)}
            role="listitem"
          >
            <span className={styles.historyTruck}>{tx.truck.id}</span>
            <span className={styles.historyCustomer}>{tx.customer.name}</span>
            <span className={styles.historyWeight}>
              {(tx.weight / 1000).toFixed(1)}k
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
