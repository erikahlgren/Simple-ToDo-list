const stateExists = () => Object.prototype.hasOwnProperty.call(localStorage, 'todos');

const getToDoItemsFromLocalStorage = () => (stateExists()
  ? JSON.parse(localStorage.getItem('todos')).items : []);

const getSortOrderFromLocalStorage = () => (stateExists()
  ? JSON.parse(localStorage.getItem('todos')).sortOrder : true);

const writeToLocalStorage = (items, sortOrder) => {
  localStorage.setItem('todos', JSON.stringify({ items, sortOrder }));
};

const toggleSortOrder = () => {
  writeToLocalStorage(getToDoItemsFromLocalStorage(), !getSortOrderFromLocalStorage());
};

const checkIfAlreadyExists = (title, description) => getToDoItemsFromLocalStorage()
  .filter(el => el.title === title || el.description === description).length;

function inputIsInvalid(title, description) {
  if (stateExists() && checkIfAlreadyExists(title, description)) {
    return true;
  }
  if (title === '' || description === '') {
    return true;
  }
  return false;
}

function addToDoToLocalStorage(title, description, timestamp, isDone) {
  const items = getToDoItemsFromLocalStorage();
  items.push({
    title,
    description,
    timestamp,
    done: isDone,
  });
  writeToLocalStorage(items, getSortOrderFromLocalStorage());
}

function removeFromLocalStorage(title) {
  const items = getToDoItemsFromLocalStorage().filter(el => el.title !== title);
  writeToLocalStorage(items, getSortOrderFromLocalStorage());
}

function clearToDoList() {
  localStorage.clear();
  document.getElementById('todos').innerHTML = '';
}

function getTimeStamp() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const timestamp = `
    added: ${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} - 
    ${hours < 10 ? `0${hours}` : hours}:
    ${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}
  `;
  return timestamp;
}

function sortToDoList() {
  const todos = document.querySelectorAll('.todo');
  const arrToDos = Array.prototype.slice.call(todos);
  if (getSortOrderFromLocalStorage()) {
    arrToDos.sort((a, b) => a.dataset.created.localeCompare(b.dataset.created));
  } else {
    arrToDos.sort((a, b) => b.dataset.created.localeCompare(a.dataset.created));
  }
  arrToDos.forEach((el) => {
    const parent = el.parentNode;
    const detached = parent.removeChild(el);
    parent.appendChild(detached);
  });
}

function sanitizeInput() {
  return {
    title: document.getElementById('title').value.replace(/<.*?>/g, ''),
    description: document.getElementById('description').value.replace(/<.*?>/g, ''),
  };
}

function addItemListener(todos, todo, title, description, timeStamp) {
  todo.addEventListener('click', (e) => {
    todo.classList.toggle('done');
    const removeButton = todo.querySelector('#remove');
    if (e.target !== removeButton) {
      const setDone = !!todo.classList.contains('done');
      removeFromLocalStorage(title);
      addToDoToLocalStorage(title, description, timeStamp, setDone);
    } else {
      removeFromLocalStorage(title);
      todos.removeChild(todo);
    }
  });
}

function appendToDoToDOM(title, description, timeStamp, isDone) {
  const todos = document.getElementById('todos');
  const todo = document.createElement('DIV');
  todo.classList.add('todo');
  if (isDone) {
    todo.classList.add('done');
  }
  todo.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
    <p class="timestamp">${timeStamp}</p>
    <button id="remove" class="remove-button">Remove</button>
  `;
  todo.dataset.created = timeStamp;
  todos.appendChild(todo);
  addItemListener(todos, todo, title, description, timeStamp);
}

const restoreToDoListFromLocalStorage = () => getToDoItemsFromLocalStorage()
  .forEach(el => appendToDoToDOM(el.title, el.description, el.timestamp, el.done));

function addToDo() {
  const { title, description } = sanitizeInput();
  if (inputIsInvalid(title, description)) {
    return;
  }
  const timeStamp = getTimeStamp();
  const isDone = false;
  addToDoToLocalStorage(title, description, timeStamp, isDone);
  appendToDoToDOM(title, description, timeStamp, isDone);
}

document.addEventListener('DOMContentLoaded', () => {
  if (stateExists()) {
    restoreToDoListFromLocalStorage();
    sortToDoList();
  }
  document.getElementById('sortbutton').addEventListener('click', (e) => {
    toggleSortOrder();
    sortToDoList();
    e.target.innerText = `Sort ${!getSortOrderFromLocalStorage() ? 'oldest first' : 'newest first'}`;
  });
  document.getElementById('submitbutton').addEventListener('click', () => addToDo());
  document.getElementById('clearlistbutton').addEventListener('click', () => clearToDoList());
});
