"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import styles from "./page.module.css";

type Todo = {
  id: string;
  title: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初期表示時に一覧取得
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/todos");
        if (!res.ok) {
          throw new Error("TODO一覧の取得に失敗しました");
        }
        const data: Todo[] = await res.json();
        setTodos(data);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "不明なエラーが発生しました";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAdd = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    try {
      setError(null);
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = typeof errBody?.error === "string" ? errBody.error : "TODOの追加に失敗しました";
        throw new Error(msg);
      }

      const created: Todo = await res.json();
      // 新しいものを先頭に
      setTodos((prev) => [created, ...prev]);
      setInput("");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "不明なエラーが発生しました";
      setError(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("TODOの削除に失敗しました");
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "不明なエラーが発生しました";
      setError(message);
    }
  };

  const toggleCompleted = async (todo: Todo) => {
    const nextDone = !todo.is_done;

    try {
      setError(null);
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_done: nextDone }),
      });

      if (!res.ok) {
        throw new Error("TODOの更新に失敗しました");
      }

      const updated: Todo = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "不明なエラーが発生しました";
      setError(message);
    }
  };

  const handleEditTitle = async (todo: Todo) => {
    const nextTitle = window.prompt("タイトルを編集", todo.title);
    if (nextTitle == null) return;
    const trimmed = nextTitle.trim();
    if (!trimmed || trimmed === todo.title) return;

    try {
      setError(null);
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) {
        throw new Error("タイトルの更新に失敗しました");
      }

      const updated: Todo = await res.json();
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "不明なエラーが発生しました";
      setError(message);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleAdd();
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.is_done;
    if (filter === "done") return todo.is_done;
    return true;
  });

  const remainingCount = todos.filter((todo) => !todo.is_done).length;

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
            <button
              className={styles.addButton}
              onClick={() => {
                void handleAdd();
              }}
            >
              追加
            </button>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.filterGroup}>
              <button
                className={
                  filter === "all"
                    ? `${styles.filterButton} ${styles.filterButtonActive}`
                    : styles.filterButton
                }
                onClick={() => setFilter("all")}
              >
                すべて
              </button>
              <button
                className={
                  filter === "active"
                    ? `${styles.filterButton} ${styles.filterButtonActive}`
                    : styles.filterButton
                }
                onClick={() => setFilter("active")}
              >
                未完了
              </button>
              <button
                className={
                  filter === "done"
                    ? `${styles.filterButton} ${styles.filterButtonActive}`
                    : styles.filterButton
                }
                onClick={() => setFilter("done")}
              >
                完了
              </button>
            </div>
            <div className={styles.statusText}>
              {loading
                ? "読み込み中..."
                : `残り ${remainingCount} 件のタスクがあります`}
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <ul className={styles.list}>
            {filteredTodos.length === 0 ? (
              <li className={styles.empty}>
                {loading
                  ? "読み込み中です..."
                  : "条件に合うタスクがありません"}
              </li>
            ) : (
              filteredTodos.map((todo) => (
                <li key={todo.id} className={styles.item}>
                  <label className={styles.itemContent}>
                    <input
                      type="checkbox"
                      checked={todo.is_done}
                      onChange={() => {
                        void toggleCompleted(todo);
                      }}
                      className={styles.checkbox}
                    />
                    <span
                      className={
                        todo.is_done
                          ? `${styles.itemText} ${styles.itemTextCompleted}`
                          : styles.itemText
                      }
                      onDoubleClick={() => {
                        void handleEditTitle(todo);
                      }}
                    >
                      {todo.title}
                    </span>
                  </label>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      void handleDelete(todo.id);
                    }}
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