var data;

var red_CE    = [[0,0],[0,0],[0,0],[0,0],[0,0]];
var yellow_CE = [[0,0],[0,0],[0,0],[0,0],[0,0]];

var contests = [[0,0],[0,0]];

var r1 = 0;
var r2 = 1; 
var r3 = 2;

var y1 = 0;
var y2 = 1;
var y3 = 2;

var time = 0;
var timervar;

//score row [ 0 - RPoint = int,
//			  1 - YPoint = int,
//			  2 - interruption = bool, 
//			  3 - correct = R1, 
//			  4 - incorrect = [R1, Y1], 
//			  5 - foul = [R1, R, Y2, Y], 
//			  6 - TO = [R, Y], 
//			  7 - Contest = [[R, W], [Y, G]], 
//			  8 - complete = bool,
//			  9 - substitution = [[R4 (comes in), R1(goes out)],[Y4 (comes in), Y1(goes out)]]
//			];

var current_buzzed = [];
var scoresheet = [["","","","","","","","","",""]];
var curr_quest = 1;
var quiz_out;

var lineup = [0,1,2,0,1,2];

function openNav() {
	document.getElementById("side-panel").style.width = "350px";
}

function closeNav() {
	document.getElementById("side-panel").style.width = "0";
}

function saveTeam() {
	document.getElementsByClassName('team-add')[0].style.display = 'none';
	
	try {
		var teams_json = JSON.parse(localStorage.getItem('teamsList'));
	}
	catch(err){
		var teams_json = JSON.parse('{}');
	}
	
	teams_json[document.getElementById('teamName').value] = JSON.parse('[{}]');
	for (var x = 1; x <= 5; x++){
		teams_json[document.getElementById('teamName').value][x] = document.getElementById('quizzer'+x).value;
		document.getElementById('quizzer'+x).value = "";
		//console.log(document.getElementById('quizzer'+x).value);
		//console.log(teams_json);
	}
	document.getElementById('teamName').value = "";
	
	localStorage.setItem('teamsList', JSON.stringify(teams_json));
	loadTeam();
}

function loadTeam() {
	default_html = "<option>Generic Team</option>";
	teams_html = "";
	
	try {
		var teams_json = JSON.parse(localStorage.getItem('teamsList'));
	}
	catch(err){
		var teams_json = JSON.parse('{}');
	}
	
	for (var team in teams_json){
		team.replaceAll('"', '');
		teams_html = teams_html + "<option>" + team + "</option>";
	}
	
	document.getElementById("redTeam").innerHTML = default_html + teams_html;
	document.getElementById("yellowTeam").innerHTML = default_html + teams_html;
	document.getElementById("teamRemoval").innerHTML = teams_html;
}

function removeTeam(){
	teams_json = JSON.parse(localStorage.getItem("teamsList"));
	
	console.log(teams_json);
	delete teams_json[document.getElementById('teamRemoval').value];
	
	localStorage.setItem("teamsList", teams_json);
	
	console.log(teams_json);
	
	loadTeam();
}

function selectTeam(color){
	var teamList = JSON.parse(localStorage.getItem('teamsList'));
	
	html_string = '';
	
	if (document.getElementById(color + "Team").value == "Generic Team"){
		for (var x = 1; x < 6; x++){
			html_string = html_string + '<option>Generic ' + x + '</option>';
			
			if (color == "yellow"){
				document.getElementsByTagName("thead")[0].children[0].children[x+6].classList.remove("vertical");
				document.getElementsByTagName("thead")[0].children[0].children[x+6].innerHTML = color[0].toUpperCase() + x;
			}else{
				document.getElementsByTagName("thead")[0].children[0].children[x].classList.remove("vertical");
				document.getElementsByTagName("thead")[0].children[0].children[x].innerHTML = color[0].toUpperCase() + x;
			}
		}
		
		for (var x = 1; x < 4; x ++){
			document.getElementById(color + "quizzer" + x).innerHTML = html_string;
			document.getElementById(color + "quizzer" + x).children[x-1].selected = true;
		}
	} else {
		for (var x = 1; x < 6; x++){
			html_string = html_string + '<option>' + teamList[document.getElementById(color + "Team").value][x] + '</option>';
			
			if (color == "yellow"){
				document.getElementsByTagName("thead")[0].children[0].children[x+6].classList.add("vertical");
				document.getElementsByTagName("thead")[0].children[0].children[x+6].innerHTML = teamList[document.getElementById(color + "Team").value][x];
			}else{
				document.getElementsByTagName("thead")[0].children[0].children[x].classList.add("vertical");
				document.getElementsByTagName("thead")[0].children[0].children[x].innerHTML = teamList[document.getElementById(color + "Team").value][x];
			}
		}
		
		for (var x = 1; x < 4; x ++){
			document.getElementById(color + "quizzer" + x).innerHTML = html_string;
			document.getElementById(color + "quizzer" + x).children[x-1].selected = true;
		}
	}
}

