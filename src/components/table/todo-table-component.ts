import { html, render } from "lit-html";
import { store } from "../../features";
import { distinctUntilChanged, map, tap } from "rxjs";
import { Todo } from "../../features/todo";
import { UserIdObservingElement } from "../utils"

class ToDoTableComponent extends UserIdObservingElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }

    override subscribe() {
        const isMyTodo = (todo: Todo) => todo.userId == this.userId || !this.userId;
        store
            .pipe(
                map(model => model.todos),
                map(todos => todos.filter(isMyTodo)),
                distinctUntilChanged(),
                tap(todos => {
                    const activeTodos = todos.filter(todo => !todo.completed);
                    const completedTodos = todos.filter(todo => todo.completed);
                    render(template(activeTodos, completedTodos), this.shadowRoot!);
                })
            )
            .subscribe();
    }
}
customElements.define("todo-table", ToDoTableComponent)

function template(activeTodos: Todo[], completedTodos: Todo[]) {
  const activeRows = activeTodos.map(todo => html`
      <tr>
          <td>${todo.id}</td>
          <td>${todo.title}</td>
          <td><button @click=${() => todoDone(todo.id)}>Complete</button></td>
      </tr>
  `);

  const completedRows = completedTodos.map(todo => html`
      <tr>
          <td>${todo.id}</td>
          <td>${todo.title}</td>
          <td><button @click=${() => todoUndone(todo.id)}>Incomplete</button></td>
      </tr>
  `);

  return html`
      <h2>Active Todos</h2>
      <table>
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Title</th>
              </tr>
          </thead>
          <tbody>
              ${activeRows}
          </tbody>
      </table>

      <h2>Completed Todos</h2>
      <table>
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Title</th>
              </tr>
          </thead>
          <tbody>
              ${completedRows}
          </tbody>
      </table>
  `;
}

function todoDone(todoId: number) {
    const currentState = store.value;

    const updatedTodos = currentState.todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: true } : todo
    );

    store.next({
        ...currentState,
        todos: updatedTodos  
    });
}

function todoUndone(todoId: number) {
    const currentState = store.value;

    const updatedTodos = currentState.todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: false } : todo
    );

    store.next({
        ...currentState,
        todos: updatedTodos  
    });
}