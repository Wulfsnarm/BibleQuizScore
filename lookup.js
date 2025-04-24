//////////// TEXT SEARCH FUNCTION ////////////////////
function search(){
	var result_string = "";
	
	var search_string = document.getElementById("search_field").value;
	
	search_string = search_string.replaceAll(/(\s*,\s*)+/g, ",");
	
	search_string = search_string.split(","); 
	
	//console.log(search_string);

    //if search_string empty return full data set
    if (search_string == ""){
        for (book in data){
			for (chapter in data[book]){
				for (verse in data[book][chapter]){
                    result_string = result_string + "<b>" + book + " " + chapter + ":" + verse + "</b> " + data[book][chapter][verse] + "\n\n";
                    //console.log(result_string);
                }
            }
        }
    }else{
        for (var x = 0; x < search_string.length; x++){
            extra = (search_string[x].match(/[+]/g) || []).length;
            vers_count = -1;
            //iterate through each verse in data set
            for (book in data){
                for (chapter in data[book]){
                    for (verse in data[book][chapter]){
                        vers_count++;

                        var txt = data[book][chapter][verse];
                        var match = true;
                        var book_match = false;
                        var chap_match = false;
                        var vers_match = false;
                        //console.log("search_string:");
                        //console.log(search_string);
                        //console.log("x: " + x);
                        var search_terms = search_string[x].split(" ");
                        
                        //iterate through individual search terms as long as they are not empty
                        //console.log(search_terms.length);
                        if (!(search_terms.length == 1 && search_terms[0] == "")){
                            pre_extra = [];
                            post_extra = [];

                            for (var y = 0; y < search_terms.length; y++){
                                var search = search_terms[y];
                                
                                //console.log("search: " + search);
                                if (search != "" && match){
                                    //search data string but remove any weird characters in the search string
                                    if (txt.search(RegExp("("+search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '')+")", "gi")) >= 0){
                                        match = true;
                                        //console.log("found");
                                    //search data string for specific book chapter and verse
                                    }else if (search.search(RegExp("([A-z]{1,20}[0-9]{1,3}\.[0-9]{0,2})", "gi")) >= 0){
                                        var search_book = search.slice(search.search(/[A-z]/), search.search(/[0-9]/));
                                        var search_chap = search.slice(search.search(/[0-9]/), search.search(/\./));
                                        var search_vers = search.slice(search.search(/\./) + 1, search.length);
                                        
                                        //console.log("Book(vers) " + book);
                                        //console.log("Chap(vers) " + search_chap);
                                        //console.log("Vers(vers) " + search_vers);
                                        
                                        if (book.search(RegExp("("+search_book.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")", "gi")) >= 0 && chapter.includes(search_chap) && verse.includes(search_vers)){
                                            match = true;
                                            vers_match = true;
                                        } else {
                                            match = false;
                                        }
                                        //console.log("reference");
                                    }else if (search.search(RegExp("([A-z]{1,20}[0-9]{1,3})", "gi")) >= 0){
                                        var search_book = search.slice(search.search(/[A-z]/), search.search(/[0-9]/));
                                        var search_chap = search.slice(search.search(/[0-9]/), search.length);
                                        
                                        //console.log("Book(chap) " + search_book);
                                        //console.log("Chap(chap) " + search_chap);
                                        
                                        if (book.search(RegExp("("+search_book.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+")", "gi")) >= 0 && chapter.includes(search_chap)){
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
                                highlight_arr = txt.split(/[<>]+/);
                            
                                //console.log("highlighting");
                                
                                regex_string = "";
                                
                                replace_obj = {};
                            
                                for (var y = 0; y < search_terms.length; y++){
                                    var search = search_terms[y];
                                    
                                    //console.log(search_terms.length);
                                    
                                    if (regex_string == "")
                                        regex_string = "("+search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '')+")";
                                    else
                                        regex_string = regex_string + "|("+search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '')+")";
                                }
                                
                                var regex = new RegExp(regex_string, "gi");
                                
                                console.log(regex);
                                
                                highlight = "";
                                for (h = 0; h < highlight_arr.length; h++){
                                    if (!highlight_arr[h].includes("span")){
                                        highlight = highlight + highlight_arr[h].replace(regex, function (matched) {
                                            return "<span class='highlight'>"+matched+"</span>";
                                        });
                                    }else{
                                        highlight = highlight + "<" + highlight_arr[h] + ">"
                                    }
                                }
    
                                //console.log(highlight);
                                
                                if (!book_match && !chap_match && !vers_match){
                                    pre_n_post = extra_verses(extra, data, book, chapter, verse, result_string);
                                    result_string = result_string + pre_n_post[0] + "<b>" + book + " " + chapter + ":" + verse + "</b> " + highlight + "\n" + pre_n_post[1] + "\n";
                                } else if (book_match) {
                                    pre_n_post = extra_verses(extra, data, book, chapter, verse, result_string);
                                    result_string = result_string + pre_n_post[0] + "<b><span class='highlight'>" + book + "</span> " + chapter + ":" + verse + "</b> " + highlight + "\n" + pre_n_post[1] + "\n";
                                } else if (chap_match) {
                                    pre_n_post = extra_verses(extra, data, book, chapter, verse, result_string);
                                    result_string = result_string + pre_n_post[0] + "<b><span class='highlight'>" + book + " " + chapter + "</span>:" + verse + "</b> " + highlight + "\n" + pre_n_post[1] + "\n";
                                } else if (vers_match) {
                                    pre_n_post = extra_verses(extra, data, book, chapter, verse, result_string);
                                    result_string = result_string + pre_n_post[0] + "<b><span class='highlight'>" + book + " " + chapter + ":" + verse + "</span></b> " + highlight + "\n" + pre_n_post[1] + "\n";
                                }
                            }
                        }
                    }
                }
            }
        }
    }
	$("#results_box").html(result_string);
    searchOptions();
}

