// ==UserScript==
// @name          [Leek Wars] Private Message Alert
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.3
// @description   Affiche une popup lors de la réception d'un message privé
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_private_message_alert.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_private_message_alert.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

_.view.loaded['main.private_message_popup'] = "<div class='title'>Message privé</div><div class='content'>Vous avez reçu un nouveau message privé de <b>{{ name }}</b> !</div><div class='actions'><div class='action dismiss'>Ok !</div></div>";

var count_popup = 0;
var _popup = null;

function init_socket()
{
	if (LW.socket.socket !== null)
	{
		LW.socket.socket.onmessage_back_private_message_alert = LW.socket.socket.onmessage;
		LW.socket.socket.onmessage = function(msg)
		{
			this.onmessage_back_private_message_alert(msg);
			var _msg = JSON.parse(msg.data);
			if (_msg[0] == MP_RECEIVE)
				popup(_msg[1][2]);
			if (_msg[0] == MP_UNREAD_MESSAGES && _msg[1][0] == 0 && _popup)
				_popup.dismiss();
		}
		clearInterval(interval_init_socket);
	}
}

var interval_init_socket = setInterval(init_socket, 100);

function popup(farmer_name)
{
	if (count_popup == 0 && LW.currentPage != "messages")
	{
		_popup = new _.popup.new('main.private_message_popup', {name: farmer_name}, 900, true);

		_popup.setOnDismiss(function()
		{
			count_popup = 0;
		});

		count_popup = 1;

		_popup.show();
	}
}
