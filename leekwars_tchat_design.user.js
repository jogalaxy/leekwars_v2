// ==UserScript==
// @name          [Leek Wars] Tchat Design
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.21
// @description   Change le design du tchat
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_design.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_design.user.js
// @match         http://leekwars.com/*
// @grant         none
// ==/UserScript==

(function()
{

	var _init = false;

	LW.on('pageload', function()
	{
		if (LW.farmer.id)
		{
			_init = true;
			init(LW.farmer.id);
		}
	});

	function init(farmer_id)
	{
		addGlobalStyle('\
			.chat-messages\
			{\
				background-color: #e4ded9;\
			}\
			#chat .chat-messages {\
				background-color: #e4ded9;\
			}\
			.chat-messages .chat-message\
			{\
				margin: 2px 0;\
				padding: 5px 10px;\
				max-width: 80%;\
				border-radius: 5px;\
				clear: both;\
			}\
			.chat-messages .chat-message-time\
			{\
				top: auto;\
				bottom: 5px;\
			}\
			.chat-messages .chat-message-messages\
			{\
				padding-left: 0px;\
			}\
			.chat-messages .chat-avatar\
			{\
				background-color: #fff;\
				border-radius: 40px;\
				box-shadow: 1px 1px 5px #555;\
			}\
			.chat-messages .chat-message\
			{\
				float:left;\
				background-color: #fff;\
				margin-left: 60px;\
			}\
			.chat-messages .chat-message .chat-avatar\
			{\
				margin-left: -60px;\
			}\
			.chat-messages .chat-message[author="'+farmer_id+'"]\
			{\
				float:right;\
				background-color: #e3f4c7;\
				margin-right: 60px;\
			}\
			.chat-messages .chat-message[author="'+farmer_id+'"] .chat-avatar\
			{\
				float:right;\
				margin-right: -60px;\
			}\
			.chat-messages .chat-message[author="'+farmer_id+'"] .chat-message-author\
			{\
				text-align: right;\
			}\
		');
	}

	function addGlobalStyle(css)
	{
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}

})();
