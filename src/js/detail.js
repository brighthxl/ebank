! function() {
	var checkbox = $("#J_used")
	var red = $("#J_red-envelope")
	var usedNum = $("#J_usedNum")
	var _parent = checkbox.parent().parent()

	checkbox.click(function(event) {
		if (checkbox.prop("checked")) {
			var pos = _parent.offset()
			red.css({
				left:pos.left,
				top : pos.top + _parent.height()
			}).slideDown()
		} else {
			red.slideUp()
			usedNum.html("0")
		}
	})

	red.on("click", "a", function(event) {
		event.preventDefault()
		var _this = $(this)
		if(_this.data("used")){
			usedNum.html(_this.data("used"))
			red.slideUp()
		}
	});
}()

!function(){
	var title = $("#J_title").children()
	var content =$("#J_content").children()
	title.click(function(){
		var index = $(this).index()
		title.removeClass("on").eq(index).addClass("on")
		content.addClass('none').eq(index).removeClass('none')
	})
}()
