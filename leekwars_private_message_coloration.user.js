// ==UserScript==
// @name          [Leek Wars] Private Message Coloration
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.2
// @description   Colore les messages privés non lus
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_private_message_coloration.user.js
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_private_message_coloration.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

(function()
{

	LW.on('pageload', function()
	{
		var c = $('#messages .label').text();
		$('#messages .message').slice(0, c).css('background-color','#d0ffd8');
	});

	var init_interval = setInterval(function()
	{
		if (LW.socket.socket !== null && $('.notifications-counter').length)
		{
			LW.socket.socket.onmessage_back_private_message_coloration = LW.socket.socket.onmessage;
			LW.socket.socket.onmessage = function(msg)
			{
				this.onmessage_back_private_message_coloration(msg);
				var data = JSON.parse(msg.data);
				if (data[0] == MP_UNREAD_MESSAGES || data[0] == MP_READ || data[0] == MP_RECEIVE)
				{
					_.get('message/get-latest-conversations/10/$', function(data)
					{
						if (data.success)
						{
							LW.messages.unread = data.unread;
							LW.updateCounters();
							$('#messages .message').css('background-color','');
							var c = $('#messages .label').text()
							$('#messages .message').slice(0, c).css('background-color','#d0ffd8');
						}
					});
				}
			}
			var c = $('#messages .label').text()
			$('#messages .message').slice(0, c).css('background-color','#d0ffd8');
			clearInterval(init_interval);
		}
	}, 100);

})();
