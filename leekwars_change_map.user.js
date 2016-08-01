// ==UserScript==
// @name          [Leek Wars] Change MAP
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.3
// @description   Permet de mettre sur tous les combats la map d'entrainement toute blanche
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_change_map.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_change_map.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

LW.on('pageload', function()
{
	if (LW.currentPage == 'fight')
	{
		var initInt = setInterval(function()
		{
			if (typeof M != "undefined")
			{
				game.map = M[0];
				LW.pages.fight.resize();
				clearInterval(initInt);
			}
		}, 100);
	}
});
