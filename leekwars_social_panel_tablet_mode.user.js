// ==UserScript==
// @name          [Leek Wars] Social Panel Tablet Mode
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.1
// @description   Affiche la sidebar de droite en mode tablette
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_social_panel_tablet_mode.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_social_panel_tablet_mode.user.js
// @match         http://leekwars.com/*
// @grant         none
// ==/UserScript==

(function()
{

	addGlobalStyle('\
		@media screen and (max-width: 1599px) {\
			#social-panel {\
				display: block;\
			}\
			#social-button {\
				display: block;\
			}\
		}\
	');

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

	$('body').on('click', '#social-button', function()
	{
		if ($('body').hasClass('social-collapsed'))
			$('#wrapper').css('margin-right', 'auto');
		else
			$('#wrapper').css('margin-right', 400);
	});

	if (localStorage['main/social-collapsed'] == "true")
		$('#wrapper').css('margin-right', 'auto');
	else
		$('#wrapper').css('margin-right', 400);

})();
