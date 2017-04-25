//var openid = getCookie("openId");
var openid = '123456';

$(function () {
    getList(-1);
});

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
var getList = function(index){
	$('.content').dropload({
		scrollArea: window,
		distance: 50,
		loadDownFn: function(me){
			index++;
			//console.log(index);
			var html = "";
			MOHA_UTILS.AJAXRequest(
				'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
				'post',
				{"action":"GetWorkList","pageSize":"3","pageindex":index},
				function(result){		
					var myData = $.parseJSON(result.Data);
					var name = "";
					if(myData.length > 0){
						for(var i=0;i<myData.length;i++){
							
							if(myData[i].weChatName === ""){
								name = "摩拜车友";
							}else{
								name = myData[i].weChatName;
							}
							html += '<div class="works-item" id="'+myData[i].workId+'"><div class="works-img" style="background-image:url('+myData[i].worksImage+')"></div><div class="center"><h4>'+myData[i].worksName+'</h4><h5>'+name+'</h5></div><div class="right">';
							if (openid !== "" && openid !== null && openid !== "null") {
							    if (myData[i].isThumbUp === 1) {
							        html += '<i class="fa fa-thumbs-up fa-flip-horizontal click-thumb" data-clickable="' + myData[i].isThumbUp + '"></i>';
							    } else if (myData[i].isThumbUp === 0) {
							        html += '<i class="fa fa-thumbs-o-up fa-flip-horizontal click-thumb" data-clickable="' + myData[i].isThumbUp + '"></i>';
							    }
							    html += '<div class="number">' + myData[i].thumbUpCount + '</div>';
							}
							html += '</div></div>';			
						}
					}else{
						alert(1);
						me.lock();
						me.noData();
					}
					
					$('#js_list').append(html);
					me.resetload();
				}

			)
		}
	});
	
}

var clickThumb = (function(){
	$('body').on('click','.click-thumb',function(){
		var isClicked = $(this).data('clickable');
		var count = Number($(this).siblings('.number').text());
		if(isClicked === 1){
			MOHA_UTILS.toast('您已赞过此作品');
		}else{		
			var id = $(this).closest('.works-item').attr('id');
			MOHA_UTILS.AJAXRequest(
				'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
				'post',
				{"action":"WorksThumbUp","id":id},
				function(result){
					$(this).removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up').attr('data-clickable',1);
					$(this).siblings('.number').text(count + 1);
				}
			)
		}
	})
})()

var thumbHandler = (function(){
    $('body').on('click', '#js_thumb', function () {
        if (openid != "" && openid != null && openid != "null") {
            var workId = $(this).data('id'),
                count = $(this).find('span').text(),
                isClicked = $(this).data('clickable');
            if (isClicked === 1) {
                MOHA_UTILS.toast('您已赞过此作品');
            } else {
                MOHA_UTILS.AJAXRequest(
					'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
					'post',
					{ "action": "WorksThumbUp", "id": workId },
					function (result) {
					    $(this).find(i).removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up').attr('data-clickable', 1);
					    $(this).find('span').text(count + 1);
					    $('#' + workId).find('.click-thumb').removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up').attr('data-clickable', 1);
					    $('#' + workId).find('.number').text(count + 1);
					}
				)
            }
        }
	})
})()

