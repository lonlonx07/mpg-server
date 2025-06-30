players = {}

/*function generate_random(){
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
            players[room_id]['board'] = ['','','','','','','','',''];
            players[room_id]['turn'] = 'X';
            players[room_id]['winner'] = '';
            players[room_id]['status'] = '';
            players[room_id]['max'] = 2;
            break;
        }
	} while(1);
    
    return room_id;
}*/

function mthd_player_generator(room_id, player_name){
    
    let player_ind = 1;
    let ind = 1;
    let char = ['','X','O']

        if(players[room_id] == undefined){
            players[room_id] = {}
            players[room_id]['stamp'] = parseInt(Date.now()/1000);
            players[room_id]['board'] = ['','','','','','','','',''];
            players[room_id]['turn'] = 'X';
            players[room_id]['winner'] = '';
            players[room_id]['status'] = '';
            players[room_id]['max'] = 2;
            players[room_id]['players'] = 0;
        }

    do{

        if(players[room_id][ind] == undefined){
            players[room_id][ind] = {}
            players[room_id][ind]['stamp'] = parseInt(Date.now()/1000);
            players[room_id][ind]['name'] = player_name;
            players[room_id][ind]['char'] = char[ind];
            players[room_id][ind]['score'] = 0;
            players[room_id][ind]['status'] = 'active';
            player_ind = ind;
            players[room_id]['players']++;

            if(players[room_id]['status'] == 'pause')
                players[room_id]['status'] = 'begin';

            break;
        }

        if(ind < players[room_id]['max'])
            ind++;
        else
            break;


    } while(1);
    
    return player_ind;
}

function mthd_check_players(room_id){
    if(players[room_id]['players'] >= players[room_id]['max']){
        return 'error-2';
    }
    else{
        return 1;
    }
}

function mthd_get_player_update(room_id){
    return players[room_id];
}

function mthd_set_player_update(room_id, player_ind, ind, val){
    players[room_id][player_ind][ind] = val;
}

function clear_board(room_id){
    players[room_id]['winner'] = '';
    players[room_id]['board'] = ['','','','','','','','',''];
}

function mthd_set_room_update(room_id, player_ind, val){
    if(val == 'begin'){
        clear_board(room_id)
        players[room_id]['status'] = val;
    }
    else if(val == 'exit'){
        players[room_id]['players']--;
        delete players[room_id][player_ind];

        if(players[room_id]['players'] == 0){
            delete players[room_id];
        }
        else{
            players[room_id]['status'] = 'pause';
            clear_board(room_id);
        }
    }
}

function mthd_reset_game(){
    players = {}
}

module.exports.reset_game = mthd_reset_game;
//module.exports.room_generator = mthd_room_generator;
module.exports.check_players = mthd_check_players;
module.exports.player_generator = mthd_player_generator;
module.exports.get_player_update = mthd_get_player_update;
module.exports.set_player_update = mthd_set_player_update;
module.exports.set_room_update = mthd_set_room_update;

function mthd_set_board_update(room_id, player_ind, ind){
    players[room_id]['board'][ind] = players[room_id][player_ind]['char'];
    if(players[room_id][player_ind]['char'] == 'X')
        players[room_id]['turn'] = 'O';
    else
        players[room_id]['turn'] = 'X';
}

function mthd_check_board(room_id, player_ind){
    if(players[room_id]['status'] == 'begin'){
        let tmp = players[room_id]['board'];
        let sets = ['012','345','678','036','147','258','048','246']
        let str = "";
        for (let i=0; i<sets.length; i++){
            let arr = (sets[i]).split("");
            str = "";
            for (let j=0; j<arr.length; j++){
                str += tmp[parseInt(arr[j])];
            }
            
            if(str == "XXX"){
                players[room_id]['winner'] = 'X';
                players[room_id][player_ind]['score'] += 1;
                players[room_id]['status'] = 'end';
                break;
            }
            else if(str == "OOO"){
                players[room_id]['winner'] = 'O';
                players[room_id][player_ind]['score'] += 1;
                players[room_id]['status'] = 'end';
                break;
            }
        }

        if(players[room_id]['status'] != 'end'){
            str = "";
            for (let i=0; i<tmp.length; i++){
                str += tmp[i];
            }
            if(str.length == 9){   
                players[room_id]['status'] = 'draw';
            }
        }
    }
}

module.exports.set_board_update = mthd_set_board_update;
module.exports.check_board = mthd_check_board;