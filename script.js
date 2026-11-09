const taskInput = document.getElementById("taskInput");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const addTaskButton = document.getElementById("addTaskButton");

// One key name for this app's saved tasks.
const STORAGE_KEY = "tasks";

// Requirement 1: every task lives in this array.
// Each item is the task text, for example ["Buy milk", "Walk the dog"].
let tasks = [];

// Requirement 2: read the saved list when the page opens.
function loadTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    // Nothing saved yet, so start with an empty list.
    if (savedTasks === null) {
        tasks = [];
        return;
    }

    // LocalStorage only stores text, so turn the saved JSON back into an array.
    tasks = JSON.parse(savedTasks);
}

// Write the current array into LocalStorage.
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Requirement 3: draw every task that is currently in the array.
function displayTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No tasks yet. Add one to get started.";
        taskList.appendChild(emptyMessage);
        return;
    }

    for (let index = 0; index < tasks.length; index++) {
        const taskItem = document.createElement("div");
        taskItem.className = "task";
        taskItem.textContent = tasks[index];

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        // Remember which array position this button belongs to.
        deleteButton.addEventListener("click", function () {
            deleteTask(index);
        });

        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    }
}

// Requirement 4: add the typed task, then save the whole array.
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push(taskText);
    saveTasks();
    displayTasks();
    taskInput.value = "";
}

// Requirement 5: remove one task, then save the updated array.
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

addTaskButton.addEventListener("click", function () {
    addTask();
});

// Pressing Enter submits the form. Stop the page from reloading so the task is saved.
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
});

loadTasks();
displayTasks();
