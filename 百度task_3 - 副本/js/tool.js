define(function(){
	return {
		init: function(){
            /*start with here
            初始化创建dom/tasknumber/一些说明/弹窗说明*/
            window.classArray= JSON.parse(window.loacateStorage.getItem('class'))||[];//将JavaScript对象转化为parse字符串
            window.taskArray= JSON.parse(window.loacateStorage.getItem('task'))||[];
//使用 JSON.stringify 将数组转换成 JSON 字符串，然后使用 JSON.parse 将该字符串重新转换成数组。

            if(window.classArray.length=0){// 如果初次访问应用
            	$('#task-num').innerHTML= '';
                var index= {
                	belong: 'MainItem',
                	id: Date.parse(new Date),
                	name: '默认分类',
                	canDelete: 'false',
                    type: 'main' 
                };
            }
		},
        
        storageOperate: {
               This: this;


        },

        getStyle: function(obj, attr){
        	if(obj.currentStyle){//IE hack
        		return obj.currentStyle[attr];
        	}else{
        		return getComputedStyle(obj,false)[attr];
        	}
        },
        maskHandler: function(options){// 遮罩操作 options是参数
          /*
           options:{};

           addClass: 显示添加分类遮罩
           alert： 显示弹窗警告
           cont属性：弹窗警告内容
          */
            var win= $('.window')[0];
                if(options.class== 'addClass'){
             	   var className= $('#class-name');
             	   className.value= '';//清空
             	   win.style.display= 'block';
                   win.getElementByClassName('window-cont-class')[0].style.display= 'block';
                   win.getElementByClassName('window-alert')[0].style.display= 'none';
                }else if(options.class == 'alert'){
                   win.getElementByClassName('window-cont-class')[0].style.display= 'none';
                   win.getElementByClassName('window-alert')[0].style.display= 'disblock'; 
                }
        },

        updataSele: function(){//更新options
            var sele= $('#class-select');
            var items= this.storageOperate.getMainClass();
            for(var i=0, len=items.length; i<len; i++){
            	sele.option[i+1]= new Option(items[i].name, items[i].id);
            }
        },
	}
})