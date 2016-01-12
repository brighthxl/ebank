

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
    var list = $('#list')
    var tpl = list.find('script').html()

    function render(arr) {
        if (arr.length) {
            //list.html(tmpl(tpl, arr))
        }
    }

    function loadContent() {
        $.ajax({
            url: 'http://m.jindanlicai.com/Share_news/get_news_list',
            dataType: 'jsonp',
            timeout: 15000,
            data: {
                limit: 10,
                offset: 0
            },
            success: function(result) {
                render(result.list)
            },
            complete: function(request, stauts) {
                if (stauts == 'timeout') {
                    console.log('网络超时，请重新操作')
                }
            },
            error: function(request, stauts) {
                if (stauts == 'error') {
                    console.log('请求错误，请检查网络')
                }
            }
        })
    }

    loadContent()
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
