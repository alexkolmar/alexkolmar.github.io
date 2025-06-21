// «амена дл€ битых ссылок на картинки
$(document).ready(function () {
    // === ”Ќ»¬≈–—јЋ№Ќџ… «јћ≈Ќ»“≈Ћ№ URL ===
    const OLD_URL = 'https://forumupload.ru/';
    const NEW_URL = 'https://forumstatic.ru/';
    const URL_REGEX = /https:\/\/forumupload\.ru\//g;

    // 1. <img src="...">
    $('img').each(function () {
        let src = $(this).attr('src');
        if (src && src.includes(OLD_URL)) {
            $(this).attr('src', src.replace(URL_REGEX, NEW_URL));
        }
    });

    // 2. <a href="...">
    $('a').each(function () {
        let href = $(this).attr('href');
        if (href && href.includes(OLD_URL)) {
            $(this).attr('href', href.replace(URL_REGEX, NEW_URL));
        }
    });

    // 3. inline style background-image
    $('[style*="forumupload.ru"]').each(function () {
        let style = $(this).attr('style');
        if (style) {
            $(this).attr('style', style.replace(URL_REGEX, NEW_URL));
        }
    });

    // 4. “екстовые узлы (например, если ссылка вставлена просто текстом)
    $('*').contents().filter(function () {
        return this.nodeType === 3 && this.nodeValue.includes(OLD_URL);
    }).each(function () {
        this.nodeValue = this.nodeValue.replace(URL_REGEX, NEW_URL);
    });

    // 5. ¬нутренний HTML (если где-то вставлена ссылка как текст или в custom-блоках)
    $('*').each(function () {
        if (this.children.length === 0 && $(this).html().includes(OLD_URL)) {
            $(this).html($(this).html().replace(URL_REGEX, NEW_URL));
        }
    });
});