document.addEventListener("DOMContentLoaded", function () {

  // Get all the task list checkboxes
  const checkboxes = document.querySelectorAll('.task-checkbox');
  checkboxes.forEach((checkbox) => {
    // Change input into checked and update completed column in database
    checkbox.addEventListener('change', () => {
      const taskId = checkbox.getAttribute('data-task-id');
      const isChecked = checkbox.checked;
      fetch('/tasks/complete/' + taskId, {
        method: 'POST',
        body: JSON.stringify({ completed: isChecked }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  });

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
      .forEach((element) =>
        element.addEventListener("input", remove_is_invalid)
      );

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
    deleteTask.innerText = "x Poista";
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
  
});