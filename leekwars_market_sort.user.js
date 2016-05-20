// ==UserScript==
// @name          [Leek Wars] Market Sort
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.4
// @description   Tri les puces du marché
// @author        jojo123 && toufalk
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_market_sort.user.js
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_market_sort.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

var intervalInit = null;

var _minLevel = 1;
var _maxLevel = 301;
var _opacity = 0.2;

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
	23: "Tactique",

};

LW.on('pageload', function()
{
	if (LW.currentPage == 'market')
	{
		$('#market-page .page-header .tabs').first()
		.prepend('<div class="tab disabled">Level min <input style="width:50px" id="min-level" type="number" value="'+_minLevel+'"> </input> max <input style="width:50px" id="max-level" type="number" value="'+_maxLevel+'"></input></div>');
		$('#min-level').keyup(filtersChange);
		$('#max-level').keyup(filtersChange);
		$('#max-habs').keyup(filtersChange);
		$('#min-level').change(filtersChange);
		$('#max-level').change(filtersChange);

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

	updateMarket();

}

function updateMarket()
{
	var habs = parseInt(LW.farmer.habs);
	var crys = parseInt(LW.farmer.crystals);

	$('.column8 .weapon').hide();
	for (var i in LW.pages.market.scope.weapons)
	{
		var weapon = LW.pages.market.scope.weapons[i];
		var level = parseInt(weapon.level);
		var cost_habs = parseInt(LW.pages.market.scope.items[parseInt(weapon.id)].price_habs);
		var cost_crystals = parseInt(LW.pages.market.scope.items[parseInt(weapon.id)].price_crystals);
		if (_minLevel <= level && level <= _maxLevel)
		{
			$(".column8 #item-"+weapon.id).show();
			if (cost_habs <= habs || (cost_crys != 0 && cost_crys <= crys))
			{
				$(".column8 #item-"+weapon.id+" img").css("opacity","1");
			}
			else
			{
				$(".column8 #item-"+weapon.id+" img").css("opacity",_opacity);
			}
		}
	}

	$('.column8 .hat').hide();
	for (var i in LW.pages.market.scope.hats)
	{
		var hat = LW.pages.market.scope.hats[i];
		var level = parseInt(hat.level);
		var cost_habs = parseInt(LW.pages.market.scope.items[parseInt(hat.id)].price_habs);
		var cost_crys = parseInt(LW.pages.market.scope.items[parseInt(hat.id)].price_crystals);
		if (_minLevel <= level && level <= _maxLevel)
		{
			$(".column8 #item-"+hat.id).show();
			if (cost_habs <= habs || (cost_crys != 0 && cost_crys <= crys))
			{
				$(".column8 #item-"+hat.id+" img").css("opacity","1");
			}
			else
			{
				$(".column8 #item-"+hat.id+" img").css("opacity",_opacity);
			}
		}
	}

	$('.potion').hide();
	for (var i in LW.pages.market.scope.potions)
	{
		var potion = LW.pages.market.scope.potions[i];
		var level = parseInt(potion.level);
		var cost_habs = parseInt(LW.pages.market.scope.items[parseInt(potion.id)].price_habs);
		var cost_crys = parseInt(LW.pages.market.scope.items[parseInt(potion.id)].price_crystals);
		if (_minLevel <= level && level <= _maxLevel)
		{
			$(".column8 #item-"+potion.id).show();
			if (cost_habs <= habs || (cost_crys != 0 && cost_crys <= crys))
			{
				$(".column8 #item-"+potion.id+" img").css("opacity","1");
			}
			else
			{
				$(".column8 #item-"+potion.id+" img").css("opacity",_opacity);
			}
		}
	}


	$('.column8 .chip').hide();
  for (var i in LW.pages.market.scope.chips)
  {
  	var chip = LW.pages.market.scope.chips[i];
    var level = parseInt(chip.level);
		var cost_habs = parseInt(LW.pages.market.scope.items[chip.id].price_habs);
		var cost_crys = parseInt(LW.pages.market.scope.items[chip.id].price_crystals);
    if (_minLevel <= level && level <= _maxLevel)
		{
			$(".column8 #item-" + chip.id).show();
			if (cost_habs <= habs || (cost_crys != 0 && cost_crys <= crys))
			{
      	$(".column8 #item-"+chip.id+" img").css("opacity","1");
			}
			else
			{
				$(".column8 #item-"+chip.id+" img").css("opacity",_opacity);
			}
    }
  }
}

var filtersChange = function()
{
	var minLevel = parseInt($('#min-level').val());
	if (isNaN(minLevel)) minLevel = 1;
	if (minLevel < 1) minLevel = 1;
	_minLevel = minLevel;

	var maxLevel = parseInt($('#max-level').val());
	if (isNaN(maxLevel)) maxLevel = 301;
	if (maxLevel < 1) maxLevel = 1;
	_maxLevel = maxLevel;

	updateMarket();
}
