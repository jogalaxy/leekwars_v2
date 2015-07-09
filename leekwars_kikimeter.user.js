// ==UserScript==
// @name          [Leek Wars] Kikimeter
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.7
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

LW.on('pageload', function()
{

	if (LW.currentPage == 'report')
	{
		LW.pages.report.kikimeter();
	}

});

LW.pages.report.kikimeter = function()
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

			case ACTION_SUMMON:
				leeks[action[1]].invocation++;
				leeks[action[2]].name += '<br><span class="alive"></span>('+leeks[action[1]].name+')';
				break;

			case ACTION_RESURRECT:
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
	var panel_0_visibility = (localStorage['kikimeter_panel_0_visibility'] == "hide") ? false : true;
	var panel_1_visibility = (localStorage['kikimeter_panel_1_visibility'] == "hide") ? false : true;
	var panel_2_visibility = (localStorage['kikimeter_panel_2_visibility'] == "hide") ? false : true;
	var panel_3_visibility = (localStorage['kikimeter_panel_3_visibility'] == "hide") ? false : true;
	var panel_4_visibility = (localStorage['kikimeter_panel_4_visibility'] == "hide") ? false : true;
	$('.panel').first().after('<div class="panel"><div class="header"><h2>Résumé</h2></div><div class="content" id=""><h3 style="float:left">Graphique</h3><div style="float:right;margin:10px 0" id="kikimeter_panel_0_visibility"><img class="expand" src="http://leekwars.com/static/image/expand.png"></div><div style="clear:both"></div><div id="kikimeter_panel_0"><div id="kikimeter_graph"></div></div><h3 style="float:left">Informations globales</h3><div style="float:right;margin:10px 0" id="kikimeter_panel_1_visibility"><img class="expand" src="http://leekwars.com/static/image/expand.png"></div><div style="clear:both"></div><div id="kikimeter_panel_1"><table class="report"><thead><th>Poireau</th><th>Niveau</th><th>Dégats reçus</th><th>Dégats infligés</th><th>Soins reçus</th><th>Soins lancés</th><th>Kills</th><th>PT utilisés</th><th>PT/tour utilisés</th><th>PM utilisés</th><th>Tours joués</th><th>Tirs</th><th>Usages Puces</th><th>Invocations lancées</th><th>Retours à la vie</th><th>Echecs</th><th>Plantages</th></thead><tbody id="kikimeter_infos"></tbody></table><div id="kikimeter_infos_bulbs_container"><br><br><table class="report"><thead><th>Bulbe</th><th>Niveau</th><th>Dégats reçus</th><th>Dégats infligés</th><th>Soins reçus</th><th>Soins lancés</th><th>Kills</th><th>PT utilisés</th><th>PT/tour utilisés</th><th>PM utilisés</th><th>Tours joués</th><th>Tirs</th><th>Usages Puces</th><th>Invocations lancées</th><th>Retours à la vie</th><th>Echecs</th><th>Plantages</th></thead><tbody id="kikimeter_infos_bulbs"></tbody></table></div></div><h3 style="float:left">Utilisation des Armes / Puces</h3><div style="float:right;margin:10px 0" id="kikimeter_panel_2_visibility"><img class="expand" src="http://leekwars.com/static/image/expand.png"></div><div style="clear:both"></div><div id="kikimeter_panel_2"><table class="report" id="kikimeter_items"><thead><tr><th style="width:200px">Arme / Puce</th></tr></thead><tbody></tbody></table></div><div id="kikimeter_errors"><h3 style="float:left">Erreurs (<span id="kikimeter_errors_count">0</span>)</h3><div style="float:right;margin:10px 0" id="kikimeter_panel_3_visibility"><img class="expand" src="http://leekwars.com/static/image/expand.png"></div><div style="clear:both"></div><div id="kikimeter_panel_3"></div></div><div id="kikimeter_warnings"><h3 style="float:left">Avertissements (<span id="kikimeter_warnings_count">0</span>)</h3><div style="float:right;margin:10px 0" id="kikimeter_panel_4_visibility"><img class="expand" src="http://leekwars.com/static/image/expand.png"></div><div style="clear:both"></div><div id="kikimeter_panel_4"></div></div></div></div>');	

	$('#kikimeter_panel_0_visibility').click(function()
	{
		panel_0_visibility = !panel_0_visibility;
		$('#kikimeter_panel_0').toggle();
		$('#kikimeter_graph').highcharts().reflow();
		if (panel_0_visibility)
			localStorage['kikimeter_panel_0_visibility'] = "show";
		else
			localStorage['kikimeter_panel_0_visibility'] = "hide";
	});
	$('#kikimeter_panel_1_visibility').click(function()
	{
		panel_1_visibility = !panel_0_visibility;
		$('#kikimeter_panel_1').toggle();
		if (panel_1_visibility)
			localStorage['kikimeter_panel_1_visibility'] = "show";
		else
			localStorage['kikimeter_panel_1_visibility'] = "hide";
	});
	$('#kikimeter_panel_2_visibility').click(function()
	{
		panel_2_visibility = !panel_2_visibility;
		$('#kikimeter_panel_2').toggle();
		if (panel_2_visibility)
			localStorage['kikimeter_panel_2_visibility'] = "show";
		else
			localStorage['kikimeter_panel_2_visibility'] = "hide";
	});
	$('#kikimeter_panel_3_visibility').click(function()
	{
		panel_3_visibility = !panel_3_visibility;
		$('#kikimeter_panel_3').toggle();
		if (panel_3_visibility)
			localStorage['kikimeter_panel_3_visibility'] = "show";
		else
			localStorage['kikimeter_panel_3_visibility'] = "hide";
	});
	$('#kikimeter_panel_4_visibility').click(function()
	{
		panel_4_visibility = !panel_4_visibility;
		$('#kikimeter_panel_4').toggle();
		if (panel_4_visibility)
			localStorage['kikimeter_panel_4_visibility'] = "show";
		else
			localStorage['kikimeter_panel_4_visibility'] = "hide";
	});
	if (!panel_0_visibility) $('#kikimeter_panel_0').hide();
	if (!panel_1_visibility) $('#kikimeter_panel_1').hide();
	if (!panel_2_visibility) $('#kikimeter_panel_2').hide();
	if (!panel_3_visibility) $('#kikimeter_panel_3').hide();
	if (!panel_4_visibility) $('#kikimeter_panel_4').hide();

	// Logs
	var count_error = 0;
	var count_warning = 0;
	$('#kikimeter_errors').hide();
	$('#kikimeter_warnings').hide();
	if (LW.connected)
	{
		_.get('fight/get-logs/' + _fight.id + '/$', function(logs)
		{
			for (var a in logs.logs)
			{
				for (var b in logs.logs[a])
				{
					var log = logs.logs[a][b];
					var leek = log[0];
					var type = log[1];
					if (type == 2) // Warning
					{
						count_warning++;
						$('#kikimeter_panel_4').append("<div class='log warning'>&nbsp&nbsp&nbsp[" + leeks[leek].name + "] " + log[2] + "</div>");
					}
					else if (type == 3) // Error
					{
						count_error++;
						$('#kikimeter_panel_3').append("<div class='log error'>&nbsp&nbsp&nbsp[" + leeks[leek].name + "] " + log[2] + "</div>");
					}
				}
			}
			$('#kikimeter_errors_count').text(count_error);
			$('#kikimeter_warnings_count').text(count_warning);
			if (count_error != 0) $('#kikimeter_errors').show();
			if (count_warning != 0) $('#kikimeter_warnings').show();
		});
	}

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
	var bulb_count = 0;
	$('#kikimeter_infos_bulbs').append('<tr><td colspan="17" style="padding:10px 8px;text-align:left;font-weight:bold">Team 1'+((_fight.winner == 1)?' (Gagnants)':(_fight.winner == 2)?' (Perdants)':'')+'</td></tr>');
	for (var i in leeks)
	{
		var leek = leeks[i];
		if (leek.leek.team == 1 && leek.leek.summon)
		{
			bulb_count++;
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
			bulb_count++;
			leek.usedPTperTurn = Math.round(leek.usedPT / leek.roundsPlayed * 10) / 10;
			$('#kikimeter_infos_bulbs').append('<tr><td class="name">'+(leek.alive?'<span class="alive"></span>':'<span class="dead"></span>')+leek.name+'</td><td>'+leek.level+'</td><td>'+leek.dmg_in+'</td><td>'+leek.dmg_out+'</td><td>'+leek.heal_in+'</td><td>'+leek.heal_out+'</td><td>'+leek.kills+'</td><td>'+leek.usedPT+'</td><td>'+leek.usedPTperTurn+'</td><td>'+leek.usedPM+'</td><td>'+leek.roundsPlayed+'</td><td>'+leek.actionsWeapon+'</td><td>'+leek.actionsChip+'</td><td>'+leek.invocation+'</td><td>'+leek.resurrection+'</td><td>'+leek.fails+'</td><td>'+leek.crashes+'</td></tr>');
		}
	}
	if (bulb_count == 0)
		$('#kikimeter_infos_bulbs_container').hide();

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
		var count = 0;

		for (var team = 1; team <= 2; team++)
		{
			for (var j in leeks)
			{
				var leek = leeks[j];
				if (!leek.leek.summon && leek.leek.team == team)
				{
					if (item[j] === undefined)
					{
						line += '<td>0</td>';
					}
					else
					{
						count += item[j]
						line += '<td>'+item[j]+'</td>';
					}
				}
			}
		}

		if (count)
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

	var chart_type = localStorage['kikimeter_graph_type'] === undefined ? 'spline' : localStorage['kikimeter_graph_type'];

	$('#kikimeter_graph').highcharts({
		chart: {
			type: chart_type,
		},
		title: {
			text: 'Points de vie de chaque poireau à chaque tour',
		},
		subtitle: {
			text: '<a href="#" id="kikimeter_graph_button">Activer / Désactiver le lissage de la courbe</a>',
			useHTML: true,

		},
		xAxis: {
			title: {
				text: 'Tour'
			},
			categories: function (turn){
				var categories = [];
				for(var i = 0 ; i <= turn; i++)
					categories.push(i);
				return categories;
			}(_fight.report.duration)
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
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			borderWidth: 1
		},
		series: series,
		plotOptions: {
			line: {
				marker: {
					enabled: false
				}
			},
			spline: {
				marker: {
					enabled: false
				}
			}
		},
		exporting: {
			enabled: false
		}
	});

	var chart = $('#kikimeter_graph').highcharts();

	$('#kikimeter_graph_button').click(function(e)
	{
		e.preventDefault();
		var new_type = chart.series[0].type == 'line' ? 'spline' : 'line';
		localStorage['kikimeter_graph_type'] = new_type;
		for (var i in chart.series)
			chart.series[i].update({type: new_type})
	});

}
