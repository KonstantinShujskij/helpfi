String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

String.prototype.insertAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index);
}

let cods = ['050', '066', '095', '099', '039', '067', '068', '096', '097', '098', '063', '093', '073', '091', '092', '094', '070', '080', '090', '044'];

function validate_phone(phone) {
    for(let i = 0; i < phone.length; i++) {
        if(isNaN(phone[i])) {
            phone = phone.replaceAt(i, ' ')
        }
    }
    phone = phone.replace(/\s+/g, '').trim();

    let format_phone = '';

    if(phone.length >= 1) {
        format_phone += "(";
    }
    if(phone.length >= 3) {
        format_phone += phone.substr(0, 3);
    }
    else {
        format_phone += phone;
    }

    if(phone.length >= 4) {
        format_phone += ") ";
    }
    if(phone.length >= 6) {
        format_phone += phone.substr(3, 3);
    }
    else {
        format_phone += phone.substr(3);
    }

    if(phone.length >= 7) {
        format_phone += "-";
    }
    if(phone.length >= 8) {
        format_phone += phone.substr(6, 2);
    }
    else {
        format_phone += phone.substr(6);
    }

    if(phone.length >= 9) {
        format_phone += "-";
    }
    if(phone.length >= 10) {
        format_phone += phone.substr(8, 2);
    }
    else {
        format_phone += phone.substr(8);
    }

    return format_phone;
}

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

(function () {

    $('.input-wrap').children('input').on( "input", function(e){
        if($(this).val() !== '') {
            $(this).parent().addClass('input-wrap_inp');
        }
        else {
            $(this).parent().removeClass('input-wrap_inp');
        }
    });

    $(document).click( function(e){
        if ( $(e.target).closest('.input-wrap').length ) {
            $('.input-wrap').removeClass('input-wrap_focus');
            $(e.target).closest('.input-wrap').addClass('input-wrap_focus');
            return;
        }

        $('.input-wrap').removeClass('input-wrap_focus');
    });
  
    $('.clear-btn').on( "click", function(){
        $(this).siblings('input').val('');
        $(this).parent('.input-wrap').removeClass('input-wrap_error');
    });

    $('.show-btn').on( "mousedown", function(){
        $(this).siblings('input').attr('type', 'text');
    });

    $(document).on( "mouseup", function(){
        $('.password').attr('type', 'password');
    });

    $('.show-btn').on( "touchstart", function(){
        $(this).siblings('input').attr('type', 'text');
    });

    $(document).on( "touchend", function(){
        $('.password').attr('type', 'password');
    });


    $('.phone__select').styler({
        selectSmartPositioning: false,
        onSelectClosed: function() {
            let select_text = $($($(this[0]).children()[1]).children()[0]).text();
            $('.phone-wrap').children('.flag').attr('country', select_text);
        }
    });

    $('.phone').bind('paste', function(e) {
        e.preventDefault();
        let phone = (e.originalEvent || e).clipboardData.getData('text/plain');

        phone = validate_phone(phone);

        if(phone !== '' && !/^[(]{1}[0-9]{3}[)]{1} [0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/.test(phone) ) {
            $(this).parent('.input-wrap').addClass('input-wrap_error');
        }
        else if (phone.length > 4 && cods.indexOf( phone.substr(1, 3) ) == -1) {
            $(this).parent('.input-wrap').addClass('input-wrap_error');
        }
        else {
            $(this).parent('.input-wrap').removeClass('input-wrap_error');
        }
        if(phone === '') {
            $(this).parent('.input-wrap').removeClass('input-wrap_error');
        } 

        $(this).val(phone);
        $(this).trigger("input");

    });

    $('.phone').on( "input", function(e){     
        let simbol = e.originalEvent.data;
        if(isNaN(simbol) && simbol != undefined){
            phone = phone.substr(0, phone.length - 1);
            $(this).val(phone);
            $(this).parent('.input-wrap').addClass('input-wrap_error');

            if(/^[(]{1}[0-9]{3}[)]{1} [0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/.test(phone) && cods.indexOf( phone.substr(1, 3) ) != -1) {
                $(this).parent('.input-wrap').removeClass('input-wrap_error');
            }

            return;
        }      
        
        let phone = $(this).val();
        phone = validate_phone(phone);

        if(phone !== '' && !/^[(]{1}[0-9]{3}[)]{1} [0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/.test(phone) ) {
            $(this).parent('.input-wrap').addClass('input-wrap_error');
        }
        else if (phone.length > 4 && cods.indexOf( phone.substr(1, 3) ) == -1) {
            $(this).parent('.input-wrap').addClass('input-wrap_error');
        }
        else {
            $(this).parent('.input-wrap').removeClass('input-wrap_error');
        }
        if(phone === '') {
            $(this).parent('.input-wrap').removeClass('input-wrap_error');
        } 

        $(this).val(phone);
    });

    let items = $(".jq-selectbox.phone__select").children(".jq-selectbox__dropdown").children("ul").children("li");
    
    for(let i = 0; i < items.length; i++) {
        let item = $(items[i]);
        let code = item.text();
        item.append('<div class="flag" country="' + code + '"></div>');
    }

}());