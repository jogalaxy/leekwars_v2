// ==UserScript==
// @name          [Leek Wars] Tchat Alert
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.9
// @description   Alerte l'utilisateur quand un tag personnalisé est rentré sur le tchat
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_alert.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_alert.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

var Notification = window.Notification || window.mozNotification || window.webkitNotification;

Notification.requestPermission(function (permission) {});

// On récupère la date
var n = __SERVER_TIME;

var tchat_alert_1 = localStorage['tchat_alert_1'] === undefined ? [] : localStorage['tchat_alert_1'].split(';');
var tchat_alert_2 = localStorage['tchat_alert_2'] === undefined ? [] : localStorage['tchat_alert_2'].split(';');
var tchat_alert_3 = localStorage['tchat_alert_3'] === undefined ? [] : localStorage['tchat_alert_3'].split(';');

$('body').on('click', '#tchat_alert_apply', save_params);

LW.on('pageload', function()
{

	if (LW.currentPage == 'settings')
	{
		$('#settings-page .flex-container').first().append('<div class="column6"><div class="panel"><div class="header"><h2>Notifications sur le tchat - Tags</h2></div><div class="content"><div style="text-align: left">Veuillez entrer la liste des tags (séparés par un point-virgule) pour chaque type de notification<br>Exemple : Pilow;salut</div><br><h4>Message en rouge</h4><input type="text" id="tchat_alert_1"><br><h4>Notifications dans le jeu</h4><input type="text" id="tchat_alert_2"><br><h4>Notifications sur le système</h4><input type="text" id="tchat_alert_3"><br><br><center><input type="submit" class="button green" value="Appliquer" id="tchat_alert_apply"></center></div></div></div>');
		$('#tchat_alert_1').val(tchat_alert_1.join(";"));
		$('#tchat_alert_2').val(tchat_alert_2.join(";"));
		$('#tchat_alert_3').val(tchat_alert_3.join(";"));
	}

});

function save_params()
{
	tchat_alert_1 = $('#tchat_alert_1').val().split(';');
	tchat_alert_2 = $('#tchat_alert_2').val().split(';');
	tchat_alert_3 = $('#tchat_alert_3').val().split(';');
	localStorage['tchat_alert_1'] = tchat_alert_1.join(";");
	localStorage['tchat_alert_2'] = tchat_alert_2.join(";");
	localStorage['tchat_alert_3'] = tchat_alert_3.join(";");
	_.toast('Paramètres sauvegardés !');
}

var init_interval = setInterval(function()
{
	if (LW.socket.socket !== null && $('.notifications-counter').length)
	{
		LW.socket.socket.onmessage_back_tchat_alert = LW.socket.socket.onmessage;
		LW.socket.socket.onmessage = function(msg)
		{
			this.onmessage_back_tchat_alert(msg);
			var data = JSON.parse(msg.data);
			if (data[0] == FORUM_CHAT_RECEIVE)
				alert_controller(data[1][1], data[1][2], data[1][3], data[1][4]);
		}
		clearInterval(init_interval);
	}
}, 100);

function alert_controller(author_id, author_name, message, message_time)
{
	if (author_id != LW.farmer.id)
	{
		var tchat_alert_2_find = false;
		var tchat_alert_3_find = false;

		for (var i in tchat_alert_2)
			if (tchat_alert_2[i] != '' && message.toLowerCase().search(tchat_alert_2[i].toLowerCase()) != -1)
				tchat_alert_2_find = true;
		for (var i in tchat_alert_3)
			if (tchat_alert_3[i] != '' && message.toLowerCase().search(tchat_alert_3[i].toLowerCase()) != -1)
				tchat_alert_3_find = true;

		if (tchat_alert_2_find && message_time > n)
			alert_2(author_name, message);

		if (tchat_alert_3_find && message_time > n)
			alert_3(author_name, message);
	}
	alert_1();

	if (message_time > n)
		n = message_time;
}

function alert_1()
{
	$('.chat-message-messages div').each(function()
	{
		var message = $(this).text();
		for (var i in tchat_alert_1)
		{
			if (tchat_alert_1[i] != '' && message.toLowerCase().search(tchat_alert_1[i].toLowerCase()) != -1)
			{
				$(this).css('color', '#e74c3c');
				$(this).css('font-weight', 'bold');
			}
		}
	});
}

function alert_2(author_name, message)
{
	_.toast("Notification sur le tchat (de "+author_name+")<br>"+message);
}

function alert_3(author_name, message)
{

	var instance = new Notification(
		author_name, {
			body: message,
			icon: "http://leekwars.com/static/image/forum_unseen"

		}
	);

}