var getDetail = (function(){	
	$('body').on('click','.works-img',function(){
		var id = $(this).closest('.works-item').attr('id');
		$.ajax({
			url:'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
			dataType: "json",
			method:'post',
			xhrFields: {
				withCredentials: false
			},
			data:{"action":"GetWorkDetail","workId":id},
			crossDomain: true,
			beforeSend: function(){
			   $('.detail-wrap').removeClass('bounceOutUp').addClass('bounceInDown').css('visibility','visible');
				$('.detail-wrap').find('.load').show();
			},
			success:function(result){
				if(result.Code === 1){					
					var detail = $.parseJSON(result.Data);
					var name = detail.weChatName || '摩拜车友';
					var avatar = detail.weChatHeadImg || 'img/avatar.png';
					var html = "";
					html += '<div class="works-content-img" style="background-image:url('+detail.workImg+')"></div><h4 class="name">'+detail.worksName+'</h4><p>'+detail.worksRemark+'</p><div class="head"><div class="head-img" style="background-image:url('+avatar+')"></div></div><h4 class="wx-id">'+name+'</h4>';
					$('#js_detail').append(html);
					$('#js_count').text(detail.thumbUpCount);
					var isThumb = detail.isThumbUp;
					$('#js_thumb').attr('data-clickable', detail.isThumbUp).attr('data-id',detail.workId);
					if(isThumb === 1){
						$('#js_thumb').find('i').removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up');
					}
				}
			},
			complete: function(){
				$('.detail-wrap').find('.load').hide();
				$('.detail-wrap .fixed-wrap').addClass('fadeIn').css('visibility','visible');
				
			}
		});
	});
	$('.close').click(function(){
		$('.detail-wrap').removeClass('bounceInDown').addClass('bounceOutUp');
		var detailWrap = document.getElementById('js_wrap');
		detailWrap.addEventListener('webkitAnimationEnd',function(){
				$('.bounceOutUp #js_detail').empty();
				$('.bounceOutUp #js_count').text(0);
				$('.bounceOutUp #js_thumb').removeClass('fa-thumbs-up fa-thumbs-o-up');			
		})
		
	})
})()

var myWork = (function(){
	$('.btn-hph').click(function(){
		if(openid === "" || openid === null || openid === "null"){
			MOHA_UTILS.toast('请在微信客户端打开');
		}else{
			MOHA_UTILS.confirm('寻回您的作品','验证提交作品时输入的手机号码，验证后找回作品。','取消','确定',function(){
				$('.msg').removeClass('bounceOutUp').addClass('bounceInDown').css('visibility','visible');
			})
		}
	});
	
	$('#getCode').click(function(){
		var _phone = $('#js_phone').val();
		if(!judge.isExist(_phone)){
			MOHA_UTILS.toast('请输入您的电话号码');
		}else if(!judge.phoneNumber(_phone)){
			MOHA_UTILS.toast('您的电话号码不规范');
		}else{
			time(this);
			
			
			$.ajax({
				url:'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
				dataType: "json",
				method:'post',
				xhrFields: {
					withCredentials: false
				},
				data:{"action":"SendCodeMessage","telPhone":_phone},
				crossDomain: true,
				success:function(result){
					console.log(result);
				}
			});

		}
	});
	
	$('.msg_btn_div input').click(function(){	
		var _phone = $('#js_phone').val(),
			_vertify = $('#js_vertify').val();
		if(!judge.isExist(_phone)){
			MOHA_UTILS.toast('请输入您的电话号码');
		}else if(!judge.phoneNumber(_phone)){
			MOHA_UTILS.toast('您的电话号码不规范');
		}else if(!judge.isExist(_vertify)){
			MOHA_UTILS.toast('请输入验证码');
		}else{
			$(this).prop('disabled',true);
			$.ajax({
				url:'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
				dataType: "json",
				method:'post',
				xhrFields: {
					withCredentials: false
				},
				data:{"action":"GetWorkDetailByTel","telPhone":_phone,"msgCode":_vertify},
				success:function(result){
					if(result.Code === -1){
						MOHA_UTILS.confirm('匹配失败','没有匹配到您提交的作品','再试一次','返回列表',function(){
							$('.msg').removeClass('bounceInDown').addClass('bounceOutUp');
						});
					}else if(result.Code === 2){
						MOHA_UTILS.toast('验证码错误');
					}else if(result.Code ===1){
						var _id = result.Data;
						window.location.href = 'works.html?workid='+_id;
					}
				}
			});
		}
	})
})()

var getCode = document.getElementById('getCode');
var wait = 60;
function time(btn){
    if (wait===0) {
        btn.removeAttribute("disabled");
        btn.value = "获取验证码";
        wait = 60;
    }else{
        btn.setAttribute("disabled",true);
        btn.value = wait + "秒后重试";
        wait--;
        setTimeout(function(){
            time(btn);
        },1000);
    }
}