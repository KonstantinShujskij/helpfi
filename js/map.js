let markers = [];
let select_cat = '';

jQuery(document).ready(function ($) {

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
        if(phone_int >= 1000000) { phone_int = 1000000; }

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
            select_cat = '';
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
    
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    init_star('body');
       
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
        
        init_icon();

        set_map_aside_item_event();

    }).catch(() => {
        let categories = {"1":{"id":1,"name":"IT услуги"},"42":{"id":42,"name":"Автоуслуги"},"79":{"id":79,"name":"Деловые услуги"},"212":{"id":212,"name":"Дом и семья"},"294":{"id":294,"name":"Домашний мастер"},"1699":{"id":1699,"name":"Доставка еды"},"1710":{"id":1710,"name":"Жилье"},"549":{"id":549,"name":"Здоровье"},"752":{"id":752,"name":"Клининговые услуги"},"912":{"id":912,"name":"Красота"},"1036":{"id":1036,"name":"Логистика"},"1069":{"id":1069,"name":"Образование и курсы"},"1173":{"id":1173,"name":"Организация праздников"},"1726":{"id":1726,"name":"Пассажирские перевозки"},"1657":{"id":1657,"name":"Прокат товаров"},"1211":{"id":1211,"name":"Ремонт техники"},"1323":{"id":1323,"name":"Спорт и туризм"},"1393":{"id":1393,"name":"Страхование"},"1397":{"id":1397,"name":"Строительные работы"},"707":{"id":707,"name":"Услуги для житвотных"},"1573":{"id":1573,"name":"Услуги курьеров"},"1677":{"id":1677,"name":"Услуги спецтехники"},"1624":{"id":1624,"name":"Фото, Видео"}};

        for (key in categories) {
            $(".servise-list .map-aside__list").append(create_map_aside_item(key, categories[key].name));
        }
        
        init_icon();

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

        init_icon();
        set_servise_cat_event();
        fun();

    }).catch(() => {
        let categories = {"2":{"id":2,"name":"Игры"},"1212":{"id":1212,"name":"Компьютерная помощь"},"7":{"id":7,"name":"Компьютерные программы"},"16":{"id":16,"name":"Мобильные приложения"},"23":{"id":23,"name":"Настройка Wi-Fi"},"29":{"id":29,"name":"Разработка сайтов"},"38":{"id":38,"name":"Установка Windows"}};

        let cat = $('<div class="map-aside-item servise-cat hidden" var="' + id + '"></div>');

        for (key in categories) {
            cat.append(create_map_aside_item(key, categories[key].name, false));
        }

        $('.map-aside-footer').append(cat);

        init_icon();
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
                        '<img src="images/aside-arrow.svg" class="img-svg" alt="icon">' +
                    '</span>' +                                
                '</div>';
        }
    return item;
}

function set_map_aside_item_event() {
    $(".servise-list .map-aside__item").on("click", function () {
        let catgory_index = $(this).attr("var");
        select_cat = catgory_index;
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

        load_users(catgory_index, _originMarker.getPosition().lat(), _originMarker.getPosition().lng());

    });    
}


// Load user 

