let _map, _drvtype = 0, 
    _isPOI = null, 
    _geocoder, 
    _originMarker,
    _destinationMarker, 
    _wayPointMarker1, 
    _wayPointMarker2,
    _tripDistance = 0,
    _directionsRenderer, 
    _directionsService, 
    _isMarkerPlacingAllowed = true, 
    _nearestMrkrs = [],
    _drvrs = null,
    _circle, 
    _markersKML, 
    _ctype = 0, 
    _cid = 0, 
    _ctoken = "", 
    _isCurrOrder = true,

    icons = {
        origin: new google.maps.MarkerImage("../images/markers/start.png"),
        waypoint_one: new google.maps.MarkerImage("../images/markers/stop-one.png"),
        waypoint_two: new google.maps.MarkerImage("../images/markers/stop-two.png"),
        destination: new google.maps.MarkerImage("../images/markers/finish.png"),
        circle: {
            anchor: new google.maps.Point(36, 36), 
            url: "../images/markers/circle.png"
        },
        car: [
            {
                anchor: new google.maps.Point(28, 22),
                url: "../images/markers/vehicles/OnC-e.png"
            }, {
                anchor: new google.maps.Point(28, 22),
                url: "../images/markers/vehicles/OnC-c.png"
            }, {
                anchor: new google.maps.Point(28, 22), 
                url: "../images/markers/vehicles/OnC-v.png"
            }
        ],
        mbus: {
            anchor: new google.maps.Point(28, 18), 
            url: "../images/markers/vehicles/OnMBig.png"
        },
        truck: {
            anchor: new google.maps.Point(28, 18), 
            url: "../images/markers/vehicles/OnTBig.png"
        },
        emerg: {
            anchor: new google.maps.Point(30, 22), 
            url: "../images/markers/vehicles/OnEBig.png"
        }
    },

    _outside_zones = "Извините пожалуйста, Вы находитесь вне зоны покрытия нашего сервиса.",
    _no_free_drvrs = "Извините, нам не удалось найти свободных водителей неподалеку от Вашего местоположения. Пожалуйста, повторите поиск позже.",
    boolOpts = {
        40: "Кондиционер",
        41: "Зона Wi-Fi",
        42: "Выдача чеков",
        43: "Оплата пласт. картой",
        44: "Оплата по таксометру",
        45: "Водитель не курит",
        46: "Грузчики в наличии",
        47: "Чистота в салоне",
        48: "Пассажир застрахован"
    }, DICodes = {
        VAN_TYPE: 0,
        SEATS_NUMBER: 1,
        CATEGORY: 2,
        DISTANCE: 10,
        RATING: 11,
        DRV_LAT: 12,
        DRV_LNG: 13,
        RATE_COUNT: 20,
        CAPACITY: 70,
        VAN_LENGTH: 71,
        VAN_WIDTH: 72,
        VAN_HEIGHT: 73,
        PHONE_NUMS: 90,
        FIRST_NAME: 91,
        FARES: 92,
        MODEL: 93,
        COLOR: 94,
        LICENSE_PLATE: 95,
        DRIVER_ID: 98,
        CALLSIGN: 100,
        LICENSE_NUM: 101
    }, 
    _categories = ["эконом", "комфорт", "бизнес"],
    _vanTypes = "Седан Пикап Хэтчбек Универсал Купе Фургон Лимузин Кабриолет Кроссовер Минивэн".split(" "),
    _fareLabels = "Минимальный заказ;Последующие (за км);Почасовая оплата;За городом (за км);Минута ожидания;Стоимость подачи;Загрузка салона;Детское кресло;Перевозка животных;Услуга Драйвер;Курьерские услуги;Трансфер;Speak English;Фаркоп;Эвакуация;Буксировка;Доставка бензина;Замена колеса;Прикуривание;Открытие замков".split(";");

let map_styles = {
    light: [
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 65
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": "50"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": "-100"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": "30"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": "40"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#ffff00"
                },
                {
                    "lightness": -25
                },
                {
                    "saturation": -97
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "lightness": -25
                },
                {
                    "saturation": -100
                }
            ]
        }
    ],
    dark: [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "saturation": 36
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 40
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                },
                {
                    "weight": 1.2
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 21
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 29
                },
                {
                    "weight": 0.2
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 18
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 19
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 17
                }
            ]
        }
    ]
}

