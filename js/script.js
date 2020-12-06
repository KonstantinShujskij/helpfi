
(function () {

    $('.promocode__input').on( "input", function(e){
        if($(this).val() !== '') {
            $(this).parent().addClass('promocode__input-wrap_active');
        }
        else {
            $(this).parent().removeClass('promocode__input-wrap_active');
        }
    });

    $('.packaged').mouseover(function() {
        $('.percentage-place').text($(this).attr('percentage-place'));
        $('.percent-month').text($(this).attr('percent-month'));
        $('.percent-year').text($(this).attr('percent-year'));

        $('.ticket-place').text($(this).attr('ticket-place'));
        $('.ticket-month').text($(this).attr('ticket-month'));
        $('.ticket-year').text($(this).attr('ticket-year'));

        $('.partner-place').text($(this).attr('partner-place'));
        $('.partner-month').text($(this).attr('partner-month'));
        $('.partner-year').text($(this).attr('partner-year'));
        
        $('.income-month').text($(this).attr('income-month'));
        $('.income-year').text($(this).attr('income-year'));


        //$('.packaged').removeClass('packaged_active');
        //$(this).addClass('packaged_active');
    });

    $('.packaged__btn').click(function(e) {
        e.stopPropagation();
        let package_type = $(this).attr('pacekage-type');
        // Запрос к серверу на добавление пользователя к выбраным
    });    

    $('.promocode__input').on( "input", function(e){     
        let value = $(this).val();

        let re = /а|б|в|г|д|е|ё|ж|з|и|ё|к|л|м|н|о|п|р|с|т|у|ф|х|ц|ч|ш|щ|ъ|ы|ь|э|ю|я/gi;
        if (re.test(value)) {
            value = value.replace(re, '');
        }

        $(this).val(value);
    });

    $('.phone').bind('paste', function(e) {
        e.preventDefault();
        let value = (e.originalEvent || e).clipboardData.getData('text/plain');
        
        let re = /а|б|в|г|д|е|ё|ж|з|и|ё|к|л|м|н|о|п|р|с|т|у|ф|х|ц|ч|ш|щ|ъ|ы|ь|э|ю|я/gi;
        if (re.test(value)) {
            value = value.replace(re, '');
        }

        $(this).val(value);
    });

}());
