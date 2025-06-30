let socket = io();
let req_timer;
let game_id = "";

const url = window.location.href;
const dir = url.split('/');
		
if(dir[dir.length-1] != ""){
	game_id = dir[dir.length-1];
}
else{
	game_id = dir[dir.length-2];
}

function format_clock(val){
	let min = Math.floor(val/60);
	let sec = val-(min*60);

	if(String(min).length == 1){
		min = '0'+min;
	}
	if(String(sec).length == 1){
		sec = '0'+sec;
	}

	return min+":"+sec;
}

function get_cookie(){
	let cookie = sessionStorage.getItem("cookie");
    let game_cookie = []
	if(cookie != null){
		game_cookie = cookie.split('-');
	}
	
	return game_cookie;
}

function set_cookie(val){
	sessionStorage.setItem("cookie", val);
}

function init(){
		$("#btn_join").on('click', function(){
			let p_name = $("#player_name2").val();
			let room_id = $("#room_id").val();
			if(room_id == ""){
				alert("Input room ID!");
			}
			else if(p_name == ""){
				alert("Input your name!");
			}
			else{
				req_key = p_name;
				socket.emit("join_room", [room_id,p_name,game_id]);
			}
		});

		$("#btn_create").on('click', function(){
			let p_name = $("#player_name").val();
			if(p_name == ""){
				alert("Input your name!");
			}
			else{
				req_key = p_name;
				socket.emit("enter_room", ['create',p_name,game_id]);
			}
			
		});
}

function copy_room_id(){
    let copyText = $("#room_id_dsp").html();
    navigator.clipboard.writeText(copyText);
}

function server_stream_comm(){
	let ind_arr = get_cookie();
	socket.emit("stream_update", [ind_arr[0],ind_arr[1],game_id]);
}

socket.on('set_client_cookie', function(data) {
	if(data == "error-1"){
		alert("Invalid room id.");
	}
	else if(data == "error-2"){
		alert("Room is full.");
	}
	else{
		$("#create").addClass("d-none");
		$("#game").removeClass("d-none");

		if(data[2] == req_key)
			set_cookie(data[0]+"-"+data[1])
				
		$("#room_id_dsp").html(data[0]);
		init_game();
	}
});