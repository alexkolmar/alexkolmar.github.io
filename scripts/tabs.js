$(document).ready(function () {
    // Клик по лейблу вкладки
    $('.tab-label').on('click', function () {
        var parentContainer = $(this).closest('.tabs-container');
        var nav = $(this).closest('.tabs-nav');
        var content = parentContainer.find('.tabs-content');
        var targetTab = $(this).data('tab');

        // Убираем активный класс у всех лейблов в этом меню
        nav.find('.tab-label').removeClass('active');
        // Добавляем активный класс текущему
        $(this).addClass('active');

        // Скрываем все панели в этом контейнере
        content.find('.tab-pane').removeClass('active');
        // Показываем нужную панель
        content.find('#' + targetTab).addClass('active');
    });
});