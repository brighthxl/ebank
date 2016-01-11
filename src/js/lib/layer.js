define(function() {
    var style = ".WINBG{height:100%;width:100%;position:fixed;left:0;top:0;z-index:1000;display:none;overflow:hidden;background:transparent;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#0F000000,endColorstr=#0F000000)}.WINBG iframe{height:2000px;width:100%;filter:alpha(opacity=0);opacity:0}.WINBG div{width:100%;height:100%;background:#000;position:absolute;left:0;top:0;z-index:2;filter:alpha(opacity=30);opacity:0.3}.WIN{border:1px solid #666;z-index:1001;box-shadow:0 0 10px rgba(0,0,0,0.5);position:fixed;top:-1000px;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;background:#FFF;overflow:hidden}.WIN iframe{border:0;overflow:hidden;background:#FFF;width:100%;height:100%}"
    var fn, win, winBg, $body, temp
    var isWin = false
    var isOpen = false
    var $win = $(window)
    var size = {}

    function loadStyle(d, a) {
        var b = d.createElement("style")
        b.type = "text/css"
        b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(d.createTextNode(a))
        d.getElementsByTagName("head")[0].appendChild(b)
    }

    function init() {
        isWin = true
        winBg = $('<div class="WINBG"><div></div><iframe src="about:blank"></div>')
        win = $('<div class="WIN">')
        loadStyle(document, style)
        $body = $('body')
        $body.append(winBg).append(win)
        $win.resize(resize)
    }

    function open(txt, closeCallback) {
        if (!isWin) init()
        isOpen = true
        temp = null
        win.html('')
        if (typeof(txt) == "object" || $.trim(txt).match(/\</)) {
            temp = $('<div style="position:absolute;top:-10000px">').append(txt);
            $body.append(temp)
            resize({
                height: temp.height(),
                width: temp.width()
            });
            win.append(temp.removeAttr('style'))
        } else {
            win.append($("<iframe src=" + txt + "></iframe>").load(resize))
        }
        fn = closeCallback ? closeCallback : null
        return temp
    }

    function resize(s) {
        if (!isOpen) return
        size = s && s.height ? s : size
        winBg.show()
        win.css({
            'top': ($win.height() - size.height) / 2,
            'left': ($win.width() - size.width) / 2,
            'width': size.width,
            'height': size.height
        })
    }

    function close() {
        isOpen = false
        win.css('top', -size.height - 20).html('')
        winBg.hide()
        fn && fn()
    }

    function layer(txt, options, callback) {
        if (txt) {
            if (callback) {
                open(txt, callback)
                resize(options)
            } else if (options) {
                if (typeof(options) == 'function') {
                    open(txt, options)
                } else {
                    open(txt)
                    resize(options)
                }
            } else if (typeof(txt) != 'string' && typeof(txt) != 'function' && typeof(txt.height) != 'function') {
                resize(txt)
            } else {
                open(txt)
            }
            return temp
        } else {
            isOpen && close()
        }
    };
    return layer
})
