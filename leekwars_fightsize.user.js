// ==UserScript==
// @name         Fight screen size
// @namespace    https://github.com/jogalaxy/leekwars_v2
// @version      0.1
// @description  Resize the fight screen
// @author       k-artorias
// @match        http://leekwars.com/*
// @grant        none
// ==/UserScript==

function main () {

(function() {
	LW.on('pageload', function() {

        var size = localStorage['fight_screen_size'] === undefined ? 900 : localStorage['fight_screen_size'];

        if (LW.currentPage == 'settings') {

            $('body').on('click', '#fight_screen_size_apply', function () {
            	var fight_screen_size = $('#fight_screen_size').val();
            	localStorage['fight_screen_size'] = fight_screen_size;
            	_.toast('Paramètres sauvegardés !');
            });

		    $('#settings-page .flex-container').first().append('<div class="column6"><div class="panel"><div class="header"><h2>Taille écran de combat</h2></div><div class="content"><input type="text" id="fight_screen_size"><br><br><br><center><input class="button green" value="Appliquer" id="fight_screen_size_apply"></center></div></div></div>');

		    $('#fight_screen_size').val(size);
	    }

        if (LW.currentPage == 'fight') {

		  LW.pages.fight.resize = function() {

			if (game) {

                $('#controls').removeClass('large')

                game.width = size;
                game.height = Math.ceil(game.width / RATIO)

                $("#fight").css("height", game.height)
                $("#game").css("width", 'auto')
                $("#game").css("height", 'auto')


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