function fillDrvrsList() {
    clearNearestMrkrs();
    _nearestMrkrs = Array(_drvrs.length);

    let a = "";
    for (i = 0; i < _drvrs.length; i++) {
        let a = a + ("<li><span class='plink order-next-step' onclick=\"showDrvr('" + i + "');\">");
        let b = _drvrs[i][DICodes.FARES].split("@");
        let c;
        if(_tripDistance > 0) {
            if(_drvtype != 2) {
                MIN_order_dst = b[5];
                c = parseFloat(b[0]);
                if(_tripDistance > MIN_order_dst) {
                    c += (_tripDistance - MIN_order_dst) * parseFloat(b[1]);
                    c = c.toFixed(2); 
                }
            }
            else { c = ""; }
        }

        Model = _drvrs[i][DICodes.MODEL];
        Category = _drvrs[i][DICodes.CATEGORY];
        a = void 0 == Category ? a +
            ("<span class='car'><strong>" + Model + "</strong></span>") : a + ("<span class='car'><strong>" + Model + "</strong>" + _categories[Category] + "</span>");
        a += "<span class='distance text-silver'><i class='ico-vt-marker silver'></i>" + _drvrs[i][DICodes.DISTANCE].toFixed(1) + " км</span><span class='text-digits'>" + ("" == c ? "?" : c) + "</span></span></li>";
       
        MarkerIco = "";
        switch (_drvtype) {
            case 0:
            case 4:
                MarkerIco = icons.car[Category];
                break;
            case 1:
                MarkerIco = icons.mbus;
                break;
            case 2:
                MarkerIco = icons.truck;
                break;
            case 3:
                MarkerIco = icons.emerg;
        }

        DrvInfo = '<span class="plink backlink" onclick="backToDrvrsList()">&larr; <u>Ближайшие свободные такси</u> (' + _drvrs.length + ")</span>";
        
        0 < _ctype && (DrvInfo += '<div id="sendinfo" class="sendinfo pull-right"><a class="btn" onclick="currOrderRequest();">Отправить</a></div>');
        DrvInfo += '<div class="driver-car"><span class="license pull-right">' + _drvrs[i][DICodes.LICENSE_PLATE] + '</span><strong class="h3">' + Model + "</strong>";
        void 0 != Category && (DrvInfo += '<i class="dotdivider text-gray"></i><small>' + _categories[Category] +
            "-класс</small>");
        DrvInfo += '<p class="text-gray">' + (void 0 == _drvrs[i][DICodes.VAN_TYPE] ? "" : _vanTypes[_drvrs[i][DICodes.VAN_TYPE]] + ", ") + "цвет: " + _drvrs[i][DICodes.COLOR] + "</p>";
        let d = "";
        void 0 != _drvrs[i][DICodes.SEATS_NUMBER] && (d += "<li>Количество мест: <b>" + _drvrs[i][DICodes.SEATS_NUMBER] + "</b></li>");
        void 0 != _drvrs[i][DICodes.CAPACITY] && (d += "<li>Грузоподъемность (т): <b>" + _drvrs[i][DICodes.CAPACITY] / 10 + "</b></li>");
        void 0 != _drvrs[i][DICodes.VAN_LENGTH] && (d += "<li>Габариты кузова (м): <b>" + _drvrs[i][DICodes.VAN_LENGTH] /
            100 + " &times; " + _drvrs[i][DICodes.VAN_WIDTH] / 100 + " &times; " + _drvrs[i][DICodes.VAN_HEIGHT] / 100 + "</b></li>");
        "" != d && (DrvInfo += '<ul class="list-unstyled">' + d + "</ul>");
        DrvInfo += '</div><div class="driver-distance text-gray"><i class="ico-vt-marker silver"></i>Сейчас в ' + _drvrs[i][DICodes.DISTANCE].toFixed(1) + " км от вас";
        void 0 != _drvrs[i][DICodes.LICENSE_NUM] && (DrvInfo += '<span class="lic-label pull-right">Лицензия: ' + _drvrs[i][DICodes.LICENSE_NUM] + "</span>");
        DrvInfo += "</div>";
        "" != c && (DrvInfo += '<div class="driver-cta clearfix"><span class="your-route">Расчетная<br>цена:</span><span class="your-price text-profit">' +
            c + "</span></div>");
        DrvInfo += '<div class="driver-profile clearfix"><ul class="driver-phones pull-right">';
        d = _drvrs[i][DICodes.PHONE_NUMS].split("@");
        for (j = 0; j < d.length; j++) DrvInfo += '<li><a href="tel:' + d[j] + '">' + d[j] + "</a></li>";
        DrvInfo += '</ul><small class="text-gray blockwide">Водитель:</small><strong class="h3">' + _drvrs[i][DICodes.FIRST_NAME] + "</strong>";
        DrvInfo += '<b title="Рейтинг по отзывам" class="text-gray"><i class="ico-vt-star"></i><abbr>' + _drvrs[i][DICodes.RATING].toFixed(1) + " (отзывов: " +
            _drvrs[i][DICodes.RATE_COUNT] + ")</abbr></b>";
        void 0 != _drvrs[i][DICodes.CALLSIGN] && (DrvInfo += '<small class="text-gray blockwide">Позывной: ' + _drvrs[i][DICodes.CALLSIGN] + "</small>");
        DrvInfo += '</div><ul class="driver-prices">';
        for (j = 21; 26 >= j; j++) 0 < b[j] && (DrvInfo += formatFare(_fareLabels[j - 7], b[j]));
        DrvInfo = 2 == _drvtype ? DrvInfo + formatFare(_fareLabels[5], b[0]) : DrvInfo + formatFare(_fareLabels[0] + " (до " + b[5] + " км)", b[0]);
        for (j = 1; 3 >= j; j++) DrvInfo += formatFare(_fareLabels[j], b[j]);
        DrvInfo += formatFare(_fareLabels[4],
            b[10]);
        for (j = 6; 13 >= j; j++) 0 < b[j + 7] && (DrvInfo += formatFare(_fareLabels[j], b[j + 7]));
        DrvInfo += '</ul><ul class="driver-services">';
        for (let f in boolOpts) void 0 != _drvrs[i][f] && (DrvInfo += "<li>" + boolOpts[f] + "</li>");
        DrvInfo += "</ul>";
        _nearestMrkrs[i] = createMarker(i, new google.maps.LatLng(_drvrs[i][DICodes.DRV_LAT], _drvrs[i][DICodes.DRV_LNG]), MarkerIco, Model, DrvInfo, c);
        google.maps.event.addListener(_nearestMrkrs[i], "click", function () {
            showDrvr(this.markerIndex)
        })
    }
    document.getElementById("list-nearest").innerHTML =
        a;
    "" == c ? document.getElementById("price-hint").innerHTML = '<hr><p class="small"><span class="text-digits">?</span> Для предварительного расчёта стоимости <span class="plink" onclick="backToFirstStep()"><u>укажите пункт назначения</u></span>.</p>' : document.getElementById("price-hint").innerHTML = ""
}

