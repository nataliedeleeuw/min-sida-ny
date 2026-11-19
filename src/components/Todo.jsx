
import { useState } from "react";
import "./Todo.css";

function loadTodos() {
  try {
    const saved = localStorage.getItem("todos");
    const lista = saved ? JSON.parse(saved) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export default function Todo() {
  const [todos, setTodos] = useState(loadTodos);
  const [text, setText] = useState("");

  const klara = todos.filter((todo) => todo.done).length;

  function saveTodos(nyaTodos) {
    setTodos(nyaTodos);
    localStorage.setItem("todos", JSON.stringify(nyaTodos));
  }

  function addTodo(e) {
    e.preventDefault();

    const nyText = text.trim();
    if (!nyText) return;

    saveTodos([
      ...todos,
      {
        id: Date.now(),
        text: nyText,
        done: false,
      },
    ]);

    setText("");
  }

  function toggleTodo(id) {
    saveTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, done: !todo.done }
          : todo
      )
    );
  }

  function removeTodo(id) {
    saveTodos(todos.filter((todo) => todo.id !== id));
  }

  function clearTodos() {
    saveTodos([]);
  }

  return (
    <section className="todo todo-board">
      <div className="todo-editorial-head">
        <div className="todo-kicker">
          <span>EN LITEN MINNESBANK</span>
          <span>01 / ANTECKNINGAR</span>
        </div>

        <h2>
          Lite mindre att
          <br />
          <em>hålla i huvudet.</em>
        </h2>

        <p className="todo-intro">
          Skriv ner det du behöver komma ihåg.
          Bocka av när det är klart. Resten får
          hjärnan syssla med på egen hand.
        </p>

        <svg
          className="todo-doodle"
          viewBox="0 0 120 55"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M5 29 Q25 12 39 28 T74 24 Q91 17 109 31" />
          <path d="M91 21l18 10-19 8" />
          <path d="M13 43 Q35 39 54 44" opacity=".5" />
        </svg>
      </div>

      <div className="todo-paper">
        <div className="todo-paper-top">
          <span>ANTECKNINGAR</span>
          <span>SPARAS I DIN WEBBLÄSARE</span>
        </div>

        <form onSubmit={addTodo} className="todo-entry">
          <label htmlFor="ny-uppgift">
            Vad vill du komma ihåg?
          </label>

          <div className="todo-entry-row">
            <input
              id="ny-uppgift"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv en påminnelse..."
              maxLength={120}
            />

            <button type="submit" className="todo-add">
              <span aria-hidden="true">+</span>
              Lägg till
            </button>
          </div>
        </form>

        <div className="todo-toolbar">
          <p className="todo-antal" aria-live="polite">
            {todos.length === 0
              ? "Inga påminnelser ännu"
              : `${klara} av ${todos.length} klara`}
          </p>

          {todos.length > 0 && (
            <button
              type="button"
              className="todo-rensa"
              onClick={clearTodos}
            >
              Rensa alla
            </button>
          )}
        </div>

        {todos.length === 0 ? (
          <div className="todo-empty">
            <span className="todo-empty-symbol" aria-hidden="true">
              ✳
            </span>

            <p>Här är det tomt.</p>
            <span>
              En ganska trevlig känsla, faktiskt.
            </span>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-note ${
                  todo.done ? "is-done" : ""
                }`}
              >
                <button
                  type="button"
                  className="todo-check"
                  onClick={() => toggleTodo(todo.id)}
                  aria-pressed={Boolean(todo.done)}
                  aria-label={
                    todo.done
                      ? `Markera ${todo.text} som inte klar`
                      : `Markera ${todo.text} som klar`
                  }
                >
                  {todo.done ? "✓" : ""}
                </button>

                <span className="todo-note-text">
                  {todo.text}
                </span>

                <button
                  type="button"
                  className="todo-delete"
                  onClick={() => removeTodo(todo.id)}
                  aria-label={`Ta bort ${todo.text}`}
                  title="Ta bort"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="todo-paper-bottom">
          <span>ETT STEG I TAGET</span>
          <span>✳</span>
        </div>
      </div>
    </section>
  );
}
