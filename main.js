
const MODEL = 
	"v1beta/models/gemini-1.5-pro-latest";
	//"v1beta/models/gemini-1.5-flash-8b";
const API_KEY = "[put your own api key here]";

const history = [];
var instructions = "";

function chatTo(prompt, callback){
	let url = "https://generativelanguage.googleapis.com/"+MODEL+":generateContent?key="+API_KEY
	history.push({
			"role": "user",
			"parts": [{"text": prompt}]
		});
	let body = JSON.stringify({
		"contents": ([{
			"role": "user",
			"parts": [{"text": instructions}]
		}]).concat(history),
		"system_instruction": { "role":"user", "parts":[
			{"text": instructions},
		] },
		"safety_settings":[
			{
				"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
				"threshold": 1,
			},
			{
				"category": "HARM_CATEGORY_HATE_SPEECH",
				"threshold": 1,
			},
			{
				"category": "HARM_CATEGORY_HARASSMENT",
				"threshold": 1,
			},
			{
				"category": "HARM_CATEGORY_DANGEROUS_CONTENT",
				"threshold": 1,
			},
		],
	});
	
	fetch(url, {
		"headers": {
			"Content-Type": "application/json",
		},
		"method": "POST",
		"body": body,
	}).then(function(r){
		r.json().then(
			function(j){
				console.log(JSON.stringify(j, null, 4));
				history.push({
					"role": "model",
					"parts": j.candidates[0].content.parts
				});
				callback(j.candidates[0].content.parts);
			}
		);
	}, function(){
		console.log("Deu num sei!");
	});
}

function addMessage(msg, left=true){
	let divm = document.createElement("div");
	divm.textContent = msg;
	divm.style.width = "90%";
	divm.style.height = "max-content";
	divm.style.marginLeft = left? "0%": "10%";
	divm.style.padding = "5px";
	divm.style.backgroundColor = left? "white": "#AF9";
	divm.style.border = "1px solid black";
	chat_div.insertBefore(divm, chat_div.firstElementChild);
}

send_bt.onclick = function(){
	instructions = instruction_ed.value;
	if (prompt_ed.value.length > 0){
		addMessage(prompt_ed.value, false);
		chatTo(prompt_ed.value, function(r){
			addMessage(r[0].text, true);
			stdout.textContent = JSON.stringify(r, null, 4);
		});
		prompt_ed.value = "";
	}
}

