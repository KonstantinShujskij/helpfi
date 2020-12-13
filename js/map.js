jQuery(document).ready(function ($) {
    $(".switcher .switch input").on("change", function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        if (!$(this).prop("checked")) {
            location.href = "taxi.php";
        } else {
            location.href = "service.php";
        }
    });

    var markers = [];

    $(".back-btn").on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if ($(this).hasClass('step1')) {

        } else if ($(this).hasClass('step2')) {

            $(".addService").remove();

            for (i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            $(this).parent().removeClass('active');
            $(".category-wrapper").hide();
            $(".services-droplist > a").show();
            $(".switcher").show();
            if($('.m_btn_back:visible').height() < 1) {
                $('.search-from').show();
            }
            $(this).removeClass('step2').addClass('step1');
            $('.services-droplist').removeClass('active');

            $(".-floating-label").text('Категории');
            $("#out-info").text("");
        } else if ($(this).hasClass('step3')) {
            $("#out-info").parent().after("<a class='addService' href='https://helpfi.me/index.php?act=clntreg&ref=11111'>Регистрация</a>");

            for (i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            $(this).removeClass('step3').addClass('step2');

            $(".category-wrapper[var='" + $(this).attr('var') + "']").show();
            var s = $(".services-droplist > .service-list__item[var='" + $(this).attr('var') + "'] .service-list__label").text();
            $('.-floating-label').text(s);
            $("#out-info").text("");
        }
    });

    $(".services-droplist .service-list__item[var]").on("click", function () {
        var noDisplay = false;
        $("#out-info").text("");
        if ($(this).hasClass('service-list__child')) {
            $('.category-wrapper').hide();
            noDisplay = true;
            $(".back-btn").removeClass('step2').addClass('step3');
        }
        $.post("/send.php", {
                'secret': $(this).attr("var"),
                'cat': $(this).attr('var'),
                'ya': {lat: _originMarker.getPosition().lat(), lng: _originMarker.getPosition().lng()},
                main: $('.back-btn').attr("var")
            },
            function (data) {
                d = $.parseJSON(data);
                for (i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
                //console.log( d.data.performers );
                if (d.ok && d.data && d.data.responseCode == 0) {
                    var infowindow = new google.maps.InfoWindow();
                    var marker;
                    if (d.data.performers.length) {


                        for (k in d.data.performers) {
                            v = d.data.performers[k];
                            $('.user-contacts').hide();

                            //console.log( "portfolioImages: ",v.portfolioImages );
                            data = "<div class='mini-info'><div class='item-user-flex' id='_i_" + k + "_i_'><div class='user-photo'></div><div class='user-info'><div class='name'>" + v.name + "</div>";
                            data += (v.rating = "<div class='rating-all'><div class='user-rating start '></div><div class='user-rating' style='width:" + (v.ratingValue / 5 * 60) + "px'></div></div>");
                            // data += "<div class='personal-id'>id</div>";
                            phone = "";
                            phone_det = "";
                            for (t in v.phones) {
                                ph = v.phones[t];
                                data += "<div class='phone'>+" + ph.num + "</div>";
                                if (phone) phone += ", ";
                                phone += ph.num;
                                phone_det = "<a href='tel:" + ph.num + "' class='contact-phone contact-phone--btn'>" + ph.num + "</a>";
                            }

                            if( _originMarker.getPosition().lat() && _originMarker.getPosition().lng() )
                                data += "<div class='user-distance'>" + calcDistance( new google.maps.LatLng(v.latitude,v.longitude), new google.maps.LatLng( _originMarker.getPosition().lat(), _originMarker.getPosition().lng() ) ) + " <span>км</span> </div>";


                            data += "</div>";

                            data += "<div class='user-additional-info'> ";

                            data += "<div class='user-status'>  </div>";

                            var dist = "";
                            if (_originMarker.getPosition().lat() && _originMarker.getPosition().lng())
                                dist = "<div class='user-distance'> " + calcDistance(new google.maps.LatLng(v.latitude, v.longitude), new google.maps.LatLng(_originMarker.getPosition().lat(), _originMarker.getPosition().lng())) + " <span>км</span> </div>";

                            // data += dist + "<div class='address'>" + v.address + "</div>";
                            data += "</div>";

                            data += "</div></div><div class='full-info'>";
                            data += "<div class='user-info'>" + v.message + "</div>"; // full info

                            // data += "<div class='other-services'> <div class='service-list__item'> <div class='service-list__label'>Другая услуга</div> <div class='service-list__price'>1200₴</div> </div></div>"; // Other Servcies

                            data += "<div class='photo-wrapper'>"; // Photo
                            if (v.portfolioImages.length > 0) {
                                $.each(v.portfolioImages, function (i, item) {
                                    var url = 'http://vtaxi.info:8084/neos/image?id=' + item.id;
                                    data += "<div class='photo-item swiper-slide'><i class='material-icons'></i><img src='" + url + "'></div>";
                                })
                            }else{
                                data += "<div class='photo-item no-img'><i class='material-icons'></i><img src='https://helpfi.me/img/photo_2020-01-18_09-36-57.jpg'></div>";
                            }
                            data += "</div>";
                            data += "<div class='user-control'> <div class='text-user btn--message' id='contacts-message'>Написать</div> <div class='call-user btn--call'>Позвонить</div></div> "; // Message.Call

                            data += "<div class='user-contacts'> " + phone_det + " <!--<div class='call-cancel call-cansel--btn '>Отмена--></a><!--</div>-->";
                            data += "<div class='user-contacts-message'> " + phone_det + " <!--<div class='call-cancel call-cansel--btn '>Отмена--></a><!--</div>-->";

                            data += "</div>";


                            $("#out-info").append(data);


                            v.dist = dist;

                            image = '/i/marker/marker-' + (v.cat_main = d.main) + '.png',
                                marker = new google.maps.Marker({
                                    position: {lat: v.latitude, lng: v.longitude},
                                    map: _map,
                                    title: v.name + " " + phone,
                                    icon: image
                                });

                            markers.push(marker);

                            google.maps.event.addListener(marker, 'click', (function (marker, v, p, k) {
                                return function () {
                                    for (var j = 0; j < markers.length; j++) {
                                        image = '/i/marker/marker-' + v.cat_main + '.png',
                                            markers[j].setIcon(image);
                                        markers[j].setZIndex(1);
                                    }
                                    infowindow.setContent('<div class="item-user-flex" rel="_i_' + k + '_i_"><div class="user-photo"></div><div class="user-info"><div class="name">' + v.name + '</div>' + v.rating + '<div class="phone">' + p + '</div><<div class="address">' + v.address + '</div></div>' + v.dist + '</div>');
                                    image = '/i/marker/active/marker-' + v.cat_main + '.png',
                                        this.setIcon(image);
                                    this.setZIndex(2);
                                    infowindow.open(_map, marker);

                                    $("#_i_" + k + "_i_").trigger("click");

                                    google.maps.event.addListener(infowindow, "closeclick", (function (marker, v) {
                                        return function () {
                                            for (var j = 0; j < markers.length; j++) {
                                                image = '/i/marker/marker-' + v.cat_main + '.png',
                                                    markers[j].setIcon(image);
                                                markers[j].setZIndex(1);
                                            }
                                        }
                                    })(marker, v));
                                }
                            })(marker, v, phone, k));

                            $("#_i_" + k + "_i_").on("click", (function (marker, v, p) {
                                //console.log( v );
                                return function () {
                                    for (var j = 0; j < markers.length; j++) {
                                        image = '/i/marker/marker-' + v.cat_main + '.png',
                                            markers[j].setIcon(image);
                                        markers[j].setZIndex(1);
                                    }
                                    infowindow.setContent('<div class="item-user-flex" id="_i_0_i_"><div class="user-photo"></div><div class="user-info"><div class="name">' + v.name + '</div>' + v.rating + '<div class="phone">' + p +
                                        '</div><!--<div class="address"> -->' +/* v.address + */ '<!--</div> --> </div>' + v.dist + '</div>');
                                    image = '/i/marker/active/marker-' + v.cat_main + '.png',
                                        marker.setIcon(image);
                                    marker.setZIndex(2);
                                    infowindow.open(_map, marker);

                                    /*google.maps.event.addListener(infowindow, "closeclick", (function(marker, v){
                                      return function() {
                                        for (var j = 0; j < markers.length; j++) {
                                          image = '/i/marker/marker-'+v.cat_main+'.png',
                                          markers[j].setIcon(image);
                                          markers[j].setZIndex(1);
                                        }
                                      }
                                    })(marker, v));*/
                                }
                            })(marker, v, phone));
                        }
                        $('.services-droplist').addClass('active');
                        $("#out-info").parent().find(".category-wrapper").hide();
                        $("#out-info").parent().find(".subcategory-wrapper").hide();
                        $(".back-btn.step2").removeClass("step2").addClass("step3");//.attr("var",d.main);
                        $(".service-list__item.has-subcategory").removeClass('selected');
                    } else {
                        if (noDisplay)
                            $("#out-info").html("<div class='item-user-flex'>Ничего не найдено.</div>");
                    }
                    function ifRegidtration() {
                        if ($("div.back-btn").hasClass("step2")) {
                            // alert();
                            $("#out-info").parent().after("<a class='addService' href='https://helpfi.me/index.php?act=clntreg&ref=11111'>Регистрация</a>");
                        } else if ($("div.back-btn").hasClass("step3")){
                            $('.addService').hide();
                        }
                    }
                    ifRegidtration();

                }
                //console.log( d );
            });

    });

    $(".services-droplist > .service-list__item[var]").on("click", function () {
        $(".select-area").addClass("active");
        $(".-floating-label").text($(this).find(".service-list__label").text());
        $(".services-droplist > a").hide();
        $(".category-wrapper[var='" + $(this).attr('var') + "']").show();
        // $(".switcher").hide();
        $('.search-from').hide();
        $(".back-btn").removeClass('step1').addClass('step2').attr('var', $(this).attr('var'));
        $('.services-droplist').addClass('active');

    });

    $(".service-list__item.has-subcategory").on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if ($(this).hasClass('selected'))
            $(".service-list__item.has-subcategory").removeClass('selected');
        else {
            $(".service-list__item.has-subcategory").removeClass('selected');
            $(this).addClass('selected').next().slideDown();
        }

        $(".service-list__item.has-subcategory").each(function () {
            if (!$(this).hasClass('selected')) $(this).next().slideUp();
        });

        $('.-floating-label').text($(this).find('.service-list__label').text());
    });

    $(".service-list__child").on('click', function () {
        $(".back-btn").removeClass('step2').addClass('step3');
        $(".-floating-label").text($(this).find(".service-list__label").text());
        return false;
    });

    $("#out-info").on("click", ".mini-info", function () {
        $(this).siblings().hide();
        $(this).next().show();

        // $('.-floating-label').text($(this).find('.name').text());
    });

    $("#out-info").on('click', '.call-user', function () {
        $('.user-control').hide();
        $('.user-contacts').show();
    });

    $("#out-info").on('click', '.call-cancel', function () {
        $('.user-control').show();
        $('.user-contacts').hide();
    });

    $("#out-info").on('click', '#contacts-message', function () {
        alert('Данная функция находится в разработке. Приносим свои извинения за неудобство.');
    });

    $(window).resize(function () {
        // var a=$(window).height(),b=220;700>a&&(a=480,b=0);
        // $("#googlemap.gmap").height( a+200 );
        // console.log( a );
    });


    /*var marker = new google.maps.Marker({
      position: {lat:50.450418, lng:30.523541},
      map: _map,
      title: 'Hello World!'
    });*/

    // $(".select-area").on('click', function() {
    // $(".switcher").hide();
    // $('aside.control-panel').css('border-top', 'none');
    // $(".search-to").hide();
    // $(".select-area").addClass("active");
    // $(".-floating-label").text('Категории').css({'font-size': '16px', 'left': '65px'});
    // $(".services-droplist").slideDown();
    // $(".back-btn").addClass('step1');
    // });

    // $(".-floating-label").on("click", function() {
    // $(".category-wrapper").hide();
    // $(".services-droplist > a").show();
    // });

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

    $('.tea').on( "input", function(e){         
        let phone = $(this).val();
        for(let i = 0; i < phone.length; i++) {
            if(isNaN(phone[i])) {
                phone = phone.replaceAt(i, ' ')
            }
        }
        phone = phone.replace(/\s+/g, '').trim();

        phone_int = parseInt(phone);
        if(phone_int >= 1000000) { console.log("GGG"); phone_int = 1000000; }

        phone = "" + phone_int;
        let phone_format = "";

        if(phone_int >= 1000000) { phone_format = "1 000 000"; }
        else if(phone >= 100000) { phone_format += phone.substr(0, 3) + " " + phone.substr(3); }
        else if(phone >= 10000) { phone_format += phone.substr(0, 2) + " " + phone.substr(2); }
        else if(phone >= 1000) { phone_format += phone.substr(0, 1) + " " + phone.substr(1); }
        else { phone_format += phone; }      

        $(this).val(phone_format);
    });

    $('.input-wrap').children('.input').on( "input", function(e){
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
        $(this).siblings('textarea').val('');
        $(this).parent('.input-wrap').removeClass('input-wrap_error');
    });

    $('button.map-footer__right-btn').on( "click", function(){
        $('.taxi-order').removeClass('open');
        $('.answer-order').removeClass('open');
        $('.info-order').removeClass('open');
        $('.time-order').toggleClass('open');
    });

    $('button.map-footer__left-btn').on( "click", function(){
        $('.time-order').removeClass('open');
        $('.answer-order').removeClass('open');
        $('.info-order').removeClass('open');
        $('.taxi-order').toggleClass('open');
    });

    $('label.map-footer__right-btn').on( "click", function(){
        let src = $(this).attr('src_img');
        $('button.map-footer__right-btn').children('span').children('img').attr('src', src);
        $('.time-order').removeClass('open');
    });

    $('label.map-footer__left-btn').on( "click", function(){
        let src = $(this).attr('src_img');
        $('button.map-footer__left-btn').children('span').children('img').attr('src', src);
        $('.taxi-order').removeClass('open');
    });

    $('.map-aside__switch-btn').click(function() {
        $('.map-aside__switch-btn').toggleClass('map-aside__switch-btn_service');
        $('.map-aside__taxi').toggleClass('map-aside__open');
    });

    $('.list-btn').click(function() {
        $('.map-aside__list').toggleClass('map-aside__list_hidden');
    });
});

function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}
