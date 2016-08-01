// ==UserScript==
// @name          [Leek Wars] Multi account manager
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.1.2
// @description   Ajout de la possibilité de changer de compte en 1 clic.
// @author        WhiteSlash
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_multiaccount.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_multiaccount.user.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==




function leekwars_multiaccount(){

		LW.on('pageload', function(){

		//système de gestion des options
		WS.addOptions('leekwars_multiaccount', {
			'title' : '[UserScript] Multi-compte',
			'fields' : [
				{'name':'multiaccount-accounts', 'label':'Liste des comptes', 'type':'textarea','secret':true,'hint':'Au format suivant : {"pseudo":"mdp1","pseudo2":"mdp2"} (sans espace)<br/><br/>Il faudra faire un petit F5 pour que le menu se mette en haut à droite au survol de votre avatar/pseudo.'}
			]
		});

		var accounts = WS.getOption('multiaccount-accounts', {});

		//Génération du menu déroulant
		var menu = $('<div>').addClass('multi-account-dropdown').css({
			'position': 'absolute',
		    'min-width': '100%',
		    'background-color': 'rgba(0,0,0,0.8)',
		    'z-index': '99999',
		    'font-size': '17px'
		});

		var liste = $('<ul>').attr('id', 'account-list').css({
			'list-style': 'none',
		    'margin': '0',
		    'padding': '10px'
		});

		for(var pseudo in accounts){
			var pwd = accounts[pseudo];
			var ligne = $('<a>').addClass('multiaccount-change').css({'color':'white'}).text(pseudo)
				.attr('data-pwd', pwd).attr('href', '#');
			liste.append($('<li>').html(ligne));
		}


		menu.append(liste);

		//mini timeOut car le onepage fait chier et modifie tout un peu quand il veut
		//si on est déjà co
		var lastButton = $('#header-farmer .button-wrapper').last().addClass('account-list-wrapper');
		lastButton.css('position','relative').append(menu.clone());
		console.log(lastButton);
		console.log(menu);
		//si on est pas co
		$('#login-button').addClass('account-list-wrapper').css('position','relative').append(menu.clone());
		$('.multi-account-dropdown').slideUp();
		$(document).on('mouseenter touch', ".account-list-wrapper", function(){
			$(this).find('.multi-account-dropdown').stop(true, true).slideDown();
		})
					.on('mouseleave touch', ".account-list-wrapper", function(){
			$(this).find('.multi-account-dropdown').stop(true, true).slideUp();
		});

		//Gestion co/deco
		$(document).on('click touch', '.multiaccount-change', function(){
			//On deconnecte l'actuel et on lance l'autre
			var pseudo = $(this).text().trim();
			var pwd = $(this).attr('data-pwd');


			if(LW.connected){
				LW.disconnect();
			}
			_.post('farmer/login', {login:pseudo, password:pwd}, function(data) {

				if (data.success) {

					_.log("Login success !")

					LW.connect(data.farmer, function() {
						LW.page('/');
						document.location.reload();
					})

				} else {

					$('#error').hide().fadeIn()
				}
			});
			return false;
		});
	});
}


function injectMe(){
	//ajout de ce userscript dans la page
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.innerHTML = ""+leekwars_multiaccount+"leekwars_multiaccount();";//lol
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