function load_users(id, lat, lng, radius = 10.5, limit = 25) {
    fetch('https://helpfi.me/api/perfomers.php?categoryId=' + id + '&latitude=' + lat + '&longitude=' + lng + '&radius=' + radius + '&limit=' + limit).then((response) => {
        return response.json();
    }).then((data) => {
        let perfomers = data.perfomers;

        load_users_handler(perfomers);

    }).catch(() => {
        let perfomers = [{"id":9901,
        "referralId":9244,
        "creator":"site",
        "state":"p",
        "createDate":"20201215102617",
        "distance":0.71080286098858,
        "name":"Андрей",
        "address":"Киев, ул. Чигорина 18",
        "email":"yakandre@gmail.com",
        "message":"Разработка программ",
        "cityId":2,
        "latitude":50.4217,
        "longitude":30.5394,
        "ratingCount":12,
        "ratingValue":4.5,
        "avatar":{"id":1863,"comment":"Аватарка"},
        "portfolioImages":[],
        "phones":[{"num":"380503537319"}],
        "categories":[{"categoryId":7,"info":"Разработка программ"}],
        "workSchedule": {"hours":[{"day":"monday","hours":"8-12,14-18"},
                        {"day":"tuesday","hours":"8-12,14-18"},
                        {"day":"wednesday","hours":"8-12,14-18"},
                        {"day":"thursday","hours":"8-12,14-18"},
                        {"day":"friday","hours":"8-12,14-18"},
                        {"day":"saturday","hours":"8-15"},
                        {"day":"sunday","hours":"8-12"}]}},
        {"id":3023,
        "referralId":0,
        "creator":"",
        "state":"p",
        "distance":1.6832856623002,
        "name":"Александр",
        "address":"Інженерний провулок  Київ",
        "email":"",
        "message":"Установлю актуальную версию Windows 10 на Ваш ноутбук всего за один час и 19 грн.!Ошибки нет, за девятнадцать гривен. Полная ГАРАНТИЯ на выполненную работу три месяца. Только СВЕЖИЕ драйвера. Опыт установки операционных систем более 15-ти лет дает гарантию ПРАВИЛЬНОЙ настройки Вашего ноутбука на максимальную ПРОИЗВОДИТЕЛЬНОСТЬ.Получите МАКСИМУМ от своего ноутбука прямо сейчас! И никаких проблем в дальнейшем",
        "cityId":2,
        "latitude":50.4429,
        "longitude":30.5453,
        "ratingCount":0,
        "ratingValue":0,
        "portfolioImages":[],
        "phones":[{"num":"380502718533"}],
        "categories":[{"categoryId":7,"info":"Компьютерная помощь."}],
        "workSchedule":{"hours":[]}},
        {"id":2899,"referralId":0,"creator":"","state":"p","distance":2.09432583516,"name":"Евгений","address":"вулиця Банкова  Київ","email":"","message":"Предлагаем Вашему вниманию полный комплекс услуг по автоматизации предприятий на базе программных продуктов 1с8(7.7)","cityId":2,"latitude":50.4452,"longitude":30.5291,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380961582169"}],"categories":[{"categoryId":7,"info":"Предлагаем Вашему вниманию полный комплекс услуг по автоматизации предприятий на базе программных продуктов 1с8(7.7)"}],"workSchedule":{"hours":[]}},{"id":3375,"referralId":0,"creator":"","state":"p","distance":3.632839508142,"name":"Дмитрий","address":"вулиця Олеся Гончара  Київ","email":"","message":"Продажа, установка,обслуживание 1с.\r\nОпыт работы более 20 лет, помогу организовать учет любой сложности.\r\nПредоставляю услуги по установке, обновлению и доработке 1с (всех версий),обучение и консультации пользователей.\r\nСтоимость 400 грн.\r\nЛюбая форма оплаты. ","cityId":2,"latitude":50.4504,"longitude":30.5038,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380996040573"}],"categories":[{"categoryId":7,"info":"Предоставляю услуги по установке, обновлению и доработке 1с (всех версий),обучение и консультации пользователей."}],"workSchedule":{"hours":[]}},{"id":2906,"referralId":0,"creator":"","state":"p","distance":5.8821037307987,"name":"Иларион","address":"вулиця Єреванська  Київ","email":"","message":"Настройка и установка программного обеспечения (ПО): Офисные приложения, графические программы, мультимедиа проигрыватели, архиватор, кодек, фото-редактор, видео плеер, браузер, скайп, пакет microsoft office, 1С:Предприятие, 1С:Бухгалтерия, «M.E.Doc» и многое др.Настройка WiFi \/ интернета: подключение к интернету, настройка домашней сети Wi-Fi, настройка и монтаж роутера и прочего сетевого оборудования, настройка и подключение беспроводной сети в офисе, настройка интернета на пару компьютеров.\r\n\r\nУстановка антивирусной защиты. Поиск и устранение компьютерных вирусов и другого вредоносного программного обеспечения..","cityId":2,"latitude":50.4358,"longitude":30.459,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380500502100"}],"categories":[{"categoryId":7,"info":"Услуги программиста."},{"categoryId":23,"info":"Настройка и установка программного обеспечения (ПО): Офисные приложения, графические программы, мультимедиа проигрыватели, архиватор, кодек, фото-редактор, видео плеер, браузер, скайп, пакет microsoft office, 1С:Предприятие, 1С:Бухгалтерия, «M.E.Doc»"}],"workSchedule":{"hours":[]}},{"id":3373,"referralId":0,"creator":"","state":"p","distance":6.3587754646565,"name":"Сергей","address":"Фанерна вулиця  Київ","email":"","message":"Программист 1С. Доработки,Обновление, Настройка, Обучение (7.7,8.2) ","cityId":2,"latitude":50.4285,"longitude":30.6309,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380937432711"}],"categories":[{"categoryId":7,"info":"Программист 1С. Доработки,Обновление, Настройка, Обучение (7.7,8.2)"}],"workSchedule":{"hours":[]}},{"id":3376,"referralId":0,"creator":"","state":"p","distance":7.7358491883125,"name":"Роман","address":"вулиця Профспілкова  Київ","email":"","message":"1.Обновление конфигураций 7.7 и 8.2\r\n2.Настройка и установка Бух, ЗУП, УПП УТ, и.д.р.\r\n3.Написание обработок\r\n4.Работа с API\r\n5.Обмен между базами 1с и других программ.\r\n6.Создание Печатных форм в Word и в 1с.\r\n7.Написание ТЗ, Алгоритмов для новых программ, инструкций для пользователей.\r\n8.Ведение Бух и Налогового учета\r\n9.Связка с Wincalc и 1С\r\n10.Автоматизация бизнес-процессов компании.\r\n11.Обучение программированию 1с индивидуально\r\nВыезд по Киеву и удаленное решение вопросов. ","cityId":2,"latitude":50.4397,"longitude":30.6488,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380930803123"}],"categories":[{"categoryId":7,"info":" Услуги Программиста 1с"}],"workSchedule":{"hours":[]}},{"id":2368,"referralId":0,"creator":"","state":"p","distance":7.8414077834332,"name":"Владимир","address":"вулиця Газова  Київ","email":"","message":"Предлагаю услуги по установке, обновлению и доработке 1с 8.х,обучение пользователей.\r\nСтоимость 150грн\/час.\r\n\r\nТакже возможно ведение управленческого, бухгалтерского, налогового учета, сдача отчетности.","cityId":2,"latitude":50.4257,"longitude":30.4305,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380935705076"}],"categories":[{"categoryId":89,"info":"Ведение управленческого,бухгалтерского,налогового учета."},{"categoryId":7,"info":"Предлагаю услуги по установке, обновлению и доработке 1с 8.х,обучение пользователей."}],"workSchedule":{"hours":[]}},{"id":3374,"referralId":0,"creator":"","state":"p","distance":8.293210964281,"name":"Инна","address":"вулиця Російська  Київ","email":"","message":"УДАЛЕННО!\r\nВедение бухгалтерского и налогового учета в программе 1с:Предприятие (8.2). Обновление 1С:Предприятие (8.2), создание любых отчетов и документов (программно), не предусмотренных в 1с:Предприятие (8.2).","cityId":2,"latitude":50.4248,"longitude":30.6581,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380672825650"}],"categories":[{"categoryId":7,"info":"Ведение бухгалтерского и налогового учета в программе 1с:Предприятие (8.2). Обновление 1С:Предприятие (8.2"},{"categoryId":89,"info":"Ведение бухгалтерского и налогового учета в программе 1с:Предприятие (8.2). Обновление 1С:Предприятие (8.2"}],"workSchedule":{"hours":[]}},{"id":2889,"referralId":0,"creator":"","state":"p","distance":9.0621846333566,"name":"Андрей","address":"вулиця Вавилових  Київ","email":"","message":"- Переустановка Windows, программ и драйверов (при переустановке Windows установка антивируса бесплатно) - 100 грн (АКЦИЯ).\r\n-Установка и обновление драйверов\r\n- Установка, переустановка и настройка программного обеспечения: Офисные приложения, графические программы, мультимедиа проигрыватели, архиватор, кодек, фото-редактор, видео плеер, браузер, скайп, пакет Microsoft Office, а также другие приложения.\r\n\r\n- Настройка WiFi \/ интернета: настройка домашней сети Wi-Fi, настройка и подключение беспроводной сети в офисе\r\n\r\n- Установка антивирусной защиты. Поиск и устранение компьютерных вирусов и другого вредоносного программного обеспечения.\r\n\r\n- Настройка МФУ, принтеров, сканеров, копиров.\r\n\r\n- Сброс пароля пользователя Windows без потери данных (если вы забыли или же потеряли свой пароль от системы Windows - наши специалисты смогут вам помочь).\r\n\r\n- Настройка мобильных телефонов под управлением Android\r\n\r\n- Установка любых приложений для вашего смартфона ","cityId":2,"latitude":50.476,"longitude":30.4377,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380934620182"}],"categories":[{"categoryId":16,"info":"Установка любых приложений для вашего смартфона"},{"categoryId":23,"info":" Настройка WiFi \/ интернета: настройка домашней сети Wi-Fi, настройка и подключение беспроводной сети в офисе"},{"categoryId":7,"info":"Установка, переустановка и настройка программного обеспечения"},{"categoryId":38,"info":"Переустановка Windows, программ и драйверов (при переустановке Windows установка антивируса бесплатно)"}],"workSchedule":{"hours":[]}},{"id":3037,"referralId":0,"creator":"","state":"p","distance":9.5159414998251,"name":"Николай","address":"вул. Теодора Драйзера  Київ","email":"","message":"Выполняю все виды компьютерных услуг.\r\nОт железа до программного обеспечения.","cityId":2,"latitude":50.5044,"longitude":30.6017,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380934220488"}],"categories":[{"categoryId":7,"info":"Выполняю все виды компьютерных услуг."},{"categoryId":1212,"info":"Выполняю все виды компьютерных услуг."}],"workSchedule":{"hours":[]}},{"id":2895,"referralId":0,"creator":"","state":"p","distance":9.5341746975027,"name":"Анатолий","address":"вулиця Вірменська  Київ","email":"","message":"Доработка, консультирование, внедрение типовых конфигураций: УПП, БП, УТ, УТП, УНФ, УТ-3. Доработанная 1С Розница8 1, 2 (фискальные и не фискальные товары в одном чеке на 2 ФР, себестоимость, ценообразование, взаиморасчеты, суммовой обмен с бухгалтерией, различное торгового оборудование). Транспортная логистика с GPS мониторингом Wialon и Google maps на УФ. Позаказный расчет себестоимости к БПу и УТП, веб-сервисы, обмены с сайтом, интеграция любой сложности и др. Не франч, от 250 час (время фактическое). ","cityId":2,"latitude":50.4075,"longitude":30.6718,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380931150924"}],"categories":[{"categoryId":7,"info":"Доработка, консультирование, внедрение типовых конфигураций: УПП, БП, УТ, УТП, УНФ, УТ-3. Доработанная 1С Розница8 1, 2"}],"workSchedule":{"hours":[]}},{"id":3050,"referralId":0,"creator":"","state":"p","distance":9.8631386629223,"name":"Александр","address":"вулиця Марганецька  Київ","email":"","message":"- Чистка, замена термопасты на ноутбуке(компьютере)\r\n- Решение проблем перегрева\r\n- Установка Windows XP, Windows 7, Windows 10\r\n(чистая установка)\r\n- Установка наиболее распространенных программ\r\n(Почтовые программы, интернет браузеры, архиваторы, программы для просмотра фотографий, рисунков, видео, фильмов, переводчики, программы для записи CD\/DVD-дисков)\r\n- Установка офисных приложений\r\n(Microsoft Office (2003,2007,2010,2013) (Word, Excel, Power Point и.т.д)\r\n- Установка и настройка антивирусной программы\r\n- Настройка интернета, роутера ","cityId":2,"latitude":50.4527,"longitude":30.6749,"ratingCount":0,"ratingValue":0,"portfolioImages":[],"phones":[{"num":"380969590591"}],"categories":[{"categoryId":1212,"info":"Чистка, замена термопасты на ноутбуке(компьютере)"},{"categoryId":38,"info":"Установка Windows XP, Windows 7, Windows 10"},{"categoryId":7,"info":"Установка наиболее распространенных программ"}],"workSchedule":{"hours":[]}}];
        
        load_users_handler(perfomers);
    });
}

