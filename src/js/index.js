var movehtml = EB_GET('lib/movehtml.js')
var countUp = EB_GET('lib/countUp.js')

! function() {
    function focuImg(json) {
        var tip = json.tip,
            img = json.elements,
            cur,
            isdoing = false,
            fn = null;

        ! function() {
            var str = ''
            for (var i = 0; i < img.length; i++) {
                str += i ? '<span></span>' : '<span class="on"></span>'
            }
            tip.append(str)
            tip = tip.children()
        }()

        function _move(n) {
            if (n == cur || isdoing) return;
            isdoing = true;
            tip.eq(cur).removeClass('on');
            tip.eq(n).addClass('on');
            img.eq(cur).css({
                'z-index': 2
            });
            var tmp = img.eq(n);
            img.eq(n).css({
                'opacity': 0,
                'z-index': 3,
                'background': tmp.attr('background')
            }).animate({
                    'opacity': 1
                }, 600,
                function() {
                    img.eq(cur).css({
                        'z-index': 0
                    });
                    cur = n;
                    isdoing = false;
                    fn = setTimeout(function() {
                            add(1);
                        },
                        5000)
                })
        }
        tip.mouseover(function() {
            clearTimeout(fn);
            _move($(this).index())
        });

        function add(s) {
            if (!isdoing) {
                clearTimeout(fn);
                var newN = cur;
                s ? newN++ : newN--;
                (newN == tip.length) && (newN = 0);
                0 > newN && (newN = tip.length - 1);
                _move(newN);
            }
        }

        json.right && json.right.click(function(event) {
            event.preventDefault();
            add(1);
        });
        json.left && json.left.click(function(event) {
            event.preventDefault();
            add();
        });
        _move(0)
    }

    focuImg({
        elements: $('#foc').children(),
        tip: $('#arw')
    })
}()



! function() {
    var e_title = $('#fifth_title').find('li')
    var e_content = $('#fifth_content').find('div')

    e_title.click(function(event) {
        var index = $(this).index()
        e_title.removeClass('on').eq(index).addClass('on')
        e_content.addClass('none').eq(index).removeClass('none')
    });

}()

movehtml({
    element: $("#note")
})

! function() {
    var elements = $(".J_number");
    var timer = null
    var win = $(window)

    function load() {
        clearTimeout(timer)
        timer = setTimeout(function() {
            var top = win.scrollTop()
            var height = win.height()
            elements.each(function(index, el) {
                var _this = $(this)
                if (top + height > _this.offset().top) {
                    var _tmp = _this.prev().children()
                    var _strong = _this.find('strong')
                    _tmp.css({
                        width: _tmp.data('width')
                    })
                    if (_strong.data('num')) {
                        (new CountUp(_strong[0], 0, _strong.data('num'), 0, 2.5)).start()
                        _strong.removeData('num')
                        _strong.data('num', 0)
                    }
                }
            });
        }, 100)

    }
    win.scroll(load).resize(load)
    load()
}()

! function() {
    var elements = $('#J_progress')
    var span = elements.find('span')
    var num = elements.data('num')
    var _step = 0
    var time = time || 2000
    var timeOut = null
    var base = Math.floor(time / num);
    (new CountUp(span[0], 0, num, 0, 2.5)).start()

    function easeOutExpo(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    }

    function count() {
        _step++
        if (num >= _step) {
            timeOut = setTimeout(function() {
                elements[0].className = "cRed em" + Math.floor(_step / 5)
                count()
            }, easeOutExpo(_step, 0, base, 100))
        } else {
            clearTimeout(timeOut)
        }
    }
    count()
}()