function extra_verses(count, data, book, chap, vers, result_string){
    pre_result = "";
    post_result = "";
    verse_list = Object.keys(data[book][chap])
    if (count > 0){
        for (ext_i = 1; ext_i <= count; ext_i++){
            if (verse_list.indexOf(vers)-ext_i >= 0){
                pre_verse = verse_list[verse_list.indexOf(vers)-ext_i]
                pre_result = "<b>" + book + " " + chap + ":" + pre_verse + "</b> " + data[book][chap][pre_verse] + "\n" + pre_result;
            }
            if (verse_list.indexOf(vers)+ext_i < verse_list.length){
                post_verse = verse_list[verse_list.indexOf(vers)+ext_i]
                post_result = post_result + "<b>" + book + " " + chap + ":" + post_verse + "</b> " + data[book][chap][post_verse] + "\n";
            }
        }
    }
    return [pre_result, post_result];
}

function init_settings(){	
	
    //check if stored settings exist
	if (localStorage.getItem('settings')){
        //set division based on storage
        settings = localStorage.getItem('settings').split(",")
        for (x = 0; x < document.getElementById("division").children.length; x ++){
            (parseInt(settings[2]) == x) ? document.getElementById("division").children[x].selected = true : document.getElementById("division").children[x].selected = false;
        }
    }else{
        for (x = 0; x < document.getElementById("division").children.length; x ++){
            (parseInt(0) == x) ? document.getElementById("division").children[x].selected = true : document.getElementById("division").children[x].selected = false;
        }
    }
}

function set_settings(){
	
    if (localStorage.getItem('settings')){
        //set division based on storage
        settings = localStorage.getItem('settings').split(",")

        var redTeam = parseInt(settings[0]);
        
        var yellowTeam = parseInt(settings[1]);
        
        var division = $("select[id='division'] option:selected").index();
        
        var tenpointRed = parseInt(settings[3]);
        
        var tenpointYellow = parseInt(settings[4]);
    }
	
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

    console.log("set_division");
    search();
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

function debounce(callback, ms) {
    var timer = 0;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}

$(document).ready(function(){

    init_settings();
	
	set_division();

    search();

	//////////// TEXT SEARCH FUNCTION ////////////////////
	$("#search_field").keyup(debounce(function(e){search();}, 300));
});