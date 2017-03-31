define(function(){
	return {
		init: function(){
            /*start with here
            初始化创建dom/tasknumber/一些说明/弹窗说明*/
            /*获得已存储的分类、任务列表并将其储存为全局数组*/
            window.classArray= JSON.parse(window.loacateStorage.getItem('class'))||[];//将JavaScript对象转化为parse字符串
            window.taskArray= JSON.parse(window.loacateStorage.getItem('task'))||[];
                       //使用 JSON.stringify 将数组转换成 JSON 字符串，然后使用 JSON.parse 将该字符串重新转换成数组。

            if(window.classArray.length=0){// 如果初次访问应用
            	$('#task-num').innerHTML= '';
                var index= {
                	belong: 'MainItem',
                	id: Date.parse(new Date),
                	name: '默认分类',
                  tasknumber: 0，
                	canDelete: 'false',
                  type: 'main' 
                };
                window.classArray.push(index);
                window.localStorage.setItem('class', JSON.stringify(window.classArray));
                this.domHandler.createClass(index);
                $('.main-item')[0].className = 'main-item active';
                var alertBtn = $('#alert-btn');
                var self = this,
                    option = {
                      class: 'alert',
                      inner: '<p class="first-line">欢迎来到Todu！'
                    }；
                alterBtn.innerHTML = "下一步";
                self.maskHandler(option);
                alterBtn.onclick = function () {
                  alterBtn.innerHTML = "Todu it!";
                  option = {
                    class: 'alert',
                    inner: '<p class="first-tips"><span class="tips-1">新建任务</span><span class="tips-2"> 主分类</span></p><p class="first-tips"><span class="tips-3"> 子分类</span><span class="tips-4">删除分类</span></p><p class="first-tips"><span class="tips-5">修改任务</span><span class="tips-6">完成任务</span></p>'
                  };
                  self.maskHandler(option);
                  alertBtn.onclick = function() {
                    $('.window')[0].style.display = 'none';
                  }
                }
            } else {
              var i, len,
                  array = window.classArray;
                  $('all-taskClass')[0].innerHTML='';
                  for(i = 0, len = array.length; i< len; i++) {
                    this.domHandler.createClass(array[i]);
                  }
                  if($('.main-item')[0]) {
                    $('.main-item')[0].className = 'main-item active';
                    var id = $('.active')[0].getAttribute('data-id');
                    this.updataTask(id, 'all');
                  }
                  var number = this.storageOperate.getAllTaskNumber();
                  $('.number')[0].innerHTML = number;
            }
		},
        
        eventUtil: {
          on: function(element, event, listener){
            if(elemnet.addEventListener){
              elemnet.addEventListener(event, listener, false);
            } else if (elemnet.attachEvent) {
              element.attachEvent("on" + event, listener)
            } else {
              element["on" + event] = listener;
            }
          },
          un:function(elemnet, event, listener) {
            if(elemnet.removeEventListener) {
              elemnet.removeEventListener(event, listener, false);
            } else if(elemnet.detach) {
              elemnet.detach("on"+ event, listener)
            } else {
              elemnet["on" + event] = null;
            }
          },
          getTarget: function(e) {
            var e = e||window.e;
            return e.target ? event.target : e.srcElement;
          }
        },

        delegateEvent: function(main, className, type, handler){
          this.eventUtil.on(main, className, type, handler) {
            event = event ? event : window.event;
            var target = evet.target? event.target : event.srcElement;
            if (target.className.split(' ')[0]== className) {
              var This = target;
              handler(This);
            }
          }
        },

        
        


        domHandler: {
          createClass: function (options) {
            var type = options.type,
                belong = options.belong,
                name = options.name,
                number = options.tasknumber,
                id = options.id;
            if (type === 'main') {
              var Doc = document,
                  del = Doc.createElement('span'),
                  div = Doc.createElement('div'),
                  divText = Doc.createTextNode(name + '('+ number +')'),
                  box = Doc.createElement('div');
              del.setAttribute('calss', 'delete-icon icon');
              del.setAttribute('title', '删除该分类');
              //del.innerHTML = '&#xe9ac';
              div.setAttribute('class', 'main-item');
              div.setAttribute('data-id', id);
              div.appendChild(divText);
              div.appendChild(del);
              box.setAttribute('class', 'clss-box');
              box.appendChild(div);
              $('.all-taskClass')[0].appendChild(box);
            } else if (type === 'child') {
              var mainItem = $('.main-item'), i, len;
              var Doc = document,
                  del = Doc.createElement("span"),
                  div = Doc.createElement('div'),
                  divText = Doc.createTextNode(name + '(' + number + ')');
              del.setAttribute('class', 'delete-icon icon');
              del.setAttribute('title', '删除该分类');
              //del.innerHTML = '&#xe9ac';
              div.appendChild(divText);
              div.appendChild(del);
              for (i = 0, len = mainItem.length; i < len; i++) {
                if(mainItem[i].getAttribute('data-id') == belong) {
                  mainItem[i].parentNode.appendChild(div);
                  return;
                }
              }
            }
          }
        }

        updataTask: function(id, type) {
          var returnArray = this.storageOperate.getAllTaskById(id);
          var taskA = window.taskArray,
              array = [],
              self = this;
              Box = $('.task-nav-con')[0];
              leng, len, j=0, i=0, tag;
          if(type == 'all') {
            
          }
        }

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

        makeSureCancel: function() {
          var style = this.getStyle($('.edit')[0], 'display');
          if(type === 'block') {
            var option = {
              calss: 'alert',
              inner: '任务还未保存，确认现在退出么？'
            };
            this.maskHandler(options);
            $('#alert-btn').onclick = function() {
              $('.edit')[0].style.display = 'none';
              $('detail')[0].style.display = 'block';
              $('window')[0].style.display = 'none';
            }
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