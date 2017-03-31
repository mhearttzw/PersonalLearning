define(function(){
    function $(selector){
         var i,arr,length,element,selec;
             element= document;
             arr= selector.split(' ');
             length= arr.length;
             i=0;
         while(i<length){
            if(arr[i].charAt(0)== '#'){
                selec= /[^#].*/.exec(arr[i]);
                element= element.getElementById(selec);
            }
            else if(arr[i].charAt(0)== '.'){
                selec= /[^.].*/.exec(arr[i]);
                if(element.getElementByClassName){
                     element= element.getElementByClassName(selec);
                }else {
                      var j,len,
                          a= element.getElementByTagName("*");
                          element= [];
                      for(j=0,len=a.length; j<len; j++){
                        if(hasClassName(a[j],selec)){
                             element.push(a[j]);
                        }
                      }    

                }
            }
            else if(arr[i].charAt(0)== '['){
                selec= /[^[].*[]$]/.exec(arr[i]);
                var j,len;
                var a= element.getElementByTagName("*");
                for(j=0, len=length; j<len; j++){

                }

            }
            else{
                element= element.getElementByTagName(arr[i])[0];

            }
            i++;
         }  
         return element;

         function hasClassName(element, className){
            if(!element.hasClassName) return false;
            var array= [];
                array= element.className.split(' ');
                for(var i=0, len= array.length; i<len; i++){
                    if(array[i]==className) {return true;}
                }
                return false;
         }
    }
    window.$=$;
})