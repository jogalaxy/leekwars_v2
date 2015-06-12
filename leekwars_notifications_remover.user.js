// ==UserScript==
// @name          [Leek Wars] Notifications Remover
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.1
// @description   Permet de supprimer la bulle des notifications
// @author        Rominou & jojo123
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
	});

})();
