players = {}

function generate_random(){
    let string_set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let rnd = "";
	for(let i=0; i<10; i++){
		rnd += string_set[Math.floor(Math.random() * string_set.length)];
	}

	return rnd;
}

function mthd_room_generator(){
    let room_id = "";
    do{
        room_id = generate_random();
        if(players[room_id] == undefined || Object.keys(players[room_id]).length == 0){
            players[room_id] = {}
            players[room_id]['stamp'] = parseInt(Date.now()/1000);

            break;
        }
	} while(1);
    
    return room_id;
}

function mthd_player_generator(room_id, player_name){
    
    let player_ind = 1;
    let ind = 1;

    do{
        if(players[room_id][ind] == undefined){
            players[room_id][ind] = {}
            players[room_id][ind]['name'] = player_name;
            players[room_id][ind]['x'] = 0;
            players[room_id][ind]['y'] = 0;
            players[room_id][ind]['choice'] = 0;
            players[room_id][ind]['status'] = 1;
            player_ind = ind;
            
            break;
        }
        
        ind++;
    } while(1);
    
    return player_ind;
}

function mthd_set_player_update(room_id, player_ind, ind, val){
    players[room_id][player_ind][ind] = val;
}

function mthd_get_player_update(room_id){
    return players[room_id];
}

function mthd_get_server_update(){
    return players;
}

module.exports.room_generator = mthd_room_generator;
module.exports.player_generator = mthd_player_generator;
module.exports.get_player_update = mthd_get_player_update;
module.exports.set_player_update = mthd_set_player_update;
module.exports.get_server_update = mthd_get_server_update;