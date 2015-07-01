// ==UserScript==
// @name          [Leek Wars] Inscription Tournois
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.7
// @description   Inscription aux tournois
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tournaments.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tournaments.user.js
// @match         http://leekwars.com/*
// @grant         none
// ==/UserScript==

var registered = false;

LW.on('pageload', function()
{
	if (!registered && LW.farmer.name)
	{
		// Farmer
		if (!LW.farmer.tournament.registered)
			_.post('farmer/register-tournament')

		// Solo
		for (var leek_id in LW.farmer.leeks)
			_.post('leek/register-tournament', {leek_id: leek_id})

		// Team
		if (LW.farmer.team)
		{
			_.get('team/get-private/' + LW.farmer.team.id + '/$', function(data)
			{
				if (data.success)
					for (var composition in data.team.compositions)
						if (!data.team.compositions[composition].tournament.registered)
							_.post('team/register-tournament', {composition_id: data.team.compositions[composition].id});
			});
		}

		// Ok
		registered = true;
	}
});
