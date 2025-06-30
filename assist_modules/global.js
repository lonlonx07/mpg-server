rooms = {}
const games_list = [
    "tic-tac-toe",
    "snakes-and-ladders",
    "othello"
]

function generate_random(){
    let string_set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let rnd = "";
	for(let i=0; i<10; i++){
		rnd += string_set[Math.floor(Math.random() * string_set.length)];
	}
	return rnd;
}

function mthd_check_room(room_id){
    if(players[room_id] == undefined){
        return 'error-1';
    }
	else{
		return 1;
	}
}

function mthd_room_generator(){
    let room_id = "";
    do{
        room_id = generate_random();
        if(rooms[room_id] == undefined){
            rooms[room_id] = {}
            rooms[room_id]['stamp'] = parseInt(Date.now()/1000);
            break;
        }
	} while(1);
    
    return room_id;
}

function mthd_room_delete(room_id){
    delete rooms[room_id];
}

function mthd_get_game_list(){
    return games_list;
}

function mthd_reset_server(){
    rooms = {}
}

module.exports.reset_server = mthd_reset_server;
module.exports.get_game_list = mthd_get_game_list;
module.exports.room_generator = mthd_room_generator;
module.exports.check_room = mthd_check_room;
module.exports.room_delete = mthd_room_delete;