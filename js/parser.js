window.parser = (function(){
  var globalHTML;
  var globalArrayProp;
  var bind_parents = {};
  var bind_parents_child = {};
  if (!Object.prototype.watch)
    Object.prototype.watch = function (prop, handler) {
        var oldval = this[prop], newval = oldval,
        getter = function () {
            return newval;
        },
        setter = function (val) {
            oldval = newval;
            return newval = handler.call(this, prop, oldval, val);
        };
        if (delete this[prop]) { // can't watch constants
            if (Object.defineProperty) // ECMAScript 5
                Object.defineProperty(this, prop, {
                    get: getter,
                    set: setter
                });
            else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
                Object.prototype.__defineGetter__.call(this, prop, getter);
                Object.prototype.__defineSetter__.call(this, prop, setter);
            }
        }
    };

// object.unwatch
if (!Object.prototype.unwatch)
    Object.prototype.unwatch = function (prop) {
        var val = this[prop];
        delete this[prop]; // remove accessors
        this[prop] = val;
    };
  String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};
document.getElementsByAttribute = Element.prototype.getElementsByAttribute = function(attr) {
    var nodeList = this.getElementsByTagName('*');
    var nodeArray = [];

    for (var i = 0, elem; elem = nodeList[i]; i++) {
        if ( elem.getAttribute(attr) ) nodeArray.push(elem);
    }

    return nodeArray;
};
var find_parent_node = function(html,temp,object){
  var temp_element = document.createElement("div");
  temp_element.style.display = "none";
  temp_element.innerHTML = html;

  var array = temp_element.getElementsByAttribute("searchIt");

  var result = [];
  for(i=0;i<array.length;i++){

    if(array[i].getAttribute("searchIt")=="@"+object+"@"){
      result.push(array[i].parentNode);
    }
  }
  return result;
};
var addObserve = function(object,value){
  object.watch(value, function (id, oldval, newval) {
    var current_array = bind_parents[id];
    for(i=0;i<current_array.length;i++){
      var new_element = document.createElement("div");
      new_element.innerHTML = bind_parents_child[id][i];

    var elements = new_element.getElementsByAttribute("searchAb");

    for(k=0;k<elements.length;k++){

      if(elements[k].getAttribute("searchAb")==id){

        elements[k].innerHTML = newval;
      }
    }

    current_array[i].innerHTML = new_element.innerHTML;
    var new1 = current_array[i].getElementsByAttribute("searchAb");
    for(x=0;x<new1.length;x++){
      var child_nodes = new1[x].childNodes;
      var parent = new1[x].parentNode;
      for(xx=0;xx<child_nodes.length;xx++){
        parent.insertBefore(child_nodes[xx],new1[x]);
      }
      parent.removeChild(new1[x]);

    }
    }
    return newval;
  });
}
 return{
   init: function(object){


     if(!object || object["parse"]==undefined)
     {
       throw("Can't get the parse property completely");
       return false;
     }
object.parse();
     var value,temp,other_html,parent,random,attra;
     var html = document.documentElement.innerHTML;
     other_html = html;
     globalHTML = html;
     var array = html.match(/\{{(.*?)\}}/g);

for(i=0;i<array.length;i++){
console.log(i);
temp = String(array[i]);
value = String(array[i]);
value = value.replaceAll("{{","");
value = value.replaceAll("}}","");

if(object[value]){
  other_html = html;
  random = Math.floor(Math.random() * 10 +1);
  html = html.replaceAll(temp,"<span searchAb='"+value+"'>" + object[value] + "</span>");

  addObserve(object,value);

other_html = other_html.replaceAll(temp,"<span searchIt='@"+value + "@'>"+object[value]+"</span>");


}

}
document.documentElement.innerHTML = html;
attra = document.getElementsByAttribute("searchAb");
for(i=0;i<attra.length;i++){
  var se = attra;
  for(var k in object){
  if(attra[i].getAttribute("searchAb")==k){
var parent_main = attra[i].parentNode;
var html_se = parent_main.innerHTML;
if(bind_parents[k]){
bind_parents[k].push(parent_main);
bind_parents_child[k].push(parent_main.innerHTML);
}
else{
bind_parents[k] = [parent_main]
bind_parents_child[k] = [parent_main.innerHTML];
}

var child_nodes = attra[i].childNodes;
for(k=0;k<child_nodes.length;k++){
  parent_main.insertBefore(child_nodes[k],attra[i]);
}
parent_main.removeChild(attra[i]);
  }
}
}
console.log(bind_parents);
   }
 }
})(window,document);
