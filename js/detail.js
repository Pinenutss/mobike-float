var openid = getCookie("openId");
$(function () {
    getDetail();
});

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var clickThumb = (function () {
    $('body').on('click', '.click-thumb', function () {
        var isClicked = $(this).data('clickable');
        var count = Number($(this).siblings('.number').text());
        if (isClicked === 1) {
            MOHA_UTILS.toast('您已赞过此作品');
        } else {
            var id = $(this).closest('.works-item').data('id');
            MOHA_UTILS.AJAXRequest(
				'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
				'post',
				{ "action": "WorksThumbUp", "id": id },
				function (result) {
				    $(this).removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up').attr('data-clickable', 1);
				    $(this).siblings('.number').text(count + 1);
				}
			)
        }
    })
})()

var thumbHandler = (function () {
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

var getDetail = function () {
    //$('body').on('click','.works-img',function(){
    var id = getQueryString("workid");
	console.log(id);
    $.ajax({
        url: 'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
        dataType: "json",
        method: 'post',
        xhrFields: {
            withCredentials: false
        },
        data: { "action": "GetWorkDetail", "workId": id },
        crossDomain: true,
        beforeSend: function () {
            $('.detail-wrap').removeClass('bounceOutUp').addClass('bounceInDown').css('visibility', 'visible');
            $('.detail-wrap').find('.load').show();
        },
        success: function (result) {
            if (result.Code === 1) {
                var detail = $.parseJSON(result.Data);
                var name = detail.weChatName || '摩拜车友';
                var avatar = detail.weChatHeadImg || 'img/avatar.png';
                var html = "";
                html += '<div class="works-content-img" style="background-image:url(' + detail.workImg + ')"></div><h4 class="name">' + detail.worksName + '</h4><p>' + detail.worksRemark + '</p><div class="head"><div class="head-img" style="background-image:url(' + avatar + ')"></div></div><h4 class="wx-id">' + name + '</h4>';
                $('#js_detail').append(html);
                $('#js_count').text(detail.thumbUpCount);
                var isThumb = detail.isThumbUp;
                $('#js_thumb').attr('data-clickable', detail.isThumbUp).attr('data-id', detail.workId);
                if (isThumb === 1) {
                    $('#js_thumb').find('i').removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up');
                }
            }
        },
        complete: function () {
            $('.detail-wrap').find('.load').hide();
            $('.detail-wrap .fixed-wrap').addClass('fadeIn').css('visibility', 'visible');

        }
    });
    //});
    //$('.close').click(function(){
    //	$('.detail-wrap').removeClass('bounceInDown').addClass('bounceOutUp');
    //	var detailWrap = document.getElementById('js_wrap');
    //	detailWrap.addEventListener('webkitAnimationEnd',function(){
    //			$('.bounceOutUp #js_detail').empty();
    //			$('.bounceOutUp #js_count').text(0);
    //			$('.bounceOutUp #js_thumb').removeClass('fa-thumbs-up fa-thumbs-o-up');			
    //	})

    //})
}