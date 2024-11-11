(function () {
    $.catch = function (a, f) { $(function () { var t, i = 0; function s() { i++; if (i > 120) return; t = setTimeout(function () { if (!$(a).length) { s(); return }; f() }, 100); } s(); }); }
    function appendTopicS() {
        if (window.innerWidth < 540) {
            $('.category .tcl h3,#f-subforums .tcl h3').each(function () {
                var L = $(this).parents('tr:first');
                var str = '<br><div class="Add"><div class="themes" title="тем"><span class="left"><i class="fa-regular fa-file-lines"></i></span><span class="right">' + L.find('td.tc2').text() + '</span></div>\
        <div class="messages" title="сообщений"><span class="left"><i class="fa-regular fa-comments"></i></span><span class="right">'+ L.find('td.tc3').text() + '</span></div>\
        </div>'; $(str).appendTo(this);
            });
        }
        else {
            $('.category td.tcr,#f-subforums td.tcr').each(function () {
                var L = $(this).parents('tr:first');
                var str = '<br><div class="Add"><div class="themes" title="тем"><span class="left"><i class="fa-regular fa-file-lines"></i></span><span class="right">' + L.find('td.tc2').text() + '</span></div>\
        <div class="messages" title="сообщений"><span class="left"><i class="fa-regular fa-comments"></i></span><span class="right">'+ L.find('td.tc3').text() + '</span></div>\
        </div>'; $(str).appendTo(this);
            });
        }
    }
    if ($('#pun-index').length) { appendTopicS(); }
    if ($('#pun-viewforum').length) {
        var summ = $('.main table[summary]').attr('summary').split(': ')[1].substr(0, 1);
        if (summ == '#' || summ == String.fromCharCode(173)) $.catch('#f-subforums', function () { appendTopicS() });
    }
}());