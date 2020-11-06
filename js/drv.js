var _map, _drvtype = 0, _isPOI = null, _geocoder, _originMarker, _destinationMarker, _wayPointMarker1, _wayPointMarker2,
    _tripDistance = 0, _directionsRenderer, _directionsService, _isMarkerPlacingAllowed = !0, _nearestMrkrs = [],
    _drvrs = null, _circle, _markersKML, _ctype = 0, _cid = 0, _ctoken = "", _isCurrOrder = !0,

    icons = {
        origin: new google.maps.MarkerImage("img/markers/start.png"),
        waypoint: new google.maps.MarkerImage("img/markers/stop.png"),
        destination: new google.maps.MarkerImage("img/markers/finish.png"),
        circle: {
            anchor: new google.maps.Point(36,
                36), url: "img/markers/circle.png"
        },
        car: [{
            anchor: new google.maps.Point(28, 22),
            url: "img/markers/vehicles/OnC-e.png"
        }, {
            anchor: new google.maps.Point(28, 22),
            url: "img/markers/vehicles/OnC-c.png"
        }, {anchor: new google.maps.Point(28, 22), url: "img/markers/vehicles/OnC-v.png"}],
        mbus: {anchor: new google.maps.Point(28, 18), url: "img/markers/vehicles/OnMBig.png"},
        truck: {anchor: new google.maps.Point(28, 18), url: "img/markers/vehicles/OnTBig.png"},
        emerg: {anchor: new google.maps.Point(30, 22), url: "img/markers/vehicles/OnEBig.png"}
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
    }, _categories = ["эконом", "комфорт", "бизнес"],
    _vanTypes = "Седан Пикап Хэтчбек Универсал Купе Фургон Лимузин Кабриолет Кроссовер Минивэн".split(" "),
    _fareLabels = "Минимальный заказ;Последующие (за км);Почасовая оплата;За городом (за км);Минута ожидания;Стоимость подачи;Загрузка салона;Детское кресло;Перевозка животных;Услуга Драйвер;Курьерские услуги;Трансфер;Speak English;Фаркоп;Эвакуация;Буксировка;Доставка бензина;Замена колеса;Прикуривание;Открытие замков".split(";");

