(function () {
    let WIDTH = 0;

    function resize() {
        if(window.innerWidth <= 576 && window.innerWidth != WIDTH) {
            WIDTH = window.innerWidth;
            $('.aside').removeClass('aside_moble');
            $('.aside').removeClass('aside_open');
            $('.main-dark').removeClass('open');
            $('.open-btn').removeClass('open-btn_mobale');
        } 
    }
    
    resize();

    $( window ).resize(resize);

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

    function copy_code() {
        let $tmp = $("<textarea>");
        $("body").append($tmp);
        $('.code-wrap').addClass('code-wrap_copied');
      
        $tmp.val($(".user__id").text()).select();
        document.execCommand("copy");
        $tmp.remove();
    }
   
    $('.user__copy').click(function() {
        copy_code();
    });    

    $('.user__id').click(function() {
        copy_code();
    });    

    $('.switch-btn').click(function() {
        $(this).toggleClass('open-btn_mobale');

        if(window.innerWidth > 576) { 
            $('.aside').toggleClass('aside_moble');
            $('.main').toggleClass('main_moble');
        }
    });

    $('.open-btn').click(function(e) {
        if(window.innerWidth <= 576) {
            $('.aside').removeClass('aside_moble');
            $('.aside').toggleClass('aside_open');
            $('.main-dark').toggleClass('open');

            e.stopPropagation();
        }       
    });

    $(document).click( function(e){
        if ( $(e.target).closest('.aside').length || $(e.target).closest('.open-btn').length ) {
            return;
        }

        if(window.innerWidth <= 576) {
            $('.aside').removeClass('aside_open');
            $('.main-dark').removeClass('open');
            $('.switch-btn').removeClass('open-btn_mobale');
        }       
    });

    
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

}());

