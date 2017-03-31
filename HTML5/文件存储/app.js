(function(){
	var SuperEditor= function(){
          var view, fileName, isDirty = false,
        unsavedMsg = 'Unsaved changes will be lost. Are you sure?',
        unsavedTitle = 'Discard changes';
    var markDirty = function() {
      isDirty = true;
    };
    var markClean = function() {
      isDirty = false;
    };
    var checkDirty = function() {
      if(isDirty) { return unsavedMsg; }
    };
    window.addEventListener('beforeunload',  checkDirty, false);
    var jump = function(e) {
      var hash = location.hash;
      if(hash.indexOf('/') > -1) {
        var parts = hash.split('/'),
            fileNameEl = document.getElementById('file_name');
        view = parts[0].substring(1) + '-view';
        fileName = parts[1];
        fileNameEl.innerHTML = fileName;
      } else {
        if(!isDirty || confirm(unsavedMsg, unsavedTitle)) {
          markClean();
          view = 'browser-view';
          if(hash != '#list') {
            location.hash = '#list';
          }
        } else {
          location.href = e.oldURL;
        }
      }
      document.body.className = view;
    };
    jump();
    window.addEventListener('hashchange', jump, false);

    
	};

	var init= function(){
		new SuperEditor();
	};

	window.addEventListener('load',init,false);
})();