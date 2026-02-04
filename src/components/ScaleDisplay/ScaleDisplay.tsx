import { memo } from "react";
import { formatWeight } from "../../utils/weight";
import styles from "./ScaleDisplay.module.css";

interface ScaleDisplayProps {
  /** Current gross weight in lbs */
  grossLbs: number;
  /** Tare weight in lbs */
  tareLbs: number;
  /** Whether scale reading is stable */
  isStable: boolean;
}

function ScaleDisplayBase({ grossLbs, tareLbs, isStable }: ScaleDisplayProps) {
  const gross = formatWeight(grossLbs);
  const tare = formatWeight(tareLbs);
  const netLbs = grossLbs - tareLbs;
  const net = formatWeight(netLbs);

  return (
    <div className={styles.scaleCompact}>
      <div className={styles.scaleLabel}>
        <span>SCALE</span>
        <span
          className={`${styles.scaleStatus} ${
            isStable ? styles.stable : styles.moving
          }`}
          aria-live="polite"
        >
          {isStable ? "STABLE" : "READING"}
        </span>
      </div>
      <div className={styles.weightDisplay}>
        <div className={styles.weightGroup}>
          <span className={styles.weightUnit}>lbs</span>
          <div className={styles.weightRow}>
            <div className={styles.weightItem}>
              <span className={styles.weightLabel}>Gross</span>
              <span className={styles.weightValue}>{gross.lbs}</span>
            </div>
            <span className={styles.weightDivider} aria-hidden>
              −
            </span>
            <div className={styles.weightItem}>
              <span className={styles.weightLabel}>Tare</span>
              <span className={styles.weightValue}>{tare.lbs}</span>
            </div>
            <span className={styles.weightDivider} aria-hidden>
              =
            </span>
            <div className={`${styles.weightItem} ${styles.weightNet}`}>
              <span className={styles.weightLabel}>Net</span>
              <span className={styles.weightValue}>{net.lbs}</span>
            </div>
          </div>
        </div>
        <div className={styles.weightGroupSep} />
        <div className={styles.weightGroup}>
          <span className={styles.weightUnit}>tons</span>
          <div className={styles.weightRow}>
            <div className={styles.weightItem}>
              <span className={styles.weightLabel}>Gross</span>
              <span className={styles.weightValue}>{gross.tons}</span>
            </div>
            <span className={styles.weightDivider} aria-hidden>
              −
            </span>
            <div className={styles.weightItem}>
              <span className={styles.weightLabel}>Tare</span>
              <span className={styles.weightValue}>{tare.tons}</span>
            </div>
            <span className={styles.weightDivider} aria-hidden>
              =
            </span>
            <div className={`${styles.weightItem} ${styles.weightNet}`}>
              <span className={styles.weightLabel}>Net</span>
              <span className={styles.weightValue}>{net.tons}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ScaleDisplay = memo(ScaleDisplayBase);