function timeOut(color){
	console.log("time out " + color);
	var to_count = parseInt(document.getElementById(color+"TOBar").innerHTML.split(" ")[1].split("/")[0]);
	console.log(to_count);
	document.getElementById(color+"TOBar").innerHTML = "TO " + (to_count + 1) + "/2";
	if (to_count + 1 >= 2){
		document.getElementById(color+"TO").disabled = true;
	}
	
	run_timer(60);
}

function buzzed(color, quizzer){
	document.getElementById("quizzers").style.display = "none";
	document.getElementById("answer").style.display = "block";
	
	run_timer(30);
	
	current_buzzed = [color, quizzer-1];
	
	switch(color) {
		case "red":
			var correct = red_CE[quizzer][0];
			var incorrect = red_CE[quizzer][1];
			var quizzer_name = $("#"+color+"quizzer"+quizzer+" option:selected").text();
		break;
		case "yellow":
			var correct = yellow_CE[quizzer][0];
			var incorrect = yellow_CE[quizzer][1];
			var quizzer_name = $("#"+color+"quizzer"+quizzer+" option:selected").text();
		break;
	}
	
	var answer_area = '<div class="' + color + '-answer-header"><div class="row"><p class="col-6">' + color.substring(0,1).toUpperCase() + quizzer + '</p><p class="col-4 answer-record"><span style="color:green">' + correct + "</span> / <span style='color:red'>" + incorrect + '</span></p></div><div class="row"><p>' + quizzer_name + '</p></div></div><div class="answer-button"><input class="form-check-input" type="checkbox" id="interruption" name="interruption" value="I"><label for="interruption">Interruption</label></div><button class="btn col-12 answer-button btn-success" onclick="judgment(0)">Correct</button><button class="btn col-12 answer-button btn-danger" onclick="judgment(1)">Incorrect</button><button type="button" class="btn btn-danger coach-button col-3" id="redFoul" onclick="">Red<br>Foul</button><button type="button" class="btn btn-warning coach-button col-3" id="yellowFoul" onclick="">Yellow<br>Foul</button>';
	
	$( "#answer" ).removeClass( "red-answer yellow-answer" );
	$( "#answer" ).addClass( color + "-answer" );
	
	document.getElementById("answer").innerHTML = answer_area;
	
	if (typeof scoresheet[curr_quest] != "undefined"){
		if (typeof scoresheet[curr_quest][2] != "undefined"){
			if (scoresheet[curr_quest][2]){
				document.getElementById("interruption").disabled = true;
			}
		}
	}
}

function judgment(result){
// 0 is correct; 1 is error

//score row [ 0 - RPoint = int, 
//			  1 - YPoint = int, 
//			  2 - interruption = bool, 
//			  3 - correct = R1, 
//			  4 - incorrect = [R1, Y1], 
//			  5 - foul = [R1, R, Y2, Y], 
//			  6 - TO = [R, Y], 
//			  7 - Contest = [R1, Y2], 
//			  8 - complete = bool
//			];
	
	var interruption = document.getElementById("interruption").checked;

	switch(current_buzzed[0]){
		case "red":
			red_CE[current_buzzed[1]][result] += 1;
			if (red_CE[current_buzzed[1]][0] == quiz_out){
				alert(current_buzzed[0].substr(0,1).toUpperCase() + (parseInt(current_buzzed[1])+1) + " has quizzed out");
			} else if (red_CE[current_buzzed[1]][1] == 5){
				alert(current_buzzed[0].substr(0,1).toUpperCase() + (parseInt(current_buzzed[1])+1) + " has fouled out");
			}
		break;
		case "yellow":
			yellow_CE[current_buzzed[1]][result] = yellow_CE[current_buzzed[1]][result] + 1;
			if (yellow_CE[current_buzzed[1]][0] == quiz_out){
				alert(current_buzzed[0].substr(0,1).toUpperCase() + (parseInt(current_buzzed[1])+1) + " has quizzed out");
			} else if (yellow_CE[current_buzzed[1]][1] == 5){
				alert(current_buzzed[0].substr(0,1).toUpperCase() + (parseInt(current_buzzed[1])+1) + " has fouled out");
			}
		break;
	}
	
	if (curr_quest < 9){
		var point = 10;
	} else if (curr_quest < 18 || curr_quest > 20){
		var point = 20;
	} else {
		var point = 30;
	}
	
	while (scoresheet.length <= curr_quest){
		scoresheet.push([0,0,false,"",[],[],[],[],null,[]]);
	}
	
	//RPoint
	//scoresheet[curr_quest][0] = scoresheet[curr_quest-1][0] + (((current_buzzed[0] == "red") ? 1 : 0 ) * (1 - 1.5 * result) * point);
	
	//YPoint
	//scoresheet[curr_quest][1] = scoresheet[curr_quest-1][1] + (((current_buzzed[0] == "yellow") ? 1 : 0 ) * (1 - 1.5 * result) * point);
	
	if (result == 0){
		scoresheet[curr_quest][3] = current_buzzed[0][0].toUpperCase() + String(current_buzzed[1]);
	} else {
		scoresheet[curr_quest][4].push(current_buzzed[0][0].toUpperCase() + String(current_buzzed[1]));
	}
	
	if (scoresheet[curr_quest][2] != true){
		scoresheet[curr_quest][2] = interruption;
	}
	
	if (result == 1 && interruption){
		// question has been interrupted and is incorrect and is still going
		scoresheet[curr_quest][8] = false;
	} else {
		// question is completed
		scoresheet[curr_quest][8] = true;
		curr_quest += 1;
	}
	
	fill_score_sheet();
	
	run_timer(0);
	
	document.getElementById("quizzers").style.display = "block";
	document.getElementById("answer").style.display = "none";
	document.getElementById("timer").innerHTML = "--";
}

