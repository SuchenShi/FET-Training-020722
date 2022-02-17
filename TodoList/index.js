// ~~~~~~~~~~~~Api~~~~~~~~~~~~~~
const Api = (() => {
    const baseUrl = "https://jsonplaceholder.typicode.com";
    const todo = "todos";

    const getTodos = () =>
        fetch([baseUrl, todo].join("/")).then((response) => response.json());

    const deleteTodo = (id) =>
        fetch([baseUrl, todo, id].join("/"), {
            method: "DELETE",
        });

    const getTodo = (id) => {};

    return {
        getTodos,
        deleteTodo,
    };
})();
// ~~~~~~~~~~~~View~~~~~~~~~~~~~~
const View = (() => {
    const domStr = {
        todolist: ".todolist-container",
        deletebtn: ".delete-btn",
    };
    const render = (ele, tmp) => {
        ele.innerHTML = tmp;
    };
    const createTmp = (arr) => {
        let tmp = "";
        arr.forEach((todo) => {
            tmp += `
                <li>
                    <span>${todo.title}</span>
                    <button class="delete-btn" id="${todo.id}">X</button>
                </li>
            `;
        });
        return tmp;
    };

    return {
        domStr,
        render,
        createTmp,
    };
})();

// ~~~~~~~~~~~~Model~~~~~~~~~~~~~~
const Model = ((api, view) => {
    class State {
        #todolist = [];

        get todolist() {
            return this.#todolist;
        }
        set todolist(newtodos) {
            this.#todolist = newtodos;
            // rerender the page;
            const tmp = view.createTmp(this.#todolist);
            const todolist = document.querySelector(view.domStr.todolist);
            view.render(todolist, tmp);
        }
    }

    const getTodos = api.getTodos;
    const deleteTodo = api.deleteTodo;

    return {
        getTodos,
        deleteTodo,
        State,
    };
})(Api, View);

// ~~~~~~~~~~~~Controller~~~~~~~~~~~~~~
const appController = ((model, view) => {
    const state = new model.State();
    const todolist = document.querySelector(view.domStr.todolist);

    const deleteTodo = () => {
        todolist.addEventListener("click", (event) => {
            state.todolist = state.todolist.filter(
                (todo) => +todo.id !== +event.target.id
            );
            // deleteTodo(event.target.id);
        });
    };

    const addTodo = () => {};

    const init = () => {
        model.getTodos().then((todos) => {
            state.todolist = todos;
        });
    };
    const bootstrap = () => {
        init();
        deleteTodo();
    };

    return { bootstrap };
})(Model, View);

appController.bootstrap();