function fillDrvrsList() {
    clearNearestMrkrs();
    _nearestMrkrs = Array(_drvrs.length);
    var a = "";
    for (i = 0; i < _drvrs.length; i++) {
        var a = a + ("<li><span class='plink order-next-step' onclick=\"showDrvr('" + i + "');\">"),
            b = _drvrs[i][DICodes.FARES].split("@"), c;
        0 < _tripDistance && 2 != _drvtype ? (MIN_order_dst = b[5], c = parseFloat(b[0]), _tripDistance > MIN_order_dst && (c += (_tripDistance - MIN_order_dst) * parseFloat(b[1])), c = c.toFixed(2)) : c = "";
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
                MarkerIco = icons.emerg
        }
        DrvInfo =
            '<span class="plink backlink" onclick="backToDrvrsList()">&larr; <u>Ближайшие свободные такси</u> (' + _drvrs.length + ")</span>";
        0 < _ctype && (DrvInfo += '<div id="sendinfo" class="sendinfo pull-right"><a class="btn" onclick="currOrderRequest();">Отправить</a></div>');
        DrvInfo += '<div class="driver-car"><span class="license pull-right">' + _drvrs[i][DICodes.LICENSE_PLATE] + '</span><strong class="h3">' + Model + "</strong>";
        void 0 != Category && (DrvInfo += '<i class="dotdivider text-gray"></i><small>' + _categories[Category] +
            "-класс</small>");
        DrvInfo += '<p class="text-gray">' + (void 0 == _drvrs[i][DICodes.VAN_TYPE] ? "" : _vanTypes[_drvrs[i][DICodes.VAN_TYPE]] + ", ") + "цвет: " + _drvrs[i][DICodes.COLOR] + "</p>";
        var d = "";
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
        for (var f in boolOpts) void 0 != _drvrs[i][f] && (DrvInfo += "<li>" + boolOpts[f] + "</li>");
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

var _currDrvId, _currPrice;

function showDrvr(a) {
    _currDrvId = _drvrs[a][DICodes.DRIVER_ID];
    a = _nearestMrkrs[a];
    _currPrice = a.price;
    document.getElementById("driverinfo").innerHTML = a.drvInfo;
    null == _circle.getMap() && _circle.setMap(_map);
    _circle.setPosition(a.getPosition());
    formProceed($(".nearest"), $(".nearest").next(".step"))
}

function createMarker(a, b, c, d, f, g) {
    return new google.maps.Marker({
        position: b,
        icon: c,
        clickable: !0,
        map: _map,
        title: d,
        markerIndex: a,
        drvInfo: f,
        price: g
    })
}

function showMsg(a, b) {
    document.getElementById("orderstatus").innerHTML = "<h3>" + a + "</h3><p>" + b + '</p><span class="plink back-mainform" onclick="backToFirstStep()"><u>Закрыть</u></span>';
    formProceed($("#order .step:visible"), $(".orderstatus"))
}

function showDrvrs(a) {
    clearNearestMrkrs();
    null == a ? showMsg("Сообщение", _outside_zones) : (a = eval(a), 0 == a.length ? showMsg("Сообщение", _no_free_drvrs) : (_drvrs = a, _markersKML.setMap(null), setCenterAndZoom(_originMarker.getPosition(), 13), fillDrvrsList(), formProceed($(".taxisearch"), $(".taxisearch").next(".step"))))
}

function clearNearestMrkrs() {
    for (i = 0; i < _nearestMrkrs.length; i++) _nearestMrkrs[i].setMap(null)
}

function initCircle() {
    _circle = new google.maps.Marker({icon: icons.circle, clickable: !1})
}

function backToDrvrsList() {
    _circle.setMap(null);
    formProceed($(".driver"), $(".driver").prev(".step"))
}

function setMapToMarker(a, b) {
    0 != a.getPosition().lat() && a.setMap(b)
}

function setMapToDirMarkers(a) {
    setMapToMarker(_originMarker, a);
    setMapToMarker(_destinationMarker, a);
    setMapToMarker(_wayPointMarker1, a);
    setMapToMarker(_wayPointMarker2, a)
}

function backToFirstStep() {
    _directionsRenderer.setMap(null);
    _markersKML.setMap(_map);
    setMapToDirMarkers(_map);
    _isMarkerPlacingAllowed = !0;
    clearNearestMrkrs();
    $(".order-form1").attr("disabled", !1);
    formProceed($("#order .step:visible"), $(".taxisearch"))
}

function makeQuery(a) {
    var b = document.createElement("script");
    b.setAttribute("type", "text/javascript");
    b.setAttribute("src", a + "&id=" + (new Date).getTime());
    a = document.getElementsByTagName("head").item(0);
    a.insertBefore(b, a.firstChild)
}

function getQueryHead(a) {
    var b = _originMarker.getPosition();
    return "/srv/ops.php?op=" + a + "&ctype=" + _ctype + "&cid=" + _cid + "&ctoken=" + _ctoken + "&Alat=" + b.lat() + "&Alng=" + b.lng() + "&vehtype=" + _drvtype
}

function getNearestDrvrs() {
    if (0 != _tripDistance || 0 == _destinationMarker.getPosition().lat() || calcRoute()) _drvrs = null, makeQuery(getQueryHead(0))
}

function currOrderRequest() {
    var a = _destinationMarker.getPosition();
    makeQuery(getQueryHead(2) + "&Blat=" + a.lat() + "&Blng=" + a.lng() + "&drvId=" + encodeURIComponent(_currDrvId) + "&phone=" + document.getElementById("order-phone").value + "&name=" + document.getElementById("order-name").value + "&info=" + document.getElementById("order-comment-curr").value + "&distance=" + (10 * _tripDistance).toFixed(0) + "&price=" + _currPrice)
}

function computeTotalDistance(a) {
    var b = 0;
    a = a.routes[0];
    for (i = 0; i < a.legs.length; i++) b += a.legs[i].distance.value;
    return b / 1E3
}

function mobileVersion() {
    var a = navigator.userAgent.toLowerCase(), b = document.referrer.toLowerCase();
    -1 != a.indexOf("android") && -1 == b.indexOf("/index.html") ? window.location = "/progs/android.html" : -1 != a.indexOf("windows phone") && -1 == b.indexOf("/progs/winphone.html") ? window.location = "/progs/winphone.html" : -1 == a.indexOf("iphone") && -1 == a.indexOf("ipod") && -1 == a.indexOf("ipad") || -1 != b.indexOf("/progs/ios.html") || (window.location = "/progs/ios.html")
}

function initDirections() {
    _directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: !1, draggable: !1});
    _directionsService = new google.maps.DirectionsService;
    google.maps.event.addListener(_directionsRenderer, "directions_changed", function () {
        _tripDistance = computeTotalDistance(_directionsRenderer.directions);
        null != _drvrs && fillDrvrsList()
    })
}

