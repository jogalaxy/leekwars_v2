// ==UserScript==
// @name         Animations remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove some animations from fight
// @author       You
// @projectPage   https://github.com/k-artorias/leekwars_v2
// @downloadURL   https://github.com/k-artorias/leekwars_v2/raw/master/leekwars_removeAnimations.user.js
// @updateURL     https://github.com/k-artorias/leekwars_v2/raw/master/leekwars_removeAnimations.user.js
// @match        https://leekwars.com/*
// @grant        none
// ==/UserScript==

function mainRemoveAnimations () {

(function() {

    // intercepte la fonction "fnName" de l'objet object, et applique la fonction options.before avant l'appel, et la fonction options.after après l'appel
    // exemple d'appel visible sur l'option slowMotion plus bas.
    function interceptFunction (object, fnName, options) {
        var noop = function () {};
        var fnToWrap = object[fnName];
        var before = options.before || noop;
        var after = options.after || noop;

        object[fnName] = function () {
            before.apply(this, arguments);
            var result = fnToWrap.apply(this, arguments);
            after.apply(this, arguments);
            return result
        }
    }
    
LW.on('pageload', function()
{
    if (LW.currentPage == 'settings') {

        var removeGas = localStorage['removeGas'] === undefined ? true : (localStorage['removeGas'] === 'true');
        var removeFire = localStorage['removeFire'] === undefined ? true : (localStorage['removeFire'] === 'true');
        var removeExplosion = localStorage['removeExplosion'] === undefined ? true : (localStorage['removeExplosion'] === 'true');
        var removeChipHalo = localStorage['removeChipHalo'] === undefined ? true : (localStorage['removeChipHalo'] === 'true');
        var removeChipImage = localStorage['removeChipImage'] === undefined ? false : (localStorage['removeChipImage'] === 'true');
        var removeChipAureol = localStorage['removeChipAureol'] === undefined ? true : (localStorage['removeChipAureol'] === 'true');
        var removeChipHeal = localStorage['removeChipHeal'] === undefined ? true : (localStorage['removeChipHeal'] === 'true');
        var removeSay = localStorage['removeSay'] === undefined ? false : (localStorage['removeSay'] === 'true');
        var addSlowMotion = localStorage['addSlowMotion'] === undefined ? false : (localStorage['addSlowMotion'] === 'true');

        $('body').on('click', '#remove_animation_apply', function () {
			var removeGas = $('#removeGas').is(':checked');
        	localStorage['removeGas'] = removeGas;
            var removeFire = $('#removeFire').is(':checked');
        	localStorage['removeFire'] = removeFire;
            var removeExplosion = $('#removeExplosion').is(':checked');
        	localStorage['removeExplosion'] = removeExplosion;
            var removeChipHalo = $('#removeChipHalo').is(':checked');
        	localStorage['removeChipHalo'] = removeChipHalo;
            var removeChipImage = $('#removeChipImage').is(':checked');
        	localStorage['removeChipImage'] = removeChipImage;
            var removeChipAureol = $('#removeChipAureol').is(':checked');
        	localStorage['removeChipAureol'] = removeChipAureol;
            var removeChipHeal = $('#removeChipHeal').is(':checked');
        	localStorage['removeChipHeal'] = removeChipHeal;
            var removeSay = $('#removeSay').is(':checked');
        	localStorage['removeSay'] = removeSay;
            var addSlowMotion = $('#addSlowMotion').is(':checked');
        	localStorage['addSlowMotion'] = addSlowMotion;
        	_.toast('Paramètres sauvegardés !');
        });

	    $('#settings-page .flex-container').first().append('<div class="column6"><div class="panel"><div class="header"><h2>Suppression animation</h2></div><div class="content">'
        + 'Gaz : <input type="checkbox" id="removeGas"><br>'
        + 'Feu : <input type="checkbox" id="removeFire"><br>'
        + 'Explosion : <input type="checkbox" id="removeExplosion"><br>'
        + 'Chip halo (animation autour du leek) : <input type="checkbox" id="removeChipHalo"><br>'
        + 'Chip image (image de la puce au dessus du leek) : <input type="checkbox" id="removeChipImage"><br>'
        + 'Chip aureol (croix au dessus du leek) : <input type="checkbox" id="removeChipAureol"><br>'
        + 'Chip heal (animation verte quand on soigne un leek) : <input type="checkbox" id="removeChipHeal"><br>'
        + 'Say : <input type="checkbox" id="removeSay"><br>'
        + 'Slow Motion (ajoute un ralenti sur les kills) : <input type="checkbox" id="addSlowMotion"><br>'
        + '<br><br><center><input class="button green" value="Appliquer" id="remove_animation_apply"></center></div></div></div>');

    	$('#removeGas').prop('checked', removeGas);
    	$('#removeFire').prop('checked', removeFire);
    	$('#removeExplosion').prop('checked', removeExplosion);
    	$('#removeChipHalo').prop('checked', removeChipHalo);
    	$('#removeChipImage').prop('checked', removeChipImage);
    	$('#removeChipAureol').prop('checked', removeChipAureol);
    	$('#removeChipHeal').prop('checked', removeChipHeal);
    	$('#removeSay').prop('checked', removeSay);
    	$('#addSlowMotion').prop('checked', addSlowMotion);
    }

	if (LW.currentPage == 'fight')
	{
        var removeGas = localStorage['removeGas'] === undefined ? true : (localStorage['removeGas'] === 'true');
        var removeFire = localStorage['removeFire'] === undefined ? true : (localStorage['removeFire'] === 'true');
        var removeExplosion = localStorage['removeExplosion'] === undefined ? true : (localStorage['removeExplosion'] === 'true');
        var removeChipHalo = localStorage['removeChipHalo'] === undefined ? true : (localStorage['removeChipHalo'] === 'true');
        var removeChipImage = localStorage['removeChipImage'] === undefined ? false : (localStorage['removeChipImage'] === 'true');
        var removeChipAureol = localStorage['removeChipAureol'] === undefined ? true : (localStorage['removeChipAureol'] === 'true');
        var removeChipHeal = localStorage['removeChipHeal'] === undefined ? true : (localStorage['removeChipHeal'] === 'true');
        var removeSay = localStorage['removeSay'] === undefined ? false : (localStorage['removeSay'] === 'true');
        var addSlowMotion = localStorage['addSlowMotion'] === undefined ? false : (localStorage['addSlowMotion'] === 'true');


		var initInt = setInterval(function()
		{
			if (typeof M != "undefined")
			{
                clearInterval(initInt);

                if (removeFire) {
                    game.particles.addFire = function(x, y, z, angle, targets, thrown) {};
                    game.particles.addFireSimple = function(x, y, z, angle, targets, thrown) {};
                }
                if (removeGas) {
                    game.particles.addGaz = function(x, y, z, angle, targets, thrown) {};
                }
                if (removeExplosion) {
                    game.particles.addExplosion = function(x, y, z) {};
                }

                // Animation autour du leek
                if (removeChipHalo) {
                    createChipHalo = function (targets, texture) {};
                }

                // Image de la puce au dessus du leek
                if (removeChipImage) {
                    createChipImage = function (targets, texture) {};
                }

                // Croix au dessus du leek
                if (removeChipAureol) {
                    createChipAureol = function (targets, texture) {};
                }

                // Truc vert quand on soigne un leek
                if (removeChipHeal) {
                    createChipHeal = function (targets) {};
                }

                //say
                if (removeSay) {
                    var nbLeeks = game.leeks.length;
                    console.log('ok ' + nbLeeks);
                    for (var i = 0; i<nbLeeks; i++){
                        game.leeks[i].say = function(message) {};
                    }
                }
                
                //slow motion
                if (addSlowMotion) {
                    interceptFunction(game, "doAction", {
                        before: function(action){
                            if(action[0]==ACTION_PLAYER_DEAD){
                                var oldGameSpeed = game.speed;
                                game.speed = 0.1;
                                setTimeout(function(){
                                    game.speed = oldGameSpeed;
                                }, 1000); // 1 seconde de slow motion. faire un param ?
                            }
                        }
                    });
                }

                game.actions.filter(function(a) { return a[0] === ACTION_USE_WEAPON && a[3] === 11;})


			}
		}, 100);
	}
});


})();


};


var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ mainRemoveAnimations +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
