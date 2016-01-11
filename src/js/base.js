//import('lib/jquery.min.js')
var define = define || function() {
    if (typeof(arguments[0]) == 'function') {
        return arguments[0]()
    } else {
        return function() {

        }
    }
}
var layer = EB_GET('lib/layer.js')
var tmpl = EB_GET('lib/tmpl.js')

$('#J_login').on('keyup', 'input', function(event) {
	//event.preventDefault();
	var _this = $(this)
	var _next = _this.next()
	if($.trim(_this.val())){
		_next.hide()
	}else{
		_next.show()
	}
});
