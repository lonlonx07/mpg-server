players = {}
suspend_limit = 1800;
function sec_stamp(){
    return parseInt(Date.now()/1000);
}

function check_room_players(room_id){
    for(i=1; i<=players[room_id]['players']; i++){
		if(sec_stamp()-players[room_id][i]['stamp'] >= suspend_limit){
            players[room_id][i]['status'] = 'exit';
        }
	}
}

function mthd_player_generator(room_id, player_name){
    
    let player_ind = 1;
    let ind = 1;
    let char = ['',1,2,3,4]

        if(players[room_id] == undefined){
            players[room_id] = {}
            players[room_id]['stamp'] = sec_stamp();
            players[room_id]['board'] = '';
            players[room_id]['turn'] = 1;
            players[room_id]['move'] = '';
            players[room_id]['winner'] = '';
            players[room_id]['status'] = '';
            players[room_id]['min'] = 2;
            players[room_id]['max'] = 4;
            players[room_id]['players'] = 0;
            players[room_id]['cell'] = {}
            players[room_id]['flip'] = []
            players[room_id]['blk'] = []
            players[room_id]['dice'] = []
            players[room_id]['timer'] = 0
            players[room_id]['resp'] = 0
        }

    do{

        if(players[room_id][ind] == undefined){
            players[room_id][ind] = {}
            players[room_id][ind]['stamp'] = sec_stamp();
            players[room_id][ind]['name'] = player_name;
            players[room_id][ind]['char'] = char[ind];
            players[room_id][ind]['score'] = 0;
            players[room_id][ind]['block'] = 0;
            players[room_id][ind]['status'] = 'active';
            players[room_id][ind]['clock'] = time_limit;
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

function mthd_set_player_update(room_id, player_ind, ind, val){
    players[room_id][player_ind][ind] = val;
}

function mthd_get_player_update(room_id){
    return players[room_id];
}

function mthd_get_server_update(){
    return players;
}

function mthd_process_command(data){
    let ret_data = [];
    if(data[3] == "dice"){
        if(data[4] == "draw"){
            players[room_id]['resp'] = 1;
            let dice_rnd = (Math.floor(Math.random() * 6)+1)
            let dice_rot = (Math.floor(Math.random() * 180)+1)

            if(players[data[0]]['turn'] == players[data[0]]['players'])
                players[data[0]]['turn'] = 1;
            else{
                if(players[data[0]]['turn'] == players[data[0]][data[1]]['char']){
                    players[data[0]]['turn']++;
                }
            }

            players[data[0]]['dice'][0] = dice_rnd;
            players[data[0]]['dice'][1] = dice_rot;
            ret_data = ['draw', dice_rnd, dice_rot];
        }
    }
    else if(data[3] == "block"){
        if(players[data[0]]['resp'] == 1){
            players[data[0]][data[1]]['block'] = data[4];
            if(players[data[0]][data[1]]['block'] == 100){
                players[data[0]]['winner'] = players[data[0]][data[1]]['name'];
                players[data[0]]['status'] = 'end';
            }
            players[data[0]]['resp'] = 0;
            let ind = players[data[0]]['turn'];
            ret_data = ['next', ind, players[data[0]][ind]['block'], players[data[0]]];
        }
        else{
            ret_data = 0;
        }
    }
    else if(data[3] == "game"){
        if(data[4] == "begin"){
            players[data[0]]['status'] = data[4];
            players[data[0]]['winner'] = '';
            players[data[0]]['dice'] = [];

            for(i=1; i<=players[data[0]]['players']; i++){
				players[data[0]][i]['block'] = 0;
			}

            ret_data = ['start'];
        }
    }
    return ret_data;
}

function mthd_reset_game(){
    players = {}
}

module.exports.reset_game = mthd_reset_game;
module.exports.check_players = mthd_check_players;
module.exports.player_generator = mthd_player_generator;
module.exports.get_player_update = mthd_get_player_update;
module.exports.set_player_update = mthd_set_player_update;
module.exports.get_server_update = mthd_get_server_update;
module.exports.process_command = mthd_process_command;