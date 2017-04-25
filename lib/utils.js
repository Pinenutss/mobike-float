/**
 * 膜蛤工具类方法
 * namespace: MOHA_UTILS
 * use: MOHA_UTILS.method
 * @author   : 红袍法师董建军队一律不得经商
 * @datetime : 2017/03/30
 * @version  : 1.0.0
 */

var MOHA_UTILS = (function(window, factory){
	'use strict'
	/**
	 * [AJAXRequest 封装AJAX]
	 * @param {[string]}  [api:具体的接口(不带URL前缀)]
	 * @param {[string]}  [method:get||Post]
	 * @param {[object]}  [data:数据对象]
	 * @param {[function]}  [success:成功回调函数]
	 * @param {[function]}  [fail:失败回调函数}]
	 * @param {[void]}  [HTTP Request失败自调用函数,无需传参]
	 * @return {[void]} [直接执行callback]
	 */

	factory.AJAXRequest = function(api, method, data, success, fail) {
		$.ajax({
			url: api,
			dataType: "json",
			type: method || "GET",
			xhrFields: {
				withCredentials: false
			},
			data: data,
			crossDomain: true,
			success: function(result) {
				if (result.Code === 1) {
					success(result);
				} else {
					if (typeof(fail) == "undefined") {
						MOHA_UTILS.toast('网络错误，请稍后再试');
						console.log(result);
					} else {
						fail(result);
					}
				}
			},
			error: function(result) {
				console.log(result.msg);
			}
		})
	}
	/**
     * [ParseURI]
     * url参数
     * USE [MOHA_UTILS.parseURI.params]
     *
     */
	factory.parseURI = function(){
		var url =window.location.href;
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
	}
	
	/**
     * [formateTime]
     * timsta:时间戳
     * type：需要输出的类型
     *
     */
    factory.formateTime =function(timsta, type){
            var date = new Date(timsta * 1000); //获取一个时间对象  注意：如果是uinx时间戳记得乘以1000。比如php函数time()获得的时间戳就要乘于1000
            Y = date.getFullYear() + '-';
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
//            D = date.getDate() + ' ';
//            h = date.getHours() + ':';
//            m = date.getMinutes() + ':';
//            s = date.getSeconds();
            D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+ ':';
            s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        
            var newTime = "";
            switch (type) {
                case "YYYY-MM-DD":
                    newTime = Y + M + D;
                    break;
                case "YYYY-MM-DD h:m:s":
                    newTime = Y + M + D + h + m + s;
                    break;
            }
            return newTime;
    };
	
	/**
	 * [toast 封装Alert]
	 * arguments(标题, 回调)
	 */
	factory.toast = function(content,cb){
		var html = '<div id="toast" class="moha-ui-toast" style="display: none;"><div class="weui-mask_transparent"></div><div class="weui-toast"><p class="weui-toast__content">'+content+'</p></div></div>';
		
		$('body').append(html);
		var $toast = $('.moha-ui-toast');
		$toast.fadeIn(200);		
		setTimeout(function () {
            $toast.fadeOut(200);
			setTimeout(function(){
				$toast.remove();
			},200)
			if (typeof cb === "function"){
				cb();
			}else{
				return;
			}
            }, 2000);
	}
	
	/**
	 * [dialog 封装Confirm]
	 * arguments(标题, 内容, 左键, 右键, 回调) 左键留空则为单按钮confirm
	 */
	factory.confirm = function(title,content,lb,rb,cb){	
		var html = '<div class="js_dialog" style="display: none;"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__hd"><strong class="weui-dialog__title">'+title+'</strong></div><div class="weui-dialog__bd">'+content+'</div><div class="weui-dialog__ft">';
		if(lb === "" || lb === null){
			html += '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">'+rb+'</a>';
		}else{
			html += '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default">'+lb+'</a><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">'+rb+'</a></div></div></div>';
		}		
		
		
		$('body').append(html);
		var $dialog = $('.js_dialog');
		$dialog.fadeIn(200);
		$('.weui-dialog__btn').on('click',function(){
			$(this).parents('.js_dialog').fadeOut(200);
			if($(this).hasClass('weui-dialog__btn_primary')){
				if (typeof cb === "function"){
					cb();
				}else{
					return;
				}
			}
			setTimeout(function(){
				$dialog.remove();
			},200)
		})
	}
	
	/* 暴露 API 工厂*/
	return factory;
	
})(window, window.MOHA_UTILS = window.MOHA_UTILS || {});