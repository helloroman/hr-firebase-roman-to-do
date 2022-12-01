import './style.css';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, onSnapshot } from "firebase/firestore"

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const template = `
  <div>
    <h1>Hello Firebase!</h1>
    <form id="form" class="form">
      <input type="text" id="title" />
      <button type="submit">Submit</button>
    </form>
    <ul class="todos"></ul>
  </div>
`;

document.querySelector('#app').innerHTML = template;
const todosContainer = document.querySelector('.todos');
const form = document.querySelector('.form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const inputValue = document.querySelector('#title').value;
  if (inputValue) {
    await addDoc(collection(db, 'todos'), {
      title: inputValue,
      done: false,
    });
  }
})

// Create and add task item do the list
const createTask = (id, task) => {
  const li = document.createElement('li');
  li.classList.add('todo-task');
  li.innerHTML = `<p id="${id}">${task.done ? '✅' : '⭐️'} ${task.title}</p>`

  return li;
}

// Fetch tasks from firestore database
const tasksQuery = query(collection(db, 'todos'));
const unsub = onSnapshot(tasksQuery, tasksSnapshot => {
  todosContainer.innerHTML = '';

  tasksSnapshot.forEach((task) => {
    todosContainer.appendChild(createTask(task.id, task.data()));
  });
});

// Mark task as done on click
todosContainer.addEventListener('click', async (event) => {
  if (!event.target.id) return;
  const taskRef = doc(db, 'todos', event.target.id);
  await updateDoc(taskRef, {
    done: true,
  })
})