function run_timer(time_span){
	if (timervar != null){
		clearInterval(timervar);
		timervar = null;
	}
	time = time_span;
	timervar = setInterval(timer, 1000);
}

function timer(){
	if (time == 0 && document.getElementById("timer").innerHTML != "--"){
		document.getElementById("timer").innerHTML = "--";
		clearInterval(timervar);
		console.log("done");
	} else if (document.getElementById("timer").innerHTML == "--" && time > 0){
		document.getElementById("timer").innerHTML = time;
		console.log("start");
	} else if (time > 0) {
		time = time - 1;
		document.getElementById("timer").innerHTML = time;
		//console.log("decrement");
	} else {
		time = 0;
		document.getElementById("timer").innerHTML = "--";
		clearInterval(timervar);
		//console.log("illegal");
	}
}

function init_settings(){	
	loadTeam();
	
	var settings = localStorage.getItem('settings').split(",");
	
	for (x = 0; x < document.getElementById("division").children.length; x ++){
		if (parseInt(settings[2]) == x)
			document.getElementById("division").children[x].selected = true;
		else
			document.getElementById("division").children[x].selected = false;
	}
	
	build_score_sheet();
	
	for (x = 0; x < document.getElementById("redTeam").children.length; x ++){
		if (parseInt(settings[0]) == x)
			document.getElementById("redTeam").children[x].selected = true;
		else
			document.getElementById("redTeam").children[x].selected = false;
	}
	
	selectTeam("red");
	
	for (x = 0; x < document.getElementById("yellowTeam").children.length; x ++){
		if (parseInt(settings[1]) == x)
			document.getElementById("yellowTeam").children[x].selected = true;
		else
			document.getElementById("yellowTeam").children[x].selected = false;
	}
	
	selectTeam("yellow");
	
	if (parseInt(settings[3]))
		document.getElementById("tenpoint").checked = true;
	else
		document.getElementById("tenpoint").checked = false;
	
	set_tenpoint();
}

function set_settings(){
	
	var redTeam = $("select[id='redTeam'] option:selected").index();
	
	var yellowTeam = $("select[id='yellowTeam'] option:selected").index();
	
	var division = $("select[id='division'] option:selected").index();
	
	var tenpoint = document.getElementById("tenpoint").checked === true ? 1 : 0;
	
	localStorage.setItem('settings', redTeam + "," + yellowTeam + "," + division + "," + tenpoint);
	
	//loadTeam();
	
	set_tenpoint();
	
	build_score_sheet()
	
	selectTeam('red');
	
	selectTeam('yellow');
	
	set_division();
}

