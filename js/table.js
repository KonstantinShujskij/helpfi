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

function init_start() {
    let balls = $(".table__stars");
    for(let j = 0; j < balls.length; j++) {
        let ball = $(balls[j]).attr("ball");
        ball = parseFloat(ball);

        for(let i = 0; i < parseInt(ball); i++) {
            $(balls[j]).append('<span class="icon"><img src="images/star-all.svg" class="img-svg" alt="icon"></span>');
        }

        let part = ball - parseInt(ball);

        let index = '0';
        
        if(part >= 0.9) {
            index = 'all';
        }
        else if(part >= 0.7) {       
            index = '5';
        }
        else if(part >= 0.4) {
            index = '3';
        }
        else if(part >= 0.2){
            index = '1';
        }

        if(ball < 5.0) {
            $(balls[j]).append('<span class="icon"><img src="images/star-' + index + '.svg" class="img-svg" alt="icon"></span>');
        }

        for(let i = 0; i < 5 - 1 - parseInt(ball); i++) {
            $(balls[j]).append('<span class="icon"><img src="images/star-0.svg" class="img-svg" alt="icon"></span>');
        }
    }
}

(function () {
    let nice = $(".table__body").niceScroll();
    
    init_start();

    $('select').styler({
        selectSmartPositioning: true
    });

    $('.select-wrap').click(function(e) {
        e.stopPropagation();
    });

    $('.delete-btn').click(function(e) {
        e.stopPropagation();
        // Запрос к серверу на удаление выбраного пользователя
    });

    $('.add-btn').click(function(e) {
        e.stopPropagation();
        // Запрос к серверу на добавление пользователя к выбраным

        $('.add-popup').addClass('popup_open');
    });

    $('.popup__close').click(function(e) {
        $(this).closest(".popup").removeClass('popup_open');
    });

    $(document).click( function(e){
        if ( $(e.target).closest('.popup__content').length ) {
            return;
        }

        $(e.target).closest(".popup").removeClass('popup_open');
    });

}());