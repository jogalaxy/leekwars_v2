// ==UserScript==
// @name          [Leek Wars] Marker Sort
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.1
// @description   Tri les puces du marché
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_market_sort.user.js
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_market_sort.user.js
// @match         http://leekwars.com/*
// @match         http://beta.leekwars.com/*
// @grant         none
// ==/UserScript==

var intervalInit = null;

var group = {

	1: "Attaques",
	2: "Soins",
	3: "Boosts",
	4: "Boosts",
	5: "Protections",
	6: "Protections",
	7: "Boosts",
	8: "Boosts",
	9: "Tactique",
	10: "Tactique",
	11: "Tactique",
	12: "Soins",
	13: "Poisons",
	14: "Bulbes",
	15: "Soins",
	17: "Debuffs",
	18: "Debuffs",
	19: "Debuffs",
	20: "Miroirs",
	21: "Boosts",
	22: "Boosts",


};

LW.on('pageload', function()
{
	if (LW.currentPage == 'market')
	{
		if (intervalInit !== null)
			clearInterval(intervalInit);
		intervalInit = setInterval(initMarket, 1);
	}
});

function initMarket()
{
	if (!$('#chips .chip').length)
		return;

	clearInterval(intervalInit);
	intervalInit = null;

	var chips = {};

	for (var i in LW.pages.market.scope.chips)
	{
		var chip = LW.pages.market.scope.chips[i];
		var type = (chip.effects[0] !== undefined) ? chip.effects[0].id : 0;
		type = group[type] === undefined ? 'Inconnu (type : '+type+')' : group[type];
		if (chips[type] === undefined)
			chips[type] = [];
		chips[type].push(chip);
	}

	for (var type in chips)
	{
		$('#chips').append('<div style="clear:both"></div><h3 style="float:left;margin-left:0px">' + type + '</h3><div style="clear:both"></div>');
		for (i in chips[type])
		{
			$("#item-" + chips[type][i].id).appendTo("#chips");
		}
	}

}
