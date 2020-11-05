(function () {

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

}());

