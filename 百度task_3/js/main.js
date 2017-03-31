require.config({
	paths:{
	}
});
require(['tool','handler'], function(tool,handler){
        if(!window.localStorage){
        	alert("don't support localStorage!");
        }//如果不支持localStorage的话则返回。
        window.localStorage.clear();
        tool.init();//初始化函数 包括装载
        /*-------------变量声明/配置----------------------*/
        var classBox = $('all-taskClass')[0],
        	taskBox = $('.task-nav-con')[0];
        window.modification = false;// 标记当前是修改任务还是新建任务
        /*--------------------点击事件-------------------------*/
        /*---
        事件代理
        左侧类别为child-item的点击事件
        作用：更新右侧任务列表
        */
        tool.delegateEvent(classBox, 'child-item', 'click', handler.classifyClickHandler);
        /*        
});