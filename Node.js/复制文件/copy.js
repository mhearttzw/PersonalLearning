var fs = require('fs'),
	path = require('path'),
	out = process.stdout;

var dirpath = process.cwd(),
	filelist = fs.readdirSync(dirpath),
	filePath = dirpath+'\\'+filelist[0];

var readStream = fs.createReadStream(filePath),
	writeStream = fs.createWriteStream('song.mp3');
var stat = fs.statSync(filePath);
var totalSize = stat.size,
	passedLength = 0,
	lastSize = 0,
	starTime = Date.now();

readStream.on('data', function(chunck) {
	passedLength += chunck.length;
	if (writeStream.write(chunck) === false) {
		readStream.pause();
	}
});
writeStream.on('drain', function() {
	readStream.resume();
});
readStream.on('end', function() {
	writeStream.end();
});

setTimeout(function show() {
	var percent = Math.ceil((passedLength / totalSize) * 100),
		size = Math.ceil(passedLength / 1000000),
		diff = size - lastSize;
	lastSize = size;
	out.clearLine();
	out.cursorTo(0);
	out.write('已完成' + size + 'MB,' + percent + '%,速度：'+ diff*2 +'MB/s');
	if(passedLength < totalSize) {
		setTimeout(show, 500);
	} else {
		var endTime = Date.now();
		console.log('共用时：' +(endTime - starTime) / 1000 + '秒。');
	}
}, 500);