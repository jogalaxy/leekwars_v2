// ==UserScript==
// @name          [Leek Wars] Tchat Private Channel
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.4
// @description   Permet d'ajouter des canaux privés
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_private_channels.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_private_channels.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

var socket = null;
var load = false;
var channels = [];
var scrollTop_value = -1;

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

	if (localStorage['private-chat/channel'] === undefined)
		localStorage['private-chat/channel'] = JSON.stringify([]);

	var localStorage_channels = JSON.parse(localStorage['private-chat/channel']);

	for (var i in localStorage_channels)
		if (localStorage_channels[i] != undefined)
			addChannel(localStorage_channels[i]);

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src="https://nodejs-jogalaxy.rhcloud.com/socket.io/socket.io.js";
	script.onload = init;
	document.getElementsByTagName('head')[0].appendChild(script);

	function init()
	{

		if (LW.farmer.id === undefined)
		{
			setTimeout(init, 1000);
			return;
		}

		socket = io.connect("nodejs-jogalaxy.rhcloud.com:8443");

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
						socket.emit('addChannel', channels[channel]);
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

			socket.on('join', function(channel)
			{
				addChannel(channel);
				scrollTop_value = $(window).scrollTop();
				LW.loadPage(LW.currentPage);
				localStorage['chat/channel'] = channel.code;
				localStorage_channels = JSON.parse(localStorage['private-chat/channel']);
				localStorage_channels.push(channel);
				localStorage['private-chat/channel'] = JSON.stringify(localStorage_channels);
			});

			socket.on('leave', function(channel_code)
			{
				removeChannel(channel_code);
				scrollTop_value = $(window).scrollTop();
				LW.loadPage(LW.currentPage);
				localStorage['chat/channel'] = "fr";
			});

			LW_socket_send = LW.socket.send;
			LW.socket.send = function(request)
			{
				var success = false;

				if (request[0] == FORUM_CHAT_ENABLE && ["fr", "en"].indexOf(request[1]) == -1)
				{
					socket.emit('addChannel', request[1]);
					success = true;
				}

				if (request[0] == FORUM_CHAT_DISABLE && ["fr", "en"].indexOf(request[1]) == -1)
				{
					socket.emit('removeChannel', request[1]);
					success = true;
				}

				if (request[0] == FORUM_CHAT_SEND)
				{
					if (["fr", "en"].indexOf(request[2]) != -1)
						return LW_socket_send(request);

					if (["/fr ", "/en "].indexOf(request[2].substring(0, 4)) != -1)
						return LW_socket_send(request);

					if (request[2].substring(0, 4) == "/es ")
					{
						sendMessage("es", request[2].substring(4));
						success = true;
					}
					else if (request[2].substring(0, 4) == "/de ")
					{
						sendMessage("de", request[2].substring(4));
						success = true;
					}
					else if (channels.indexOf(request[1]) != -1)
					{
						sendMessage(request[1], request[2]);
						success = true;
					}
				}

				if (!success)
				{
					return LW_socket_send(request);
				}
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
		channels.push(channel.code);
	}

	function removeChannel(channel_code)
	{
		delete _.lang.languages[channel_code];
		delete channels[channels.indexOf(channel_code)];

		localStorage_channels = JSON.parse(localStorage['private-chat/channel']);

		for (var i in localStorage_channels)
		{
			if (localStorage_channels[i] != undefined && localStorage_channels[i].code == channel_code)
				delete localStorage_channels[i];
		}

		localStorage['private-chat/channel'] = JSON.stringify(localStorage_channels);
	}

	LW.on('pageload', function()
	{
		if (LW.currentPage == "forum")
		{
			if (scrollTop_value != -1)
			{
				$(window).scrollTop(scrollTop_value);
				scrollTop_value = -1;
			}
		}
	});

})();