function formatFare(a, b) {
    return "<li>" + a + '<span class="text-profit"><b>' + b + "</b></span></li>"
}

let _currDrvId, _currPrice;

function showDrvr(index) {
    _currDrvId = _drvrs[index][DICodes.DRIVER_ID];
    let nearestMrkr = _nearestMrkrs[index];
    _currPrice = nearestMrkr.price;
    document.getElementById("driverinfo").innerHTML = nearestMrkr.drvInfo;

    if(_circle.getMap() == null) {  _circle.setMap(_map); }
      
    _circle.setPosition(nearestMrkr.getPosition());
    formProceed($(".nearest"), $(".nearest").next(".step"))
}

function createMarker(position, icon, title, marker_index, drv_info, price) {
    return new google.maps.Marker({
        position: position,
        icon: icon,
        clickable: !0,
        map: _map,
        title: title,
        markerIndex: marker_index,
        drvInfo: drv_info,
        price: price
    });
}

function showMsg(title, text) {
    text = "<h3>" + title + "</h3><p>" + text + '</p>';
    $('.answer-order').html(text);
    $('.footer__popup').removeClass('open');
    $('.answer-order').addClass('open');

    $('.order-btn-one').removeClass('map-footer__btn_active');
    $('.order-btn-two').removeClass('map-footer__btn_active');
    $('.order-btn-three').addClass('map-footer__btn_active');
}

//// ?-----------------?
function showDrvrs(a) {
    clearNearestMrkrs();
    null == a ? showMsg("Сообщение", _outside_zones) : (a = eval(a), 0 == a.length ? showMsg("Сообщение", _no_free_drvrs) : (_drvrs = a, _markersKML.setMap(null), setCenterAndZoom(_originMarker.getPosition(), 13), fillDrvrsList(), formProceed($(".taxisearch"), $(".taxisearch").next(".step"))))
}

function clearNearestMrkrs() {
    for (i = 0; i < _nearestMrkrs.length; i++) {
        _nearestMrkrs[i].setMap(null);
    }
}

function initCircle() {
    console.log("initCircle");
    _circle = new google.maps.Marker({icon: icons.circle, clickable: false})
}

function backToDrvrsList() {
    _circle.setMap(null);
    formProceed($(".driver"), $(".driver").prev(".step"))
}

function setMapToMarker(marker, map) {
    console.log("setMapToMarker");
    if(marker.getPosition().lat() != 0) {
       marker.setMap(map);
    } 
}

function setMapToDirMarkers(map) {
    console.log("setMapToDirMarkers");
    setMapToMarker(_originMarker, map);
    setMapToMarker(_destinationMarker, map);
    setMapToMarker(_wayPointMarker1, map);
    setMapToMarker(_wayPointMarker2, map)
}

function backToFirstStep() {
    _directionsRenderer.setMap(null);
    _markersKML.setMap(_map);
    setMapToDirMarkers(_map);
    _isMarkerPlacingAllowed = true;
    clearNearestMrkrs();

    $('.footer__popup').removeClass('open');
    $('.order-btn-three').removeClass('map-footer__btn_active');
    $('.order-btn-two').removeClass('map-footer__btn_active');
    $('.order-btn-one').addClass('map-footer__btn_active');
}

function makeQuery(src) {
    console.log(src);
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", src + "&id=" + (new Date).getTime());
    let head = document.getElementsByTagName("head").item(0);
    head.insertBefore(script, head.firstChild);
    console.log("hext");
}

function getQueryHead(n) {
    console.log("getQueryHead");
    let position = _originMarker.getPosition();
    return "/srv/ops.php?op=" + n + "&ctype=" + _ctype + "&cid=" + _cid + "&ctoken=" + _ctoken + "&Alat=" + position.lat() + "&Alng=" + position.lng() + "&vehtype=" + _drvtype;
}

function getNearestDrvrs() {
    console.log("getNearestDrvrs");
    if (_tripDistance != 0 || _destinationMarker.getPosition().lat() == 0 || calcRoute()) {
       _drvrs = null;
       makeQuery(getQueryHead(0));
    } 
}

function currOrderRequest() {
    let position = _destinationMarker.getPosition();
    makeQuery(getQueryHead(2) + "&Blat=" + position.lat() + "&Blng=" + position.lng() + "&drvId=" + encodeURIComponent(_currDrvId) + "&phone=" + document.getElementById("order-phone").value + "&name=" + document.getElementById("order-name").value + "&info=" + document.getElementById("order-comment-curr").value + "&distance=" + (10 * _tripDistance).toFixed(0) + "&price=" + _currPrice)
}

function computeTotalDistance(directions) {
    console.log("computeTotalDistance");
    let distance = 0;
    directions = directions.routes[0];
    for (i = 0; i < directions.legs.length; i++) {
        distance += directions.legs[i].distance.value;
    }
    console.log(distance);
    return distance / 1000;
}

/*----------!-----------*/
function mobileVersion() {
    let a = navigator.userAgent.toLowerCase(), b = document.referrer.toLowerCase();
    -1 != a.indexOf("android") && -1 == b.indexOf("/index.html") ? window.location = "/progs/android.html" : -1 != a.indexOf("windows phone") && -1 == b.indexOf("/progs/winphone.html") ? window.location = "/progs/winphone.html" : -1 == a.indexOf("iphone") && -1 == a.indexOf("ipod") && -1 == a.indexOf("ipad") || -1 != b.indexOf("/progs/ios.html") || (window.location = "/progs/ios.html")
}