function addWaypointMarker(a, b) {
    0 != b.getPosition().lat() && a.push({location: b.getPosition(), stopover: !0})
}

function calcRoute() {
    var a = [];
    addWaypointMarker(a, _wayPointMarker1);
    addWaypointMarker(a, _wayPointMarker2);
    a = {
        origin: _originMarker.getPosition(),
        destination: _destinationMarker.getPosition(),
        waypoints: a,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: !1
    };
    _directionsService.route(a, function (a, c) {
        switch (c) {
            case google.maps.DirectionsStatus.OK:
                _directionsRenderer.setDirections(a);
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
                alert("Неожиданный код ошибки: " + c)
        }
    });
    return !0
}

function initMarkers() {
    _originMarker = createDirMarker(icons.origin, "Откуда ехать", "search-from");
    _destinationMarker = createDirMarker(icons.destination, "Конечная точка", "search-to");
    _wayPointMarker1 = createDirMarker(icons.waypoint, "Остановка", "search-waypoint1");
    _wayPointMarker2 = createDirMarker(icons.waypoint, "Остановка", "search-waypoint2");
    setActiveMarker(0);
    getClientLocation();
    google.maps.event.addListener(_map, "click", function (a) {
        null != _activeMarker && _isMarkerPlacingAllowed && placeMarker(_activeMarker,
            a.latLng)
    })
}

var _activeMarker = null;

