var cheerio = require('cheerio'),
	eventproxy = require('eventproxy'),
	superagent = require('superagent'),
	url = require('url')
	fs = require('fs');

var cnodeUrl = 'http://cnodejs.org';

superagent.get(cnodeUrl)
	.end(function (err, res) {
		if (err) {
			throw err;
		}
		var topicUrls = [],
			$ = cheerio.load(res.text);
		$('#topic_list .topic_title').each(function (idx, element) {
			var $element = $(element);
			var href = url.resolve(cnodeUrl, $element.attr('href'));
			topicUrls.push(href);
		});
        
        topicUrls.forEach(function (topicUrl) {
        	superagent.get(topicUrl)
        		.end(function (err, res) {
        			
        			console.log('fetch'+ topicUrl + 'successful');
        			ep.emit('topic_html', [topicUrl, res.text]);
        		});
        });

		var ep = new eventproxy();

		ep.after('topic_html', topicUrls.length, function (topics) {
			topics = topics.map(function (topicPair) {
				var topicUrl = topicPair[0],
					topicHtml = topicPair[1],
					$ = cheerio.load(topicHtml);
				return ({
					title: $('.topic_full_title').text().trim(),
					href: topicUrl,
					comment1: $('reply_content').eq(0).text().trim(),
				});
			});
			console.log('final：');
			console.log(topics);
			writeFile(topics);
		});


	});

function writeFile(data) {
	var str = '';
	for(var i = 0, len = data.length; i<len; i++) {
		str += '>[' + data[i].title + ']' +'(' +data[i].href+ ')\n';
	};
	fs.writeFile('index.md', str, function(err){
		if(err) throw err;
		console.log('数据已保存！');
	});
}