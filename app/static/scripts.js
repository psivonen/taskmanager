document.addEventListener("DOMContentLoaded", function () {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("showSidebar");
        // change icon
        toggle.classList.toggle("bx-x");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");
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
});
