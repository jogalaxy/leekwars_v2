// ==UserScript==
// @name          [Leek Wars] Private Message Design
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.2
// @description   Change le design de la page des messages privés
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_private_message_design.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_private_message_design.user.js
// @match         *://*.leekwars.com/*
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
			#conversations\
			{\
				background-color: #e4ded9;\
			}\
			#conversations .conversation:after\
			{\
				content: \'\';\
				display: block;\
				clear: both;\
			}\
			#conversations .chat-message\
			{\
				margin: 5px 0;\
				padding: 10px;\
				max-width: 80%;\
				border-radius: 5px;\
				clear: both;\
			}\
			#conversations .chat-message-time\
			{\
				top: auto;\
				bottom: 5px;\
			}\
			#conversations .chat-message-messages\
			{\
				padding-left: 0px;\
			}\
			#conversations .chat-avatar\
			{\
				background-color: #fff;\
				border-radius: 40px;\
				box-shadow: 1px 1px 5px #555;\
			}\
			#conversations .chat-message\
			{\
				float:left;\
				background-color: #fff;\
				margin-left: 60px;\
			}\
			#conversations .chat-message .chat-avatar\
			{\
				margin-left: -60px;\
			}\
			#conversations .chat-message[author="'+farmer_id+'"]\
			{\
				float:right;\
				background-color: #e3f4c7;\
				margin-right: 60px;\
			}\
			#conversations .chat-message[author="'+farmer_id+'"] .chat-avatar\
			{\
				float:right;\
				margin-right: -60px;\
			}\
			#conversations .chat-message[author="'+farmer_id+'"] .chat-message-author\
			{\
				text-align: right;\
			}\
			#messages-page .panel\
			{\
				border-radius: 0px;\
			}\
			#messages-page #chat-send\
			{\
				display: none;\
			}\
			#messages-page #chat-input\
			{\
				  margin: -3px 4px 6px 4px;\
			}\
			#conversations-list\
			{\
				background-color: #434753;\
				margin-right: -13px;\
			}\
			#conversations-list .conversation-preview\
			{\
				padding: 5px;\
				padding-right: 65px;\
			}\
			#conversations-list .conversation-preview.selected\
			{\
				background-color: rgba(255, 255, 255, 0.3);\
			}\
			#conversations-list .conversation-preview:hover\
			{\
				background-color: rgba(255, 255, 255, 0.2);\
			}\
			#conversations-list .conversation-preview img\
			{\
				border-radius: 52px;\
			}\
			#conversations-list .conversation-preview .content\
			{\
				color: #fff;\
				width: 100%;\
			}\
			#conversations-list .conversation-preview .last-message\
			{\
				color: rgba(255, 255, 255, 0.8);\
				overflow: hidden;\
				text-overflow: ellipsis;\
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