function initDirections() {
    console.log("initDirections");
    _directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: false, draggable: false});
    _directionsService = new google.maps.DirectionsService;

    google.maps.event.addListener(_directionsRenderer, "directions_changed", function () {
        console.log("event cange dir");
        _tripDistance = computeTotalDistance(_directionsRenderer.directions);
        if(_drvrs != null) { 
            fillDrvrsList();
        }
    })
}

function addWaypointMarker(arr, marker) {
    if(marker.getPosition().lat() != 0) {
        arr.push({location: marker.getPosition(), stopover: true});
    }     
}

function calcRoute() {
    console.log("calcRoute");
    let arr_point = [];
    addWaypointMarker(arr_point, _wayPointMarker1);
    addWaypointMarker(arr_point, _wayPointMarker2);

    let arr = {
        origin: _originMarker.getPosition(),
        destination: _destinationMarker.getPosition(),
        waypoints: arr_point,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false
    };

    _directionsService.route(arr, function (dir, status) {
        console.log("route");
        switch (status) {
            case google.maps.DirectionsStatus.OK:
                _directionsRenderer.setDirections(dir);
                _directionsRenderer.setMap(_map);
                break;
            case google.maps.DirectionsStatus.NOT_FOUND:
                alert("Извините, одно из указанных Вами мест не может быть найдено. Проверьте поля еще раз и повторите попытку.");
                break;
            case google.maps.DirectionsStatus.ZERO_RESULTS:
                alert("Извините, между указанными Вами местами маршрут не может быть проложен.");
                break;
            case google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED:
                alert("Вы указали слишком много промежуточных точек.");
                break;
            case google.maps.DirectionsStatus.INVALID_REQUEST:
                alert("Неправильный запрос. Пожалуйста, сообщите администратору.");
                break;
            case google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
                alert("С Вашего адреса было слишком много запросов. Пожалуйста, попробуйте позднее.");
                break;
            case google.maps.DirectionsStatus.REQUEST_DENIED:
                alert("Google запретил запросы с Вашего адреса.");
                break;
            case google.maps.DirectionsStatus.UNKNOWN_ERROR:
                alert("Ошибка сервера Google. Пожалуйста, попробуйте позднее.");
                break;
            default:
                alert("Неожиданный код ошибки: " + status)
        }
    });
    return true;
}

function initMarkers() {
    console.log("initMarkers");
    _originMarker = createDirMarker(icons.origin, "Откуда ехать", "start-point");
    _destinationMarker = createDirMarker(icons.destination, "Конечная точка", "finish-point");
    _wayPointMarker1 = createDirMarker(icons.waypoint_one, "Остановка", "way-point-one");
    _wayPointMarker2 = createDirMarker(icons.waypoint_two, "Остановка", "way-point-two");
    
    setActiveMarker(0);
    getClientLocation();
    google.maps.event.addListener(_map, "click", function (point) {
        if(_activeMarker != null && _isMarkerPlacingAllowed) {
            placeMarker(_activeMarker, point.latLng);
        }
    })
}

let _activeMarker = null;

function setActiveMarker(number) {
    switch (number) {
        case 0:
            _activeMarker = _originMarker;
            break;
        case 1:
            _activeMarker = _wayPointMarker1;
            break;
        case 2:
            _activeMarker = _wayPointMarker2;
            break;
        case 3:
            _activeMarker = _destinationMarker
    }
}

function getClientLocation() {
    if(_isPOI == null) {
        if(!navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                setCenterAndZoom(position, 17);
                placeMarker(_originMarker, position)
            });
        }
    }
    else {
        placeMarker(_originMarker, _map.getCenter())
    }
}

function createDirMarker(icon, title, id) {
    input = document.getElementById(id);
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(0, 0),
        icon: icon,
        draggable: true,
        map: null,
        animation: google.maps.Animation.DROP,
        title: title,
        autoCompl: input
    });

    console.log(marker);

    google.maps.event.addListener(marker, "dragend", function (icon) {
        placeMarker(marker, marker.getPosition());
    });

    let auto_comp = new google.maps.places.Autocomplete(input);
    auto_comp.setTypes(["geocode"]);
    input.placeholder = "";

    google.maps.event.addListener(auto_comp, "place_changed", function () {
        let place = auto_comp.getPlace();
        if(place.geometry != null) {
           setCenterAndZoom(place.geometry.location, 16);
           placeMarker(marker, place.geometry.location);
        } 
    });

    return marker;
}

function placeMarker(marker, position) {
    console.log("placeMarker");
    _tripDistance = 0;
    marker.setPosition(position);

    renewAddress(marker);
    if(marker == _originMarker && marker.getMap() ) {
        //showElemInline("save_POI");
    }
}

function renewAddress(marker) {
    console.log("renewAddress");

    _geocoder.geocode({latLng: marker.getPosition()}, function (b, status) {
        let num = '';
        let str = '';
        let ct = '';
        
        let len = b[0].address_components.length;
        for(let i=0; i < len; i++){
            if(b[0].address_components[i].types[0] == "street_number") {
                num = b[0].address_components[i].long_name;
            }
            if(b[0].address_components[i].types[0] == "route") {
                str = b[0].address_components[i].long_name;
            }
            if(b[0].address_components[i].types[0] == "locality") {
                ct = b[0].address_components[i].long_name;
            }                
        }

        let add = ct + ", " + str + ", " + num;
        if(status == google.maps.GeocoderStatus.OK) {
            if(marker.getMap() == null) {
                marker.setMap(_map);
            }
            marker.autoCompl.value = add;
        }
    })
}

