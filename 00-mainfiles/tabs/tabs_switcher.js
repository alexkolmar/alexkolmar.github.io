document.addEventListener('DOMContentLoaded', function() {
    const themeLinks = {
        horisontal: 'clean_tabs.css',
        vertical: 'vertical_tabs.css'
    };
    
    const themeStyle = document.getElementById('theme-style');
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Функция для установки темы
    function setTheme(themeName) {
        // Устанавливаем новый файл стилей
        if (themeLinks[themeName]) {
            themeStyle.href = themeLinks[themeName];
            
            // Сохраняем выбор в localStorage
            localStorage.setItem('preferredTheme', themeName);
            
            // Обновляем активную кнопку
            themeButtons.forEach(btn => {
                if (btn.dataset.theme === themeName) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }
    
    // Обработчики для кнопок
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.dataset.theme;
            setTheme(theme);
        });
    });
    
    // Проверяем сохраненную тему при загрузке страницы
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme && themeLinks[savedTheme]) {
        setTheme(savedTheme);
    }
});