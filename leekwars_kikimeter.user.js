// ==UserScript==
// @name          [Leek Wars] Kikimeter
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.3
// @description   Ce script améliore le rapport de combat : affiche un résumé des combats de leekwars, des graphes et tableaux d'analyse
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_kikimeter.user.js
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_kikimeter.user.js
// @match         http://leekwars.com/*
// @require       http://code.highcharts.com/highcharts.js
// @require       http://code.highcharts.com/modules/exporting.js
// @grant         none
// ==/UserScript==

// Informations (http://leekwars.com/static/script/game/game.v2.js)
var ACTION_START_FIGHT = 0;
var ACTION_USE_WEAPON = 1;
var ACTION_USE_CHIP = 2;
var ACTION_SET_WEAPON = 3;
var ACTION_END_FIGHT = 4;
var ACTION_PLAYER_DEAD = 5;
var ACTION_NEW_TURN = 6;
var ACTION_LEEK_TURN = 7;
var ACTION_END_TURN = 8;
var ACTION_SUMMONING = 9;
var ACTION_MOVE_TO = 10;
var ACTION_TP_LOST = 100;
var ACTION_LIFE_LOST = 101;
var ACTION_MP_LOST = 102; 
var ACTION_CARE = 103; 
var ACTION_BOOST_VITA = 104;
var ACTION_RESURRECTION = 105;
var ACTION_SAY = 200; 
var ACTION_LAMA = 201; 
var ACTION_SHOW_CELL = 202;
var ACTION_ADD_WEAPON_EFFECT = 301;
var ACTION_ADD_CHIP_EFFECT = 302;
var ACTION_REMOVE_EFFECT = 303;
var ACTION_BUG = 1002;

LW.on('pageload', function()
{

	if (LW.currentPage == 'report')
	{
		kikimeter();
	}

});

