players = {}
dim = 8;
container_cnt = dim*dim;
time_limit = 30;

function sec_stamp(){
    return parseInt(Date.now()/1000);
}

function mthd_player_generator(room_id, player_name){
    
    let player_ind = 1;
    let ind = 1;
    let char = ['','B','W']

        if(players[room_id] == undefined){
            players[room_id] = {}
            players[room_id]['stamp'] = sec_stamp();
            players[room_id]['board'] = generate_board_container(container_cnt);
            players[room_id]['turn'] = 'B';
            players[room_id]['move'] = '';
            players[room_id]['winner'] = '';
            players[room_id]['status'] = '';
            players[room_id]['max'] = 2;
            players[room_id]['players'] = 0;
            players[room_id]['cell'] = {}
            players[room_id]['flip'] = []
            players[room_id]['blk'] = []
            players[room_id]['timer'] = 0
        }

    do{

        if(players[room_id][ind] == undefined){
            players[room_id][ind] = {}
            players[room_id][ind]['stamp'] = sec_stamp();
            players[room_id][ind]['name'] = player_name;
            players[room_id][ind]['char'] = char[ind];
            players[room_id][ind]['score'] = 0;
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

function mthd_get_player_update(room_id){
    return [players[room_id], players[room_id]['flip']];
}

function mthd_set_player_update(room_id, player_ind, ind, val){
    players[room_id][player_ind][ind] = val;
}

function mthd_set_room_update(room_id, player_ind, val){
    if(val == 'begin'){
        clear_board(room_id)
        players[room_id]['status'] = val;
        players[room_id]['timer'] = sec_stamp();
    }
    else if(val == 'timer'){
        for(i=1; i<=players[room_id]['max']; i++){
            if(players[room_id]['turn'] == players[room_id][i]['char']){
                players[room_id][i]['clock'] -= (sec_stamp()-players[room_id]['timer']);
            }
            if(players[room_id][i]['clock'] < 0)
                players[room_id][i]['clock'] = 0;
        }
        players[room_id]['timer'] = sec_stamp();
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
module.exports.check_players = mthd_check_players;
module.exports.player_generator = mthd_player_generator;
module.exports.get_player_update = mthd_get_player_update;
module.exports.set_player_update = mthd_set_player_update;
module.exports.set_room_update = mthd_set_room_update;

function clear_board(room_id){
    players[room_id]['move'] = '';
    players[room_id]['timer'] = sec_stamp();
    players[room_id]['flip'] = []
    players[room_id]['winner'] = '';
    players[room_id]['board'] = generate_board_container(room_id, container_cnt);
    for(i=1; i<=players[room_id]['max']; i++){
        try {
            players[room_id][i]['clock'] = time_limit;
        }catch(e){}
    }
}

function generate_board_container(room_id, len){
    let arr = []
    let ctr_c = 1;
    let ctr_r = 1;
    for(let i=0; i<len; i++){
        let ind = ctr_c+'_'+ctr_r;
        players[room_id]['cell'][ind] = i;
        players[room_id]['blk'][i] = ind;

        ctr_c++;
        if(ctr_c == 9){
            ctr_c = 1;
            ctr_r++;
        }
        if(i==28 || i==35){
            arr[i] = 'B';
        }
        else if(i==27 || i==36){
            arr[i] = 'W';
        }
        /*if((i>33 && i<38) || (i>38 && i<46)){
            arr[i] = 'B';
        }
        else if(i==38 || i==46 || i==47){
            arr[i] = 'W';
        }*/
        else{
            arr[i] = '';
        }
    }
    
    return arr;
}

let mod_opt = [[-1,0], [1,0], [0,-1], [0,1], [-1,-1] ,[1,1], [-1,1], [1,-1]];
function check_move(tmp, room_id, v, ch){
    let x = v;
    let valid = 0;

    let tmp_cr = (players[room_id]['blk'][x]).split('_');
    let po = [parseInt(tmp_cr[0]), parseInt(tmp_cr[1])];
    
    for(i=0; i<mod_opt.length; i++){
        let tmp_arr = [];
        let cv = po[0];
        let rv = po[1];
        let point = []
        do {
            point.push(tmp[players[room_id]['cell'][cv+'_'+rv]]);
            cv += mod_opt[i][0];
            rv += mod_opt[i][1];
            let ind = players[room_id]['cell'][cv+'_'+rv];
            
            if(ind != undefined && tmp[ind] != '' && tmp[ind] != ch){
                tmp_arr.push(players[room_id]['cell'][cv+'_'+rv]);
            }
            else{
                if(ind != undefined && tmp[ind] != '')
                    point.push(tmp[players[room_id]['cell'][cv+'_'+rv]]);
                break; 
            }            
        }while(1);
        
        if(point.length >= 3){
            if(point[0] == point[point.length-1]){
                players[room_id]['flip'].push(tmp_arr);
                valid = 1;
            }
        }
    }
    
    return valid;
}

function mthd_set_board_update(room_id, player_ind, ind){
    if(ind == 'timesup'){
        for(i=1; i<=players[room_id]['max']; i++){
            if(players[room_id]['turn'] == players[room_id][i]['char']){
                players[room_id][i]['clock'] = 0;
            }
            else{
                players[room_id]['winner'] = players[room_id][i]['char'];
                players[room_id][i]['score'] += 1;
            }
        }
        players[room_id]['status'] = "end";
    }
    else{
    players[room_id]['board'][ind] = players[room_id][player_ind]['char'];
    
    players[room_id]['flip'] = [];
    let tmp = players[room_id]['board'];
    let res = 0;

    res = check_move(tmp, room_id, ind, tmp[ind]);

    for(i=0; i<players[room_id]['flip'].length; i++){
        for(j=0; j<players[room_id]['flip'][i].length; j++)
            tmp[players[room_id]['flip'][i][j]] = tmp[ind];
    }

    if(res == 0){
        tmp[ind] = '';
        players[room_id]['flip'] = [];
    }
    else{
        
        players[room_id]['move'] = players[room_id][player_ind]['char'];
        if(players[room_id][player_ind]['char'] == 'B'){
            players[room_id]['turn'] = 'W';
        }
        else{
            players[room_id]['turn'] = 'B';
        }
        players[room_id][player_ind]['clock'] -= (sec_stamp() - players[room_id]['timer']);
        players[room_id]['timer'] = sec_stamp();
    }
    }
}

function mthd_check_board(room_id, player_ind){
    if(players[room_id]['status'] == 'begin'){
        let tmp = players[room_id]['board'];
        let tmp_cnt = 0;
        let tmp_x = 0;
        let tmp_o = 0;
        for (let i=0; i<container_cnt; i++){
            if(tmp[i] == ''){
                tmp_cnt++;
            }
            else if(tmp[i] == 'B'){
                tmp_x++;
            }
            else if(tmp[i] == 'W'){
                tmp_o++;
            }
        }

        if(tmp_cnt == 0){
            players[room_id]['status'] = "end";

            if(tmp_x > tmp_o){
                players[room_id]['winner'] = 'B';
                players[room_id][player_ind]['score'] += 1;
            }
            else if(tmp_x < tmp_o){
                players[room_id]['winner'] = 'W';
                players[room_id][player_ind]['score'] += 1;
            }
        }
    }
}

module.exports.set_board_update = mthd_set_board_update;
module.exports.check_board = mthd_check_board;