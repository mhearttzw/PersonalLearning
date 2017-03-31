var express= require('express'),
    path= require('path'),
    partial= require('express-partials'),
    cookieParser= require('cookie-parser');

var app= express();

//view engine setting
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partial());

app.listen(3000,function(){
	if (err) throw err;
	console.log('监听中...')
});    