function select_quizzer(color, quizzer){
	//set quizzer equals index in list of quizzers from team
	var set_quizzer = $("#"+color+"quizzer"+quizzer+" option:selected").index();
	
	//create array of quzzers who are at the table
	var quizzers_selected = [$("#"+color+"quizzer1 option:selected").index(), $("#"+color+"quizzer2 option:selected").index(), $("#"+color+"quizzer3 option:selected").index()];
	
	console.log(quizzers_selected);
	
	for (var x = 0; x < 3; x ++){
		if (x != quizzer-1){
			console.log("not changed");
			if (quizzers_selected[x] == set_quizzer){
				console.log("change");
				do {
					var new_index = Math.floor(Math.random() * 4);
				} while (quizzers_selected.includes(new_index));
				document.getElementById(color+"quizzer"+(x+1)).selectedIndex = new_index;
			}
		}
	}
	
	if (curr_quest == 1){
		header = document.getElementById("header_row").children;
		
		// set header rows to quizzers selected for r1-3 or y1-3
		header[((color == "red")? 0 : 6 ) + 1].innerHTML = $("#"+color+"quizzer1 option:selected").text();
		header[((color == "red")? 0 : 6 ) + 2].innerHTML = $("#"+color+"quizzer2 option:selected").text();
		header[((color == "red")? 0 : 6 ) + 3].innerHTML = $("#"+color+"quizzer3 option:selected").text();
		
		//select other 2 names for 4 and 5
		index = 4;
		for (var x = 0; x < 6 && index < 6; x ++){
			//if match selected indexes then skip
			//console.log("quizzer1: " + $("#"+color+"quizzer1 option:selected").index());
			//console.log("quizzer2: " + $("#"+color+"quizzer2 option:selected").index());
			//console.log("quizzer3: " + $("#"+color+"quizzer3 option:selected").index());
			
			selected_quizzers = [$("#"+color+"quizzer1 option:selected").index(), $("#"+color+"quizzer2 option:selected").index(), $("#"+color+"quizzer3 option:selected").index()]

			if (!selected_quizzers.includes(x)){
				//console.log(index);
				header[((color == "red")? 0 : 6 ) + index].innerHTML = $("#"+color+"quizzer"+quizzer).children()[x].innerHTML;
				index ++;
			}
		}
		
		lineup = [$("#redquizzer1 option:selected").index(), $("#redquizzer2 option:selected").index(), $("#redquizzer3 option:selected").index(), $("#yellowquizzer1 option:selected").index(), $("#yellowquizzer2 option:selected").index(), $("#yellowquizzer3 option:selected").index()];
	} else {
		//substitution
		check_lineup = [$("#redquizzer1 option:selected").index(), $("#redquizzer2 option:selected").index(), $("#redquizzer3 option:selected").index(), $("#yellowquizzer1 option:selected").index(), $("#yellowquizzer2 option:selected").index(), $("#yellowquizzer3 option:selected").index()];
		
		for (var x = 0; x < 6; x ++){
			if (check_lineup[x] != lineup[x]){
				scoresheet[curr_quest - 1][9].push([((x < 3)? "R" : "Y") + (check_lineup[x] + 1), ((x < 3)? "R" : "Y") + (lineup[x] + 1)]);
				console.log("#" + ((x < 3)?"R":"Y") + (x%3+1) + "buzzer");
				$("#" + ((x < 3)?"R":"Y") + (x%3+1) + "buzzer").attr("onclick", "buzzed(" + ((x < 3)?"'red'":"'yellow'") + "," + (check_lineup[x]+1) + ")");
			}
		}
		
		lineup = [$("#redquizzer1 option:selected").index(), $("#redquizzer2 option:selected").index(), $("#redquizzer3 option:selected").index(), $("#yellowquizzer1 option:selected").index(), $("#yellowquizzer2 option:selected").index(), $("#yellowquizzer3 option:selected").index()];
		
		fill_score_sheet();
	}
}