function kikimeter()
{

	var leeks = {};
	var items = {};
	var life  = {};

	for (var i in _fight.data.leeks)
	{
		var leek = _fight.data.leeks[i];
		leeks[leek.id] = {
			leek          : leek,
			alive         : true,
			name          : leek.name,
			level         : leek.level,
			dmg_in        : 0,
			dmg_out       : 0,
			heal_in       : 0,
			heal_out      : 0,
			kills         : 0,
			usedPT        : 0,
			usedPTperTurn : 0,
			usedPM        : 0,
			roundsPlayed  : 0,
			actionsWeapon : 0,
			actionsChip   : 0,
			invocation    : 0,
			resurrection  : 0,
			fails         : 0,
			crashes       : 0,
			life          : leek.life,
		};
	}

	life[0] = {};
	for (var j in leeks)
		life[0][j] = leeks[j].life;

	var currentPlayer = 0;
	var currentTurn = 1;
	for (var i in _fight.data.actions)
	{
		var action = _fight.data.actions[i];
		var type = action[0];

		switch (type)
		{
			case ACTION_NEW_TURN:
				life[action[1]-1] = {};
				for (var j in leeks)
					life[action[1]-1][j] = leeks[j].life;
				currentTurn = action[1];
				break;

			case ACTION_LEEK_TURN:
				leeks[action[1]].roundsPlayed++;
				currentPlayer = action[1];
				break;

			case ACTION_PM_LOST:
				leeks[action[1]].usedPM += action[2];
				break;

			case ACTION_CARE:
				leeks[action[1]].heal_in += action[2];
				leeks[currentPlayer].heal_out += action[2];
				leeks[action[1]].life += action[2];
				break;

			case ACTION_BOOST_VITA:
				leeks[action[1]].heal_in += action[2];
				leeks[currentPlayer].heal_out += action[2];
				leeks[action[1]].life += action[2];
				break;

			case ACTION_LIFE_LOST:
				leeks[action[1]].dmg_in += action[2];
				leeks[currentPlayer].dmg_out += action[2];
				leeks[action[1]].life -= action[2];
				break;

			case ACTION_PT_LOST:
				leeks[action[1]].usedPT += action[2];
				break;

			case ACTION_PLAYER_DEAD:
				leeks[action[1]].alive = false;
				leeks[currentPlayer].kills++;
				leeks[action[1]].life = 0;
				break;

			case ACTION_USE_WEAPON:
				leeks[action[1]].actionsWeapon++;
				if (action[4] == 1) // Echec
					leeks[action[1]].fails++;
				var name = LW.weapons[LW.weaponTemplates[action[3]].item].name;
				if (items[name] === undefined)
					items[name] = {};
				if (items[name][action[1]] === undefined)
					items[name][action[1]] = 0;
				items[name][action[1]]++;
				break;

			case ACTION_USE_CHIP:
				leeks[action[1]].actionsChip++;
				if (action[4] == 1) // Echec
					leeks[action[1]].fails++;
				var name = LW.chips[LW.chipTemplates[action[3]].item].name;
				if (items[name] === undefined)
					items[name] = {};
				if (items[name][action[1]] === undefined)
					items[name][action[1]] = 0;
				items[name][action[1]]++;
				break;

			case ACTION_SUMMONING:
				leeks[action[1]].invocation++;
				leeks[action[2]].name += '<br><span class="alive"></span>('+leeks[action[1]].name+')';
				break;

			case ACTION_RESURRECTION:
				leeks[action[2]].resurrection++;
				break;

			case ACTION_BUG:
				leeks[action[1]].crashes++;
				break;

		}
	}

	life[currentTurn] = {};
	for (var j in leeks)
		life[currentTurn][j] = leeks[j].life;

	// Design

	$('.panel').first().after('<div class="panel"><div class="header"><h2>Résumé</h2></div><div class="content" id=""><h3>Informations globales</h3><table class="report"><thead><th>Poireau</th><th>Niveau</th><th>Dégats reçus</th><th>Dégats infligés</th><th>Soins reçus</th><th>Soins lancés</th><th>Kills</th><th>PT utilisés</th><th>PT/tour utilisés</th><th>PM utilisés</th><th>Tours joués</th><th>Tirs</th><th>Usages Puces</th><th>Invocations lancés</th><th>Retours à la vie</th><th>Echecs</th><th>Plantages</th></thead><tbody id="kikimeter_infos"></tbody></table><br><br><table class="report"><thead><th>Bulbe</th><th>Niveau</th><th>Dégats reçus</th><th>Dégats infligés</th><th>Soins reçus</th><th>Soins lancés</th><th>Kills</th><th>PT utilisés</th><th>PT/tour utilisés</th><th>PM utilisés</th><th>Tours joués</th><th>Tirs</th><th>Usages Puces</th><th>Invocations lancés</th><th>Retours à la vie</th><th>Echecs</th><th>Plantages</th></thead><tbody id="kikimeter_infos_bulbs"></tbody></table><h3>Utilisation des Armes / Puces</h3><table class="report" id="kikimeter_items"><thead><tr><th style="width:200px">Arme / Puce</th></tr></thead><tbody></tbody></table><h3>Graphique</h3><div id="kikimeter_graph"></div></div></div>');

	// [#kikimeter_infos]
	$('#kikimeter_infos').append('<tr><td colspan="17" style="padding:10px 8px;text-align:left;font-weight:bold">Team 1'+((_fight.winner == 1)?' (Gagnants)':(_fight.winner == 2)?' (Perdants)':'')+'</td></tr>');
	for (var i in leeks)
	{
		var leek = leeks[i];
		if (leek.leek.team == 1 && !leek.leek.summon)
		{
			leek.usedPTperTurn = Math.round(leek.usedPT / leek.roundsPlayed * 10) / 10;
			$('#kikimeter_infos').append('<tr><td class="name">'+(leek.alive?'<span class="alive"></span>':'<span class="dead"></span>')+leek.name+'</td><td>'+leek.level+'</td><td>'+leek.dmg_in+'</td><td>'+leek.dmg_out+'</td><td>'+leek.heal_in+'</td><td>'+leek.heal_out+'</td><td>'+leek.kills+'</td><td>'+leek.usedPT+'</td><td>'+leek.usedPTperTurn+'</td><td>'+leek.usedPM+'</td><td>'+leek.roundsPlayed+'</td><td>'+leek.actionsWeapon+'</td><td>'+leek.actionsChip+'</td><td>'+leek.invocation+'</td><td>'+leek.resurrection+'</td><td>'+leek.fails+'</td><td>'+leek.crashes+'</td></tr>');
		}
	}
	$('#kikimeter_infos').append('<tr><td colspan="17" style="padding:10px 8px;text-align:left;font-weight:bold">Team 2'+((_fight.winner == 2)?' (Gagnants)':(_fight.winner == 1)?' (Perdants)':'')+'</td></tr>');
	for (var i in leeks)
	{
		var leek = leeks[i];
		if (leek.leek.team == 2 && !leek.leek.summon)
		{
			leek.usedPTperTurn = Math.round(leek.usedPT / leek.roundsPlayed * 10) / 10;
			$('#kikimeter_infos').append('<tr><td class="name">'+(leek.alive?'<span class="alive"></span>':'<span class="dead"></span>')+leek.name+'</td><td>'+leek.level+'</td><td>'+leek.dmg_in+'</td><td>'+leek.dmg_out+'</td><td>'+leek.heal_in+'</td><td>'+leek.heal_out+'</td><td>'+leek.kills+'</td><td>'+leek.usedPT+'</td><td>'+leek.usedPTperTurn+'</td><td>'+leek.usedPM+'</td><td>'+leek.roundsPlayed+'</td><td>'+leek.actionsWeapon+'</td><td>'+leek.actionsChip+'</td><td>'+leek.invocation+'</td><td>'+leek.resurrection+'</td><td>'+leek.fails+'</td><td>'+leek.crashes+'</td></tr>');
		}
	}

	// [#kikimeter_infos_bulbs]
	$('#kikimeter_infos_bulbs').append('<tr><td colspan="17" style="padding:10px 8px;text-align:left;font-weight:bold">Team 1'+((_fight.winner == 1)?' (Gagnants)':(_fight.winner == 2)?' (Perdants)':'')+'</td></tr>');
	for (var i in leeks)
	{
		var leek = leeks[i];
		if (leek.leek.team == 1 && leek.leek.summon)
		{
			leek.usedPTperTurn = Math.round(leek.usedPT / leek.roundsPlayed * 10) / 10;
			$('#kikimeter_infos_bulbs').append('<tr><td class="name">'+(leek.alive?'<span class="alive"></span>':'<span class="dead"></span>')+leek.name+'</td><td>'+leek.level+'</td><td>'+leek.dmg_in+'</td><td>'+leek.dmg_out+'</td><td>'+leek.heal_in+'</td><td>'+leek.heal_out+'</td><td>'+leek.kills+'</td><td>'+leek.usedPT+'</td><td>'+leek.usedPTperTurn+'</td><td>'+leek.usedPM+'</td><td>'+leek.roundsPlayed+'</td><td>'+leek.actionsWeapon+'</td><td>'+leek.actionsChip+'</td><td>'+leek.invocation+'</td><td>'+leek.resurrection+'</td><td>'+leek.fails+'</td><td>'+leek.crashes+'</td></tr>');
		}
	}
	$('#kikimeter_infos_bulbs').append('<tr><td colspan="17" style="padding:10px 8px;text-align:left;font-weight:bold">Team 2'+((_fight.winner == 2)?' (Gagnants)':(_fight.winner == 1)?' (Perdants)':'')+'</td></tr>');
	for (var i in leeks)
	{
		var leek = leeks[i];
		if (leek.leek.team == 2 && leek.leek.summon)
		{
			leek.usedPTperTurn = Math.round(leek.usedPT / leek.roundsPlayed * 10) / 10;
			$('#kikimeter_infos_bulbs').append('<tr><td class="name">'+(leek.alive?'<span class="alive"></span>':'<span class="dead"></span>')+leek.name+'</td><td>'+leek.level+'</td><td>'+leek.dmg_in+'</td><td>'+leek.dmg_out+'</td><td>'+leek.heal_in+'</td><td>'+leek.heal_out+'</td><td>'+leek.kills+'</td><td>'+leek.usedPT+'</td><td>'+leek.usedPTperTurn+'</td><td>'+leek.usedPM+'</td><td>'+leek.roundsPlayed+'</td><td>'+leek.actionsWeapon+'</td><td>'+leek.actionsChip+'</td><td>'+leek.invocation+'</td><td>'+leek.resurrection+'</td><td>'+leek.fails+'</td><td>'+leek.crashes+'</td></tr>');
		}
	}

	// [#kikimeter_items]

	for (var team = 1; team <= 2; team++)
	{
		for (var i in leeks)
		{
			var leek = leeks[i];
			if (!leek.leek.summon && leek.leek.team == team)
			{
				$('#kikimeter_items thead tr').append('<th>' + leek.name + '</th>');
			}
		}
	}
	for (var i in items)
	{
		var item = items[i];
		var line = '<td>'+i+'</td>';

		for (var team = 1; team <= 2; team++)
		{
			for (var j in leeks)
			{
				var leek = leeks[j];
				if (!leek.leek.summon && leek.leek.team == team)
				{
					if (item[j] === undefined)
						line += '<td>0</td>';
					else
						line += '<td>'+item[j]+'</td>';
				}
			}
		}

		$('#kikimeter_items tbody').append('<tr>' + line + '</tr>');
	}

	// [#kikimeter_graph]

	var teamColors = {
		1: "#0000FF",
		2: "#FF0000"
	};

	var series = [];
	var data = [];
	for (var i in leeks)
	{
		var leek = leeks[i];
		if (!leek.leek.summon)
		{
			data = [];
			var thisTurn = 0;
			
			for (var j = 0; j <= _fight.report.duration; j++)
				data.push(life[j][i]);

			series.push({name: leek.leek.name, color: teamColors[leek.leek.team], data: data});
		}
	}

	$('#kikimeter_graph').highcharts({
		chart: {
			type: 'spline',
		},
		title: {
			text: 'Points de vie de chaque poireau à chaque tour',
			x: -20 //center
		},
		xAxis: {
			title: {
				text: 'Tour'
			},
			categories: generate_categories(_fight.report.duration)
		},
		yAxis: {
			title: {
				text: 'Points de vie'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}],
			min : 0
		},
		tooltip: {
			// shared: true,
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			floating: true,
			borderWidth: 1
		},
		series: series,
		plotOptions: {
			spline: {
				marker: {
					enabled: false
				}
			}
		}
	});

}

function generate_categories(turn)
{
	var categories = [];
	for(var i = 0 ; i <= turn; i++)
		categories.push(i);
	return categories;
}
