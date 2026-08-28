// ============================================
// УНИВЕРСАЛЬНЫЙ СКРИПТ ДЛЯ ЯКОРЕЙ (с отступом)
// ============================================

$(document).ready(function () {

    // Высота фиксированного меню
    var headerHeight = 50; // ← поменяйте на вашу высоту

    // 1️⃣ Плавная прокрутка для ссылок #на_текущей_странице
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - headerHeight
            }, 600);
        }
    });

    // 2️⃣ Если пришли с другой страницы по якорю — плавно скроллим
    if (window.location.hash) {
        var target = window.location.hash;
        setTimeout(function () {
            if ($(target).length) {
                $('html, body').animate({
                    scrollTop: $(target).offset().top - headerHeight
                }, 600);
            }
        }, 300);
    }

});