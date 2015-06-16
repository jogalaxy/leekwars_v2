// ==UserScript==
// @name          [Leek Wars] Inscription Tournois
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.5
// @description   Inscription aux tournois
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tournaments.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tournaments.user.js
// @match         http://leekwars.com/*
// @grant         none
// ==/UserScript==

LW.on('initialized', function()
{
	_.post('farmer/register-tournament')
	for (var leek_id in LW.farmer.leeks)
	{
		_.post('leek/register-tournament', {leek_id: leek_id})
	}
});
