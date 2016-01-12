//import('lib/jquery.min.js')
var define = define || function() {
    if (typeof(arguments[0]) == 'function') {
        return arguments[0]()
    } else {
        return function() {

        }
    }
}
var loginType = loginType || 0
var layer = EB_GET('lib/layer.js')
var tmpl = EB_GET('lib/tmpl.js')

! function() {
    var ele = $('#J_login')
    var show = false

    function login(self) {
        if (loginType) {
            var _this = $(self)
            if (show) {
                _this.removeClass('on')
                show = false
                ele.slideUp(function() {
                    ele.removeAttr('style')
                })
            } else {
                var pos = _this.offset()
                _this.addClass('on')
                show = true
                ele.css({
                    left: pos.left - 150,
                    top: pos.top + _this.outerHeight(),
                    position: 'absolute',
                    zIndex: '10'
                }).slideDown();
            }
        } else {
            layer(ele.show())
        }
    }

    ele.on('keyup', 'input', function(event) {
        //event.preventDefault();
        var _this = $(this)
        var _next = _this.next()
        if ($.trim(_this.val())) {
            _next.hide()
        } else {
            _next.show()
        }
    })

    window['login'] = login
}()
