define(function() {
    return function(json) {
        var tag = json.element.children(),
            path = json.path == 'x' ? 'marginLeft' : 'marginTop',
            offset = path == 'marginLeft' ? -tag.eq(0).outerWidth() : -tag.eq(0).outerHeight(),
            fn = null,
            n = 0,
            isMove = false,
            delay = json.delay || 3000,
            data = {};
        json.element.hover(c, auto).html(json.element.html() + json.element.html());

        function auto() {
            fn = setTimeout(function() {
                n++;
                m(n);
            }, delay);
            if (json.tip) {
                json.tip.removeClass('on').eq(n >= tag.length ? n - tag.length : n).addClass('on');
            }
        }

        function m() {
            c();
            isMove = true;
            if (n < 0) {
                json.element.css(path, tag.length * offset);
                n = tag.length - 1;
            }
            data[path] = n * offset;
            json.element.animate(data, function() {
                isMove = false;
                if (n > tag.length) {
                    json.element.css(path, offset);
                    n = 1;
                }
            });
            auto();
        };

        function c() {
            clearTimeout(fn);
            fn = null;
        };

        function add(s) {
            if (!isMove) {
                s ? n++ : n--;
                m(n);
            }
        };
        json.right && json.right.click(function(e) {
            e.preventDefault();
            add(1);
        });

        json.left && json.left.click(function(e) {
            e.preventDefault();
            add();
        });

        json.tip && json.tip.click(function() {
            n = $(this).index();
            m();
        });
        return auto();
    }
});
