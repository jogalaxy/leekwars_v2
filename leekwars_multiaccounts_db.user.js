// ==UserScript==
// @name          [Leek Wars] Multi Accounts Database
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.2
// @description   Affiche le propriétaire des multi-comptes
// @author        jojo123 && Tist59
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_multiaccounts_db.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_multiaccounts_db.user.js
// @match         http://leekwars.com/*
// @match         http://www.leekwars.com/*
// @grant         none
// ==/UserScript==

// Récupérer la liste des multi-comptes

var script = document.createElement('script'); 
script.type = 'text/javascript'; 
script.src = 'https://rawgit.com/jogalaxy/leekwars_v2/master/multiaccounts_db.js';
document.getElementsByTagName('head')[0].appendChild(script);

// On récupère la base de données
var multiaccount_db = (localStorage['multiaccount_db'] !== undefined) ? JSON.parse(localStorage['multiaccount_db']) : {};

// Intercepter les messages du socket pour changer les noms

var init_interval = setInterval(function()
{
	if (LW.socket.socket !== null)
	{
		LW.socket.socket.onmessage_back_multiaccount_db = LW.socket.socket.onmessage;
		LW.socket.socket.onmessage = function(msg)
		{

			data = JSON.parse(msg.data)

			if (data[0] == FORUM_CHAT_RECEIVE)
			{

				var owner = null;

				for (var i in multiaccount_db)
				{
					for (var j in multiaccount_db[i])
					{
						if (multiaccount_db[i][j] == data[1][2])
						{
							owner = i;
							break;
						}
					}
					if (owner !== null) break;
				}

				if (owner !== null)
					data[1][2] += ' [' + owner + ']';

			}

			msg = {data : JSON.stringify(data)};

			this.onmessage_back_multiaccount_db(msg);
		}
		clearInterval(init_interval);
	}
}, 100);
