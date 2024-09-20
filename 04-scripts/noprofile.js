<!--Скрытие профиля в теме тегом-->
<style type="text/css">.hideprofile .post-author,.hideprofile .pl-email,.hideprofile .pl-website{display:none!important}
.hideprofile .post-body,.hideprofile .post-links,.hideprofile .post-links ul,.post.hideprofile h3>span{margin-left:0!important}</style>
<script>
    FORUM.set('editor.addition.tags.hideprofile',{name:'Скрыть минипрофиль',onclick:function(){insert('[hideprofile]');}});
    $().pun_mainReady(function(){$('.post:contains("[hideprofile]")').addClass('hideprofile').html(function(){return $(this).html().replace(/\[hideprofile\]/gim,'')})});
</script>
<!-- Конец -->