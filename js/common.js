$(function(){
	$('.intro a').click(function(){
		var _pop = $(this).data('pop');
		$('#'+_pop).css('visibility','visible').removeClass('bounceOutUp').addClass('bounceInDown');
	})

	$('.close').click(function(){
		$(this).parent().removeClass('bounceInDown').addClass('bounceOutUp');
	  })
})

var fp =  new AlloyTouch.FullPage("#fullpage",{
            animationEnd:function () {

            },
            leavePage: function (index) {
               console.log("leave"+index)
            },
            beginToPage: function (index) {
               console.log("to"+index);

            }
        });

function ImgChange(_index){
	    console.log(_index);
		switch(_index)
				{
					case 0 :
					$("#author").text("设计师4");
					$("#remark").text("设计说明4");
					break;
					case 1 :
					$("#author").text("设计师1");
					$("#remark").text("设计说明1");
					break;
					case 2 :
					$("#author").text("设计师2");
					$("#remark").text("设计说明2");
					break;
					case 3 :
					$("#author").text("设计师3");
					$("#remark").text("设计说明3");
					break;
					case 4 :
					$("#author").text("设计师4");
					$("#remark").text("设计说明4");
					break;
					case 5 :
					$("#author").text("设计师1");
					$("#remark").text("设计说明1");
					break;
				}
		}
	

		var mySwiper = new Swiper('.swiper-container', {
            loop: true,//是否循环轮播
            slidesPerView: 1,//显示多少列
            spaceBetween: 0,//轮播之间的左右（前后）间距
            paginationClickable: true,//是否可点击页码按钮切换
            autoplay: false,//自动轮播间隔时间
			onSlideNextStart:function(swiper){
				ImgChange(swiper.activeIndex);
			},
			onSlidePrevStart: function(swiper){
				ImgChange(swiper.activeIndex);
			}
        });
