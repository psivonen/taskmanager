// Get all the task list checkboxes
const checkboxes = document.querySelectorAll(".task-checkbox");
checkboxes.forEach((checkbox) => {
  // Change input into checked and update completed column in database
  checkbox.addEventListener("change", () => {
    const taskId = checkbox.getAttribute("data-task-id");
    const isChecked = checkbox.checked;
    fetch(`/tasks/complete/${taskId}`, {
      method: "POST",
      body: JSON.stringify({ completed: isChecked }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        // Update the completed status of the task checkbox
        checkbox.checked = data.task.completed;

        // Update the completed status of the task list
        const taskList = checkbox.closest(".list");
        if (data.todo_list.completed) {
          taskList.classList.add("completed-list");
          document.querySelector("#completed-lists").appendChild(taskList);
        } else {
          taskList.classList.remove("completed-list");
          document.querySelector("#uncompleted-lists").appendChild(taskList);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});


// get reference to delete list button
const deleteListButtons = document.querySelectorAll(".delete-list");

// add event listener to each button
deleteListButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    // get list ID from data attribute
    const listId = button.getAttribute("data-list-id");

    // get reference to confirm delete button
    const confirmDeleteButton = document.querySelector(
      ".confirm-delete-list-button"
    );

    // add event listener to confirm delete button
    confirmDeleteButton.addEventListener("click", () => {
      // send delete request to server using fetch API
      fetch(`/tasks/delete-list/${listId}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            if (data.redirect) {
              location.href = data.redirect;
              $("#confirmDeleteModal").modal("hide");
            }
          });
        } else {
          console.error("Error deleting list");
        }
      });
    });
  });
});

// Sidenav toggle
const toggle = document.querySelector("#header-toggle");
const nav = document.querySelector("#nav-bar");
const bodypd = document.querySelector("#body-pd");
const headerpd = document.querySelector("#header");

toggle.addEventListener("click", () => {
  nav.classList.toggle("showSidebar");
  toggle.classList.toggle("bx-x");
  bodypd.classList.toggle("body-pd");
  headerpd.classList.toggle("body-pd");
});

const remove_is_invalid = (event) => {
  let element = event.target;
  if (element.classList.contains("is-invalid")) {
    element.classList.remove("is-invalid");
    element
      .querySelectorAll(".invalid-feedback")
      .forEach((e) => (e.style.display = "none"));
    element.removeEventListener("input", remove_is_invalid);
  }
};

(() => {
  "use strict";
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  document
    .querySelectorAll(".is-invalid")
    .forEach((element) => element.addEventListener("input", remove_is_invalid));

  const forms = document.querySelectorAll(".needs-validation");
  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Add tasks when creating a new todo list
const addTask = document.querySelector("#addTask");
const taskFields = document.querySelector("#taskFields");

let taskIndex = 1;

addTask.addEventListener("click", () => {
  // Add new div element for the task input and delete button
  const taskRow = document.createElement("div");
  taskRow.setAttribute("id", "taskRow");
  taskRow.classList.add("input-group");
  // Create a new input field
  const newTask = document.createElement("input");
  newTask.setAttribute("type", "text");
  newTask.setAttribute("id", `task${taskIndex}`);
  newTask.setAttribute("name", "tasks");
  newTask.classList.add("form-control");
  // Create a delete button for the input
  const deleteTask = document.createElement("button");
  deleteTask.innerText = "Poista";
  deleteTask.classList.add("btn", "btn-outline-secondary");
  deleteTask.addEventListener("click", () => {
    taskRow.removeChild(newTask);
    taskRow.removeChild(deleteTask);
    taskFields.removeChild(taskRow);
  });

  taskRow.appendChild(newTask);
  taskRow.appendChild(deleteTask);
  taskFields.appendChild(taskRow);

  taskIndex++;
});

// Add delete button next to list tasks and delete from database
const deleteButtons = document.querySelectorAll(".delete-task");
deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const taskId = button.getAttribute("data-task-id");
    const form = document.createElement("form");
    form.method = "post";
    form.action = "/tasks/delete/" + taskId;
    document.body.appendChild(form);
    form.submit();
  });
});

// Add new task to existing todo list
const addTaskList = document.querySelector("#addTaskList");
const addTaskButton = document.querySelector(".add-task");
addTaskButton.addEventListener("click", () => {
  const newTaskItem = document.createElement("div");
  newTaskItem.setAttribute("id", "taskRow");
  newTaskItem.classList.add("input-group");
  const newTaskInput = document.createElement("input");
  newTaskInput.setAttribute("type", "text");
  newTaskInput.setAttribute("name", "tasks[]");
  newTaskInput.classList.add("form-control");
  // Delete created input
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.innerText = "Poista";
  deleteButton.classList.add("btn", "btn-outline-secondary");
  newTaskItem.appendChild(newTaskInput);
  newTaskItem.appendChild(deleteButton);
  addTaskList.appendChild(newTaskItem);
  deleteButton.addEventListener("click", () => {
    addTaskList.removeChild(newTaskItem);
  });
});