function load_users_handler(perfomers) {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];

    let user_list = $('.users-list .map-aside__list');
    user_list.html('');

    for (key in perfomers) {
        user_list.append(create_user_item(perfomers[key].id, 
                                          perfomers[key].name, 
                                          perfomers[key].distance.toFixed(2),
                                          perfomers[key].address,
                                          "Юлия.png",
                                          perfomers[key].ratingValue,
                                          perfomers[key].ratingCount
                                          ));

        let infowindow = new google.maps.InfoWindow();    

        google.maps.event.addListener(infowindow, "closeclick", () => {
            for (let j = 0; j < markers.length; j++) {
                let image = 'https://helpfi.me/i/marker/marker-' + select_cat + '.png';
                markers[j].setIcon(image);
                markers[j].setZIndex(1);
            }
        });

        let image = 'https://helpfi.me/i/marker/marker-' + select_cat + '.png';
        let marker = new google.maps.Marker({
            position: {lat: perfomers[key].latitude, lng: perfomers[key].longitude},
            map: _map,
            title: perfomers[key].name,
            icon: image
        }); 

        markers.push(marker);

        phone = perfomers[key].phones[0].num? perfomers[key].phones[0].num : '';

        google.maps.event.addListener(marker, 'click', (function (marker, perfomer, phone, key) {
            return function () {
                for (var j = 0; j < markers.length; j++) {
                    let image = 'https://helpfi.me/i/marker/marker-' + select_cat + '.png';
                    markers[j].setIcon(image);
                    markers[j].setZIndex(1);
                }

                infowindow.setContent(create_info_window(perfomer.id,
                                                         perfomer.name, 
                                                         perfomer.distance.toFixed(2),
                                                         perfomer.address,
                                                         "Юлия.png",
                                                         perfomer.ratingValue,
                                                         perfomer.ratingCount));
                let active_image = 'https://helpfi.me/i/marker/active/marker-' + select_cat + '.png';
                this.setIcon(active_image);
                this.setZIndex(2);
                infowindow.open(_map, marker);
            }
        })(marker, perfomers[key], phone, key));
    }

    init_star('body');
    set_user_item_event();
}

