// ==UserScript==
// @name          [Leek Wars] Another Test Fight
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.3
// @description   Permet de relancer un combat de test avec les mêmes paramètres
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_another_test_fight.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_another_test_fight.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

(function()
{

	$('body').on('mouseup', '.test_popup #launch', saveTestSettings)
	$('body').on('click', '#refight_test', refight_test)

	LW.on('pageload', function()
	{
		if (LW.currentPage == 'report' && _fight.context == 0)
		{
			$('#report-page .first center').append('<div class="button" id="refight_test">' + _.lang.langs[_.lang.current]['report']['refight'] + '</div>')
		}
	})

	function saveTestSettings()
	{
		_saveTestSettings()
	}

	function refight_test()
	{
		var _testType = localStorage['editor/test_type']
		var _testLeek = localStorage['editor/test_leek']
		var _testAI = localStorage['editor/test_ai']
		var _testEnemies = JSON.parse(localStorage['editor/test_enemies'])

		var data = {}

		data.ai_id = _testAI
		data.leek_id = _testLeek

		data.bots = {}
		for (var e in _testEnemies) {
			data.bots[e] = _testEnemies[e]
		}

		data.type = _testType

		_.post('ai/test', data, function(data)
		{

			if (data.success)
			{
				LW.page('/fight/' + data.fight)
			}

		})

	}

})()
