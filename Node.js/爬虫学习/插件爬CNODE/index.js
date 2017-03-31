var express= require('express'),
    cheerio= require('cheerio'),
    superagent= require('superagent')
    fs= require('fs');
var app= express();

app.get('/',function(req, res, next){
	superagent.get('https://cnodejs.org/')
	  .end(function(err, sres){
	  	if(err) throw err;
	  	var $= cheerio.load(sres.text);
	  	var items= [];
	  	$('#topic_list .topic_title').each(function(idx,element){
	  		var $element= $(element);
	  		items.push({
	  			title: $element.attr('title'),
	  			href: $element.attr('href')
	  		});
	  	});
	  	res.send(items);
	  	writeFile(items);
	  });
});
app.listen(3000, function(){
	console.log('app is listening.')
});

function writeFile(data){
   var str= '';
   for(var i=0,len= data.length; i< len; i++){
   	 str+= '>['+data[i].title+']'+'('+data[i].href+')\n'+'\n';
   };
   fs.writeFile('index.md', str, function(err){
   	if(err) throw err;
   	console.log('数据已保存！')
   })
}    