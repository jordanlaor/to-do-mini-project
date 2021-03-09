let tasksObject = {
  taskId: 1000,
  tasks: [],
};

function addItem(importance, category, taskName) {
  const task = {
    taskId: tasksObject.taskId++,
    category,
    importance,
    taskName,
    creationDate: Date.now().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
  };
  tasksObject.tasks.push(task);
  addTaskToDOM(task);
  updateLocalStorage();
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
              <div class="task-item__creation">Created on: </div>
            </div>
            <div class="task-item__right">
              <label for="task-item--${task.taskId}" class="task-item__checkbox-wrapper completed">
                <input
                  type="checkbox"
                  name="task-item--${task.taskId}"
                  id="task-item--${task.taskId}"
                  class="task-item__checkbox"
                />
              </label>
            </div>`;
  taskItem.innerHTML = innerHTML;
}

function handleLoad() {
  tasksObject = JSON.parse(localStorage.getItem('tasksObject'));
}

function updateLocalStorage() {
  localStorage.setItem('tasksObject', JSON.stringify(tasksObject));
}

window.addEventListener('load', handleLoad);
