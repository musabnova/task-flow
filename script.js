const taskInput = document.getElementById("taskInput");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const addTaskButton = document.getElementById("addTaskButton");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

// One key name for this app's saved tasks.
const STORAGE_KEY = "tasks";

// Each task is an object: { id, text, completed }.
let tasks = [];

// A counter keeps ids unique even if two tasks are created in the same millisecond.
let idCounter = 0;

function createId() {
    idCounter = idCounter + 1;
    return Date.now().toString() + "-" + idCounter;
}

// Old saves were an array of strings. New saves are an array of task objects.
function normalizeTask(item) {
    if (typeof item === "string") {
        return {
            id: createId(),
            text: item,
            completed: false
        };
    }

    if (item !== null && typeof item === "object" && typeof item.text === "string") {
        return {
            id: item.id ? String(item.id) : createId(),
            text: item.text,
            completed: item.completed === true
        };
    }

    return null;
}

function loadTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks === null) {
        tasks = [];
        return;
    }

    let parsed;

    try {
        parsed = JSON.parse(savedTasks);
    } catch (error) {
        tasks = [];
        return;
    }

    if (!Array.isArray(parsed)) {
        tasks = [];
        return;
    }

    const loadedTasks = [];
    let shouldSave = false;

    for (let index = 0; index < parsed.length; index++) {
        const task = normalizeTask(parsed[index]);

        if (task === null) {
            shouldSave = true;
            continue;
        }

        // A plain string, or an object without an id, needs to be saved in the new shape.
        if (typeof parsed[index] === "string" || !parsed[index].id) {
            shouldSave = true;
        }

        loadedTasks.push(task);
    }

    tasks = loadedTasks;

    if (shouldSave) {
        saveTasks();
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function findTaskIndex(id) {
    for (let index = 0; index < tasks.length; index++) {
        if (tasks[index].id === id) {
            return index;
        }
    }

    return -1;
}

function updateCounts() {
    let completed = 0;

    for (let index = 0; index < tasks.length; index++) {
        if (tasks[index].completed) {
            completed = completed + 1;
        }
    }

    const total = tasks.length;
    const pending = total - completed;

    totalCount.textContent = String(total);
    completedCount.textContent = String(completed);
    pendingCount.textContent = String(pending);
}

function displayTasks() {
    taskList.innerHTML = "";
    updateCounts();

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No tasks yet. Add one to get started.";
        taskList.appendChild(emptyMessage);
        return;
    }

    for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];

        const taskItem = document.createElement("div");
        taskItem.className = "task";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", function () {
            setTaskCompleted(task.id, checkbox.checked);
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    }
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: createId(),
        text: taskText,
        completed: false
    });

    saveTasks();
    displayTasks();
    taskInput.value = "";
}

function setTaskCompleted(id, completed) {
    const index = findTaskIndex(id);

    if (index === -1) {
        return;
    }

    tasks[index].completed = completed;
    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    const index = findTaskIndex(id);

    if (index === -1) {
        return;
    }

    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

addTaskButton.addEventListener("click", function () {
    addTask();
});

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
});

loadTasks();
displayTasks();
