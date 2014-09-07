// stores data returned from ajax request
var idata;

// contest name
var contest = localStorage["contest"];

// stalking other users
var sub = document.getElementById("submit");

// user's codechef handle
var str = document.getElementById("store");

// add contest
var getcon = document.getElementById("getcon");

// reference to infodiv
var info = document.getElementById("info");

// stores user's rank among friends
var userrank;

// checks for user's codechef handle and displays the div accordingly
if((typeof localStorage["usern"]) === 'undefined') {
	document.getElementById('usern').style.display = "block";
}

// check if the contest's name is set
else if((typeof localStorage["contest"]) === 'undefined') {
	document.getElementById('contest').style.display = "block";
	var division = document.getElementById('contest');
	
	sendContests(division.id);
}

// display the table
else {
	document.getElementById('inp').style.display = "block";
	info.style.display = "block";
	document.getElementById('tabs').style.display = "block";
	infodiv(true);
	tabs();
	sendrequest(contest);
}

// event listener for stalking other users
sub.addEventListener(
	"click", 
	function(){
		var inp = document.getElementById("input").value;
		var span1=document.getElementById('validatehandle_2');
		if (validateRegEx(/^[A-z]{1}[A-z0-9_]{3,13}$/, inp) && inp != "") {
			storenames(inp);
			// span1.innerHTML='';
			document.getElementById("input").value='';
			getData(idata);
		}
		else {
			span1.innerHTML='Invalid handle';
		}
	},
	true
);

// event listener for adding user's codechef handle
str.addEventListener(
	"click", 
	function(){
		var inpu = document.getElementById("in").value;
		var span1=document.getElementById('validatehandle_1');
		if (validateRegEx(/^[A-z]{1}[A-z0-9_]{3,13}$/, inpu) && inpu != "") {
			localStorage.setItem('usern', inpu);
			span1.innerHTML='';
			storenames(inpu);
			document.getElementById('usern').style.display = "none";
			document.getElementById('contest').style.display = "block";
		}
		else {
			span1.innerHTML='Invalid handle';
		}
	},
	true
);

// event listener for adding contest
getcon.addEventListener(
	"click", 
	function() {
		var conname = (document.getElementById('tags').value).toUpperCase();
		var span1=document.getElementById('validatecontest_1');
		if (validateRegEx(/^[a-zA-Z0-9]*$/, conname) && conname != '') {
			
			span1.innerHTML='';
			localStorage.setItem('contest', conname);
			document.getElementById('contest').style.display = "none";
			document.getElementById('inp').style.display = "block";
			document.getElementById('tabs').style.display = "block";
			info.style.display = "block";
			infodiv(true);
			tabs();
			sendrequest(conname);
		}
		else {
			span1.innerHTML='Invalid Contest';
		}
	},
	true
);

function validateRegEx(regex, inputStr) {
	if(!regex.test(inputStr))
		return false;
	else
		return true;
}


// this is where the magic happens
function sendrequest(conname) {
	$.ajax({
		type:'GET',
		url: "http://stalk-coder.appspot.com/?conname="+conname,
		beforeSend: function () {
	      	$("#target").loadingOverlay();
		},
	    success: function (data) {
	    	$('#target').loadingOverlay('remove');
	    	idata = data;
			getData(idata);
			//infodiv(true);
	    },
	});
}

// get the names of 5 recent contests
function sendContests(division) {
	$.ajax({
		type:'GET',
		url: "http://stalk-coder.appspot.com/precontests",
	    success: function (data) {
	    	if (division.id === 'info')
	    		getContests('info',data);
	    	else
	    		getContests(division, data);
	    },
	});
}

// show tabs
function tabs() {
	$(function() {
      $("#tabs").tabs();
    });
}

sendContests('info');

// add codechef handles to localstorage
function storenames(inp) {
	var names = [];
	if((typeof localStorage["data"]) === 'undefined') {
		names.push(inp);
		localStorage.setItem('data', JSON.stringify(names));
	}
	else {
		names = JSON.parse(localStorage.getItem('data'));
		var span1 = document.getElementById('validatehandle_2');
		if (names.indexOf(inp) > -1) {
			span1.innerHTML = "User exists";
		}
		else {
			names.push(inp);
			span1.innerHTML = "";	
			localStorage.setItem('data', JSON.stringify(names));
		}
	}
}

