define(function() {
    var cache = {}

    return function(str, data) {
        var fn = cache[str] ? cache[str] :
            (cache[str] = new Function("data",
                "var p=[];" +
                "p.push('" +
                str
                .replace(/&lt;!--/g, "<!--")
                .replace(/--&gt;/g, "-->")
                .replace(/[\r\t\n]/g, " ")
                .split("<!--").join("\t")
                .replace(/((^|-->)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)-->/g, "',$1,'")
                .split("\t").join("');")
                .split("-->").join("p.push('")
                .split("\r").join("\\'") + "');return p.join('');"))
        return data ? fn(data) : fn
    }
})
