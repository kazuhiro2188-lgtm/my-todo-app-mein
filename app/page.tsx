"use client";

import { useState, KeyboardEvent } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, trimmed]);
    setInput("");
  };

  const handleDelete = (index: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>My Todo App</h1>

        <section className={styles.todoSection}>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="やることを入力して Enter または 追加 を押してください"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.addButton} onClick={handleAdd}>
              追加
            </button>
          </div>

          <ul className={styles.list}>
            {todos.length === 0 ? (
              <li className={styles.empty}>まだタスクがありません</li>
            ) : (
              todos.map((todo, index) => (
                <li key={index} className={styles.item}>
                  <span className={styles.itemText}>{todo}</span>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(index)}
                    aria-label="このタスクを削除"
                  >
                    🗑️
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}