function setActiveMarker(a) {
    switch (a) {
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
    null == _isPOI ? navigator.geolocation && navigator.geolocation.getCurrentPosition(function (a) {
        a = new google.maps.LatLng(a.coords.latitude, a.coords.longitude);
        setCenterAndZoom(a, 17);
        placeMarker(_originMarker, a)
    }) : placeMarker(_originMarker, _map.getCenter())
}

function createDirMarker(a, b, c) {
    c = document.getElementById(c);
    var d = new google.maps.Marker({
        position: new google.maps.LatLng(0, 0),
        icon: a,
        draggable: !0,
        map: null,
        animation: google.maps.Animation.DROP,
        title: b,
        autoCompl: c
    });
    google.maps.event.addListener(d, "dragend", function (a) {
        placeMarker(d, d.getPosition())
    });
    var f = new google.maps.places.Autocomplete(c);
    f.setTypes(["geocode"]);
    google.maps.event.addListener(f, "place_changed", function () {
        var a = f.getPlace();
        null != a.geometry && (setCenterAndZoom(a.geometry.location,
            16), placeMarker(d, a.geometry.location))
    });
    return d
}

function placeMarker(a, b) {
    _tripDistance = 0;
    a.setPosition(b);
    renewAddress(a);
    a != _originMarker || a.getMap() || showElemInline("save_POI")
}

function renewAddress(a) {
    _geocoder.geocode({latLng: a.getPosition()}, function (b, c) {
        var num = '';
        var str = '';
        var ct = '';
        var len = b[0].address_components.length;
        for(var i=0; i < len; i++){
            if(b[0].address_components[i].types[0] == "street_number")
                num = b[0].address_components[i].long_name;
            if(b[0].address_components[i].types[0] == "route")
                str = b[0].address_components[i].long_name;
            if(b[0].address_components[i].types[0] == "locality")
                ct = b[0].address_components[i].long_name
        }
        var add = ct +", " + str + ", " + num
        c == google.maps.GeocoderStatus.OK && (null == a.getMap() && a.setMap(_map), a.autoCompl.value = add)
    })
}

function showElemInline(a) {
    document.getElementById(a).style.display = "inline"
}

function showElem(a) {
    document.getElementById(a).style.display = ""
}

function hideElem(a) {
    document.getElementById(a).style.display = "none"
}

function savePOI() {
    setCookie("lat=" + _originMarker.getPosition().lat());
    setCookie("lng=" + _originMarker.getPosition().lng());
    setCookie("zoom=" + _map.getZoom());
    setCookie("isPOI=true");
    $(".address-saved").fadeIn(200)
}

function getCookie(a) {
    var b = " " + document.cookie;
    a = " " + a + "=";
    var c = null, d = 0, f = 0;
    0 < b.length && (d = b.indexOf(a), -1 != d && (d += a.length, f = b.indexOf(";", d), -1 == f && (f = b.length), c = unescape(b.substring(d, f))));
    return c
}

function setCookie(a) {
    document.cookie = a + ";path=/; expires=Mon, 01-Jan-2050 00:00:00 GMT"
}

function delCookie(a) {
    document.cookie = a + ";path=/; expires=Mon, 01-Jan-1970 00:00:00 GMT"
}

function setCenterAndZoom(a, b) {
    _map.setCenter(a);
    _map.setZoom(b)
}

function zoomToCity(a, b) {
    setCenterAndZoom(new google.maps.LatLng(b[0], b[1]), b[2]);
    setCookie("name=" + a);
    setCookie("lat=" + b[0]);
    setCookie("lng=" + b[1]);
    setCookie("zoom=" + b[2]);
    delCookie("isPOI=false")
}

function initMap() {
    var a = getCookie("lat"), b = getCookie("lng"), c = getCookie("zoom"), d = getCookie("name");
    _isPOI = getCookie("isPOI");
    if (null == a || null == b || null == c) a = 50.46, b = 30.55, c = 11, d = "Киев";
    null != _isPOI && (d = "сохраненная точка");
    a = Number(a);
    b = Number(b);
    c = Number(c);
    $(".dd-city .dropdown-toggle u").text(d);
    _map = new google.maps.Map(document.getElementById("googlemap"),{
        zoom: c,
        center: new google.maps.LatLng(a, b),
        scaleControl: !0,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.TOP_LEFT
        },
        zoomControl: false,
        zoomControlOptions: {style: google.maps.ZoomControlStyle.LARGE, position: google.maps.ControlPosition.RIGHT_BOTTOM},
        streetViewControl: !1,
        panControl: !1
    } )
    CreateZoomButton(_map)

}
function CreateZoomButton(map) {
    var wrapperBtn = document.createElement('div');
    wrapperBtn.classList.add("app-vertical-item");

    var widgetZoom = document.createElement('div');

    widgetZoom.classList.add("widget-zoom-slider-invisible");
    widgetZoom.classList.add("widget-zoom");

    var btnPlus = document.createElement('button');
    var btnMinus = document.createElement('button');
    var btnPlusIcon = document.createElement('div');
    var btnMinusIcon = document.createElement('div');
    btnPlusIcon.classList.add('widget-zoom-icon');
    btnMinusIcon.classList.add('widget-zoom-icon');
    btnPlus.appendChild(btnPlusIcon);
    btnMinus.appendChild(btnMinusIcon);
    btnPlus.classList.add("widget-zoom-button");
    btnPlus.classList.add("widget-zoom-in");
    btnMinus.classList.add("widget-zoom-button");
    btnMinus.classList.add("widget-zoom-out");
    btnPlus.addEventListener('click', function() {
        let oldZoom = map.getZoom();
        map.setZoom(oldZoom+1)
    });
    btnMinus.addEventListener('click', function() {
        let oldZoom = map.getZoom();
        map.setZoom(oldZoom-1)
    });
    var zoomDelemiter = document.createElement('div');
    zoomDelemiter.classList.add('widget-zoom-button-divider');
    widgetZoom.appendChild(btnMinus);
    widgetZoom.appendChild(zoomDelemiter);
    widgetZoom.appendChild(btnPlus);
    wrapperBtn.appendChild(widgetZoom);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(wrapperBtn);
}

function initComboBox() {
    $(".dd-city .dropdown-toggle").click(function () {
        $(this).next().removeClass("hidden");
        $(this).next().find("#city").val("").focus()
    });
    $("#city").autocomplete({
        lookup: _cities,
        minChars: 0,
        appendTo: $(".dd-city .dropdown-menu"),
        onSelect: function (a) {
            zoomToCity(a.value, a.data);
            $(".dd-city .dropdown-toggle u").text(a.value);
            $(".dd-city .dropdown-menu").addClass("hidden")
        }
    })
}

