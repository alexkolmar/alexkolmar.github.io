$(document).ready(function() {
    const backgrounds = [
        'img/hero.jpg',
        'img/hero2.jpg',
        'img/hero3.jpg',
        'img/hero6.jpg'
    ];
    
    // Случайная картинка
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    const randomBg = backgrounds[randomIndex];
    
    // Вставляем в тег img
    $('#hero-bg').attr('src', randomBg);
    
    // Дальше можно крутить слайдер
    let currentIndex = randomIndex;
    setInterval(function() {
        currentIndex = (currentIndex + 1) % backgrounds.length;
        $('#hero-bg').fadeOut(500, function() {
            $(this).attr('src', backgrounds[currentIndex]);
            $(this).fadeIn(500);
        });
    }, 5000);
});