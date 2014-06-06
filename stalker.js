
//var QUERY = 'architv';

var kittenGenerator = {
 
  codechefurl: 'http://www.codechef.com/',

  requestKittens: function() {
    var req = new XMLHttpRequest();
    req.open("GET", this.codechefurl, false);
    ///req.send();
    console.log(req.status);
    console.log(req.statusText);
    console.log(req.responseText);
    console.log(req.responseXML);
    //req.onload = this.showPhotos_.bind(this);
    req.send(null);
  },
};

  
// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  kittenGenerator.requestKittens();
});