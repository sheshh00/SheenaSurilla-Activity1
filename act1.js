document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task');
    const taskInput = document.getElementById('new-task');
    const taskDateInput = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');
    const sortOptions = document.getElementById('sort-options');
    loadTasks();
    // Function to add a task
    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        if (taskText !== "" && taskDate !== "") {
            const li = createTaskElement(taskText, taskDate);
            taskList.appendChild(li);
            saveTasks();
            clearInputs();
        }
    }
    // Function to create a task element
    function createTaskElement(taskText, taskDate) {
        const li = document.createElement('li');
        li.textContent = "".concat(taskText, " (Due: ").concat(taskDate, ")");
        // Check if task is expired
        const currentDate = new Date().toISOString().split('T')[0];
        if (taskDate < currentDate) {
            li.classList.add('expired');
        }
        // Add complete and delete buttons
        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.addEventListener('click', function () {
            li.classList.toggle('completed');
            saveTasks();
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
            li.remove();
            saveTasks();
        });
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        return li;
    }
    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(function (li) {
            const taskText = li.textContent.split(' (Due: ')[0];
            const taskDate = li.textContent.split(' (Due: ')[1].split(')')[0];
            const isCompleted = li.classList.contains('completed');
            const isExpired = li.classList.contains('expired');
            tasks.push({ taskText: taskText, taskDate: taskDate, isCompleted: isCompleted, isExpired: isExpired });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(function (task) {
            const li = createTaskElement(task.taskText, task.taskDate);
            if (task.isCompleted)
                li.classList.add('completed');
            if (task.isExpired)
                li.classList.add('expired');
            taskList.appendChild(li);
        });
    }
    // Clear input fields
    function clearInputs() {
        taskInput.value = '';
        taskDateInput.value = '';
    }
    // Sorting functionality
    sortOptions.addEventListener('change', function () {
        const option = sortOptions.value;
        const tasksArray = Array.from(taskList.children);
        if (option === 'alphabetically') {
            tasksArray.sort(function (a, b) { return a.textContent.localeCompare(b.textContent); });
        }
        else if (option === 'status') {
            tasksArray.sort(function (a, b) { return Number(a.classList.contains('completed')) - Number(b.classList.contains('completed')); });
        }
        taskList.innerHTML = '';
        tasksArray.forEach(function (task) { return taskList.appendChild(task); });
    });
    // Event listener for adding tasks
    addTaskBtn.addEventListener('click', addTask);
    // Allow pressing "Enter" to add task
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});
