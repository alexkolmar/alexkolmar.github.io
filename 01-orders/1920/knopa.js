/*************************
 mybb.ru, 
 Чтобы не пропадали посты v.3
 19.07.2015; v3.00;
 Author: Deff
*************************/

$(function(){
  (function(a,b,c,d){
     if(a && b.length){
       function getTid(){
         var p1 = $('#pun-messages').length||c.split(/post\.php|fid=/)[2]? 0 : NaN,
         p2 = +c.replace(/.*?\/viewtopic\.php\?id=(\d+).*$/,'$1'),
         p3 = d.length? d.attr('href').split('/viewtopic.php?id=')[1] : NaN;
         return [p1,p2,p3].toString().replace(/.*?(\d+).*/,'$1');
       }
       var tid = getTid(), mem = a.mem, bnd = '==='+'#12'+'==', val_KN2, dat = new Date(), tab = '    ',mes;
       if(mem){
         mem = mem.split(bnd);if(mem[0]==tid){val_KN2=mem[1]; mes = +mem[3]; dat.setTime(+mem[2])};
         if( RequestTime*1000 > (+mem[2] + 2*60*60*1000) ) delete a.mem; /*Два часа хранения последне-запомненного*/
       }

       if(val_KN2){
          $('<span style="position:absolute; right: 0;top: -20px;z-index:200;cursor:pointer"><img id="Knopa2-2" style="width: 16px;" src="//forumstatic.ru/files/0012/0b/b4/14501.svg?v=1" title="'+tab+'Вставка запомненного\n'+tab+'от ' + (dat).toLocaleDateString()+' в '+(dat).toLocaleTimeString() +(mes?'\n    При набивке сообщения':'\nПри последней отправке в теме')+'"/></span>')
          .insertBefore(b)
          .click(function (){b[0].value = b.val()+($.trim(b.val())!=''?'\n':'')+val_KN2;});
       }

       var memYes = 0, timId = 0;
       function save(){if($.trim(b.val())!='') a.mem = tid + bnd + b.val() + bnd + (+new Date()) + bnd + memYes;}
       b.bind('input',function(){if(memYes||b.val().length > 100){clearTimeout(timId);memYes=1; timId=setTimeout(save,200);}});
       b.parents('#post').find('input[type="submit"]').click(function(){memYes = 0;save();});
     }
  }(window.localStorage,$('#main-reply'),document.URL,$('#pun-crumbs1 a[href*="/viewtopic.php?id="]')));
});