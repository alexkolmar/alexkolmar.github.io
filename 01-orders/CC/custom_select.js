document.addEventListener('DOMContentLoaded', function() {
  // ===== ПЕРВЫЙ СКРИПТ ДЛЯ mod-options =====
  const originalSelect = document.getElementById('mod-options');
  if (originalSelect) {
    // Обёртка
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';

    // Кастомный select (кнопка)
    const customSelect = document.createElement('div');
    customSelect.className = 'custom-select';
    customSelect.innerHTML = `
      <span class="custom-select-value">${originalSelect.options[0].text}</span>
      <span class="custom-select-arrow">
        <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 7.225L3.1375 4.8625L2.5 5.5L5.5 8.5L8.5 5.5L7.8625 4.8625L5.5 7.225Z" fill="#2F2F2F" />
        </svg>
      </span>
    `;

    // Выпадающий список
    const optionsList = document.createElement('div');
    optionsList.className = 'custom-select-options';

    // Копируем опции
    Array.from(originalSelect.options).forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'custom-select-option';
      optionElement.textContent = option.text;
      optionElement.dataset.value = option.value;
      optionElement.dataset.index = index;

      optionElement.addEventListener('click', () => {
        if (option.value) {
          originalSelect.selectedIndex = index;
          window.location.href = option.value;
        }
        customSelect.querySelector('.custom-select-value').textContent = option.text;
        wrapper.classList.remove('open');
      });

      optionsList.appendChild(optionElement);
    });

    // Открытие/закрытие по клику
    customSelect.addEventListener('click', (e) => {
      e.stopPropagation();
      wrapper.classList.toggle('open');
    });

    // Закрытие при клике вне списка
    document.addEventListener('click', () => {
      wrapper.classList.remove('open');
    });

    // Вставляем в DOM
    wrapper.appendChild(customSelect);
    wrapper.appendChild(optionsList);
    originalSelect.parentNode.insertBefore(wrapper, originalSelect);
    originalSelect.style.display = 'none';
  }

  // ===== ВТОРОЙ СКРИПТ ДЛЯ ch_twins =====
  const twinsSelect = document.getElementById('ch_twins');
  if (twinsSelect) {
    // Обёртка
    const twinsWrapper = document.createElement('div');
    twinsWrapper.className = 'custom-twins-wrapper';

    // Кастомный select (кнопка)
    const twinsCustomSelect = document.createElement('div');
    twinsCustomSelect.className = 'custom-twins-select';
    twinsCustomSelect.innerHTML = `
      <span class="custom-twins-value">${twinsSelect.options[0].text}</span>
      <span class="custom-twins-arrow">
        <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 7.225L3.1375 4.8625L2.5 5.5L5.5 8.5L8.5 5.5L7.8625 4.8625L5.5 7.225Z" fill="#2F2F2F" />
        </svg>
      </span>
    `;

    // Выпадающий список
    const twinsOptionsList = document.createElement('div');
    twinsOptionsList.className = 'custom-twins-options';

    // Копируем опции
    Array.from(twinsSelect.options).forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'custom-twins-option';
      optionElement.textContent = option.text;
      optionElement.dataset.value = option.value;
      optionElement.dataset.index = index;

      optionElement.addEventListener('click', () => {
        if (option.value) {
          twinsSelect.selectedIndex = index;
          window.location.href = option.value;
        }
        twinsCustomSelect.querySelector('.custom-twins-value').textContent = option.text;
        twinsWrapper.classList.remove('open');
      });

      twinsOptionsList.appendChild(optionElement);
    });

    // Открытие/закрытие по клику
    twinsCustomSelect.addEventListener('click', (e) => {
      e.stopPropagation();
      twinsWrapper.classList.toggle('open');
    });

    // Закрытие при клике вне списка
    document.addEventListener('click', () => {
      twinsWrapper.classList.remove('open');
    });

    // Вставляем в DOM
    twinsWrapper.appendChild(twinsCustomSelect);
    twinsWrapper.appendChild(twinsOptionsList);
    twinsSelect.parentNode.insertBefore(twinsWrapper, twinsSelect);
    twinsSelect.style.display = 'none';
  }
});