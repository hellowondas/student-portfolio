function initApp() {
  /* get the menu & the button */
  const navBar = document.getElementById("prim-nav");
  const navToggle = document.getElementById("nav-toggle");
  
  /* this function adds the class: (opened) to the menu (ul list) & sets button to expand (as true) */
  function openNavBar() {
    navBar.classList.add("opened");
    navToggle.setAttribute("aria-expanded", "true");
  }
  
  /* this function removes the class: (opened) from the menu (ul list) & sets button to contract (as false) */
  function closeNavBar() {
    navBar.classList.remove("opened");
    navToggle.setAttribute("aria-expanded", "false");
  }
  
  /* listens for the click on the button */
  navToggle.addEventListener("click", () => {
    if (navBar.classList.contains("opened")) {
      closeNavBar();
    } else {
      openNavBar();
    }
  });
  
}
