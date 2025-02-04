//////////// TEXT SEARCH FUNCTION ////////////////////
function search(){
	var result_string = "";
	
	var search_string = document.getElementById("search_field").value;
	
	search_string = search_string.replaceAll(/(\s*,\s*)+/g, ",");
	
	search_string = search_string.split(","); 
	
	//console.log(search_string);

    if (search_string == ""){
        for (book in data){
			for (chapter in data[book]){
				for (verse in data[book][chapter]){
                    result_string = result_string + "<b>" + book + " " + chapter + ":" + verse + "</b> " + data[book][chapter][verse] + "\n\n";
                    //console.log(result_string);
                }
            }
        }
    }
		
	for (var x = 0; x < search_string.length; x++){
		for (book in data){
			for (chapter in data[book]){
				for (verse in data[book][chapter]){
					txt = data[book][chapter][verse];
					var match = true;
					var book_match = false;
					var chap_match = false;
					var vers_match = false;
					var search_terms = search_string[x].split(" ");
					
					//console.log(search_terms.length);
					if (!(search_terms.length == 1 && search_terms[0] == "")){
						for (var y = 0; y < search_terms.length; y++){
							var search = search_terms[y];
							
							//console.log("search: " + search);
							if (search != "" && match){
								if (txt.search(RegExp("("+search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")", "gi")) >= 0){
									match = true;
									//console.log("found");
								}else if (search.search(RegExp("([A-z]{1,20}[0-9]{1,3}\.[0-9]{1,2})", "gi")) >= 0){
									var search_book = search.slice(search.search(/[A-z]/), search.search(/[0-9]/));
									var search_chap = search.slice(search.search(/[0-9]/), search.search(/\./));
									var search_vers = search.slice(search.search(/\./) + 1, search.length);
									
									//console.log("Book " + book);
									//console.log("Chap " + search_chap);
									//console.log("Vers " + search_vers);
									
									if (book.search(RegExp("("+search_book.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")", "gi")) >= 0 && chapter == search_chap && verse == search_vers){
										match = true;
										vers_match = true;
									} else {
										match = false;
									}
									//console.log("reference");
								}else if (search.search(RegExp("([A-z]{1,20}[0-9]{1,3})", "gi")) >= 0){
									var search_book = search.slice(search.search(/[A-z]/), search.search(/[0-9]/));
									var search_chap = search.slice(search.search(/[0-9]/), search.length);
									
									//console.log("Book " + book);
									//console.log("Chap " + search_chap);
									
									if (book.search(RegExp("("+search_book.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")", "gi")) >= 0 && chapter == search_chap){
										match = true;
										chap_match = true;
									} else {
										match = false;
									}
									//console.log("reference");
								}else if (book.search(RegExp("("+search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")", "gi")) >= 0){
										match = true;
										book_match = true;
									//console.log("reference");
								}else{
									match = false;
									//console.log("no match");
								}
							}
						}
						
						var highlight = "";
						
						if (match)	{		
							highlight = txt;
						
							//console.log("highlighting");
							
							regex_string = "";
							
							replace_obj = {};
						
							for (var y = 0; y < search_terms.length; y++){
								var search = search_terms[y];
								
								//console.log(search_terms.length);
								
								if (regex_string == "")
									regex_string = "("+search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")";
								else
									regex_string = regex_string + "|("+search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")";
							}
							
							var regex = new RegExp(regex_string, "gi"); 
							
							//console.log(regex);
							highlight = highlight.replace(regex, function (matched) {
										return "<span class='highlight'>"+matched+"</span>";
									});
							//console.log(highlight);
							
							if (!book_match && !chap_match && !vers_match){
								result_string = result_string + "<b>" + book + " " + chapter + ":" + verse + "</b> " + highlight + "\n\n";
							} else if (book_match) {
								result_string = result_string + "<b><span class='highlight'>" + book + "</span> " + chapter + ":" + verse + "</b> " + highlight + "\n\n";
							} else if (chap_match) {
								result_string = result_string + "<b><span class='highlight'>" + book + " " + chapter + "</span>:" + verse + "</b> " + highlight + "\n\n";
							} else if (vers_match) {
								result_string = result_string + "<b><span class='highlight'>" + book + " " + chapter + ":" + verse + "</span></b> " + highlight + "\n\n";
							}
						}
					}
				}
			}
		}
	}
	$("#results_box").html(result_string);
}

function init_settings(){	
	
	var settings = localStorage.getItem('settings').split(",");
	
	//set division based on storage
	for (x = 0; x < document.getElementById("division").children.length; x ++){
		(parseInt(settings[2]) == x) ? document.getElementById("division").children[x].selected = true : document.getElementById("division").children[x].selected = false;
	}
}

function set_settings(){
	
    var settings = localStorage.getItem('settings').split(",");

	var redTeam = parseInt(settings[0]);
	
	var yellowTeam = parseInt(settings[1]);
	
	var division = $("select[id='division'] option:selected").index();
	
	var tenpointRed = parseInt(settings[3]);
	
	var tenpointYellow = parseInt(settings[4]);
	
	localStorage.setItem('settings', redTeam + "," + yellowTeam + "," + division + "," + tenpointRed + "," + tenpointYellow);
	
	set_division();
}

function set_division(){ //sets the division of competition (junior, senior)
	switch($("#division option:selected").text().toLowerCase()){
		case "beginner":
			data = JSON.parse(beginner);
		break;
		case "junior":
			data = JSON.parse(junior);
		break;
		case "intermediate":
			data = JSON.parse(intermediate);
		break;
		default:
			data = JSON.parse(experienced);
		break;
	}
}

function openNav() {
	document.getElementById("side-panel").style.width = "350px";
}

function closeNav() {
	document.getElementById("side-panel").style.width = "0";
}

function searchOptions(){
    if(document.getElementById("otw").checked){
        elements = document.getElementsByClassName('stdytlsotw');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.color='blue';
        }
    }else{
        elements = document.getElementsByClassName('stdytlsotw');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.color='black';
        }
    }

    if(document.getElementById("ttw").checked){
        elements = document.getElementsByClassName('stdytlsttw');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.color='green';
        }
    }else{   
        elements = document.getElementsByClassName('stdytlsttw');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.color='black';
        }
    }

    if(document.getElementById("rtw").checked){
        elements = document.getElementsByClassName('stdytlsrtw');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.color='red';
        }
    }else{  
        elements = document.getElementsByClassName('stdytlsrtw');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.color='black';
        }
    }
}

$(document).ready(function(){

    init_settings();
	
	set_division();

    search();
    
    searchOptions();

	//////////// TEXT SEARCH FUNCTION ////////////////////
	$("#search_field").keyup(function(){search();});
});