function create_user_item(user_id, user_name, user__distance, user__adres, user__photo, user__appraisal = 5.0, user__appraisal_count = 100, user__coment_count = 100, user__status = 'свободен') { 
    let item = '<div class="user-item" user-id="' + user_id +'">' +
                    '<div class="online-wrap online-wrap__online">' +
                        '<div class="avatar table-avatar">' +
                            '<div class="avatar__wrapper">' + 
                                '<div class="avatar__anchor">' +
                                    '<img src="images/' + user__photo + '" class="w-100 d-block" alt="avatar">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="user-item__info">' +
                        '<div class="user-item__name">' + user_name + '</div>' +
                        '<div class="table__ball">' +
                            '<div class="table__stars" ball="' + user__appraisal + '"></div>' +                            
                            '<div>' +
                                '<span>' + user__appraisal.toFixed(1) + ' (' + user__appraisal_count + ')</span>' + 
                            '</div>' +
                        '</div>' +
                        '<div>' +
                            '<img class="user-item__mess-icon" src="images/mess.svg" alt="icon">' +
                            '<span>' + user__coment_count + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="user-item__status">' +
                        '<div class="user-item__flag">' + user__status + '</div>' +
                        '<div class="user-item__distance">' + user__distance + ' км</div>' +
                        '<div class="user-item__adres">' + user__adres + '</div>' +
                    '</div>' +
                '</div>';

    return item;
}

