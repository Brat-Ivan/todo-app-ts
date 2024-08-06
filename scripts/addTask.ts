import { validateInput } from "./helperFunction.js";
import { Task } from "./types.js";

const form = document.querySelector('.form') as HTMLFormElement;
const titleInput = document.querySelector('#title-input') as HTMLInputElement;
const detailInput = document.querySelector('#detail-input') as HTMLInputElement;
const deadlineInput = document.querySelector('#deadline-input') as HTMLInputElement;
const priorityDropdown = document.querySelector('#priority-dropdown') as HTMLSelectElement;

let tasks: Task[] = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks')!);
}

function addTask(e: Event): void | boolean {
  e.preventDefault();

  const taskTitleText = titleInput.value;
  const taskDetailText = detailInput.value;
  let taskDeadlineDate = deadlineInput.value;

  let isErrorTitle = validateInput(taskTitleText, titleInput);
  let isErrorDetail = validateInput(taskDetailText, detailInput);

  if (isErrorTitle || isErrorDetail) {
    return false;
  }

  if (!taskDeadlineDate) {
    taskDeadlineDate = 'Not set';
  } else {
    taskDeadlineDate = taskDeadlineDate.split('-').reverse().join('.');
  }

  const newTask: Task = {
    title: taskTitleText,
    detail: taskDetailText,
    deadline: taskDeadlineDate,
    priority: priorityDropdown.value,
    id: Date.now(),
    done: false
  }
  
  tasks.unshift(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  window.location.href = './index.html';
}

form.addEventListener('submit', addTask);
