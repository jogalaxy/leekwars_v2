// ==UserScript==
// @name          [Leek Wars] Tchat Private Channel
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.1.4
// @description   Permet d'ajouter des canaux privés
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_private_channels.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_private_channels.user.js
// @match         http://leekwars.com/*
// @grant         none
// ==/UserScript==

/*
- Corrections des bugs
- Ajout des commandes :
	/createChannel <channel_name> (modérateur seulement)
	/deleteChannel <channel_name> (modérateur seulement)
	/createChannel <channel_name> <mdp> (modérateur seulement)
	/deleteChannel <channel_name> (modérateur seulement)
	/join <channel_name>
	/join <channel_name> <mdp>
	/leave
	/listChannels
	/connected
	/connected <channel_name>
	/allConnected
	/reboot (administrateur seulement)
*/

var socket = null;
var load = false;
var channels = [];

(function()
{

	addChannel({
		code: "es",
		name: "Español",
		flag: "image/flag/32/es.png"
	});

	addChannel({
		code: "de",
		name: "Deutsch",
		flag: "image/flag/32/de.png"
	});

	var script = document.createElement('script'); 
	script.type = 'text/javascript'; 
	script.src="http://nodejs-jogalaxy.rhcloud.com/socket.io/socket.io.js";
	script.onload = init;
	document.getElementsByTagName('head')[0].appendChild(script);

	function init()
	{

		if (LW.farmer.id === undefined)
		{
			setTimeout(init, 1000);
			return;
		}

		socket = io.connect("nodejs-jogalaxy.rhcloud.com:8000");

		socket.emit('auth', {id : LW.farmer.id, key : localStorage['leekwars_tchat_private_channels/' + LW.farmer.id]});

		if (!load)
		{

			socket.on('messages', function(data)
			{

				LW.socket.socket.onmessage({
					data : JSON.stringify([
						FORUM_CHAT_RECEIVE,
						[
							data.channel,
							data.author_id,
							data.author_name,
							data.message,
							data.time,
							data.role,
							data.time
						]
					])
				});

			});

			socket.on('disconnect', function()
			{
				setTimeout(init, 1000);
			});

			socket.on('auth_result', function(data)
			{
				if (data == true)
				{
					for (var channel in channels)
					{
						socket.emit('addChannel', channels[channel].code);
					}
				}
			});

			socket.on('auth_result', function(data)
			{
				if (data == false)
					connect();
			});

			socket.on("sendKey_result", function(data)
			{

				_.get('message/get-latest-conversations/100/$', function(data)
				{
					if (!data.success) return;

					for (var i in data.conversations)
					{
						if (data.conversations[i].last_farmer_id == 34762)
						{
							localStorage['leekwars_tchat_private_channels/' + LW.farmer.id] = data.conversations[i].last_message;
							socket.emit('auth', {id : LW.farmer.id, key : data.conversations[i].last_message});
							return;
						}
					}
				});

			});

			LW_socket_send = LW.socket.send;
			LW.socket.send = function(request)
			{
				if (request[0] == FORUM_CHAT_ENABLE && request[1] == "es")
					socket.emit('addChannel', 'es');
				else if (request[0] == FORUM_CHAT_ENABLE && request[1] == "de")
					socket.emit('addChannel', 'de');
				else if (request[0] == FORUM_CHAT_DISABLE && request[1] == "es")
					socket.emit('removeChannel', 'es');
				else if (request[0] == FORUM_CHAT_DISABLE && request[1] == "de")
					socket.emit('removeChannel', 'de');
				else if (request[0] == FORUM_CHAT_SEND && request[2].substring(0, 4) == "/fr ")
					LW_socket_send(request);
				else if (request[0] == FORUM_CHAT_SEND && request[2].substring(0, 4) == "/en ")
					LW_socket_send(request);
				else if (request[0] == FORUM_CHAT_SEND && request[2].substring(0, 4) == "/es ")
					sendMessage("es", request[2].substring(4));
				else if (request[0] == FORUM_CHAT_SEND && request[2].substring(0, 4) == "/de ")
					sendMessage("de", request[2].substring(4));
				else if (request[0] == FORUM_CHAT_SEND && request[1] == "es")
					sendMessage("es", request[2]);
				else if (request[0] == FORUM_CHAT_SEND && request[1] == "de")
					sendMessage("de", request[2]);
				else
					LW_socket_send(request);
			}
		}

		load = true;

	}

	function connect()
	{
		var key = generateKey();
		_.post('message/create-conversation', {farmer_id: 34762, message: key, token: '$'}, function()
		{
			socket.emit('sendKey', {id : LW.farmer.id, key : key});
		});
	}

	function generateKey()
	{
		var ret = "";
		while (ret.length < 50)
		{
			ret += Math.random().toString(16).substring(2);
		}
		return ret;
	}

	function sendMessage(channel, message)
	{
		socket.emit('sendMessage', {
			channel : channel,
			message : message
		});
	}

	function addChannel(channel)
	{
		_.lang.languages[channel.code] = channel;
		channels.push(channel);
	}


})();

