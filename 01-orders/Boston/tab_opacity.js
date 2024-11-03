// Получаем элемент с классом tab_hover
const tabHover = document.getElementsByClassName("tab_hover")[0];

// Получаем кнопку с id toggle_tab
const toggleTab = document.getElementById("toggle_tab");

function saveData() {
 const isActive = toggleTab.classList.contains("active");
 localStorage.setItem("isActive", isActive ? "true" : "false");
 const opacity = Number(tabHover.style.opacity);
 localStorage.setItem("opacity", opacity);
}

function loadData() {
 if (localStorage.getItem("isActive") === "true") {
  toggleTab.classList.add("active");
 } else {
  toggleTab.classList.remove("active");
 }
 if (localStorage.getItem("opacity") !== null) {
  tabHover.style.opacity = localStorage.getItem("opacity");
 }
}

// Добавляем обработчик события нажатия на кнопку
toggleTab.addEventListener("click", function () {
 // Проверяем, активна ли кнопка
 if (toggleTab.classList.contains("active")) {
  // Если кнопка активна, то делаем её неактивной и уменьшаем прозрачность tab_hover до 0
  toggleTab.classList.remove("active");
  tabHover.style.opacity = "0";
 } else {
  // Иначе делаем кнопку активной и увеличиваем прозрачность tab_hover до 1
  toggleTab.classList.add("active");
  tabHover.style.opacity = "1";
 }
 saveData(); // Сохраняем данные после каждого изменения
});

loadData(); // Загружаем данные из localStorage при загрузке страницы