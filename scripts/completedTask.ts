import { PRIORITY } from "./constants.js";
import { Task } from "./types.js";

const taskList = document.querySelector('.task-list') as HTMLUListElement;
const taskTemplate = document.querySelector('#task-template') as HTMLTemplateElement;
const emptyListTemplate = document.querySelector('#empty-list-template') as HTMLTemplateElement;

let tasks: Task[] = [];

function renderTasks(): void {
  tasks = JSON.parse(localStorage.getItem('tasks')!);
  tasks = tasks.filter(task => task.done);
  tasks.forEach(task => {
    const currentTask = taskTemplate.content.cloneNode(true) as DocumentFragment;
    const taskListItem = currentTask.querySelector('.task-list__item') as HTMLLIElement;
    const taskElement = currentTask.querySelector('.task') as HTMLElement;
    const taskTitle = currentTask.querySelector('.task__title') as HTMLHeadingElement;
    const taskDetail = currentTask.querySelector('.task__detail') as HTMLParagraphElement;

    taskTitle.textContent = task.title;
    taskDetail.textContent = task.detail;

    if (task.priority === PRIORITY.high) {
      taskElement.classList.add('task--priority--high');
    } else if (task.priority === PRIORITY.medium) {
      taskElement.classList.add('task--priority--medium');
    } else if (task.priority === PRIORITY.low) {
      taskElement.classList.add('task--priority--low');
    }
    
    taskList.insertAdjacentElement('beforeend', taskListItem);
  });
}

if (localStorage.getItem('tasks')) {
  renderTasks();
}

function checkEmptyList(): void {
  if (!tasks.length) {
    const emptyList = emptyListTemplate.content.querySelector('.empty-list') as HTMLLIElement;
    taskList.insertAdjacentElement('afterbegin', emptyList);
  }
}

checkEmptyList();
