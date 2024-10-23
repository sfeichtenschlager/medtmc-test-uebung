import { produce } from "immer";
import { BASE_URL, store } from ".."

export async function loadAllUsers() {
    const res = await fetch(`${BASE_URL}/users`);
    const users = await res.json();

    let next = produce(store.getValue(), (draft) => {
        draft.users = users;
    });

    console.log("next is:", next);

    store.next(next);
}


