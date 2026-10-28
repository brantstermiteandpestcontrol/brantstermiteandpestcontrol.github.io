// Mobile menu, dropdown toggles, and quote-form guard.
(function () {
  var menuBtn = document.querySelector("[data-menu-btn]");
  var nav = document.querySelector("[data-nav]");

  if (menuBtn && nav) {
    nav.id = "nav";
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        menuBtn.click();
        menuBtn.focus();
      }
    });
  }

  document.querySelectorAll(".nav__toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".nav__item--drop");
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Until a Web3Forms key is added in Business Info, don't send the form anywhere — point people to the phone.
  document.querySelectorAll("[data-quote-form][data-unconfigured]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-note]");
      if (note) {
        note.classList.add("is-error");
        note.innerHTML = "Online quotes are almost ready — for now, please call " + note.querySelector("a").outerHTML + ".";
      }
    });
  });
})();
