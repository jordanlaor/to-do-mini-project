let tasksObject = {
  taskId: 1000,
  tasks: [],
};

const functions = {
  newTask() {
    const popup = document.querySelector('.popup');
    popup.classList.remove('none');
    document.querySelector('.btn-add-task').addEventListener('click', addItem);
    document.querySelector('#category').addEventListener('input', updateCategoryImg);
  },
  refresh: sortTasks,
  deleteList() {
    tasksObject.tasks = [];
    tasksObject.taskId = 1000;
    updateLocalStorage();
    document.querySelector('.tasks').innerHTML = '';
  },
};

const importanceRank = { red: 2, orange: 1, green: 0 };
let sortBy;

function addItem(e) {
  const popup = document.querySelector('.popup');
  const category = document.querySelector('#category').value;
  category.value = '';
  const importance = [...document.querySelectorAll('input[name="importance"]')].find((radio) => radio.checked).value;
  const taskName = document.querySelector('#taskName').value;
  taskName.value = '';
  const task = {
    taskId: tasksObject.taskId++,
    category,
    importance,
    taskName,
    creationDate: new Date(Date.now()).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
    isCompleted: false,
  };
  popup.classList.add('none');
  tasksObject.tasks.push(task);
  addTaskToDOM(task);
  updateLocalStorage();
  sortTasks();
}

function addTaskToDOM(task) {
  const taskItem = document.createElement('div');
  taskItem.classList.add('task-item');
  taskItem.dataset.importance = task.importance;
  taskItem.dataset.taskId = task.taskId;
  taskItem.dataset.category = task.category;
  const innerHTML = `
            <div class="task-item__left">
              <img
                src="./images/categoryIcons/category-${task.category}.png"
                alt=""
                class="task-item__categroy-img"
              />
              <div class="task-item__btns">
                <div class="btn btn-save none">Save</div>
                <div class="btn btn-update">Update</div>
                <div class="btn btn-delete">Delete</div>
              </div>
            </div>
            <div class="task-item__center">
              <h2 class="task-item__name">${task.taskName}</h2>
              <div class="task-item__creation">Created on: ${task.creationDate}</div>
            </div>
            <div class="task-item__right">
              <label for="task-item--${task.taskId}" class="task-item__checkbox-wrapper">
                <input
                  type="checkbox"
                  name="task-item--${task.taskId}"
                  id="task-item--${task.taskId}"
                  class="task-item__checkbox"
                />
              </label>
            </div>`;
  taskItem.innerHTML = innerHTML;
  document.querySelector('.tasks').appendChild(taskItem);
  task.HTMLElement = taskItem;
  taskItem.querySelector('.task-item__checkbox-wrapper').addEventListener('change', toggleCompletion);
  taskItem.querySelector('.btn-update').addEventListener('click', updateTask);
  taskItem.querySelector('.btn-delete').addEventListener('click', () => deleteTask(task, taskItem));
  const isCompleted = taskItem.querySelector('[type="checkbox"]');
  if (task.isCompleted) {
    isCompleted.parentElement.classList.add('completed');
    isCompleted.checked = task.isCompleted;
  }
}

function updateTask(e) {}

function deleteTask(task, taskItem) {
  taskItem.remove();
  const index = tasksObject.tasks.findIndex((taskFromList) => taskFromList === task);
  if (index >= 0) {
    tasksObject.tasks.splice(index, 1);
  }
  updateLocalStorage();
}

function getTaskById(id) {
  return tasksObject.tasks.find((task) => task.taskId === id);
}

function toggleCompletion(e) {
  e.target.parentElement.classList.toggle('completed');
  const task = getTaskById(parseInt(e.target.parentElement.parentElement.parentElement.dataset.taskId));
  task.isCompleted = e.target.checked;
  updateLocalStorage();
}

function handleLoad() {
  tasksObject = JSON.parse(localStorage.getItem('tasksObject')) || {
    taskId: 1000,
    tasks: [],
  };
  document.querySelector('.controls__btns-wrapper').addEventListener('click', controlsBtnsClick);
  tasksObject.tasks.forEach((task) => addTaskToDOM(task));
}

function updateLocalStorage() {
  localStorage.setItem('tasksObject', JSON.stringify(tasksObject));
}

function controlsBtnsClick(e) {
  if (e.target.classList.contains('btn')) {
    functions[e.target.dataset.function]();
  }
}

function sortTasks() {
  let sortFunction;
  switch (sortBy) {
    case 'importance--ascending':
      sortFunction = function (taskA, taskB) {
        return importanceRank[taskA.importance] - importanceRank[taskB.importance];
      };
      break;

    case 'created--ascending':
      sortFunction = function (taskA, taskB) {
        return new Date(taskA.creationDate) - new Date(taskB.creationDate);
      };
      break;

    case 'completion--ascending':
      sortFunction = function (taskA, taskB) {
        return taskA.isCompleted - taskB.isCompleted;
      };
      break;

    case 'name--ascending':
      sortFunction = function (taskA, taskB) {
        return taskA.taskName.localeCompare(taskB.taskName);
      };
      break;

    case 'importance--descending':
      sortFunction = function (taskA, taskB) {
        return importanceRank[taskB.importance] - importanceRank[taskA.importance];
      };
      break;

    case 'created--descending':
      sortFunction = function (taskA, taskB) {
        return new Date(taskB.creationDate) - new Date(taskA.creationDate);
      };
      break;

    case 'completion--descending':
      sortFunction = function (taskA, taskB) {
        return taskB.isCompleted - taskA.isCompleted;
      };
      break;

    case 'name--descending':
      sortFunction = function (taskA, taskB) {
        return taskA.taskName.localeCompare(taskB.taskName);
      };
      break;

    default:
      break;
  }
  if (sortFunction && tasksObject.tasks.length) {
    tasksObject.tasks.sort(sortFunction);
  }

  updateHTMLRows();
}

function updateHTMLRows() {
  tasksObject.tasks.forEach((task, index) => {
    task.HTMLElement.style.gridRow = `${index + 1}`;
  });
}

function updateCategoryImg() {
  const categoryNum = document.querySelector('#category');
  if (parseInt(categoryNum.value) > parseInt(categoryNum.max)) {
    categoryNum.value = categoryNum.max;
  }
  if (parseInt(categoryNum.value) < parseInt(categoryNum.min)) {
    categoryNum.value = categoryNum.min;
  }

  document.querySelector('.new-task-img').src = document
    .querySelector('.new-task-img')
    .src.replace(/-\d+.png/, `-${categoryNum.value}.png`);
}

document.querySelector('#sortBy').addEventListener('change', (e) => {
  sortBy = e.target.value;
  sortTasks();
});

document.querySelector('#sortBy').addEventListener('load', (e) => {
  sortBy = e.target.value;
  sortTasks();
});

window.addEventListener('load', handleLoad);