function fill_score_sheet() {
	var row = null;
	
	red_CE = [[0,0],[0,0],[0,0],[0,0],[0,0]];
	yellow_CE = [[0,0],[0,0],[0,0],[0,0],[0,0]];
	
	for (var i = 1; i < scoresheet.length; i++) {
		var pointValue = 10
		if (i > 8) pointValue = pointValue + 10;
		if (i > 17) pointValue = pointValue + 10;
		
		row = document.getElementById("q" + String(i)).children;
		
		//recalculate and write Red Score
		scoresheet[i][0] = scoresheet[i-1][0] + (((scoresheet[i][3][0] == "R" || scoresheet[i][4].some(e => /(R)/g.test(e))) ? 1 : 0 ) * (1 - 1.5 * ((scoresheet[i][3][0] == "R") ? 0 : 1)) * pointValue);
		
		row[0].innerHTML = "<div style='position:relative; width: 100%; height: 100%'>" + scoresheet[i][0] + "<span class='lower-right-corner'> </span></div>";
		
		//recalculate and write Yellow Score
		scoresheet[i][1] = scoresheet[i-1][1] + (((scoresheet[i][3][0] == "R" || scoresheet[i][4].some(e => /(R)/g.test(e))) ? 1 : 0 ) * (1 - 1.5 * ((scoresheet[i][3][0] == "R") ? 0 : 1)) * pointValue);
		
		row[12].innerHTML = "<div style='position:relative; width: 100%; height: 100%'>" + scoresheet[i][1] + "<span class='lower-left-corner'> </span></div>";;
		
		// record incorrects first to appropriate CE counter
		for (var b = 0; b < scoresheet[i][4].length; b++){
			if (scoresheet[i][4][b][0] == "R"){
				red_CE[scoresheet[i][4][b][1]][1] += 1
			} else {
				yellow_CE[scoresheet[i][4][b][1]][1] += 1
			}
		}
		
		//write correct to appropriate CE counter
		if (scoresheet[i][3] != ""){
			if (scoresheet[i][3][0] == "R"){
				red_CE[scoresheet[i][3][1]][0] += 1
			} else {
				yellow_CE[scoresheet[i][3][1]][0] += 1
			}
		}
		
		interruption = scoresheet[i][2];
		
		//write incorrects first then corrects
		if (scoresheet[i][4].length > 0){
			quizzer_index = parseInt(scoresheet[i][4][0][1]);
			quizzer_color = scoresheet[i][4][0][0];
			row[parseInt(quizzer_index) + 1 + ((quizzer_color == "R") ? 0 : 6)].innerHTML = "<div class='score-cell'> " + ((interruption) ? "<p class='interruption'> I </p>" : "") + "<p class='question-result'>" + String(pointValue/2 * -1) + "</p> <p class='question-count'>" + ((quizzer_color == "R") ? red_CE[quizzer_index][1] : yellow_CE[quizzer_index][1]) + "</p> </div>";
			if (scoresheet[i][3] != ""){
				quizzer_index = parseInt(scoresheet[i][3][1]);
				quizzer_color = scoresheet[i][3][0];
				row[parseInt(quizzer_index) + 1 + ((quizzer_color == "R") ? 0 : 6)].innerHTML = "<div class='score-cell'> " + "<p class='question-result'>" + String(pointValue) + "</p> <p class='question-count'>" + ((quizzer_color == "R") ? red_CE[quizzer_index][0] : yellow_CE[quizzer_index][0]) + "</p> </div>";
			} else if (scoresheet[i][4].length > 1){
				quizzer_index = parseInt(scoresheet[i][4][0][1]);
				quizzer_color = scoresheet[i][4][0][0];
				row[parseInt(quizzer_index) + 1 + ((quizzer_color == "R") ? 0 : 6)].innerHTML = "<div class='score-cell'> " + "<p class='question-result'>" + String(pointValue/2 * -1) + "</p> <p class='question-count'>" + ((quizzer_color == "R") ? red_CE[quizzer_index][1] : yellow_CE[quizzer_index][1]) + "</p> </div>";
			}
		} else {
			quizzer_index = parseInt(scoresheet[i][3][1]);
			quizzer_color = scoresheet[i][3][0];
			row[parseInt(quizzer_index) + 1 + ((quizzer_color == "R") ? 0 : 6)].innerHTML = "<div class='score-cell'> " + ((interruption) ? "<p class='interruption'> I </p>" : "") + "<p class='question-result'>" + String(pointValue) + "</p> <p class='question-count'>" + ((quizzer_color == "R") ? red_CE[quizzer_index][0] : yellow_CE[quizzer_index][0]) + "</p> </div>";
		}
		
		//write contests 
		for (var x = 0; x < scoresheet[i][7].length; x ++){
			switch(scoresheet[i][7][x][0]){
				case "R":
					row[0].children[0].children[0].innerHTML = "C" + scoresheet[i][7][x][1];
					break;
				case "Y":
					row[12].children[0].children[0].innerHTML = "C" + scoresheet[i][7][x][1];
					break;
			}
		}
		
		//write substitutions
		for (var x = 0; x < scoresheet[i][9].length; x++){
			//sub out
			row[parseInt(scoresheet[i][9][x][1][1]) + 1 + ((scoresheet[i][9][x][1][0] == "R") ? 0 : 5)].children[0].innerHTML += 
			"<p class='substitution'>sub out</p>";
			//sub in
			row[parseInt(scoresheet[i][9][x][0][1]) + 1 + ((scoresheet[i][9][x][0][0] == "R") ? 0 : 5)].children[0].innerHTML += 
			"<p class='substitution'>sub in</p>";
		}
		
		//write fouls
	}
}