// displays the data fetched from ajax request
function getData(idata) {
	var flag = false;
	
	var totdata = JSON.parse(idata);
	var userlist = JSON.parse(localStorage.getItem('data'));
	var ranks = [];
	
	var inactive = [];
	for (var i = 0; i < userlist.length; i++) {
		var uname = userlist[i];
		
		if (totdata.hasOwnProperty(uname)) {
			
			ranks.push([uname, totdata[uname][0], totdata[uname][1]]);
		}
		else {
			
			inactive.push(i);
		}
	}
	ranks.sort(function(a, b) {return a[1] - b[1]});

	var new_data = '<table style="width:100%; border-collapse: collapse; margin-left: 0px;text-align: center; vertical-align: middle;"><tr style="background-color: rgba(171,226,246, .5);"><th>Rank</th><th>Username</th><th>Score</th><th>Curr Rank</th><th>Rem</th></tr>';
	var j = 1;
	for (var i = ranks.length - 1; i >= 0; i--) {
		
		
		if (ranks[i][0] == localStorage.getItem('usern')) {
			new_data += '<tr style="background-color: rgba(56,121,153, 0.5);"><td>'+ j + '</td><td class="user_inactive"><a href="http://www.codechef.com/users/'+ranks[i][0]+'/" target="_blank">' + ranks[i][0] + '</td><td>' + ranks[i][1] + '</td><td>' + ranks[i][2] + '</td><td><a id="' +ranks[i][0]+ '" href="javascript:void(0)" style="text-decoration:none;color:red;" class = "close">x</a></td></tr>'; 
			userrank = j;
			flag = true;
			j = j + 1;
		}
		else if (j%2 == 0) {
			new_data += '<tr style="background-color: rgba(193,245,241, .3);"><td>'+ j + '</td><td class="user_inactive"><a href="http://www.codechef.com/users/'+ranks[i][0]+'/" target="_blank">' + ranks[i][0] + '</td><td>' + ranks[i][1] + '</td><td>' + ranks[i][2] + '</td><td><a id="' +ranks[i][0]+ '" href="javascript:void(0)" style="text-decoration:none;color:red;" class = "close">x</a></td></tr>';
			j = j + 1;
		}
		else {
			new_data += '<tr><td>'+ j + '</td><td class="user_inactive"><a href="http://www.codechef.com/users/'+ranks[i][0]+'/" target="_blank">' + ranks[i][0] + '</td><td>' + ranks[i][1] + '</td><td>' + ranks[i][2] + '</td><td><a id="' +ranks[i][0]+ '" href="javascript:void(0)" style="text-decoration:none;color:red;" class = "close">x</a></td></tr>';
			j = j + 1;
		}
	}
	new_data += '</table>';
	var div = document.getElementById("probdiv");
	div.innerHTML = new_data;
	in_data = '<table style="width:100%; border-collapse: collapse; margin-left: 0px;text-align: center; vertical-align: middle;"><tr style="background-color: rgba(171,226,246, .5);"><th>Username</th><th>Rem</th>';
	var indiv = document.getElementById("inprobdiv");
	if(inactive.length > 0) {
		
		for (var i = 0; i < inactive.length; i++) {
			
			in_data += '<tr><td><a href="http://www.codechef.com/users/'+userlist[inactive[i]]+'/" target="_blank">' + userlist[inactive[i]] + '</td><td><a id="' +userlist[inactive[i]]+ '" href="javascript:void(0)" style="text-decoration:none;color:red;" class = "close">x</a></td></tr>';
		}
	}
	in_data += '</table>';
	indiv.innerHTML = in_data;
	infodiv(flag);
}

document.querySelector('body').addEventListener('click', function(event) {
	
	if (event.target.tagName.toLowerCase() === 'a') {

		if(event.target.className === "close") {
			
			var rem = event.target.id;
	  		
	  		var names = [];
	  		names = JSON.parse(localStorage.getItem('data'));
	  		var index = names.indexOf(rem);
	  		names.splice(index, 1);
	  		localStorage.setItem('data', JSON.stringify(names));
	  		getData(idata);
		}

		else if(event.target.id === 'edit') {
			
			document.getElementById('myuser').style.display = 'none';
			document.getElementById('user_edit').value = localStorage.getItem('usern');
			document.getElementById('change').style.display = 'block';
		}
  	

  		else if (event.target.id === 'ed') {
	  		var inp = document.getElementById("user_edit").value;
	  		var span1=document.getElementById("validateuser_1");
	  		if (validateRegEx(/^[A-z]{1}[A-z0-9_]{3,13}$/, inp) && inp != "") {
				localStorage.setItem('usern', inp);
				infodiv(false);
				span1.innerHTML='';
				storenames(inp);
				getData(idata);
				document.getElementById('change').style.display = "none";
				document.getElementById('myuser').style.display = "block";
			}
			else {
				span1.innerHTML='Invalid handle';
			}
  		}

  		else if(event.target.id === 'choose') {
  			var con = (document.getElementById('tags1').value).toUpperCase();
  			var span1=document.getElementById("validatecontest_2");
  			
  			if (con === 'NULL') {
  				con='';
  			}
  			else if(validateRegEx(/^[a-zA-Z0-9]*$/, con) && con!=''){
	  			localStorage.setItem('contest',con);
	  			
	  			sendrequest(con);
	  			span1.innerHTML='';
  			}
  			else {
  				span1.innerHTML='Invalid Contest';
  			}
  		}
  	}
});

// display data in infodiv
function infodiv(flag) {
	
	(info.getElementsByTagName("span"))[0].innerText = localStorage.getItem('usern');
	
	if (flag) {
		(info.getElementsByTagName("span"))[1].innerText = "Your Rank is " + userrank; 
	}
	else {
		(info.getElementsByTagName("span"))[1].innerText = "Your Rank is not available"; 
	}
	(info.getElementsByTagName("span"))[2].innerText = localStorage.getItem('contest');
}

// fetch recent contest names
function getContests(division, data) {
	var realdata = JSON.parse(data);
	
    
    $(function() {
	    var availableTags = realdata;
	   
		$( "#tags1" ).autocomplete({
			source: availableTags
		});
		
		$( "#tags" ).autocomplete({
			source: availableTags
		});	
	});
}

$("#in").autocomplete({
    source: function (request, response) {
        $.getJSON("http://www.codechef.com/submission/autocomplete/handle?term=" + request.term, function (data) {
            response(data.slice(0, 5));
        });
    },
    minLength: 1,
    delay: 100
});
$("#input").autocomplete({
    source: function (request, response) {
        $.getJSON("http://www.codechef.com/submission/autocomplete/handle?term=" + request.term, function (data) {
            response(data.slice(0, 5));
        });
    },
    minLength: 1,
    delay: 100
});
