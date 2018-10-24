(function ($,window) {
    
    //数组包含
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (typeof this[i] === "object" && siteTools.isObjectValueEqual(this[i], obj)) {
                return true;
            } else if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
    //返回复杂对象在数组中的位置
    Array.prototype.indexOfComplexObj = function (key, value) {
        if (this.length === 0) return -1;
        for (var i = 0; i < this.length; i++) {
            if (this[i][key] == value) return i;
        }
        return -1;
    };
    //返回数组中的复杂对象
    Array.prototype.findObjOfComplexObj = function (key, value) {
        var index = this.indexOfComplexObj(key, value);
        return index === -1 ? null : this[index];
    };

    /*
    * 数组遍历使用回调
    */
    Array.prototype.forEach = Array.prototype.forEach || function (callback) {
        callback = callback || function () { };
        for (var i = 0, len = this.length; i < len; i++) {
            callback.call(this[i], this[i], i);
        }
    };
    //数组删除某一元素，n表示第几项，从0开始算起。
    Array.prototype.del = function (n) {
        if (n >= 0)
            return this.slice(0, n).concat(this.slice(n + 1, this.length));
    };
    //数组复杂对象的删除元素
    Array.prototype.removeOfComplexObj = function (key, value) {
        var index = this.indexOfComplexObj(key, value);
        index > -1 && this.splice(index, 1);
    };


    //是否包含某字符串，默认区分大小写
    //isCaseSensitive: 是否区分大小写，默认为true
    String.prototype.contains = function (obj, isCaseSensitive) {
        if (isCaseSensitive === undefined) isCaseSensitive = true;
        return isCaseSensitive ? this.indexOf(obj) >= 0 : this.indexOfIgnoreCase(obj) >= 0;
    };
    //是否包含某字符串，忽略大小写
    String.prototype.indexOfIgnoreCase = function () {
        var bi = arguments[arguments.length - 1];
        var thisObj = this;
        var idx = 0;
        if (typeof (arguments[arguments.length - 2]) == 'number') {
            idx = arguments[arguments.length - 2];
            thisObj = this.substr(idx);
        }

        var re = new RegExp(arguments[0], bi ? 'i' : '');
        var r = thisObj.match(re);
        return r == null ? -1 : r.index + idx;
    };
    //扩展 string.format
    String.prototype.format = function () {
        var args = arguments;
        var reg = /\{(\d+)\}/g;
        return this.replace(reg, function (g0, g1) {
            return args[+g1];
        });
    };
    //是否为正整数
    String.prototype.isDigit = function () {
        var s = this.trim();
        return (s!='' && s.replace(/\d/g, "").length == 0);
    };

    // 检查是否为数字 (含正负符号和小数点)
    String.prototype.isNumber = function () {
        var s = this.trim();
        return (s.search(/^[+-]?[0-9.]*$/) >= 0);
    };
    //字符转换成整数
    String.prototype.toInt = function () {
        return parseInt(this.trim());
    };
    //字符转换成浮点数字
    String.prototype.toFloat = function () {
        return parseFloat(this.trim());
    };
    //去掉所有的html标记
    String.prototype.delHtmlTag = function () {
        return this.replace(/<[^>]+>/g, '');
    };

    /**
     * 日期时间格式化
     * @param {string} fmt 格式化字符串，如"yyyy-MM-dd hh:mm:ss"
     */
    Date.prototype.format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1,
                    (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    /**
     * 增加天数
     * @param {number} day 需要增加的天数
     */
    Date.prototype.addDay = function (day) {
        let d = this.setDate(this.getDate()+day);
        return new Date(d);
    };


    /**
     * 父级中符合条件的第一个元素
     * @param {selector} selector 
     * @returns {jQuery对象} 
     */
    $.fn.firstParent = function (selector) {
        return $(this).parents(selector).eq(0);
    };

})(jQuery, window);




(function ($,window) { 

    class tools{
        getWebContent(url){
            $.get(url);
            
        }
    }

    window.tools = new tools();

 })(jQuery, window)