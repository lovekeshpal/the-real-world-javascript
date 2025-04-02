document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const prioritySelect = document.getElementById('prioritySelect');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');
  const filterButtons = document.querySelectorAll('.task-filters button');
  
  // Task array to store all tasks
  let tasks = [];
  let currentFilter = 'all';
  
  // Add task event
  taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    if (taskText) {
      addTask(taskText, priority);
      taskInput.value = '';
      taskInput.focus();
    }
  });
  
  // Add task function
  function addTask(text, priority) {
    const task = {
      id: Date.now(),
      text: text,
      priority: priority,
      completed: false,
      createdAt: new Date()
    };
    
    tasks.push(task);
    renderTasks();
  }
  
  // Toggle task completion
  function toggleTask(id) {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    
    renderTasks();
  }
  
  // Delete task
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }
  
  // Filter tasks
  function filterTasks(filter) {
    currentFilter = filter;
    
    filterButtons.forEach(button => {
      if (button.getAttribute('data-filter') === filter) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    renderTasks();
  }
  
  // Render tasks to DOM
  function renderTasks() {
    let filteredTasks = [];
    
    switch(currentFilter) {
      case 'active':
        filteredTasks = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filteredTasks = tasks.filter(task => task.completed);
        break;
      default:
        filteredTasks = [...tasks];
    }
    
    // Sort tasks by priority (high to low)
    filteredTasks.sort((a, b) => {
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Clear task list
    taskList.innerHTML = '';
    
    // Add tasks to DOM
    filteredTasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = `list-group-item d-flex justify-content-between align-items-center task-item priority-${task.priority}`;
      if (task.completed) {
        taskItem.classList.add('completed');
      }
      
      // Create priority badge
      const priorityBadge = document.createElement('span');
      priorityBadge.className = `priority-badge ${task.priority}`;
      priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
      
      // Create task content
      const taskContent = document.createElement('div');
      taskContent.className = 'd-flex align-items-center';
      
      // Create checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'mr-3';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTask(task.id));
      
      // Create task text
      const taskText = document.createElement('span');
      taskText.textContent = task.text;
      if (task.completed) {
        taskText.style.textDecoration = 'line-through';
        taskText.style.color = '#6c757d';
      }
      
      taskContent.appendChild(checkbox);
      taskContent.appendChild(taskText);
      
      // Create delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));
      
      // Assemble task item
      taskItem.appendChild(taskContent);
      taskItem.appendChild(priorityBadge);
      taskItem.appendChild(deleteBtn);
      
      taskList.appendChild(taskItem);
    });
    
    // Update task count
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
  }
  
  // Set up filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      filterTasks(filter);
    });
  });
  
  // Initialize app
  renderTasks();
});