var movehtml = define(function() {
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

var countUp = (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require, exports, module);
    } else {
        root.CountUp = factory();
    }
}(this, function(require, exports, module) {

    /*

        countUp.js
        (c) 2014-2015 @inorganik
        Licensed under the MIT license.

    */

    // target = id of html element or var of previously selected html element where counting occurs
    // startVal = the value you want to begin at
    // endVal = the value you want to arrive at
    // decimals = number of decimal places, default 0
    // duration = duration of animation in seconds, default 2
    // options = optional object of options (see below)

    var CountUp = function(target, startVal, endVal, decimals, duration, options) {

        // make sure requestAnimationFrame and cancelAnimationFrame are defined
        // polyfill for browsers without native support
        // by Opera engineer Erik Möller
        var lastTime = 0;
        var vendors = ['webkit', 'moz', 'ms', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }

        // default options
        this.options = {
            useEasing: true, // toggle easing
            useGrouping: true, // 1,000,000 vs 1000000
            separator: ',', // character to use as a separator
            decimal: '.' // character to use as a decimal
        };
        // extend default options with passed options object
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                this.options[key] = options[key];
            }
        }
        if (this.options.separator === '') this.options.useGrouping = false;
        if (!this.options.prefix) this.options.prefix = '';
        if (!this.options.suffix) this.options.suffix = '';

        this.d = (typeof target === 'string') ? document.getElementById(target) : target;
        this.startVal = Number(startVal);
        this.endVal = Number(endVal);
        this.countDown = (this.startVal > this.endVal);
        this.frameVal = this.startVal;
        this.decimals = Math.max(0, decimals || 0);
        this.dec = Math.pow(10, this.decimals);
        this.duration = Number(duration) * 1000 || 2000;
        var self = this;

        this.version = function() {
            return '1.6.0';
        };

        // Print value to target
        this.printValue = function(value) {
            var result = (!isNaN(value)) ? self.formatNumber(value) : '--';
            if (self.d.tagName == 'INPUT') {
                this.d.value = result;
            } else if (self.d.tagName == 'text' ||  self.d.tagName == 'tspan') {
                this.d.textContent = result;
            } else {
                this.d.innerHTML = result;
            }
        };

        // Robert Penner's easeOutExpo
        this.easeOutExpo = function(t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        };
        this.count = function(timestamp) {

            if (!self.startTime) self.startTime = timestamp;

            self.timestamp = timestamp;

            var progress = timestamp - self.startTime;
            self.remaining = self.duration - progress;

            // to ease or not to ease
            if (self.options.useEasing) {
                if (self.countDown) {
                    self.frameVal = self.startVal - self.easeOutExpo(progress, 0, self.startVal - self.endVal, self.duration);
                } else {
                    self.frameVal = self.easeOutExpo(progress, self.startVal, self.endVal - self.startVal, self.duration);
                }
            } else {
                if (self.countDown) {
                    self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
                } else {
                    self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
                }
            }

            // don't go past endVal since progress can exceed duration in the last frame
            if (self.countDown) {
                self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
            } else {
                self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
            }

            // decimal
            self.frameVal = Math.round(self.frameVal * self.dec) / self.dec;

            // format and print value
            self.printValue(self.frameVal);

            // whether to continue
            if (progress < self.duration) {
                self.rAF = requestAnimationFrame(self.count);
            } else {
                if (self.callback) self.callback();
            }
        };
        // start your animation
        this.start = function(callback) {
            self.callback = callback;
            self.rAF = requestAnimationFrame(self.count);
            return false;
        };
        // toggles pause/resume animation
        this.pauseResume = function() {
            if (!self.paused) {
                self.paused = true;
                cancelAnimationFrame(self.rAF);
            } else {
                self.paused = false;
                delete self.startTime;
                self.duration = self.remaining;
                self.startVal = self.frameVal;
                requestAnimationFrame(self.count);
            }
        };
        // reset to startVal so animation can be run again
        this.reset = function() {
            self.paused = false;
            delete self.startTime;
            self.startVal = startVal;
            cancelAnimationFrame(self.rAF);
            self.printValue(self.startVal);
        };
        // pass a new endVal and start animation
        this.update = function(newEndVal) {
            cancelAnimationFrame(self.rAF);
            self.paused = false;
            delete self.startTime;
            self.startVal = self.frameVal;
            self.endVal = Number(newEndVal);
            self.countDown = (self.startVal > self.endVal);
            self.rAF = requestAnimationFrame(self.count);
        };
        this.formatNumber = function(nStr) {
            nStr = nStr.toFixed(self.decimals);
            nStr += '';
            var x, x1, x2, rgx;
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? self.options.decimal + x[1] : '';
            rgx = /(\d+)(\d{3})/;
            if (self.options.useGrouping) {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
                }
            }
            return self.options.prefix + x1 + x2 + self.options.suffix;
        };

        // format startVal on initialization
        self.printValue(self.startVal);
    };

    // Example:
    // var numAnim = new countUp("SomeElementYouWantToAnimate", 0, 99.99, 2, 2.5);
    // numAnim.start();
    // numAnim.update(135);
    // with optional callback:
    // numAnim.start(someMethodToCallOnComplete);

    return CountUp;

}));


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
