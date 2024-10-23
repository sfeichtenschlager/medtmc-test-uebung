import { html, render } from "lit-html";
import "../components/user-todo/user-todo-component"

class AppComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    
    connectedCallback() {
        console.log("AppComponent connected");
        render(template(), this.shadowRoot!);
    }
}
customElements.define("app-component", AppComponent);

function template() {
    return html`
      <user-todos user-id="4"></user-todos>
    `
}