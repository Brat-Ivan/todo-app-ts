import { validateInput } from "./helperFunction.js";
import { Task } from "./types.js";

const form = document.querySelector('.form') as HTMLFormElement;
const titleInput = document.querySelector('#title-input') as HTMLInputElement;
const detailInput = document.querySelector('#detail-input') as HTMLInputElement;
const deadlineInput = document.querySelector('#deadline-input') as HTMLInputElement;
const priorityDropdown = document.querySelector('#priority-dropdown') as HTMLSelectElement;

let tasks: Task[] = JSON.parse(localStorage.getItem('tasks')!);
const editableTask: Task = tasks.find(
  task => task.id === +JSON.parse(sessionStorage.getItem('editable task')!)
)!;

let taskTitleText = editableTask.title;
let taskDetailText = editableTask.detail;
let taskDeadlineDate = editableTask.deadline;

titleInput.value = taskTitleText;
detailInput.value = taskDetailText;

if (taskDeadlineDate !== 'Not set') {
  deadlineInput.value = taskDeadlineDate.split('.').reverse().join('-');
}

priorityDropdown.value = editableTask.priority;

function editCurrentTask(e: SubmitEvent): void | boolean {
  e.preventDefault();
  taskTitleText = titleInput.value;
  taskDetailText = detailInput.value;
  taskDeadlineDate = deadlineInput.value;

  if (!taskDeadlineDate) {
    taskDeadlineDate = 'Not set';
  } else {
    taskDeadlineDate = taskDeadlineDate.split('-').reverse().join('.');
  }

  const submitter = e.submitter as HTMLButtonElement;

  if (submitter.id === 'update-button') {
    let isErrorTitle = validateInput(taskTitleText, titleInput);
    let isErrorDetail = validateInput(taskDetailText, detailInput);
  
    if (isErrorTitle || isErrorDetail) {
      return false;
    }

    editableTask.title = taskTitleText;
    editableTask.detail = taskDetailText;
    editableTask.deadline = taskDeadlineDate;
    editableTask.priority = priorityDropdown.value;

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  window.location.href = './index.html';
}

form.addEventListener('submit', editCurrentTask);
