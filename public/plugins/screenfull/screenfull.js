!function() {
    "use strict";

    var ui_fullscreen = $( "[ui-fullscreen]" );
    var expand = ui_fullscreen.children('#expand');
    var compress = ui_fullscreen.children('#compress');

    //.removeClass('');
    //.addClass('');

    var e = "undefined" != typeof module && module.exports
      , n = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT"in Element
      , l = function() {

        for (var e, n, l = 
            [
                ["requestFullscreen"        , "exitFullscreen"          , "fullscreenElement"               , "fullscreenEnabled"       , "fullscreenchange"        , "fullscreenerror"], 
                ["webkitRequestFullscreen"  , "webkitExitFullscreen"    , "webkitFullscreenElement"         , "webkitFullscreenEnabled" , "webkitfullscreenchange"  , "webkitfullscreenerror"], 
                ["webkitRequestFullScreen"  , "webkitCancelFullScreen"  , "webkitCurrentFullScreenElement"  , "webkitCancelFullScreen"  , "webkitfullscreenchange"  , "webkitfullscreenerror"], 
                ["mozRequestFullScreen"     , "mozCancelFullScreen"     , "mozFullScreenElement"            , "mozFullScreenEnabled"    , "mozfullscreenchange"     , "mozfullscreenerror"], 
                ["msRequestFullscreen"      , "msExitFullscreen"        , "msFullscreenElement"             , "msFullscreenEnabled"     , "MSFullscreenChange"      , "MSFullscreenError"]
            ], r = 0, t = l.length, u = {}; t > r; r++)

            if ((e = l[r]) && e[1]in document) {
                for (r = 0, n = e.length; n > r; r++)
                    u[l[0][r]] = e[r];
                return u
            }
        return !1
    }()
      , r = {
        request: function(e) {
            var r = l.requestFullscreen;
            e = e || document.documentElement,
            /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? e[r]() : e[r](Element.ALLOW_KEYBOARD_INPUT)
        },
        exit: function() {
            document[l.exitFullscreen]()
        },
        toggle: function(e) {
            this.isFullscreen ? this.exit() : this.request(e)
        },
        onchange: function() {
            if (this.isFullscreen) {
                expand.addClass('text-active');
                compress.removeClass('text-active');
            } else {
                compress.addClass('text-active');
                expand.removeClass('text-active');
            }
        },
        onerror: function() {},
        raw: l
    };
    l ? (Object.defineProperties(r, {
        isFullscreen: {
            get: function() {
                return !!document[l.fullscreenElement]
            }
        },
        element: {
            enumerable: !0,
            get: function() {
                return document[l.fullscreenElement]
            }
        },
        enabled: {
            enumerable: !0,
            get: function() {
                return !!document[l.fullscreenEnabled]
            }
        }
    }),
    document.addEventListener(l.fullscreenchange, function(e) {
        r.onchange.call(r, e)
    }),
    document.addEventListener(l.fullscreenerror, function(e) {
        r.onerror.call(r, e)
    }),
    e ? module.exports = r : window.screenfull = r) : e ? module.exports = !1 : window.screenfull = !1

    ui_fullscreen.click(function() {
      r.toggle();
    });

}();