document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');

  document.getElementById('add-task').addEventListener('click', () => {
    const taskName = document.getElementById('task-name').value;
    const taskPriority = document.getElementById('task-priority').value;

    if (taskName) {
      addTask(taskName, taskPriority);
      document.getElementById('task-name').value = '';
    }
  });

  function addTask(name, priority) {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <div class="task-info">
        <strong>${name}</strong> - <em>${priority} priority</em>
      </div>
      <button onclick="removeTask(this)">Remove</button>
    `;
    taskList.appendChild(taskItem);
  }

  window.removeTask = function(button) {
    const taskItem = button.parentElement;
    taskList.removeChild(taskItem);
  }
});