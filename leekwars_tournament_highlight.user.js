// ==UserScript==
// @name          [Leek Wars] Tournament hightlight
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.2
// @description   Ajoute la possibilité de colorer d'autres poireaux dans les tournois
// @author        WhiteSlash
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tournament_highlight.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tournament_highlight.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==




function leekwars_tournament_highlight(){

	$(function(){

		//système de gestion des options
		WS.addOptions('leekwars_tournament_highlight', {
			'title' : '[UserScript] Coloration des tournois',
			'fields' : [
				{'name':'hightlight-leeks', 'label':'Liste des poireaux', 'type':'textarea','hint':''},
				{'name':'hightlight-farmers', 'label':'Liste des eleveurs', 'type':'textarea','hint':'Au format suivant : {"couleur_hexa":[123,123,123],"#FF55EE":[1,2,3,5,6]} (sans espace)'}
			]
		});

		WS.require('tournament.v2.js', function(){
			var oldComments = LW.pages.tournament.comments;
			LW.pages.tournament.comments = function(){
				oldComments();

				//selon le type on récup les infos qu'on veut
				var colors = {};
				if(LW.pages.tournament.scope.tournament.type=="solo"){
					colors = WS.getOption('hightlight-leeks', {});
				}
				else if(LW.pages.tournament.scope.tournament.type=="farmer"){
					colors = WS.getOption('hightlight-farmers', {});
				}

				function findIdInUrl(url, regexp){
				    var matches = url.match(regexp);
				    if(matches === null)
				        return false;
				    return matches[1];
				}

				//taken from http://www.sitepoint.com/javascript-generate-lighter-darker-color/
				function ColorLuminance(hex, lum) {
					// validate hex string
					hex = String(hex).replace(/[^0-9a-f]/gi, '');
					if (hex.length < 6) {
						hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
					}
					lum = lum || 0;

					// convert to decimal and change luminosity
					var rgb = "#", c, i;
					for (i = 0; i < 3; i++) {
						c = parseInt(hex.substr(i*2,2), 16);
						c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
						rgb += ("00"+c).substr(c.length);
					}

					return rgb;
				}

				function coloriseCell(jqObject, fill){
				    jqObject.find('rect').css({'stroke':ColorLuminance(fill, -0.4), 'fill':fill});
				}

			    for(var color in colors){
			        var ids = colors[color];
			         $('svg#tournament a').each(function(){
			         	for(var i = 0 ; i < ids.length ; i++){
			                if(ids[i] == findIdInUrl($(this).attr('xlink:href'), /\/leek\/(.*)/)) {
			                 	coloriseCell($(this), color);
			                 }
			                 else if(ids[i] == findIdInUrl($(this).attr('xlink:href'), /\/farmer\/(.*)/)){
			                 	coloriseCell($(this), color);
			                 	$(this).find('rect').css('opacity',0.4);
			                 	//on inverse l'image et le rectangle car l'opacité faible de l'image c'est bof
			                 	var img = $(this).find('image').detach();
			                 	$(this).prepend(img);
			                 }
			            }
		            });
				}
			}//fin override
		});
	});
}

function injectMe(){
	//ajout de ce userscript dans la page
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.innerHTML = ""+leekwars_tournament_highlight+"leekwars_tournament_highlight();";//lol
	document.getElementsByTagName('head')[0].appendChild(script);
}


//Ajout dépendance avec mon utilitaire de scripts
if(typeof WS === "undefined"){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src="https://rawgit.com/jogalaxy/leekwars_v2/master/ws_lib.user.js";
	script.onload = function(){
		injectMe();
	}
	document.getElementsByTagName('head')[0].appendChild(script);
}
else{
	injectMe();
}

