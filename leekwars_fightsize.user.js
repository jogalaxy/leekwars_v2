// ==UserScript==
// @name         Fight screen size
// @namespace    https://github.com/jogalaxy/leekwars_v2
// @version      0.1
// @description  Resize the fight screen
// @author       k-artorias
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://raw.githubusercontent.com/k-artorias/leekwars_v2/master/leekwars_fightsize.user.js
// @updateURL     https://raw.githubusercontent.com/k-artorias/leekwars_v2/master/leekwars_fightsize.user.js
// @match        http://leekwars.com/*
// @grant        none
// ==/UserScript==

function main () {

(function() {
	LW.on('pageload', function() {

        var size = localStorage['fight_screen_size'] === undefined ? 900 : localStorage['fight_screen_size'];

		var allResize = localStorage['fight_screen_resizeall'] === undefined ? false : (localStorage['fight_screen_resizeall']  === 'true');

        if (LW.currentPage == 'settings') {

            $('body').on('click', '#fight_screen_size_apply', function () {
            	var fight_screen_size = $('#fight_screen_size').val();
            	localStorage['fight_screen_size'] = fight_screen_size;
				var fight_screen_resizeall = $('#fight_screen_resizeall').is(':checked');
            	localStorage['fight_screen_resizeall'] = fight_screen_resizeall;
            	_.toast('Paramètres sauvegardés !');
            });

		    $('#settings-page .flex-container').first().append('<div class="column6"><div class="panel"><div class="header"><h2>Taille écran de combat</h2></div><div class="content">Taille: <input type="text" id="fight_screen_size"><br><br>Tout redimensionner : <input type="checkbox" id="fight_screen_resizeall"><br><br><br><center><input class="button green" value="Appliquer" id="fight_screen_size_apply"></center></div></div></div>');

		    $('#fight_screen_size').val(size);
			if (allResize) {
		    	$('#fight_screen_resizeall').prop('checked', true);
			} else {
				$('#fight_screen_resizeall').prop('checked', false);
			}
	    }

        if (LW.currentPage == 'fight') {

		  LW.pages.fight.resize = function() {

			if (allResize) {
				$("#fight-page").css("width", size)
				$("#fight-page").css("height", Math.ceil(game.width / RATIO))

				$("#fight-page").css("margin-right", 'auto')
				$("#fight-page").css("margin-left", 'auto')
			}

			if (game) {

                $('#controls').removeClass('large')

				if (allResize) {
					game.width = $('#fight-page').width() - 15
					game.height = Math.ceil(game.width / RATIO)
				} else {
					game.width = size;
					game.height = Math.ceil(game.width / RATIO)

					$("#bg-canvas").css("margin-right", 'auto')
	                $("#bg-canvas").css("margin-left", 'auto')

					$("#game-canvas").css("margin-right", 'auto')
	                $("#game-canvas").css("margin-left", 'auto')
				}

                $("#fight").css("height", game.height)
                $("#game").css("width", 'auto')
                $("#game").css("height", 'auto')
				$("#game").css("margin-right", 'auto')
                $("#game").css("margin-left", 'auto')

				$(canvas).attr("width", game.width)
				$(canvas).attr("height", game.height)
				$("#layers").css("height", game.height)

				game.ground.resize(game.width, game.height, _fullscreen, game.quality)
				game.setupMouseMove()

				game.requestPause = game.paused
				game.draw() // redraw
			}
          }
		}

	});

})();


};


var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
