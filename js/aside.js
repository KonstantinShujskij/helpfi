(function () {
    $('img.img-svg').each(function(){
        let $img = $(this);
        let imgClass = $img.attr('class');
        let imgURL = $img.attr('src');
        $.get(imgURL, function(data) {
          let $svg = $(data).find('svg');
          if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
          }
          $svg = $svg.removeAttr('xmlns:a');
          if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
          }
          $img.replaceWith($svg);
        }, 'xml');
    });
   
    $('.user__copy').click(function() {
        var $tmp = $("<textarea>");
        $("body").append($tmp);
      
        $tmp.val($(this).siblings(".user__id").text()).select();
        document.execCommand("copy");
        $tmp.remove();
    });    

    $('.switch-btn').click(function() {
        $('.aside').toggleClass('aside_moble');
    });

    $('.map-aside__switch-btn').click(function() {
        $(this).toggleClass('map-aside__switch-btn_service');
    });

}());

