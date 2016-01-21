var countUp = EB_GET('lib/countUp.js')

! function() {
    var checkbox = $("#J_used")
    var red = $("#J_red-envelope")
    var usedNum = $("#J_usedNum")
    var mask = $("#J_mask")
    var _parent = checkbox.parent().parent()
    var is_use = false
    var bak = checkbox.html()
    var win = $(window)
    checkbox.parent().click(function(event) {
        if (!is_use) {
            mask.show()
            red.css({
                right: (win.width() - 1000) / 2,
                top: _parent.offset().top + _parent.height()
            }).slideDown()
        } else {
            is_use = false
            checkbox.html(bak)
            mask.hide()
            red.slideUp()
            usedNum.html("0")
        }
    })

    red.on("click", "a", function(event) {
        event.preventDefault()
        is_use = true
        checkbox.html(checkbox.data('check'))
        var _this = $(this)
        if (_this.data("used")) {
            usedNum.html(_this.data("used"))
            red.slideUp()
            mask.hide()
        }
    })

    mask.on('click', function(event) {
        red.slideUp()
        mask.hide()
    })
}()

! function() {
    var title = $("#J_title").children()
    var content = $("#J_content").children()
    title.click(function() {
        var index = $(this).index()
        title.removeClass("on").eq(index).addClass("on")
        content.addClass('none').eq(index).removeClass('none')
    })
}()

! function() {
    var progress = $('#J_progress');
    progress.prev().children().css({
        width: progress.data('num')
    });
    (new CountUp(progress[0], 0, progress.data('num'), 0, 2.5)).start()
}()