function setDrvType(a) {
    _drvtype = a
}

function showWaypoint(a) {
    a.removeClass("hidden");
    a.slideDown(100, function () {
        adaptSidebar()
    })
}

function addWaypoint() {
    var a = $(".search-waypoint1"), b = $(".search-waypoint2");
    a.hasClass("hidden") ? showWaypoint(a) : b.hasClass("hidden") && showWaypoint(b);
    a.hasClass("hidden") || b.hasClass("hidden") || $(".order-addwaypoint").addClass("hidden")
}

function clearMarker(a) {
    _tripDistance = 0;
    a.setMap(null);
    a.setPosition(new google.maps.LatLng(0, 0));
    a.autoCompl.value = ""
}

function delWaypoint(a) {
    $(".search-waypoint" + a).addClass("hidden");
    switch (a) {
        case 1:
            clearMarker(_wayPointMarker1);
            break;
        case 2:
            clearMarker(_wayPointMarker2)
    }
    adaptSidebar();
    $(".order-addwaypoint").removeClass("hidden")
}

function minToMillis(a) {
    return 6E4 * a
}

function getMinDate() {
    var a = (new Date).getTime(), b = (new Date(a + minToMillis(30))).getMinutes() % 5, c = 0;
    0 < b && (c = 5 - b);
    return new Date(a + minToMillis(c + 30))
}

function appendSelectElem(a, b, c) {
    option = document.createElement("option");
    option.setAttribute("value", b);
    c && option.setAttribute("selected", "selected");
    b = "" + b;
    1 == b.length && (b = "0" + b);
    option.appendChild(document.createTextNode(b));
    a.appendChild(option)
}

function fillMinutes() {
    var a = 0;
    0 == document.getElementById("time-date").selectedIndex && 0 == document.getElementById("time-hours").selectedIndex && (a = getMinDate().getMinutes());
    var b = document.getElementById("time-mins");
    for (b.innerHTML = ""; 55 >= a; a += 5) appendSelectElem(b, a, !1)
}

function fillTime() {
    var a = 0;
    0 == document.getElementById("time-date").selectedIndex && (a = getMinDate().getHours());
    var b = document.getElementById("time-hours");
    for (b.innerHTML = ""; 23 >= a; a++) appendSelectElem(b, a, !1);
    fillMinutes()
}

var errorColor = "#FAF75A";

function checkName() {
    var a = document.getElementById("order-name");
    if (2 > a.value.length) return a.style.backgroundColor = errorColor, "";
    a.style.backgroundColor = "#FFFFFF";
    return a.value
}

function checkPhone() {
    var a = document.getElementById("order-phone"), b = a.value;
    if (11 > b.length || !/^\d+$/.test(b)) return a.style.backgroundColor = errorColor, "";
    a.style.backgroundColor = "#FFFFFF";
    return b
}

function checkCaptcha() {
    var a = document.getElementById("captcha");
    if (4 != a.value.length) return a.style.backgroundColor = errorColor, "";
    a.style.backgroundColor = "#FFFFFF";
    return a.value
}

function checkGrat() {
    var a = document.getElementById("order-gratuity"), b = a.value;
    if ("" == b) return a.style.backgroundColor = "#FFFFFF", "0";
    if (!/^\d+$/.test(b) || 0 > b || 65535 < b) return a.style.backgroundColor = errorColor, "";
    a.style.backgroundColor = "#FFFFFF";
    return b
}

function checkOrgLogin() {
    var a = !0;
    if (!document.getElementById("is_anon_org_login").checked) {
        var b = document.getElementById("orglogin");
        3 > b.value.length ? (b.style.backgroundColor = errorColor, a = !1) : b.style.backgroundColor = "#FFFFFF";
        b = document.getElementById("orgpwd");
        1 > b.value.length ? (b.style.backgroundColor = errorColor, a = !1) : b.style.backgroundColor = "#FFFFFF"
    }
    return a
}

function wrongClientLogin() {
    clientLogout();
    alert("Ошибка: требуется повторный вход");
    window.location = "/index.php?act=client_login"
}

function showAdditionalFields() {
    showElem("order-phone");
    showElem("order-name");
    showElem("order-addinfo-curr");
    showElem("order-phone-plus")
}

