var http=require('http'),
    fs= require('fs');
var url= "http://www.alloyteam.com",
    data= "";    
var req= http.request(url, function(res){
	res.setEncoding('utf-8');
	res.on('data',function(chunck){
		data+= chunck
	});
	res.on('end',function(){
		dealData(data)
	});
	console.log("数据处理中...")
});
req.on('err',function(e){
	throw e
})
req.end();

function dealData(data){
	var reg = /<ul\s+class="articlemenu">\s+<li>\s+<a[^>]*>.*?<\/a>\s+<a href="(.*?)"[^>]*>(.*?)<\/a>[\s\S]*?<div\s+class="text">([\s\S]*?)<\/div>/g;
	var res= [];
	while(match= reg.exec(data)){
		res.push({
            "url": match[1],
            "title": match[2],
            "excerpt": match[3].replace(/(<.*?>)((.*?)(<.*?>))?/g, "$3").slice(0,120)
        });
	};
	writeFile(res)
}

/*function writeFile(data){
	var str="";
	for(var i=0, len=data.length; i<len; i++){
		str+="["+data[i].title+"]("+data[i].url+")\n>"+data[i].excerpt.replace(/\n\s*\n?/g,"\n")+"\n\n";
	}
	fs.writeFile('index.md',str,function(err){
		if(err) throw err;
		console.log('数据已保存~');
	});
}*/
function writeFile(data){
    var str = '';
    for(var i = 0, len = data.length; i < len; i++){
        str += "[" + data[i].title + "](" + data[i].url + ")\n>" + data[i].excerpt.replace(/\n\s*\n?/g, "\n>") + "\n\n";
    }
    fs.writeFile('index.md', str, function (err) {                                                                                                 
       if (err) throw err;
       console.log('数据已保存～');
    });
}