function showElemInline(id) {
    document.getElementById(id).style.display = "inline";
}

function showElem(id) {
    document.getElementById(id).style.display = "";
}

function hideElem(id) {
    document.getElementById(id).style.display = "none";
}

function savePOI() {
    setCookie("lat=" + _originMarker.getPosition().lat());
    setCookie("lng=" + _originMarker.getPosition().lng());
    setCookie("zoom=" + _map.getZoom());
    setCookie("isPOI=true");
    $(".address-saved").fadeIn(200)
}

function getCookie(cookie) {
    let cookies = " " + document.cookie;
    cookie = " " + cookie + "=";
    let res = null, index = 0, end_index = 0;
    if(cookies.length > 0) {
        index = cookies.indexOf(cookie);
        if(index != -1) {
            index += cookie.length;
            end_index = cookies.indexOf(";", index);            
            if(end_index == -1) { end_index = cookies.length; }              
           
            res = unescape(cookies.substring(index, end_index));
        }
    }
    return res;
}

function setCookie(cookie) {
    document.cookie = cookie + ";path=/; expires=Mon, 01-Jan-2050 00:00:00 GMT"
}

function delCookie(cookie) {
    document.cookie = cookie + ";path=/; expires=Mon, 01-Jan-1970 00:00:00 GMT"
}

function setCenterAndZoom(center, zoom) {
    _map.setCenter(center);
    _map.setZoom(zoom)
}

function zoomToCity(name, param) {
    setCenterAndZoom(new google.maps.LatLng(param[0], param[1]), param[2]);
    setCookie("name=" + name);
    setCookie("lat=" + param[0]);
    setCookie("lng=" + param[1]);
    setCookie("zoom=" + param[2]);
    delCookie("isPOI=false")
}

function initMap() {
    console.log("initMap");

    const default_point = {
        lat: 50.46,
        lng: 30.55,
        zoom: 11,
        name: "Киев"
    }

    let lat = getCookie("lat"), 
        lng = getCookie("lng"), 
        zoom = getCookie("zoom"), 
        name = getCookie("name");

    if (zoom == null || lat == null || lng == null) {
        lat = default_point.lat;
        lng = default_point.lng;
        zoom = default_point.zoom;
        name = default_point.name;
    }

    _isPOI = getCookie("isPOI");    
    if(_isPOI != null) { name = "сохраненная точка"; }
       
    lat = Number(lat);
    lng = Number(lng);
    zoom = Number(zoom);

    $(".dd-city .dropdown-toggle u").text(name);//!-----------------

    _map = new google.maps.Map(document.getElementById("googlemap"), {
        zoom: zoom,
        center: new google.maps.LatLng(lat, lng),
        scaleControl: true,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.TOP_LEFT
        },
        zoomControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        streetViewControl: false,
        panControl: false,
        styles: map_styles.light
    });
}

// No Use
function initComboBox() {
    console.log("initComboBox");
    $(".dd-city .dropdown-toggle").click(function () {
        $(this).next().removeClass("hidden");
        $(this).next().find("#city").val("").focus();
    });

    $("#city").autocomplete({
        lookup: _cities,
        minChars: 0,
        appendTo: $(".dd-city .dropdown-menu"),
        onSelect: function (a) {
            zoomToCity(a.value, a.data);
            $(".dd-city .dropdown-toggle u").text(a.value);
            $(".dd-city .dropdown-menu").addClass("hidden");
        }
    })
}

function setDrvType(type) {
    _drvtype = type;
}

function showWaypoint(point) {
    point.removeClass("hidden");
    point.slideDown(100, function () {
        //adaptSidebar();
    })
}

function addWaypoint() {
    let point_one = $(".way-point-one");
    let point_two = $(".way-point-two");
    if(point_one.hasClass("hidden")) {
        showWaypoint(point_one);
    } 
    else if(point_two.hasClass("hidden")) {
        showWaypoint(point_two);
    }

    if(!point_one.hasClass("hidden") && !point_two.hasClass("hidden")) {
        $(".input-btn.add-btn").addClass("hidden");
    } 
}

function clearMarker(marker) {
    _tripDistance = 0;
    marker.setMap(null);
    marker.setPosition(new google.maps.LatLng(0, 0));
    marker.autoCompl.value = ""
}

function delWaypoint(number) {
    $(".way-point-" + number).addClass("hidden");
    switch (number) {
        case 'one':
            clearMarker(_wayPointMarker1);
            break;
        case 'two':
            clearMarker(_wayPointMarker2);
    }

    $(".input-btn.add-btn").removeClass("hidden");
}

function minToMillis(min) {
    return min * 60 * 1000;
}

function getMinDate() {
    const max_minutes = 5;
    const half_hour = 30;

    let millisec = (new Date).getTime(),
        minutes  = (new Date(millisec + minToMillis(half_hour))).getMinutes() % max_minutes,
        d_minutes = 0;

    if(minutes > 0) { d_minutes = max_minutes - minutes; }
       
    return new Date(millisec + minToMillis(half_hour + d_minutes))
}

function appendSelectElem(select, value, is_selected) {
    console.log("appendSelectElem");
    option = document.createElement("option");
    option.setAttribute("value", value);

    if(is_selected) { option.setAttribute("selected", "selected"); }

    value = String(value);
    if(value.length === 1) { value = '0' + value; }

    option.appendChild(document.createTextNode(value));
    select.appendChild(option);  
}

