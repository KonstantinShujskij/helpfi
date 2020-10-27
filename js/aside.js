(function () {

    $('.open-btn').click(function() {
        $(this).addClass('open-btn_click');
        $('.close-btn').removeClass('close-btn_click');
        $('.aside').addClass('aside_open');
        $('.main').addClass('main_close');
    });

    $('.close-btn').click(function() {
      $(this).addClass('close-btn_click');
      $('.open-btn').removeClass('open-btn_click');
      $('.aside').removeClass('aside_open');
      $('.main').removeClass('main_close');
    });

    $('.user__copy').click(function() {
        var $tmp = $("<textarea>");
        $("body").append($tmp);
      
        $tmp.val($(this).siblings(".user__id").text()).select();
        document.execCommand("copy");
        $tmp.remove();
    });    

}());