//////////// BUILD SCORE SHEET ///////////////////////
function build_score_sheet() {
//0 for junior, 1 for senior
	var score_sheet_html = "<thead><tr id='header_row'><th>Points</th><th>R1</th><th>R2</th><th>R3</th><th>Sub</th><th>Sub</th><th>Question Type / Remaining Points</th><th>Y1</th><th>Y2</th><th>Y3</th><th>Sub</th><th>Sub</th><th>Points</th></tr></thead><tbody>";
	
	//console.log("selected division " + $("select[name='division'] option:selected").index());
	
	switch ($("select[name='division'] option:selected").index() <= 1){
		case true:
			var tens = 6;
			var twenties = 6;
			var thirties = 3;
			var points = 270;
			quiz_out = 6;
		break;
		case false:
			var tens = 8;
			var twenties = 9;
			var thirties = 3;
			var points = 350;
			quiz_out = 8;
		break;
	}
	var quest_count = (tens + twenties + thirties);
	
	//console.log("num questions: " + quest_count);
	for (var x = 1; x <= quest_count; x++){
		console.log(x);
		score_sheet_html += "<tr id='q" + x + "'>\n";
		score_sheet_html += "<td class='point td-score'>\n";
		score_sheet_html += "<div style='width: 100%;height: 100%;position: relative;'>\n";
		score_sheet_html += "</div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='game-info td-score'>\n";
		score_sheet_html += "<div style='position:relative; width: 100%; height: 100%'>\n";
		score_sheet_html += "<span class='lower-right-corner'>\n";
		score_sheet_html += points + "\n";
		if (tens > 0){
			points = points - 10;
			tens = tens - 1;
		}else if (twenties > 0){
			points = points - 20;
			twenties = twenties - 1;
		}else{
			points = points - 30;
			thirties = thirties - 1;
		}
		score_sheet_html += "</span>\n";
		score_sheet_html += "<span class='lower-left-corner'>\n";
		score_sheet_html += x + "\n";
		score_sheet_html += "</span>\n";
		score_sheet_html += "</div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'>\n";
		score_sheet_html += "<div class='score-cell'></div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='point td-score'></td>\n";
		score_sheet_html += "</tr>\n";
	}
	
	var tens = 0;
	var twenties = 5;
	var thirties = 0;
	var points = 60;
	
	for (var x = 1; x <= 4; x++){
		score_sheet_html += "<tr id='ot" + x + "' class='gray-out'>\n";
		score_sheet_html += "<td class='point td-score'>\n";
		score_sheet_html += "<div style='position:relative'>\n";
		score_sheet_html += "</div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='game-info td-score'>\n";
		score_sheet_html += "<div style='position:relative'>\n";
		score_sheet_html += "<span class='lower-right-corner'>\n";
		score_sheet_html += points + "\n";
		if (x < 3){
			points = points - 20;
			twenties = twenties - 1;
		}
		score_sheet_html += "</span>\n";
		score_sheet_html += "<span class='lower-left-corner'>\n";
		if (x < 4){
			score_sheet_html += "OT" + "\n";
		} else {
			score_sheet_html += "DOT" + "\n";
		}
		score_sheet_html += "</span>\n";
		score_sheet_html += "</div>\n";
		score_sheet_html += "</td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='player-score td-score'></td>\n";
		score_sheet_html += "<td class='point td-score'></td>\n";
		score_sheet_html += "</tr>\n";
	}	
	
	score_sheet_html += "</tbody>\n";
	
	score_sheet_html += "<tfoot><tr><td></td><td></td><td></td><td></td><td></td><td></td><td class='total-cell'>TOTALS</td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tfoot>"
	
	document.getElementById("table-score").innerHTML = score_sheet_html;
};
	
