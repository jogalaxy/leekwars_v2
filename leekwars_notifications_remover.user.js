// ==UserScript==
// @name          [Leek Wars] Notifications Remover
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.4.1
// @description   Permet de supprimer la bulle des notifications
// @author        Rominou & jojo123 & Keorl
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_notifications_remover.user.js
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_notifications_remover.user.js
// @match         http://leekwars.com/*
// @grant         none
// ==/UserScript==

(function()
{

	$('head').append('<style>#notifications .label { cursor: pointer }</style>');

	$("body").on("click", "#notifications .label", function()
	{
		_.post("notification/read-all", {});
		$('.notification').css('background-color','');
	});

	var init_interval = setInterval(function()
	{
		if (LW.socket.socket !== undefined && $('.notifications-counter').length)
		{
			LW.socket.socket.onmessage_back = LW.socket.socket.onmessage;
			LW.socket.socket.onmessage = function(msg)
			{
				this.onmessage_back(msg);
				$('.notification').css('background-color','');
				var c = $('.notifications-counter').first().contents().text();
				$('.notification').slice(0, c).css('background-color','#d0ffd8');
			}

			var c = $('.notifications-counter').first().contents().text();
			$('.notification').slice(0, c).css('background-color','#d0ffd8');
			
			clearInterval(init_interval);
		}
	}, 200);

})();
