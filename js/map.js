let markers = [];

jQuery(document).ready(function ($) {

    $(".services-droplist .service-list__item[var]").on("click", function () {
        $.post("https://helpfi.me/send.php", {
                'secret': 1,
                'cat': 1,
                'ya': {lat: _originMarker.getPosition().lat(), lng: _originMarker.getPosition().lng()},
                main: 1
            },
            function (data) {
                alert(data);

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
        $(this).parent('.input-wrap').removeClass('input-wrap_inp');
    });

    $(".geo-btn").click(function () {
        $(this).parent('.input-wrap').addClass('input-wrap_inp');
    });

    $('button.map-footer__right-btn').on( "click", function(){
        $('.map-aside-item.time-order').toggleClass('hidden');
        $('.map-aside-item.taxi-order').addClass('hidden');
        $('.map-aside-item.answer-order').addClass('hidden');
        $('.map-aside-item.info-order').addClass('hidden');
    });

    $('button.map-footer__left-btn').on( "click", function(){
        $('.map-aside-item.taxi-order').toggleClass('hidden');
        $('.map-aside-item.time-order').addClass('hidden');
        $('.map-aside-item.answer-order').addClass('hidden');
        $('.map-aside-item.info-order').addClass('hidden');
    });

    $('label.map-footer__right-btn').on( "click", function(){
        let src = $(this).attr('src_img');
        $('button.map-footer__right-btn').children('span').children('img').attr('src', src);

        $('.map-aside-item.time-order').addClass('hidden');
    });

    $('label.map-footer__left-btn').on( "click", function(){
        let src = $(this).attr('src_img');
        $('button.map-footer__left-btn').children('span').children('img').attr('src', src);

        $('.map-aside-item.taxi-order').addClass('hidden');
    });

    $('.map-aside__switch-btn').click(function() {
        $('.map-aside__switch-btn').toggleClass('map-aside__switch-btn_service');
        
        $('.map-aside-item').addClass('hidden');
        $('.map-aside-item.geo-self').removeClass('hidden');

        if($(this).hasClass('map-aside__switch-btn_service')) {
            $('.map-aside-item.search-servise').removeClass('hidden');
            $('.map-aside-item.servise-list').removeClass('hidden');
        }
        else {
            $('.map-aside-item.finish-point').removeClass('hidden');
            $('.map-aside-item.map-aside__footer').removeClass('hidden');
        }

    
    });

    $('.list-btn').click(function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('.map-aside-footer').toggleClass('hidden');
    });

    ///////// 

    $(".back__btn").on("click", function () {

        $('.map-aside-item').addClass('hidden');
        $('.map-aside-item.geo-self').removeClass('hidden');
        $('.map-aside-item.search-servise').removeClass('hidden');

        let step = $(this).attr('step');

        if(step === 'one') {
            $('#search').val('');
            $('.map-aside-item.search-servise').children('.input-wrap').removeClass('input-wrap_inp');        
            $('.map-aside-item.search-servise').removeClass('search-servise_back');
            $('.map-aside-item.servise-list').removeClass('hidden');
            $('.map-aside__podcat').addClass('hidden');        
            $(".servise-cat .map-aside__item").removeClass("map-aside__item_open");

        }
        else if(step === 'two') {
            $('.input-wrap__cat').attr('value', 'Какую услугу найти?');

            let cat_id = $(this).attr('servise-id');  
            let service = $(this).attr('servise');

            $('#search').val(service);
            $('.map-aside-item[var=' + cat_id + ']').removeClass('hidden');
            $('.map-aside-item.create-servise').addClass('hidden');  
            $('.map-aside-item.search-servise').removeClass('search-servise_users'); 
            $('#search').removeAttr('readonly');

            $('.back__btn').attr('step', 'one');
        }
        else if(step === 'three') {
            $('.input-wrap__cat').attr('value', 'Выбрать исполнителя');

            $('.map-aside-item.user-info').addClass('hidden');  
            $('.map-aside-item.users-list').removeClass('hidden');  
            $('.map-aside-item.create-servise').removeClass('hidden');  
            $('.map-aside-item.search-servise').removeClass('search-servise_user'); 

            $('.back__btn').attr('step', 'two');
        }
       
    });

    $(".user-item").on("click", function () {
        let user_id = $(this).attr("user-id");

        $('.back__btn').attr('step', 'three');
        $('.input-wrap__cat').attr('value', 'Портфолио');

        $('.map-aside-item').addClass('hidden');
        $('.map-aside-item.search-servise').removeClass('hidden');
        $('.map-aside-item.user-info').removeClass('hidden');
        $('.map-aside-item.search-servise').addClass('search-servise_user');
        $('.map-aside-item.search-servise').removeClass('search-servise_users'); 

        $('#search').attr('readonly', 'readonly');

    });   
    
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    init_start();
       
    load_categories(); 

});


function load_categories() {
    fetch('https://helpfi.me/api/categories.php').then((response) => {
        return response.json();
    }).then((data) => {
        let categories = data.categories;

        for (key in categories) {
            $(".servise-list .map-aside__list").append(create_map_aside_item(key, categories[key].name));
        }

        set_map_aside_item_event();

    }).catch(() => {
        let categories = {"1":{"id":1,"name":"IT услуги"},"42":{"id":42,"name":"Автоуслуги"},"79":{"id":79,"name":"Деловые услуги"},"212":{"id":212,"name":"Дом и семья"},"294":{"id":294,"name":"Домашний мастер"},"1699":{"id":1699,"name":"Доставка еды"},"1710":{"id":1710,"name":"Жилье"},"549":{"id":549,"name":"Здоровье"},"752":{"id":752,"name":"Клининговые услуги"},"912":{"id":912,"name":"Красота"},"1036":{"id":1036,"name":"Логистика"},"1069":{"id":1069,"name":"Образование и курсы"},"1173":{"id":1173,"name":"Организация праздников"},"1726":{"id":1726,"name":"Пассажирские перевозки"},"1657":{"id":1657,"name":"Прокат товаров"},"1211":{"id":1211,"name":"Ремонт техники"},"1323":{"id":1323,"name":"Спорт и туризм"},"1393":{"id":1393,"name":"Страхование"},"1397":{"id":1397,"name":"Строительные работы"},"707":{"id":707,"name":"Услуги для житвотных"},"1573":{"id":1573,"name":"Услуги курьеров"},"1677":{"id":1677,"name":"Услуги спецтехники"},"1624":{"id":1624,"name":"Фото, Видео"}};

        for (key in categories) {
            $(".servise-list .map-aside__list").append(create_map_aside_item(key, categories[key].name));
        }

        set_map_aside_item_event();
    });
}

function load_cat(id, fun) {
    fetch('https://helpfi.me/api/categories.php?categoryId=' + id).then((response) => {
        return response.json();
    }).then((data) => {
        let categories = data.categories;

        let cat = $('<div class="map-aside-item servise-cat hidden" var="' + id + '"></div>');

        for (key in categories) {
            cat.append(create_map_aside_item(key, categories[key].name, false));
        }

        $('.map-aside-footer').append(cat);

        set_servise_cat_event();
        fun();

    }).catch(() => {
        let categories = {"2":{"id":2,"name":"Игры"},"1212":{"id":1212,"name":"Компьютерная помощь"},"7":{"id":7,"name":"Компьютерные программы"},"16":{"id":16,"name":"Мобильные приложения"},"23":{"id":23,"name":"Настройка Wi-Fi"},"29":{"id":29,"name":"Разработка сайтов"},"38":{"id":38,"name":"Установка Windows"}};

        let cat = $('<div class="map-aside-item servise-cat hidden" var="' + id + '"></div>');

        for (key in categories) {
            cat.append(create_map_aside_item(key, categories[key].name, false));
        }

        $('.map-aside-footer').append(cat);

        set_servise_cat_event();
        fun();

    });
}

function load_podcat(id, elem, fun) {
    fetch('https://helpfi.me/api/categories.php?subCategoryId=' + id).then((response) => {
        return response.json();
    }).then((data) => {
        let categories = data.categories;

        let podcat = $('<div class="map-aside__podcat hidden"></div>');

        for (key in categories) {
            podcat.append(create_map_aside_item(key, categories[key].name, false, false));
        }

        $(elem).after(podcat);

        set_servise_podcat_event();
        fun(elem);

    }).catch(() => {
        let categories = {"3":{"id":3,"name":"Озвучивание игр"},"4":{"id":4,"name":"Программирование игр"},"5":{"id":5,"name":"Разработка игр"},"6":{"id":6,"name":"Тестирование игр"}};

        let podcat = $('<div class="map-aside__podcat hidden"></div>');

        for (key in categories) {
            podcat.append(create_map_aside_item(key, categories[key].name, false, false));
        }

        $(elem).after(podcat);

        set_servise_podcat_event();
        fun(elem);

    });
}

function create_map_aside_item(id, name, icon=true, arrow=true) {
    let item = '<div class="map-aside__item" var="' + id + '">';

        if(icon) {
            item += '<span class="icon cat-icon">' +
                        '<img src="https://helpfi.me/my_images/icons/service-list__icon.icon-' + id + '.svg" alt="icon">' +
                    '</span>';
        }

            item += '<span class="servise-name">' + name + '</span>';

        if(arrow) {
            item += '<span class="icon arrow-icon">' +
                        '<img src="images/aside-arrow.svg" alt="icon">' +
                    '</span>' +                                
                '</div>';
        }
    return item;
}

function set_map_aside_item_event() {
    $(".servise-list .map-aside__item").on("click", function () {
        let catgory_index = $(this).attr("var");
        let name = $(this).children('.servise-name').text();

        $('.back__btn').attr('step', 'one');
        $('.back__btn').attr('servise', name);
        $('.back__btn').attr('servise-id', catgory_index);

        $('#search').val(name);
        $('.map-aside-item').addClass('hidden');
        $('.map-aside-item.geo-self').removeClass('hidden');
        
        $('.map-aside-item.search-servise').removeClass('hidden');
        $('.map-aside-item.search-servise').addClass('search-servise_back');
        $('.map-aside-item.search-servise').children('.input-wrap').addClass('input-wrap_inp');

        if($('.map-aside-item[var=' + catgory_index + ']').length == 0) {
            load_cat(catgory_index, () => {
                $('.map-aside-item[var=' + catgory_index + ']').removeClass('hidden');
            });
        }
        else {
            $('.map-aside-item[var=' + catgory_index + ']').removeClass('hidden');
        }

    });
}

function set_servise_cat_event() {
    $(".servise-cat .map-aside__item").on("click", function () {
        let elem = $(this).next();
        if(!elem.hasClass('map-aside__podcat')) { 
            let id = $(this).attr('var');

            load_podcat(id, this, (this_elem) => {
                let elem = $(this_elem).next();

                $(".servise-cat .map-aside__item").removeClass("map-aside__item_open");
                $(this_elem).addClass("map-aside__item_open");
                $('.map-aside__podcat').addClass('hidden');
                elem.removeClass('hidden');
            });
            return; 
        }
        else {
            if(elem.hasClass('hidden')){
                $(".servise-cat .map-aside__item").removeClass("map-aside__item_open");
                $(this).addClass("map-aside__item_open");
                $('.map-aside__podcat').addClass('hidden');
                elem.removeClass('hidden');
            }
            else {
                $(this).removeClass("map-aside__item_open");
                elem.addClass('hidden');
            }
        }
    });
}

function set_servise_podcat_event() {
    $(".map-aside__podcat .map-aside__item").on("click", function () {
        let catgory_index = $(this).attr("var");
        let name = $(this).text();
        $('.back__query').text(name);

        $('.back__btn').attr('step', 'two');
        $('.input-wrap__cat').attr('value', 'Выбрать исполнителя');

        $('.map-aside-item').addClass('hidden');
        $('.map-aside-item.geo-self').removeClass('hidden');
        $('.map-aside-item.search-servise').removeClass('hidden');
        $('.map-aside-item.users-list').removeClass('hidden');
        $('.map-aside-item.create-servise').removeClass('hidden');
        $('.map-aside-item.search-servise').addClass('search-servise_users');

        $('#search').attr('readonly', 'readonly');

        load_users(catgory_index);

    });    
}


// Load user

function load_users(id) {
    $.post("https://helpfi.me/send.php", {
        'secret': id,
        'cat': id,
        'ya': {lat: _originMarker.getPosition().lat(), lng: _originMarker.getPosition().lng()},
        'main': ''
    }, function(data) {
        
        data = $.parseJSON(data);

        for (i = 0; i < markers.length; i++) { markers[i].setMap(null); }
        markers = [];

        console.log(data);
    }).catch(() => {
        console.log("FFF");
        data = {};
        data = $.parseJSON(data);

        for (i = 0; i < markers.length; i++) { markers[i].setMap(null); }
        markers = [];

        console.log(data);
    });
}

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

function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}
