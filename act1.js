document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('add-task');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    // Function to add a task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const li = document.createElement('li');
            li.textContent = taskText;

            // Add complete and delete buttons
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Complete';
            completeBtn.addEventListener('click', function() {
                li.classList.toggle('completed');
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                li.remove();
            });

            li.appendChild(completeBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);

            // Clear input field
            taskInput.value = '';
        }
    }

    // Event listener for adding tasks
    addTaskBtn.addEventListener('click', addTask);

    // Optional: allow pressing "Enter" to add task
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});
