document.addEventListener('DOMContentLoaded', function () {
    var addTaskBtn = document.getElementById('add-task');
    var taskInput = document.getElementById('new-task');
    var taskDateInput = document.getElementById('task-date');
    var taskList = document.getElementById('task-list');
    var sortOptions = document.getElementById('sort-options');
    loadTasks();
    // Function to add a task
    function addTask() {
        var taskText = taskInput.value.trim();
        var taskDate = taskDateInput.value;
        if (taskText !== "" && taskDate !== "") {
            var li = createTaskElement(taskText, taskDate);
            taskList.appendChild(li);
            saveTasks();
            clearInputs();
        }
    }
    // Function to create a task element
    function createTaskElement(taskText, taskDate) {
        var li = document.createElement('li');
        li.textContent = "".concat(taskText, " (Due: ").concat(taskDate, ")");
        // Check if task is expired
        var currentDate = new Date().toISOString().split('T')[0];
        if (taskDate < currentDate) {
            li.classList.add('expired');
        }
        // Add complete and delete buttons
        var completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.addEventListener('click', function () {
            li.classList.toggle('completed');
            saveTasks();
        });
        var deleteBtn = document.createElement('button');
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
        var tasks = [];
        taskList.querySelectorAll('li').forEach(function (li) {
            var taskText = li.textContent.split(' (Due: ')[0];
            var taskDate = li.textContent.split(' (Due: ')[1].split(')')[0];
            var isCompleted = li.classList.contains('completed');
            var isExpired = li.classList.contains('expired');
            tasks.push({ taskText: taskText, taskDate: taskDate, isCompleted: isCompleted, isExpired: isExpired });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // Function to load tasks from localStorage
    function loadTasks() {
        var tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(function (task) {
            var li = createTaskElement(task.taskText, task.taskDate);
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
        var option = sortOptions.value;
        var tasksArray = Array.from(taskList.children);
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
