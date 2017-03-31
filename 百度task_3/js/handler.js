define(['selector','tool'], function(a,tool){
     var classCont = $('.all-taskClass')[0];


	return{
          classifyClickHander: function(This) {
               tool.maskSureCancel();//检查编辑内容是否保存
               if(This.className.split(' ')[0]== 'main-item') {
                    var id = This.getAttribute('data-id');
                    tool.updataTask(id, 'all');
                    
               }
          }

		addClassHandle: function(){//左侧下方添加分类事件
               var editElement= $(".edit")[0];
               var display= tool.getStyle(editElement, 'display');
               if(display== 'block'){
               	   var option= {
                     class: 'alert',
                     inner: '任务未保存，现在退出么？'
               	   };
               	   tool.maskHandler(option);
               	   $('#alert-btn').onclick= function(){
               	   	$('.window')[0].style.display= 'none';
               	   	editElement.style.display= 'none';
               	   	$('.detail')[0].style.display= 'block';
               	   };
               	   return ;
               }
               var options= {
               	class: 'addClass'
               };
               tool.maskHandler(options);//开启遮罩浮层
               /*这里要把selected进行更新*/
               tool.updataSele();
               var makeSure= $('#addClass-btn');
               
		}
	}
})