function fillMinutes() {
    let minuts = 0;
    if(document.getElementById("time-date").selectedIndex == 0 && document.getElementById("time-hours").selectedIndex == 0) {
        minuts = getMinDate().getMinutes();
    }

    let elem_min = document.getElementById("time-mins");
    for (elem_min.innerHTML = ""; minuts <= 55; minuts += 5) {
        appendSelectElem(elem_min, minuts, false);
    } 
}

function fillTime() {
    console.log("fillTime");
    let hours = 0;
    if(document.getElementById("time-date").selectedIndex == 0) {
        hours = getMinDate().getHours();
    }
    console.log(hours);

    let elem_hours = document.getElementById("time-hours");
    for (elem_hours.innerHTML = ""; hours <= 23; hours++) {
        appendSelectElem(elem_hours, hours, false);
    }

    fillMinutes();
}

let errorColor = "#FAF75A";

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

String.prototype.insertAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index);
}

function checkName() {
    let name = document.getElementById("order-name");
    if (name.value.length < 2) {
        return "";
    }
    return name.value;
}

function checkPhone() {
    let phone = document.getElementById("order-phone");
    let phone_val = phone.value;

    console.log(phone_val);

    for(let i = 0; i < phone_val.length; i++) {
        if(isNaN(phone_val[i])) {
            phone_val = phone_val.replaceAt(i, ' ')
        }
    }
    phone_val = phone_val.replace(/\s+/g, '').trim();

    console.log(phone_val);


    if (phone_val.length != 10) {
        return "";
    } 
    return phone_val;
}

function checkCaptcha() {
    let elem = document.getElementById("captcha");
    if (elem.value.length != 4) {
        return "";
    } 
    return elem.value;
}

function checkGrat() {
    let elem = document.getElementById("order-gratuity");
    let value = elem.value;
    if (value == "") {
        return "0";
    } 
    if (!/^\d+$/.test(value) || value < 0 || value > 65535) {
        return "";
    } 

    return value;
}

function checkOrgLogin() {
    let flag = true;
    if (!document.getElementById("is_anon_org_login").checked) {
        let elem = document.getElementById("orglogin");
        if(elem.value.length < 3) {
            elem.style.backgroundColor = errorColor;
            flag = false;
        }
        else {
            elem.style.backgroundColor = "#FFFFFF";
        }

        elem = document.getElementById("orgpwd");

        if(elem.value.length < 1) {
            elem.style.backgroundColor = errorColor;
            flag = false;
        }
        else {
            elem.style.backgroundColor = "#FFFFFF";
        }
    }
    return flag;
}

function wrongClientLogin() {
    clientLogout();
    alert("Ошибка: требуется повторный вход");
    window.location = "/index.php?act=client_login"
}

// No Use
function showAdditionalFields() {
    /*showElem("order-phone");
    showElem("order-name");
    showElem("order-addinfo-curr");
    showElem("order-phone-plus")*/
}

// No Use
function hideAdditionalFields() {/*hideElem("order-phone");hideElem("order-name");hideElem("order-addinfo-curr");hideElem("order-phone-plus")*/
}

// No Use
function showHideAdditionalFields() {
    console.log("showHideAdditionalFields");
    console.log(_isCurrOrder);
    if(!_isCurrOrder || _ctype <= 0) {
        if(!_isCurrOrder ) { showAdditionalFields(); }
        else { hideAdditionalFields(); }
    }
}

let MIN_ADV_ORDER_TIME_DELTA = minToMillis(15);

function advOrderSubmit() {
    let milles;
    switch ($("input:radio[name=when]:checked").val()) {
        case "when-quarter":
            milles = minToMillis(15);
            break;
        case "when-half":
            milles = minToMillis(30);
            break;
        case "when-time":
            let days = document.getElementById("time-date").selectedIndex;
            let hours_elem = document.getElementById("time-hours");
            let hourse = hours_elem.options[hours_elem.selectedIndex].value;
            let minuts_elem = document.getElementById("time-mins");
            let minuts = minuts_elem.options[minuts_elem.selectedIndex].value;
            let date = new Date;
            date.setHours(0);
            date.setMinutes(0);

            milles = (new Date(date.getTime() + minToMillis(24 * 60 * days) + minToMillis(60 * hourse) + minToMillis(minuts))).getTime() - (new Date).getTime();

            if(milles < MIN_ADV_ORDER_TIME_DELTA) { milles = MIN_ADV_ORDER_TIME_DELTA; }
    }

    let grat = checkGrat();
    let captcha = "";
    let get_param = "";

    if (_ctype == 0) {
        captcha = checkCaptcha();
        if (captcha == "") { return; } 
        get_param = "&PHPSESSID=" + sessionId + "&captcha_txt=" + captcha;
        console.log(get_param);
    }

    if(grat != "") {
        _originMarker.getPosition();
        position = _destinationMarker.getPosition();
        let phone = "38" + checkPhone();
        makeQuery(getQueryHead(1) + get_param + "&Blat=" + position.lat() + "&Blng=" + position.lng() + 
                "&grat=" + grat + "&phone=" + phone + "&timeD=" + milles + "&name=" + document.getElementById("order-name").value + "&info=" +
                document.getElementById("order-comment-adv").value);
    }    
}

