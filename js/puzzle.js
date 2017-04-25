$(function(){
	deploy('bg');
});
var flag = "bg";
var editorTool = (function(){
	$('.editor-tool a').click(function(){
		$('.editor-tool a').removeClass('active');
		$(this).addClass('active');
		var _cat = $(this).data('cat');
		flag = _cat;		
		deploy(_cat);				   
	})
})()

function deploy(arr){
	$('#js_option').empty();
	var myArray = eval('(array' + arr + ')');
	var html = "";
	$('#js_option').empty();
	for(var i=0; i<myArray.length; i++){
		html += '<div class="swiper-slide" data-src="'+myArray[i]+'" style="background-image:url('+myArray[i]+')"></div>';
	}
	$('#js_option').append(html);
	swiper = new Swiper('.swiper-container',{
		slidesPerView:4.5,
		spaceBetween:10,
		freeMode:true
	});
}


var editorHandler = (function(){
	var editor = null,
		_width = $('#js_puzzle').width(),
		_height = $('#js_puzzle').height();
	editor = $('#js_puzzle').ImageEditor({
		imageUrls:[
			{url:'img/bg/bg1.png',closeButtonRequire: false, clickToSelect: false},
			{url:'img/bike/bike-lg.png',closeButtonRequire: false, clickToSelect: false,size:'bike'},
			{url:'img/bike/basket.png',closeButtonRequire: false, clickToSelect: false,index:998,size:'basket'}
			
		],
		removeIcon:'img/minus.svg',
		width: _width,
		height: _height,
		onInitCompleted:function(){
			
		}		
	});
	$('body').on('click','.swiper-slide',function(){
		var _src = $(this).data('src');
		if(flag === "bg"){
			editor.setImage(_src, 0, false);
		}else{
			editor.addImage(_src, true);
		}
		
	});
	$('.js_reset').click(function(){
		MOHA_UTILS.confirm('重置画布？','此操作将撤销之前的全部操作，是否确定？','取消','确定重置',function(){
			editor.reset();
		});
	});
	$('.js_preview').click(function(){
		var cvs = editor.mergeImage(),
			$img = $('<img>');
		$img.attr('src', cvs.toDataURL());
		$('#output').append($(cvs));
		$('.preview').addClass('show');
		$('.preview>div').css('visibility','visible').removeClass('bounceOutUp').addClass('bounceInDown');
	});
	$('.close').click(function(){
		$('.preview>div').removeClass('bounceInDown').addClass('bounceOutUp');
		setTimeout(function(){
			$('.preview').removeClass('show');
			$('.preview').find('canvas').remove();
		},500);
	});
	$('.js_publish').click(function(){
		$('.panel').css('visibility','visible').removeClass('bounceOutUp').addClass('bounceInDown');
	});
	$('#js_submit').click(function(){
		var _name = $('#js_workName').val(),
			_phone = $('#js_phone').val(),
			_des = $('#js_workDes').val(),
		    _workString = editor.mergeImage().toDataURL();
		if(!judge.isExist(_name)){
			MOHA_UTILS.toast('请输入作品名称');
		}else if(!judge.isExist(_phone)){
			MOHA_UTILS.toast('请输入您的电话号码');
		}else if(!judge.phoneNumber(_phone)){
			MOHA_UTILS.toast('您的电话号码不规范');
		}else{
			$(this).prop('disabled',true);
			MOHA_UTILS.AJAXRequest(
				'http://mobike.zmdtech.com/Components/H5PageHandler.ashx',
				'post',
				{"action":"UpWorks","worksName":_name,"telPhone":_phone,"remark":_des,"strImage":_workString},
				function(result){
					var data = $.parseJSON(result.Data);
					$('.form').addClass('bounceOutDown');
					$('#js_workName,#js_phone,#js_workDes').val();
					$('#js_score').text(data.score);
					setTimeout(function(){
						$('.score').css('visibility','visible').addClass('bounceInDown');
						$(this).prop('disabled',false);
					},500);
					$('.btn-hph').click(function(){
						window.location.href = 'works.html?workid='+data.workid;
					})
				}
			);
		}
		
		
	});
})()

var arrayflower = [	
	'img/flower/1.png?v=1',
	'img/flower/2.png?v=1',
	'img/flower/3.png?v=1',
	'img/flower/4.png?v=1',
	'img/flower/5.png?v=1',
	'img/flower/6.png?v=1',
	'img/flower/7.png?v=1',
	'img/flower/8.png?v=1',
	'img/flower/9.png?v=1',
	'img/flower/10.png?v=1',
	'img/flower/11.png?v=1',
	'img/flower/12.png?v=1'
];
var arraybg = [
	'img/bg/bg1.png',
	'img/bg/bg2.png'
];
var arraypattern = [
	'img/pattern/1.png',
	'img/pattern/2.png',
	'img/pattern/3.png',
	'img/pattern/4.png',
	'img/pattern/5.png',
	'img/pattern/6.png',
	'img/pattern/7.png',
	'img/pattern/8.png',
	'img/pattern/9.png',
	'img/pattern/10.png',
	'img/pattern/11.png',
	'img/pattern/12.png'
];
