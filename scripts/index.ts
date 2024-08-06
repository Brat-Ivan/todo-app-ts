import { PRIORITY, SORT_DROPDOWN_TEXT, PRIORITY_ARR } from "./constants.js";
import { Task, Item } from "./types.js";

const taskList = document.querySelector('.task-list') as HTMLUListElement;
const taskTemplate = document.querySelector('#task-template') as HTMLTemplateElement;
const emptyListTemplate = document.querySelector('#empty-list-template') as HTMLTemplateElement;
const sortDropdown = document.querySelector('#sort-dropdown') as HTMLSelectElement;
const uncompletedBtn = document.querySelector('#uncompleted-button') as HTMLButtonElement;
const uncompletedBtnText = uncompletedBtn.querySelector('.nav-bar__button-text') as HTMLButtonElement;

let tasks: Task[] = [];

function renderTasks(): void {
  tasks = JSON.parse(localStorage.getItem('tasks')!);

  tasks.forEach((task) => {
    const currentTask = taskTemplate.content.cloneNode(true) as DocumentFragment;
    const taskListItem = currentTask.querySelector('.task-list__item') as HTMLLIElement;
    const taskElement = currentTask.querySelector('.task') as HTMLElement;
    const taskTitle = currentTask.querySelector('.task__title') as HTMLHeadingElement;
    const taskDetail = currentTask.querySelector('.task__detail') as HTMLParagraphElement;
    const taskDeadline = currentTask.querySelector('.task__deadline') as HTMLParagraphElement;
    const taskPriority = currentTask.querySelector('.task__priority') as HTMLParagraphElement;
    const editBtn = currentTask.querySelector('.task__button') as HTMLAnchorElement;

    taskTitle.textContent = task.title;
    taskDetail.textContent = task.detail;
    taskDeadline.textContent = `Deadline: ${task.deadline}`;
    taskPriority.textContent = `Priority: ${task.priority}`;
    taskListItem.id = String(task.id);

    if (task.priority === PRIORITY.high) {
      taskElement.classList.add('task--priority--high');
    } else if (task.priority === PRIORITY.medium) {
      taskElement.classList.add('task--priority--medium');
    } else if (task.priority === PRIORITY.low) {
      taskElement.classList.add('task--priority--low');
    }
    
    if (task.done) {
      taskListItem.classList.toggle('task-list__item--done-task');
      editBtn.classList.add('task__button--disabled');
    }

    taskList.insertAdjacentElement('beforeend', taskListItem);
  });
}

if (localStorage.getItem('tasks')) {
  renderTasks();
}

function checkEmptyList(): void {
  const tasksLength = tasks.length;
  if (
    !tasksLength ||
    (tasksLength === taskList.querySelectorAll('.task-list__item--done-task').length &&
    taskList.classList.contains('task-list--hidden-completed'))
  ) {
    const emptyList = emptyListTemplate.content.cloneNode(true) as DocumentFragment;
    const emptyListItem = emptyList.querySelector('.empty-list') as HTMLLIElement;
    const emptyListText = emptyListItem.querySelector('.empty-list__text') as HTMLParagraphElement;
    
    if (tasksLength) {
      emptyListText.textContent = 'All tasks are completed';
    } else {
      emptyListText.textContent = 'ToDo list is empty';
    }

    const emptyListElement = document.querySelector('.empty-list') as HTMLLIElement;

    if (!emptyListElement) {
      taskList.insertAdjacentElement('afterbegin', emptyListItem);
    }
  } else {
    const emptyListElement = document.querySelector('.empty-list') as HTMLLIElement;
    
    if (emptyListElement) {
      emptyListElement.remove();
    }
  }
}

checkEmptyList();

function editTask(e: MouseEvent): void {
  const target = e.target as HTMLButtonElement;

  if (target.id !== 'edit-btn') return;
  e.preventDefault();
  
  const parentNode = target.closest('.task-list__item') as HTMLLIElement;
  const editBtn = parentNode.querySelector('.task__button') as HTMLAnchorElement;

  if (!editBtn.classList.contains('task__button--disabled')) {
    sessionStorage.setItem('editable task', JSON.stringify(parentNode.id));
    window.location.href = './edit-task.html';
  }
}

