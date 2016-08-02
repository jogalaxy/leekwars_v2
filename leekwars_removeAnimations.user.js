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
    // inArray
    function inArray(val, array){
        for (var i in array)
            if (val === array[i]) return true;
        return false;        
    }
    // récupère l'action avant la mort d'un leek pour commencer le slow motion au bon moment.
    function getSlowMotionActions(){
        var slowMotionActions = [];
        var nbActions = game.actions.length;
        for (var i = 1 ; i < (nbActions-1); i++)
        {		            
            var nextActionType =  game.actions[i+1][0];
            if (nextActionType === ACTION_PLAYER_DEAD) slowMotionActions.push(i);
        }	
        return slowMotionActions;
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

	    $('#settings-page .flex-container').first().append('<div class="column6"><div class="panel"><div class="header"><h2>Suppression animation</h2></div>'
        +'<div class="content" style="text-align: left;">'
        + '<h3>Des choses en moins</h3>'
        + '<p>'
        + '<input type="checkbox" class="category-checkbox" id="removeGas"> <label for="removeGas" class="category-title">Gas</label><br/>'
        + '<input type="checkbox" id="removeFire"> <label for="removeFire" class="category-title">Feu</label><br/>'
        + '<input type="checkbox" id="removeExplosion"> <label for="removeExplosion" class="category-title">Explosion</label><br>'
        + '<input type="checkbox" id="removeChipHalo"> <label for="removeChipHalo" class="category-title">Chip halo (animation autour du leek)</label><br>'
        + '<input type="checkbox" id="removeChipImage"> <label for="removeChipImage" class="category-title">Chip image (image de la puce au dessus du leek)</label><br>'
        + '<input type="checkbox" id="removeChipAureol"> <label for="removeChipAureol" class="category-title">Chip aureol (croix au dessus du leek) </label><br>'
        + '<input type="checkbox" id="removeChipHeal"> <label for="removeChipHeal" class="category-title">Chip heal (animation verte quand on soigne un leek)</label><br>'
        + '<input type="checkbox" id="removeSay"> <label for="removeSay" class="category-title">Say</label><br>'
        + '</p>'
        + '<h3>Des choses en plus</h3>'
        + '<p>'
        + '<input type="checkbox" id="addSlowMotion"> <label for="addSlowMotion" class="category-title">Slow Motion (ajoute un ralenti sur les kills)</label><br>'
        + '</p>'
        + '<br><br><center><div class="button green" id="remove_animation_apply">Appliquer</div></center></div></div></div>');

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
                    for (var i = 0; i<nbLeeks; i++){
                        game.leeks[i].say = function(message) {};
                    }
                }
                
                //slow motion
                if (addSlowMotion) {
					var slowMotionActions = getSlowMotionActions();										
                    interceptFunction(game, "doAction", {
                        before: function(action){
                            if (inArray(game.currentAction, slowMotionActions)){ 
                                var gameDiv = document.getElementById("layers");
                                var wasted;
                                var bgCanvas = document.getElementById("bg-canvas");
                                var gameCanvas = document.getElementById("game-canvas");
                                if(gameDiv.lastChild["isWastedScreen"] === true){
                                    //wasted déjà créé
                                    wasted = gameDiv.lastChild;
                                }else{
                                    //besoin de crééer la div wasted
                                    wasted = document.createElement("div");
                                    wasted["isWastedScreen"] = true;
                                    wasted.style.textAlign = "center";
                                    wasted.style.position = "absolute";
                                    wasted.style.top = "0";
                                    wasted.style.left = "0";
                                    wasted.style.height = "100%";
                                    wasted.style.width = "100%";
                                    wasted.style.backgroundImage = "url(https://i.imgur.com/JN1rYNl.png)";
                                    wasted.style.backgroundSize = "auto 100%";
                                    wasted.style.backgroundPosition = "center";
                                    wasted.style.backgroundRepeat = "no-repeat";
                                    wasted.style.transition = "all 1s";
                                    gameDiv.appendChild(wasted);
                                    // ajoute une transition sur les canvas
                                    bgCanvas.style.transition = "all 500ms";
                                    gameCanvas.style.transition = "all 500ms";
                                }
                                
                                wasted.style.opacity="1";
                                wasted.style.display = "block";
                                bgCanvas.style["-webkit-filter"] = "grayscale(100%)";
                                bgCanvas.style.filter = "grayscale(100%)";
                                gameCanvas.style["-webkit-filter"] = "grayscale(100%)";
                                gameCanvas.style.filter = "grayscale(100%)";
                                var oldGameSpeed = game.speed;
                                game.speed = 0.1;
                                
                                setTimeout(function(){
                                    game.speed = oldGameSpeed;
                                    wasted.style.opacity="0";
                                    bgCanvas.style["-webkit-filter"] = "none";
                                    bgCanvas.style.filter = "none";
                                    gameCanvas.style["-webkit-filter"] = "none";
                                    gameCanvas.style.filter = "none";
                                    setTimeout(function(){
                                        wasted.style.display = "none";
                                    }, 500);
                                }, 1000); // 1 seconde de slow motion. faire un param ?
                            }
                        }
                    });
                }


			}
		}, 100);
	}
});


})();
    
};




var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ mainRemoveAnimations +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