function create_info_window(user_id, user_name, user_distance, user_adres, user_photo, user_appraisal = 5.0, user_appraisal_count = 100, user_coment_count = 100, user_status = 'свободен') {
    let item = '<div class="user-item" user-id="' + user_id +'">' + 
                    '<div class="online-wrap online-wrap__online">' +
                        '<div class="avatar table-avatar">' +
                            '<div class="avatar__wrapper">' +
                                '<div class="avatar__anchor">' +
                                    '<img src="images/' + user_photo + '" class="w-100 d-block" alt="avatar">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="user-item__info">' +
                        '<div class="user-item__name">' + user_name + '</div>' +
                        '<div class="table__ball">' +
                            '<div class="table__stars" ball="' + user_appraisal + '">';
                                for(let i = 0; i < parseInt(user_appraisal); i++) {
                                    item += '<span class="icon"><img src="images/star-all.svg" class="img-svg" alt="icon"></span>';
                                }
                        
                                let part = user_appraisal - parseInt(user_appraisal);                        
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
                        
                                if(user_appraisal < 5.0) {
                                    item += '<span class="icon"><img src="images/star-' + index + '.svg" class="img-svg" alt="icon"></span>';
                                }
                        
                                for(let i = 0; i < 5 - 1 - parseInt(user_appraisal); i++) {
                                    item += '<span class="icon"><img src="images/star-0.svg" class="img-svg" alt="icon"></span>';
                                }
                    item += '</div>' +                          
                            '<div>' +                     
                                '<span>' + user_appraisal + ' (' + user_appraisal_count + ')</span>' +
                            '</div>' +
                        '</div>' +
                        '<div>' +
                            '<img class="user-item__mess-icon" src="images/mess.svg" alt="icon">' +
                            '<span>' + user_coment_count + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="user-item__status">' +
                        '<div class="user-item__flag">' + user_status + '</div>' +
                        '<div class="user-item__distance">' + user_distance + ' км</div>' +
                        '<div class="user-item__adres">' + user_adres + '</div>' +
                    '</div>'+
                '</div>';
    return item;
}

