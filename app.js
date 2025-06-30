const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 10001;
const os = require('os');
const host = os.hostname();

app.use(express.static(__dirname+'/public'));


const mod_generator = require('./assist_modules/generator');
const mod_g = require('./assist_modules/global');
const games_list = mod_g.get_game_list();

const mod_ttt = require('./assist_modules/'+games_list[0]);
const mod_sandl = require('./assist_modules/'+games_list[1]);
const mod_oth = require('./assist_modules/'+games_list[2]);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/pages/home.html');
});

app.get('/'+games_list[0], (req, res) => {
    res.sendFile(__dirname + '/pages/'+games_list[0]+'.html');
});

app.get('/'+games_list[1], (req, res) => {
    res.sendFile(__dirname + '/pages/'+games_list[1]+'.html');
});

app.get('/'+games_list[2], (req, res) => {
    res.sendFile(__dirname + '/pages/'+games_list[2]+'.html');
});

app.get('/dungeon', (req, res) => {
    res.sendFile(__dirname + '/pages/dungeon.html');
});

app.get('/reset', (req, res) => {
    mod_g.reset_server();
    mod_ttt.reset_game();
    mod_sandl.reset_game();
    mod_oth.reset_game();
    res.send("Game server reset complete.");
});

io.on('connection', (socket) => {
    
    //data[room_id, player_index, game_id]
    socket.on('enter_room', data => {
        room_id = mod_g.room_generator();
        if(data[2] == games_list[0]){
            player_ind = mod_ttt.player_generator(room_id, data[1]);
        }
        else if(data[2] == games_list[1]){
            player_ind = mod_sandl.player_generator(room_id, data[1]);
        }
        else if(data[2] == games_list[2]){
            player_ind = mod_oth.player_generator(room_id, data[1]);
        }
        else{
            player_ind = mod_generator.player_generator(room_id, data[1]);
        }
        
        socket.join(room_id);
        io.to(room_id).emit("set_client_cookie", [room_id, player_ind, data[1]]);
	});

    socket.on('join_room', data => { 
        room_id = data[0]
        check_res = mod_g.check_room(room_id);
        if(check_res == 1){
            if(data[2] == games_list[0]){
                check_res = mod_ttt.check_players(room_id);
                socket.join(room_id);
                player_ind = mod_ttt.player_generator(room_id, data[1]);
            }
            else if(data[2] == games_list[1]){
                check_res = mod_sandl.check_players(room_id);
                socket.join(room_id);
                player_ind = mod_sandl.player_generator(room_id, data[1]);
            }
            else if(data[2] == games_list[2]){
                check_res = mod_oth.check_players(room_id);
                socket.join(room_id);
                player_ind = mod_oth.player_generator(room_id, data[1]);
            }
            else{
                player_ind = mod_generator.player_generator(room_id, data[1]);
            }
        }

        if(check_res == 1){
            io.to(room_id).emit("set_client_cookie", [room_id, player_ind, data[1]]);
        }
        else{
            io.to(socket.id).emit("set_client_cookie", check_res);
        }
	});

    socket.on('rejoin_room', data => {
        room_id = data[0]
        player_ind = data[1]
        socket.join(room_id);
        if(data[2] == games_list[0]){
                
        }
        else if(data[2] == games_list[1]){

        }
        else if(data[2] == games_list[2]){
            mod_oth.set_room_update(room_id, player_ind, 'timer');
        }
        else{
                
        }
        io.to(room_id).emit("set_client_cookie", [room_id, player_ind]);
	});

    socket.on('player_command', data => {
        room_id = data[0];
        if(data[2] == games_list[0]){
            mod_ttt.set_board_update(room_id, data[1], data[4]);
        }
        else if(data[2] == games_list[1]){
            rescomm = mod_sandl.process_command(data);
            io.to(room_id).emit("return_command", rescomm);
        }  
        else if(data[2] == games_list[2]){
            mod_oth.set_board_update(room_id, data[1], data[4]);
        }
	});

    socket.on('room_command', data => {
        room_id = data[0];
        if(data[2] == games_list[0]){
            mod_ttt.set_room_update(room_id, data[1], data[3]);
            rom_res = mod_ttt.get_player_update(room_id);
            if(rom_res == undefined)
                mod_g.room_delete(room_id);
            io.to(room_id).volatile.emit("server_update", rom_res);
        }
        else if(data[2] == games_list[1]){
            
        }  
        else if(data[2] == games_list[2]){
            mod_oth.set_room_update(room_id, data[1], data[3]);
            rom_res = mod_oth.get_player_update(room_id);
            if(rom_res == undefined)
                mod_g.room_delete(room_id);
            io.to(room_id).volatile.emit("server_update", rom_res);
        }
	});

    socket.on('stream_update', data => {
        room_id = data[0];
        if(data[2] == games_list[0]){
            mod_ttt.check_board(room_id, data[1]);
            io.to(room_id).volatile.emit("server_update", mod_ttt.get_player_update(room_id));
        }
        else if(data[2] == games_list[1]){
            io.to(room_id).volatile.emit("server_update", mod_sandl.get_player_update(room_id));
        }
        else if(data[2] == games_list[2]){
            mod_oth.check_board(room_id, data[1]);
            io.to(room_id).volatile.emit("server_update", mod_oth.get_player_update(room_id));
        }
        else{
            io.to(room_id).volatile.emit("server_update", mod_generator.get_player_update(room_id));
        }
	});

});

http.listen(port, () => {
    console.log(`Socket.IO server running at ${host}:${port}/`);
});