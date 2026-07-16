// To-Do Planner with localStorage
(function () {
  'use strict';

  // ===== HTML Elements =====
  const form = document.getElementById('planner-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const emptyMessage = document.getElementById('empty-state');
  const taskCounter = document.getElementById('task-count');
  const clearButton = document.getElementById('clear-completed');
  const filterButtons = document.querySelectorAll('.chip[data-filter]');

  // Check if elements exist
  if (!form || !input || !list) return;

  // ===== State =====
  const STORAGE_KEY = 'samuel.planner.tasks.v1';
  let tasks = loadTasks();
  let currentFilter = 'all';

  // ===== Load/Save Functions =====
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ===== Display Function =====
  function render() {
    // Filter tasks based on current filter
    const filtered = tasks.filter((task) => {
      if (currentFilter === 'active') return !task.done;
      if (currentFilter === 'completed') return task.done;
      return true; // Show all
    });

    // Clear list
    list.innerHTML = '';

    // Loop through each task and create HTML
    filtered.forEach((task) => {
      // Create list item
      const listItem = document.createElement('li');
      listItem.className = 'task';
      if (task.done) listItem.className += ' is-done';
      listItem.dataset.id = task.id;

      // Create checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.done ? 'not done' : 'done'}`);
      checkbox.addEventListener('change', () => toggleTask(task.id));

      // Create task text
      const text = document.createElement('span');
      text.className = 'task_text';
      text.textContent = task.text;

      // Create delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'task_del';
      deleteBtn.setAttribute('aria-label', `Delete "${task.text}"`);
      deleteBtn.innerHTML = '<i class="bx bx-trash" aria-hidden="true"></i>';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      // Append all to list item
      listItem.appendChild(checkbox);
      listItem.appendChild(text);
      listItem.appendChild(deleteBtn);

      // Append to list
      list.appendChild(listItem);
    });

    // Update task counter
    const remaining = tasks.filter((t) => !t.done).length;
    const word = remaining === 1 ? 'task' : 'tasks';
    taskCounter.textContent = `${remaining} ${word} left`;

    // Show empty message if no tasks
    if (filtered.length === 0) {
      emptyMessage.hidden = false;
      if (currentFilter === 'completed') {
        emptyMessage.textContent = 'No completed tasks.';
      } else if (currentFilter === 'active') {
        emptyMessage.textContent = "No active tasks."
      } else {
        emptyMessage.textContent = 'No task. add one';
      }
    } else {
      emptyMessage.hidden = true;
    }
  }

  // ===== Task Functions =====
  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return; // Don't add empty tasks

    const newTask = {
      id: generateId(),
      text: trimmed,
      done: false,
      createdAt: Date.now()
    };

    tasks.unshift(newTask); // Add to beginning
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.done = !task.done;
      saveTasks();
      render();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }

  function clearCompletedTasks() {
    tasks = tasks.filter((t) => !t.done);
    saveTasks();
    render();
  }

  // ===== Event Listeners =====
  // Add task when form is submitted
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  // Clear completed tasks
  clearButton.addEventListener('click', clearCompletedTasks);

  // Filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });

      // Add active to clicked button
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');

      // Update filter and render
      currentFilter = button.dataset.filter || 'all';
      render();
    });
  });

  // Initial render
  render();
})();