function hideAdditionalFields() {/*hideElem("order-phone");hideElem("order-name");hideElem("order-addinfo-curr");hideElem("order-phone-plus")*/
}

function showHideAdditionalFields() {
    _isCurrOrder && 0 < _ctype || !_isCurrOrder ? showAdditionalFields() : hideAdditionalFields()
}

var MIN_ADV_ORDER_TIME_DELTA = minToMillis(15);

function advOrderSubmitJson() {
    var order = {
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

    var a;
    switch ($("input:radio[name=when]:checked").val()) {
        case "when-quarter":
            a = minToMillis(15);
            break;
        case "when-half":
            a = minToMillis(30);
            break;
        case "when-time":
            a = document.getElementById("time-date").selectedIndex;
            e = document.getElementById("time-hours");
            var b = e.options[e.selectedIndex].value;
            e = document.getElementById("time-mins");
            var c = e.options[e.selectedIndex].value,
                d = new Date;
            d.setHours(0);
            d.setMinutes(0);
            a = (new Date(d.getTime() + minToMillis(1440 * a) + minToMillis(60 * b) + minToMillis(c))).getTime() -
                (new Date).getTime();
            b = checkGrat();
            a < MIN_ADV_ORDER_TIME_DELTA && (a = MIN_ADV_ORDER_TIME_DELTA)
    }
    b = checkGrat();
    c = c = "";
    if (0 == _ctype) {
        c = checkCaptcha();
        if ("" == c) return;
        c = "&PHPSESSID=" + sessionId + "&captcha_txt=" + c
    }
    "" != b && (_originMarker.getPosition(), d = _destinationMarker.getPosition(), makeQueryJson(getQueryHead(1) + c + "&Blat=" + d.lat() + "&Blng=" + d.lng() +
        "&grat=" + b + "&phone=" + document.getElementById("order-phone").value + "&timeD=" + a + "&name=" + document.getElementById("order-name").value + "&info=" +
        document.getElementById("order-comment-adv").value, order))
}

function makeQueryJson(a, order) {
    $.ajax({
        type: "POST",
        url: a + "&id=" + (new Date).getTime(),
        data: {'': JSON.stringify(order)},
        success: function (data) {
            eval(data);
            advOrderOK();
        },
    });
}

function generatePHPSessionId(a, b) {
    for (var c = "", d = a; 0 < d; --d) c += b[Math.round(Math.random() * (b.length - 1))];
    return c
}

var sessionId;

function refreshCaptcha() {
    sessionId = generatePHPSessionId(26, "0123456789abcdefghijklmnopqrstuvwxyz");
    document.getElementById("captchaImg").src = "captcha.php?PHPSESSID=" + sessionId;
    document.getElementById("captcha").value = ""
}

function wrongCaptcha() {
    document.getElementById("captcha").style.backgroundColor = errorColor
}

function advOrderOK() {
    showMsg("Спасибо, Ваш заказ принят", "Водитель, который возьмет Ваш заказ, перезвонит Вам.")
}

function formProceed(a, b) {
    a.fadeOut(100, function () {
        b.delay(80).fadeIn(100, function () {
            adaptSidebar()
        })
    })
}

function clientLogout() {
    setCookie("ctype=0");
    setCookie("cid=0");
    setCookie("_ctoken=''");
    _cid = _ctype = 0;
    _ctoken = "";
    changeLoginUI()
}

function changeLoginUI() {
    0 == _ctype ? (document.getElementById("loginMenuCaption").innerHTML = '<i class="ico-vt-login"></i> Войти', document.getElementById("order_login_logout").innerHTML = "<a href='/index.php?act=client_login'>Вход для заказа с сайта</a>") : (document.getElementById("loginMenuCaption").innerHTML = '<i class="ico-vt-login"></i> ' + (1 == _ctype ? "клиент" : "организация") + " <" + _cid + ">", document.getElementById("order_login_logout").innerHTML = '<a href="#" onclick="clientLogout();return false;">Выход</a>');
    showHideAdditionalFields()
}

$(document).ready(function () {/*mobileVersion();*/
    initMap();
    initDirections();
    initCircle();
    _markersKML = new google.maps.KmlLayer("http://vtaxi.info/srv/d.kmz?" + _ver, {preserveViewport: !0});
    _markersKML.setMap(_map);
    _geocoder = new google.maps.Geocoder;
    _ctype = getCookie("ctype");
    null == _ctype && (_ctype = 0);
    _cid = getCookie("cid");
    null == _cid && (_cid = 0);
    _ctoken = getCookie("ctoken");
    null == _ctoken && (_ctoken = "");
    changeLoginUI();
    setDrvType(0);
    $(".online b").text(_drvNum);
    initMarkers();
    adaptSidebar();
    adaptHeight();
    $(window).resize(function () {
        adaptHeight()
    });
    $(".order-form1").click(function () {
        if (_originMarker.getMap()) {
            _isMarkerPlacingAllowed = !1;
            if (_isCurrOrder && 0 < _ctype || !_isCurrOrder) {
                var a = checkName();
                if ("" == checkPhone() || "" == a) return
            }
            _isCurrOrder ? getNearestDrvrs() : (0 == _ctype ? ($(".captcha").removeClass("hidden"), refreshCaptcha()) : $(".captcha").addClass("hidden"), document.getElementById("captcha").style.backgroundColor = "#FFFFFF", formProceed($(this).parents(".step"), $(".step.orderinfo")));
            setMapToDirMarkers(null);
            $(this).attr("disabled", !0);
            $(".orglogin").addClass("hidden")
        } else alert("Для заказа необходимо установить хотя бы Откуда")
    });
    $(".order-next-step").click(function () {
        formProceed($(this).parents(".step"), $(this).parents(".step").next(".step"))
    });
    initComboBox();
    $("input[name=when]").on("change", function () {
        var a = $("input:radio[name=when]:checked").val();
        _isCurrOrder = "when-now" === a ? !0 : !1;
        showHideAdditionalFields();
        "when-time" === a ? $(".search-time").slideDown(100, function () {
            fillTime();
            adaptSidebar()
        }) : $(".search-time").slideUp(100, function () {
            adaptSidebar()
        })
    });
    $(".form-toggle").on("click", function () {
        $(this).parents(".form-collapse").find(".form-group").slideDown(100,
            function () {
                adaptSidebar()
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
        $(document).on("keydown", function (a) {
            27 === a.keyCode && (popup.remove(), _currentSlide = 1)
        })
    });
    0 != $("html.ie").length && ($(".switch input:checked").each(function () {
        $(this).addClass("chkd")
    }), $(".switch input:radio").on("change", function () {
        $(this).parent(".switch").find("input:not(:checked)").removeClass("chkd");
        $(this).addClass("chkd")
    }))
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
        }else {
            $('.back-btn').trigger('click')
        }
    });
});