function advOrderSubmitJson() {
    let order = {
        'search-from': $('#search-from').val(),
        'search-to': $('#search-to').val(),
        'time-date': $('#time-date').val(),
        'time-hours': $('#time-hours').val(),
        'time-mins': $('#time-mins').val(),
        'what-auto': $('input:radio[name=what] :selected').val(),
        'order-phone': $('#order-phone').val(),
        'order-name': $('#order-name').val(),
        'order-comment-adv': $('#order-comment-adv').val()
    }

    let milles;
    switch ($("input:radio[name=when]:checked").val()) {
        case "when-quarter":
            milles = minToMillis(15);
            break;
        case "when-half":
            milles = minToMillis(30);
            break;
        case "when-time":
            let days = document.getElementById("time-date").selectedIndex;
            let hours_elem = document.getElementById("time-hours");
            let hourse = hours_elem.options[hours_elem.selectedIndex].value;
            let minuts_elem = document.getElementById("time-mins");
            let minuts = minuts_elem.options[minuts_elem.selectedIndex].value;
            let date = new Date;
            date.setHours(0);
            date.setMinutes(0);

            milles = (new Date(date.getTime() + minToMillis(24 * 60 * days) + minToMillis(60 * hourse) + minToMillis(minuts))).getTime() - (new Date).getTime();

            if(milles < MIN_ADV_ORDER_TIME_DELTA) { milles = MIN_ADV_ORDER_TIME_DELTA; }
    }

    let grat = checkGrat();
    let captcha = "";
    let get_param = "";

    if (_ctype == 0) {
        captcha = checkCaptcha();
        if (captcha == "") { return; } 
        get_param = "&PHPSESSID=" + sessionId + "&captcha_txt=" + captcha;
    }

    if(grat != "") {
        _originMarker.getPosition();
        position = _destinationMarker.getPosition();
        makeQueryJson(getQueryHead(1) + get_param + "&Blat=" + position.lat() + "&Blng=" + position.lng() + 
                "&grat=" + grat + "&phone=" + document.getElementById("order-phone").value + "&timeD=" + milles + "&name=" + document.getElementById("order-name").value + "&info=" +
                document.getElementById("order-comment-adv").value, order);
    }     
    
}

function makeQueryJson(url, order) {
    $.ajax({
        type: "POST",
        url: url + "&id=" + (new Date).getTime(),
        data: {'': JSON.stringify(order)},
        success: function (data) {
            eval(data);
            advOrderOK();
        },
    });
}

function generatePHPSessionId(len, str) {
    let session_id = "";
    while (0 < len) {
        --len;
        let random_index = Math.round(Math.random() * (str.length - 1));
        session_id += str[random_index];
    }
    return session_id;
}

let sessionId;

function refreshCaptcha() {
    sessionId = generatePHPSessionId(26, "0123456789abcdefghijklmnopqrstuvwxyz");
    document.getElementById("captchaImg").src = "captcha.php?PHPSESSID=" + sessionId;
    document.getElementById("captcha").value = "";
}

function wrongCaptcha() {
    console.log("wrongCaptcha");
    $("#captcha").parent('.input-wrap').addClass('input-wrap_error');
}

function advOrderOK() {
    showMsg("Спасибо, Ваш заказ принят", "Водитель, который возьмет Ваш заказ, перезвонит Вам.");
}

function formProceed(one_elem, two_elem) {
    one_elem.fadeOut(100, function () {
        two_elem.delay(80).fadeIn(100, function () {
            //adaptSidebar();
        })
    })
}

function clientLogout() {
    setCookie("ctype=0");
    setCookie("cid=0");
    setCookie("_ctoken=''");
    _cid = 0;
    _ctype = 0;
    _ctoken = "";
    changeLoginUI()
}

//Управление кнопками входа выхода, не используеться!
function changeLoginUI() {
    console.log("changeLoginUI");
    if(_ctype === 0) {
        console.log("==0");
        document.getElementById("loginMenuCaption").innerHTML = '<i class="ico-vt-login"></i> Войти';
        document.getElementById("order_login_logout").innerHTML = "<a href='/index.php?act=client_login'>Вход для заказа с сайта</a>";
    }
    else {
        let type = "клиент";
        if(_ctype !== 1) { type = "организация"; }

        document.getElementById("loginMenuCaption").innerHTML = '<i class="ico-vt-login"></i> ' + type + " <" + _cid + ">";
        document.getElementById("order_login_logout").innerHTML = '<a href="#" onclick="clientLogout();return false;">Выход</a>';
    }

    showHideAdditionalFields()
}