//////////// BUILD SCORE AREA ////////////////////////
function build_score_area() {
	var red_score = "<div id='red-team'>";
	
	for (var x = 1; x <= 3; x++){
		red_score += "<div class='row team-row'>\n";
		red_score += "<div class='col-6'>\n";
		red_score += "<select class='form-select col-6' id='redquizzer" + x + "' onchange='select_quizzer(\"red\", " + x + ")'>\n";
		
		if (x == 1)
			red_score += "<option selected>Generic 1</option>\n";
		else 
			red_score += "<option>Generic 1</option>\n";
		if (x == 2)
			red_score += "<option selected>Generic 2</option>\n";
		else 
			red_score += "<option>Generic 2</option>\n";
		if (x == 3)
			red_score += "<option selected>Generic 3</option>\n";
		else
			red_score += "<option>Generic 3</option>\n";
		
		red_score += "<option>Generic 4</option>\n";
		red_score += "<option>Generic 5</option>\n";
		red_score += "</select>\n";
		red_score += "</div>\n";
		red_score += '<button type="button" class="btn btn-danger col-2" id="R' + x + 'buzzer" onclick="buzzed(\'red\', ' + x + ')">R';
		red_score += x;
		red_score += "</button>\n";
		switch(x) {
			case 1:
				red_score += "<p class='col-4'><span style='color:green'>" + red_CE[r1][0] + "</span> / <span style='color:red'>" + red_CE[r1][1] + "</span></p>\n";
			break;
			case 2:
				red_score += "<p class='col-4'><span style='color:green'>" + red_CE[r2][0] + "</span> / <span style='color:red'>" + red_CE[r2][1] + "</span></p>\n";
			break;
			case 3:
				red_score += "<p class='col-4'><span style='color:green'>" + red_CE[r3][0] + "</span> / <span style='color:red'>" + red_CE[r3][1] + "</span></p>\n";
			break;
		}
		red_score += "</div>";
	}
	
	red_score += "<div class='row coach-row'><div><button type='button' class='btn btn-danger coach-button col-3' id='redTO' onclick='timeOut(\"red\")'>Time Out</button><button type='button' class='btn btn-danger coach-button col-3' id='redContest' onclick='contest(\"red\")'>Contest</button><button type='button' class='btn btn-danger coach-button col-3' id='redFoul' onclick='foul(\"red\")'>Foul</button></div></div></div>";
	
	var yellow_score = "<div id='yellow-team'>";
	
	for (var x = 1; x <= 3; x++){
		yellow_score += "<div class='row team-row'>\n";
		yellow_score += "<div class='col-6'>\n";
		yellow_score += "<select class='form-select col-6' id='yellowquizzer" + x + "' onchange='select_quizzer(\"yellow\", " + x + ")'>\n";
		if (x == 1)
			yellow_score += "<option selected>Generic 1</option>\n";
		else 
			yellow_score += "<option>Generic 1</option>\n";
		if (x == 2)
			yellow_score += "<option selected>Generic 2</option>\n";
		else 
			yellow_score += "<option>Generic 2</option>\n";
		if (x == 3)
			yellow_score += "<option selected>Generic 3</option>\n";
		else
			yellow_score += "<option>Generic 3</option>\n";
		yellow_score += "<option>Generic 4</option>\n";
		yellow_score += "<option>Generic 5</option>\n";
		yellow_score += "</select>\n";
		yellow_score += "</div>\n";
		yellow_score += '<button type="button" class="btn btn-warning col-2" id="Y' + x + 'buzzer" onclick="buzzed(\'yellow\', ' + x + ')">Y';
		yellow_score += x;
		yellow_score += "</button>\n";
		switch(x) {
			case 1:
				yellow_score += "<p class='col-4'><span style='color:green'>" + yellow_CE[y1][0] + "</span> / <span style='color:red'>" + yellow_CE[y1][1] + "</span></p>\n";
			break;
			case 2:
				yellow_score += "<p class='col-4'><span style='color:green'>" + yellow_CE[y2][0] + "</span> / <span style='color:red'>" + yellow_CE[y2][1] + "</span></p>\n";
			break;
			case 3:
				yellow_score += "<p class='col-4'><span style='color:green'>" + yellow_CE[y3][0] + "</span> / <span style='color:red'>" + yellow_CE[y3][1] + "</span></p>\n";
			break;
		}
		yellow_score += "</div>";
	}
	
	yellow_score += "<div class='row coach-row'><div><button type='button' class='btn btn-warning coach-button col-3' id='yellowTO' onclick='timeOut(\"yellow\")'>Time Out</button><button type='button' class='btn btn-warning coach-button col-3' id='yellowContest' onclick='contest(\"yellow\")'>Contest</button><button type='button' class='btn btn-warning coach-button col-3' id='yellowFoul' onclick='foul(\"yellow\")'>Foul</button></div></div></div>";
	
	document.getElementById("quizzers").innerHTML = red_score + yellow_score;
	
	//console.log(red_score + yellow_score);
};

