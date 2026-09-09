/* =========================================
   TO-DO LIST APPLICATION
========================================= */


/* =========================================
   VARIABLES
========================================= */

let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];

let currentFilter = "all";

let editingTaskId = null;


/* =========================================
   ELEMENTS
========================================= */

const taskForm =
    document.getElementById("taskForm");

const taskTitle =
    document.getElementById("taskTitle");

const category =
    document.getElementById("category");

const priority =
    document.getElementById("priority");

const dueDate =
    document.getElementById("dueDate");

const taskList =
    document.getElementById("taskList");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const taskCount =
    document.getElementById("taskCount");

const titleError =
    document.getElementById("titleError");

const themeBtn =
    document.getElementById("themeBtn");

const editModal =
    document.getElementById("editModal");

const closeModal =
    document.getElementById("closeModal");

const saveEdit =
    document.getElementById("saveEdit");


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   ADD TASK
========================================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const title =
            taskTitle.value.trim();

        /* VALIDATION */

        if (title === "") {

            titleError.textContent =
                "Please enter a task.";

            taskTitle.focus();

            return;

        }

        if (title.length < 3) {

            titleError.textContent =
                "Task must contain at least 3 characters.";

            taskTitle.focus();

            return;

        }

        titleError.textContent = "";


        /* CREATE TASK */

        const newTask = {

            id: Date.now(),

            title: title,

            category: category.value,

            priority: priority.value,

            dueDate: dueDate.value,

            completed: false,

            createdAt: new Date().toISOString()

        };


        tasks.unshift(newTask);

        saveTasks();

        taskForm.reset();

        priority.value = "Medium";

        renderTasks();

    }
);


/* =========================================
   DISPLAY TASKS
========================================= */

function renderTasks() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    let filteredTasks =
        tasks.filter(function (task) {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);

            const matchesFilter =
                currentFilter === "all"
                    ? true
                    : currentFilter === "completed"
                        ? task.completed
                        : !task.completed;

            return matchesSearch && matchesFilter;

        });


    taskList.innerHTML = "";


    /* EMPTY STATE */

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    /* CREATE TASK ELEMENTS */

    filteredTasks.forEach(function (task) {

        const taskElement =
            document.createElement("div");

        taskElement.className =
            "task" +
            (task.completed
                ? " completed"
                : "");


        const dueText =
            task.dueDate
                ? formatDate(task.dueDate)
                : "No due date";


        taskElement.innerHTML = `

            <button
                class="check-btn"
                onclick="toggleTask(${task.id})"
                aria-label="Complete task">
            </button>


            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-info">

                    <span class="badge category">
                        ${escapeHTML(task.category)}
                    </span>

                    <span class="badge priority-${task.priority.toLowerCase()}">
                        ${escapeHTML(task.priority)}
                    </span>

                    <span class="due-date">
                        Due: ${dueText}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="action-btn"
                    onclick="editTask(${task.id})"
                    title="Edit task">
                    ✎
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete task">
                    ×
                </button>

            </div>

        `;


        taskList.appendChild(taskElement);

    });


    updateStatistics();

}


/* =========================================
   TOGGLE TASK
========================================= */

function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {
        return;
    }


    tasks =
        tasks.filter(function (task) {

            return task.id !== id;

        });


    saveTasks();

    renderTasks();

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(id) {

    const task =
        tasks.find(function (item) {

            return item.id === id;

        });


    if (!task) {
        return;
    }


    editingTaskId = id;


    document.getElementById(
        "editTitle"
    ).value = task.title;


    document.getElementById(
        "editCategory"
    ).value = task.category;


    document.getElementById(
        "editPriority"
    ).value = task.priority;


    document.getElementById(
        "editDate"
    ).value = task.dueDate;


    editModal.classList.add("show");

}


/* =========================================
   SAVE EDIT
========================================= */

saveEdit.addEventListener(
    "click",
    function () {

        const newTitle =
            document.getElementById(
                "editTitle"
            ).value.trim();


        if (newTitle === "") {

            alert(
                "Task title cannot be empty."
            );

            return;

        }


        if (newTitle.length < 3) {

            alert(
                "Task must contain at least 3 characters."
            );

            return;

        }


        tasks =
            tasks.map(function (task) {

                if (
                    task.id === editingTaskId
                ) {

                    task.title =
                        newTitle;

                    task.category =
                        document.getElementById(
                            "editCategory"
                        ).value;

                    task.priority =
                        document.getElementById(
                            "editPriority"
                        ).value;

                    task.dueDate =
                        document.getElementById(
                            "editDate"
                        ).value;

                }

                return task;

            });


        saveTasks();

        editModal.classList.remove(
            "show"
        );

        editingTaskId = null;

        renderTasks();

    }
);


/* =========================================
   CLOSE MODAL
========================================= */

closeModal.addEventListener(
    "click",
    function () {

        editModal.classList.remove(
            "show"
        );

    }
);


/* CLOSE WHEN CLICKING OUTSIDE */

editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === editModal
        ) {

            editModal.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    function () {

        renderTasks();

    }
);


/* =========================================
   FILTER
========================================= */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;


    const visibleTasks =
        document.querySelectorAll(
            ".task"
        ).length;


    taskCount.textContent =
        visibleTasks +
        (visibleTasks === 1
            ? " task"
            : " tasks");

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "No due date";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   PREVENT HTML INJECTION
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   DARK MODE
========================================= */

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent = "☀️";

}


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        if (isDark) {

            themeBtn.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeBtn.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


/* =========================================
   CLEAR ERROR WHEN TYPING
========================================= */

taskTitle.addEventListener(
    "input",
    function () {

        titleError.textContent = "";

    }
);


/* =========================================
   INITIAL DISPLAY
========================================= */

renderTasks();