$(document).ready(function () {/*mobileVersion();*/
    initMap();
    initDirections();
    initCircle();
    _markersKML = new google.maps.KmlLayer("http://vtaxi.info/srv/d.kmz?" + _ver, {preserveViewport: true});
    _markersKML.setMap(_map);
    console.log(_markersKML);
    _geocoder = new google.maps.Geocoder;

    _ctype = getCookie("ctype");
    _cid = getCookie("cid");
    _ctoken = getCookie("ctoken");
    console.log(_ctype);
    console.log(_cid);
    console.log(_ctoken);

    if(_ctype == null) { _ctype = 0; }
    if(_cid == null) { _cid = 0; }    
    if (_ctoken == null) { _ctoken = ""; }

    console.log(_ctype);
    console.log(_cid);
    console.log(_ctoken);

    changeLoginUI();
    setDrvType(0);

    $(".online").text(_drvNum);

    initMarkers();
    initComboBox();

    fillTime();

    $(window).resize(function () {
        //adaptHeight()
    });

    $(".geo-btn").click(function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            setCenterAndZoom(position, 17);
            placeMarker(_originMarker, position)
        });
    });

    $(".order-btn-one").click(function () {
        console.log("order-btn-one click");
        if (_originMarker.getMap()) {
            _isMarkerPlacingAllowed = false;
            console.log(_ctype);
            if (_isCurrOrder && 0 < _ctype || !_isCurrOrder) {
                /*let name = checkName();
                let phone = checkPhone();
                console.log(phone);
                console.log(name);
                if (phone == "" || name == "") { console.log("lox"); return; }*/
            }
            console.log(_isCurrOrder);

            if(_isCurrOrder) {
                getNearestDrvrs();
            }
            else {
                if(_ctype == 0) {
                    console.log("captca 0");
                    $(".captcha").removeClass("hidden");
                    refreshCaptcha();
                    $(".info-order").removeClass('hidden');
                    $(".order-btn-one").removeClass('map-footer__btn_active');
                    $(".order-btn-two").addClass('map-footer__btn_active');
                }
                else {
                    $(".captcha").addClass("hidden");
                    document.getElementById("captcha").style.backgroundColor = "#FFFFFF";
                    $(".orderinfo").fadeIn(100, function () {
                        //adaptSidebar();
                    })
                }
            }
           
            //$(this).attr("disabled", true);
            //$(".orglogin").addClass("hidden")
        } 
        else {
            swal("Упсс..", "Для заказа необходимо установить хотя бы Откуда", "error");
        }

    });

    $(".order-next-step").click(function () {
        formProceed($(this).parents(".step"), $(this).parents(".step").next(".step"));
    });

    $("input[name=when]").on("change", function () {
        console.log("when cange");
        let value = $("input:radio[name=when]:checked").val();
        console.log(value);
        if(value === "when-now") { _isCurrOrder = true; }
        else { _isCurrOrder = false; }
        
        showHideAdditionalFields();

        if(value === "when-time") {
            $(".search-time").slideDown(100, function () {
                fillTime();
                //adaptSidebar()
            })
        }
        else {
            $(".search-time").slideUp(100, function () {
                //adaptSidebar()
            })
        }

    });

    $(".form-toggle").on("click", function () {
        $(this).parents(".form-collapse").find(".form-group").slideDown(100,
            function () {
                //adaptSidebar()
            });
        $(this).addClass("hidden")
    });

    $(".showvideo").on("click", function () {
        $(".fullpage").after($('<div class="videopopup" style="display:none;"><div id="ytplayer"><button class="arrow_backward hidden" onclick="changeSlide(-1);"></button><img width="853" height="480" id="manual" src="img/client/site/step1.png" onclick="changeSlide(1);"><button class="arrow_forward" onclick="changeSlide(1);"></button></div><span class="plink white close" title="Закрыть">&times;</span></div>'));
        popup = $(".videopopup");
        popup.fadeIn(200);
        $(".close").on("click", function () {
            popup.remove();
            _currentSlide = 1
        });
        $(document).on("keydown", function (event) {
            if(event.keyCode === 27) {
                popup.remove();
                _currentSlide = 1;
            }
        })
    });

    if($("html.ie").length != 0) {
        $(".switch input:checked").each(function () {
            $(this).addClass("chkd");
        });
        
        $(".switch input:radio").on("change", function () {
            $(this).parent(".switch").find("input:not(:checked)").removeClass("chkd");
            $(this).addClass("chkd");
        });
    }

    // Услуги
    $('.select-area').on('click', function () {
        if($('#search-from').val().length < 1){
            alert('Сначала укажите адрес.');
            return false;
        }
        $('.search-from').hide();
        $('.select-area').hide();
        $('.map-area').hide();
        $('.services-droplist').show();
        $('.switcher .m_btn_back').show();
    })

    $('.switcher .m_btn_back').on('click', function () {
        if($('.back-btn').hasClass('step1')){
            $('.map-area').show();
            $('.services-droplist').hide();
            $('.switcher .m_btn_back').hide();
            $('.search-from').show();
            $('.select-area').show();
        } 
        else {
            $('.back-btn').trigger('click');
        }
    });

    $('.map__screan-btn').on('click', function () {
        $('.gm-fullscreen-control').trigger('click');
    });
});

let _currentSlide = 1, _lowerBound = 1, _upperBound = 4;

function changeSlide(step) {
    let slide_index = _currentSlide + step;
    if(a <= _upperBound && a >= _lowerBound) {
        if(slide_index == _lowerBound) {
            $(".arrow_backward").addClass("hidden");
        }
        else {
            $(".arrow_backward").removeClass("hidden");
            if(slide_index == _upperBound) {
                $(".arrow_forward").addClass("hidden");
            }
            else {
                $(".arrow_forward").removeClass("hidden");
                _currentSlide = slide_index;
                document.getElementById("manual").src = "images/client/site/step" + _currentSlide + ".png";
            }
        }
    }
}

function showChat() { 
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "//code.jivosite.com/script/widget/54034";
    let ntx_script = document.getElementsByTagName("script")[0];
    ntx_script.parentNode.insertBefore(script, ntx_script)
}

function orderInfoOK() {
    swal("Успех", "Информация о заказе успешно отправлена водителю.", "success");
    hideElem("sendinfo")
}

function orderInfoDrvIsBusy() {
    swal("Упсс..", "Извините, этот водитель уже принял заказ. Пожалуйста, сделайте выбор из списка свободных водителей.", "error");
    backToDrvrsList();
    sleep(300, getNearestDrvrs)
}

function sleep(time, fun) {
    setTimeout(function () {
        fun()
    }, time)
};

(function () {

     $('.map__plus-btn').click(function(e) {
        e.stopPropagation();
        
        let oldZoom = _map.getZoom();
        _map.setZoom(oldZoom + 1)
    });  

    $('.map__minus-btn').click(function(e) {
        e.stopPropagation();
        
        let oldZoom = _map.getZoom();
        _map.setZoom(oldZoom - 1)
    });  

}());