function set_tenpoint(){ //sets if each team starts with 10 pts or not
	if (document.getElementById("tenpoint").checked){
		//RPoint
		scoresheet[0][0] = 10;
		//YPoint
		scoresheet[0][1] = 10;
	}else{
		//RPoint
		scoresheet[0][0] = 0;
		//YPoint
		scoresheet[0][1] = 0;
	}
	
	fill_score_sheet();
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

function contest(color){
	document.getElementById("modal").style.display = "block";
	
	document.getElementById("modal_content").classList.add("modal-inner-contest");
	
	switch (color){
		case "red":
			team_contests = contests[0];
			break;
		case "yellow":
			team_contests = contests[1];
			break;
		default:
			alert("contest error");
	}
	
	//headers
	content = "<p>Withdrawn " + team_contests[0] + "/2</p> <p>Denied " + team_contests[1] + "/2</p>";
	// withdraw button
	content = content + 
	"<button style='grid-row-start: 2; grid-column-start: 1;' onclick='contest_result(\"" + color + "\", \"withdraw\")'" + ((team_contests[0] >= 2) ? "disabled" : "") + ">Withdraw</button>";
	// deny button
	content = content + 
	"<button style='grid-row-start: 2; grid-column-start: 2;' onclick='contest_result(\"" + color + "\", \"deny\")'" + ((team_contests[1] >= 2) ? "disabled" : "") + ">Denied</button>";
	// grant button
	content = content + 
	"<button style='grid-row-start: 2; grid-column-start: 3;' onclick='contest_result(\"" + color + "\", \"grant\")'>Granted</button>";
	
	
	document.getElementById("modal_content").innerHTML = content;
	
	run_timer(60);
}

function contest_result(color, state){
	//state = withdraw, deny, grant
	switch(state) {
		case "withdraw":
			switch(color){
				case "red":
					// write to scoresheet var
					scoresheet[curr_quest - 1][7].push(["R", "W"]);
					// calc withdraw counter
					contests[0][0] += 1;
					break;
				case "yellow":
					// write to scoresheet var
					scoresheet[curr_quest - 1][7].push(["Y", "W"]);
					// calc withdraw counter
					contests[1][0] += 1;
					break;
				default:
					alert("result error");
			}
			break;
		case "deny":
			switch(color){
				case "red":
					// write to scoresheet var
					scoresheet[curr_quest - 1][7].push(["R", "D"]);
					// calc deny counter
					contests[0][1] += 1;
					break;
				case "yellow":
					// write to scoresheet var
					scoresheet[curr_quest - 1][7].push(["Y", "D"]);
					// calc deny counter
					contests[1][1] += 1;
					break;
				default:
					alert(error);
			}
			break;
		default:
			// show question correction
			switch(color){
				case "red":
					// write to scoresheet var
					scoresheet[curr_quest - 1][7].push(["R", "G"]);
					break;
				case "yellow":
					// write to scoresheet var
					scoresheet[curr_quest - 1][7].push(["Y", "G"]);
					break;
				default:
					alert(error);
			}
			question_edit(curr_quest - 1);
	}
	
	document.getElementById("modal").style.display = "none";
	
	document.getElementById("modal_content").classList.remove("modal-inner-contest");
	
	document.getElementById("redContestBar").innerHTML = "Contest W " + contests[0][0] + "/2 | D " + contests[0][1] + "/2";
	document.getElementById("yellowContestBar").innerHTML = "Contest W " + contests[1][0] + "/2 | D " + contests[1][1] + "/2";
	
	if (contests[0][1] >= 2){
		document.getElementById("redContest").disabled = true;
	}
	
	if (contests[1][1] >= 2){
		document.getElementById("yellowContest").disabled = true;
	}
	
	fill_score_sheet();
}

function foul(color){
	document.getElementById("modal").style.display = "block";
	
	document.getElementById("modal_content").classList.add("modal-inner-foul");
	
	document.getElementById("modal_content").innerHTML = "";
	
}

function foul_result(entity, color){
	//state = withdraw, deny, grant
	document.getElementById("modal").style.display = "none";
	
	document.getElementById("modal_content").classlist.remove("modal-inner-contest");
}

function question_edit(){
	
}

//////////// TEXT SEARCH FUNCTION ////////////////////
function search(){
	var result_string = "";
	
	var search_string = document.getElementById("search_field").value;
	
	search_string = search_string.replaceAll(", ", ",");
	
	search_string = search_string.split(","); 
	
	//console.log(search_string);
		
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
									
									console.log("Book " + book);
									console.log("Chap " + search_chap);
									console.log("Vers " + search_vers);
									
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
									
									console.log("Book " + book);
									console.log("Chap " + search_chap);
									
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

$(document).ready(function(){	
	if (typeof localStorage.getItem('settings') === 'undefined' || localStorage.getItem('settings') == null || localStorage.getItem('settings') == "") {
		localStorage.setItem('settings', "1,0,3,1");
		console.log("no settings");
	}
	
	console.log("settings configured");
	
	build_score_area();
	
	init_settings();
	
	set_division();
	
	window.onclick = function(event) {
		if (event.target == document.getElementById("modal")) {
			document.getElementById("modal").style.display = "none";
		}
		console.log(event.target.parentElement.parentElement);
	}
	
	//////////// TEXT SEARCH FUNCTION ////////////////////
	$("#search_field").keyup(function(){search();});
});