function init_star(parent) {
    let balls = $(parent).find(".table__stars");
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

function set_user_item_event() {
    $(".user-item").on("click", function () {
        let user_id = $(this).attr("user-id");

        $('.back__btn').attr('step', 'three');
        $('.input-wrap__cat').attr('value', 'Портфолио');

        $('.map-aside-item').addClass('hidden');
        load_user_info(user_id);
        
        $('.map-aside-item.user-info').removeClass('hidden');       
        $('.map-aside-item.search-servise').removeClass('hidden');
        $('.map-aside-item.search-servise').addClass('search-servise_user');
        $('.map-aside-item.search-servise').removeClass('search-servise_users'); 

        $('#search').attr('readonly', 'readonly');

    });   
}

function load_user_info(id) {
    fetch('https://helpfi.me/api/perfomer.php?id=' + id).then((response) => {
        return response.json();
    }).then((data) => {
        let perfomer = data.perfomers;

        load_user_info_handler(perfomer);
    }).catch(() => {
        let perfomer = {
            "id":383,
            "referralId":0,
            "creator":"",
            "state":"p",
            "name":"Ирина, Олег",
            "address":"Лісозахисний провулок ",
            "email":"",
            "message":"Цены умеренные:-Грунтовка стен от 5грн, потолок от 7.50грн. кв.м-Шпатлевание стен под обои от 30грн, под покраску-40грн, потолок- 40грн кв.мВенецианская Штукатурка,Марсельский Воск,Фактурная Штукатурка - От 100 гр.кв м.-Поклейка обоев без подбора рисунка-25грн, с рисунком-30-50грн кв.м-Покраска обоев, стен от 15грн. м",
            "cityId":2,
            "latitude":50.5293,
            "longitude":30.4406,
            "ratingCount":0,
            "ratingValue":0,
            "portfolioImages":[{'title': 'title one', 'id': 1813}, {'title': 'title two', 'id': 383}],
            "phones":[{"num":"380688151430"}],
            "categories":[{"categoryId":1502,"categoryName":[{"locale":"ru","value":"Отделочные работы"},{"locale":"ua","value":"Оздоблювальні роботи"}],"info":"Цены умеренные:-Грунтовка стен от 5грн, потолок от 7.50грн. кв.м-Шпатлевание стен под обои от 30грн, под покраску-40грн, потолок- 40грн кв.мВенецианская Штукатурка,Марсельский Воск,Фактурная Штукатурка - От 100 гр.кв м.-Поклейка обоев без подбора рис"},{"categoryId":1567,"categoryName":[{"locale":"ru","value":"Штукатур"},{"locale":"ua","value":"Штукатур"}],"info":"Венецианская Штукатурка,Марсельский Воск,Фактурная Штукатурка"},{"categoryId":1512,"categoryName":[{"locale":"ru","value":"Поклейка обоев"},{"locale":"ua","value":"Поклейка шпалер"}],"info":"-Поклейка обоев без подбора рисунка-25грн, с рисунком-30-50грн кв.м-Покраска обоев"}],
            "workSchedule":{"hours":[{"day":"monday","hours":"7-21"},{"day":"tuesday","hours":"7-21"},{"day":"wednesday","hours":"7-21"},{"day":"thursday","hours":"7-21"},{"day":"friday","hours":"7-21"},{"day":"saturday","hours":"7-21"},{"day":"sunday","hours":"7-21"}]}};

        load_user_info_handler(perfomer);
    });
}

function load_user_info_handler(perfomer) {
    let user_info = $('.user-info');

    user_info.html('');

    user_info.append(create_user_item(perfomer.id, 
                                      perfomer.name, 
                                      calcDistance(new google.maps.LatLng(perfomer.latitude, perfomer.longitude), new google.maps.LatLng(_originMarker.getPosition().lat(), _originMarker.getPosition().lng())),
                                      perfomer.address,
                                      "Юлия.png",
                                      perfomer.ratingValue,
                                      perfomer.ratingCount));
    init_star('.user-info');
    user_info.append(create_user_service_list(perfomer.categories));
                                                
    user_info.append(create_user_service_services([ {'title': 'Другие услуги швеи', 'price': '1200'}, 
                                                    {'title': 'Пошив одежды', 'price': '1500'},
                                                    {'title': 'Пошив текстиля', 'price': '1000'},
                                                    {'title': 'Ремонт одежды', 'price': '500'}]));

    user_info.append(create_user_service_photo(perfomer.portfolioImages));
    user_info.append(create_user_service_btns(perfomer.phones));

    init_icon();

    set_user_info_event();
}

function create_user_service_list(list) {
    let item =  '<div class="user-service-list">';

    for(let i = 0; i < list.length; i++) {
        item += '<div class="user-service">' + (i + 1) + ') ' + list[i].info + '.</div>'
    }

    item += '</div>';

    return item;
}

function create_user_service_services(services) {
    let item = '';

    for(let i = 0; i < services.length; i++) {
        item += '<div class="user-info__service">' +
                    '<div class="mr-auto">' + services[i].title + '</div>' + 
                    '<div class="green">от ' + services[i].price + '₴</div>' +
                '</div>';
    }
    
    return item;
}

function create_user_service_photo(images) {
    let item =  '<div class="user-info__img-wrap">';

    for(let i = 0; i < images.length; i++) {
        item += '<div class="user-info__img">' +
                    '<img src="http://vtaxi.info:8084/neos/image?id=' + images[i].id + '" alt="img" class="w-100 h-100">' +
                    '<div class="user-info-img-title">' +
                        '<span class="ml-auto mr-auto">' + images[i].title + '</span>' +
                        '<span>' + (i + 1) + '/' + images.length + '</span>' +
                    '</div>' +
                '</div>';
    }     

    item += '</div>';
    return item;
}

function create_user_service_btns(phones) {
    item = '<div class="user-info__btns">' +
                '<div class="user-info__phones-wrap">';

                    for(let i = 0; i < phones.length; i++) {
                        item += '<div class="user-info__phone" phone-val="' + phones[i].num + '">';

                        let phone_code = phones[i].num.substring(2, 5);

                        if(phone_code == '050' || phone_code == '066' || phone_code == '095' || phone_code == '099') {
                            item += '<span class="icon">' +
                                        '<img src="images/Vodafone.svg" class="img-svg" alt="icon">' +
                                    '</span>' +
                                    '<span>Vodafone</span>';

                        }
                        else if(phone_code == '039' || phone_code == '067' || phone_code == '068' || phone_code == '096' || phone_code == '097' || phone_code == '098') {
                            item += '<span class="icon">' +
                                        '<img src="images/Kyivstar.svg" class="img-svg" alt="icon">' +
                                    '</span>' +
                                    '<span>Vodafone</span>';
                        }
                        else if(phone_code == '063' || phone_code == '093' || phone_code == '073') {
                            item += '<span class="icon">' +
                                        '<img src="images/Vodafone.svg" class="img-svg" alt="icon">' +
                                    '</span>' +
                                    '<span>Киевстар</span>';
                                    
                        }
                        else {
                            item += '<span>Неизвестный оператор</span>';
                        }

                        item += '</div>';
                    }

        item += '</div>' +
                '<div class="user-info__btns-wrap">' +
                    '<button class="helpfi___btn phone-btn">' +
                        '<span>ПОЗВОНИТЬ</span>' +
                    '</button>' +
                '</div>' +
            '</div>';

    return item;
}

function set_user_info_event() {
    $(".user-info .phone-btn").on("click", function () {
        $('.user-info__phones-wrap').toggleClass('user-info__phones-wrap_active');
    });
}


function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}
