import { ThemeToggle } from "./components/ThemeToggle";
import { PosInterface } from "./components/PosInterface";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.topBar}>
        <h1 className={styles.title}>POS Challenge</h1>
        <ThemeToggle />
      </header>
      <main className={styles.main}>
        <PosInterface />
      </main>
    </div>
  );
}

export default App;