taskList.addEventListener('click', editTask);

function deleteTask(e: MouseEvent): void {
  const target = e.target as HTMLButtonElement;
  
  if (target.id !== 'delete-btn') return;

  const parentNode = target.closest('.task-list__item') as HTMLLIElement;
  const taskId = +parentNode.id;
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  tasks.splice(taskIndex, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  parentNode.remove();
  checkEmptyList();
}

taskList.addEventListener('click', deleteTask);

function doneTask(e: MouseEvent): void {
  const target = e.target as HTMLButtonElement;

  if (target.id !== 'done-btn') return;

  const parentNode = target.closest('.task-list__item') as HTMLLIElement;
  const taskId = +parentNode.id;
  const task: Task = tasks.find(task => task.id === taskId)!;
  const editBtn = parentNode.querySelector('.task__button') as HTMLAnchorElement;
  
  task.done = !task.done;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  parentNode.classList.toggle('task-list__item--done-task');
  editBtn.classList.toggle('task__button--disabled');

  if (uncompletedBtnText.textContent === 'All') {
    checkEmptyList();
  }
}

taskList.addEventListener('click', doneTask);

function sortTasks(): void {
  const taskListItems: NodeListOf<HTMLLIElement> = document.querySelectorAll('.task-list__item');

  if (taskListItems.length > 1) {
    const sortDropdownValue = sortDropdown.value;

    let item1: Item;
    let item2: Item;

    const sortedItems = [...taskListItems].sort((a, b) => {
      if (sortDropdownValue === SORT_DROPDOWN_TEXT.title) {
        const titleNodeA = a.children[0].children[0].children[0] as HTMLHeadingElement;
        const titleNodeB = b.children[0].children[0].children[0] as HTMLHeadingElement;
        
        item1 = titleNodeA.textContent?.toLowerCase()!;
        item2 = titleNodeB.textContent?.toLowerCase()!;

        if (item1 && item2 && (item1 > item2)) return 1;
      } else if (sortDropdownValue === SORT_DROPDOWN_TEXT.deadline) {
        const deadlineNodeA = a.children[0].children[0].children[2].children[0] as HTMLParagraphElement;
        const deadlineNodeB = b.children[0].children[0].children[2].children[0] as HTMLParagraphElement;

        item1 = Number(deadlineNodeA.textContent?.slice(10).split('.').reverse().join(''));
        item2 = Number(deadlineNodeB.textContent?.slice(10).split('.').reverse().join(''));
        
        if (isNaN(item1) && !isNaN(item2) || isNaN(item1) || item1 > item2) return 1;
      } else if (sortDropdownValue === SORT_DROPDOWN_TEXT.priority) {
        const priorityNodeA = a.children[0].children[0].children[2].children[1];
        const priorityNodeB = b.children[0].children[0].children[2].children[1];

        item1 = priorityNodeA.textContent!;
        item2 = priorityNodeB.textContent!;

        if (PRIORITY_ARR.indexOf(item1) > PRIORITY_ARR.indexOf(item2)) return 1;
      } else {
        item1 = +a.id;
        item2 = +b.id;

        if (item1 < item2) return 1;
      }

      return -1;
    });

    taskList.innerHTML = '';

    sortedItems.forEach(elem => taskList.appendChild(elem));
  }
}

sortDropdown.addEventListener('change', sortTasks);

function hideCompletedTasks(): void {
  taskList.classList.toggle('task-list--hidden-completed');
  if (uncompletedBtnText.textContent === 'Uncompleted') {
    uncompletedBtnText.textContent = 'All';
  } else {
    uncompletedBtnText.textContent = 'Uncompleted';
  }
  checkEmptyList();
}

uncompletedBtn.addEventListener('click', hideCompletedTasks);