var _currentSlide = 1, _lowerBound = 1, _upperBound = 4;

function changeSlide(a) {
    a = _currentSlide + a;
    a >= _lowerBound && a <= _upperBound && (a == _lowerBound ? $(".arrow_backward").addClass("hidden") : $(".arrow_backward").removeClass("hidden"), a == _upperBound ? $(".arrow_forward").addClass("hidden") : $(".arrow_forward").removeClass("hidden"), _currentSlide = a, document.getElementById("manual").src = "img/client/site/step" + _currentSlide + ".png")
}

function adaptHeight() {
    var a = $(window).height(), b = 220;
    700 > a && (a = 480, b = 0);
    $("#googlemap").css({height: a - b + "px"});
    $("#order").css({"min-height": a - b + "px"})
}

function adaptSidebar() {
    var a = $(".order-out"), b = $(".order-in");
    a.animate({height: b.innerHeight() + "px"}, 100)
}

function showChat() {
    var a = document.createElement("script");
    a.type = "text/javascript";
    a.async = !0;
    a.src = "//code.jivosite.com/script/widget/54034";
    var b = document.getElementsByTagName("script")[0];
    b.parentNode.insertBefore(a, b)
}

function orderInfoOK() {
    alert("Информация о заказе успешно отправлена водителю.");
    hideElem("sendinfo")
}

function orderInfoDrvIsBusy() {
    alert("Извините, этот водитель уже принял заказ. Пожалуйста, сделайте выбор из списка свободных водителей.");
    backToDrvrsList();
    sleep(300, getNearestDrvrs)
}

function sleep(a, b) {
    setTimeout(function () {
        b()
    }, a)
};
