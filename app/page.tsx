"use client";

import { useState, KeyboardEvent } from "react";
import styles from "./page.module.css";

type Todo = {
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { text: trimmed, completed: false }]);
    setInput("");
  };

  const handleDelete = (index: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCompleted = (index: number) => {
    setTodos((prev) =>
      prev.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
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
        <h1 className={styles.title}>TODO</h1>

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
                  <label className={styles.itemContent}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleCompleted(index)}
                      className={styles.checkbox}
                    />
                    <span
                      className={
                        todo.completed
                          ? `${styles.itemText} ${styles.itemTextCompleted}`
                          : styles.itemText
                      }
                    >
                      {todo.text}
                    </span>
                  </label>
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