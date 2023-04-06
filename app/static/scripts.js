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

document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        // show navbar
        nav.classList.toggle("show");
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
  // Your code to run since DOM is loaded and ready
});
