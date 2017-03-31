require.congig({
	path:{
	}
});
require(['tool','handler'], function(tool,handler){
        if(!window.localStorage){
        	alert("don't support localStorage!");
        }//如果不支持localStorage的话则返回。
        //window.localStorage.clear();
        tool.init();

});