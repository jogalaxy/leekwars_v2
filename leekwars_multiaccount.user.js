// ==UserScript==
// @name          [Leek Wars] Multi account manager
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.1
// @description   Ajout de la possibilité de changer de compte en 1 clic.
// @author        WhiteSlash
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_multiaccount.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_multiaccount.user.js
// @match         http://leekwars.com/*
// @include       http://leekwars.com/*
// @grant         none
// ==/UserScript==




function leekwars_multiaccount(){
	//utilitaire pour mes userscripts, à voir pour externaliser
	if(typeof WS == 'undefined'){
		WS = {};
		WS.require = function(files, callback){
			var count = 0;
			var loaded = 0;
			var callEnded = false;
			function countLoadedFiles(){
				loaded++;
				if(callEnded && loaded == count){
					console.log('We loaded everything, '+loaded+'/'+count+', sir.');
					if(typeof callback === "function")
						callback();
				}
			}
			if(typeof files !== 'object')
				files = [files];
			for(var i in files){
				count++;
				_.script.load(LW.staticURL + '/script/', files[i] , countLoadedFiles);
			}
			callEnded = true;
		}
		WS.getOption = function(key, default_value){
			if(localStorage.getItem(key) === null && default_value !== undefined){
				WS.setOption(key, default_value);
				return default_value;
			}
			return JSON.parse(localStorage.getItem(key));
		}
		WS.setOption = function(key, value){
			localStorage.setItem(key, JSON.stringify(value));
		}
		//gestion des "helpers"
		WS.optionList = {};
		WS.addOptions = function(script, datas){
			WS.optionList[script] = datas;
		}
		WS.displayOptionsForm = function(){
			var blocOptions = '<div class="flex-container">';
			for(var script in WS.optionList){
				var datas = WS.optionList[script];
				blocOptions += '<div class="column6">'
				+ '<div class="panel first"><div class="header"><h2>'+datas.title+'</h2></div>'
				+ '<div class="content"><div id="'+script+'">'
				//On ajoute les inputs
				for(var i = 0 ; i < datas.fields.length; i++){
					var field = datas.fields[i];
					blocOptions += '<h4 id="'+field.name+'">'+field.label+'</h4>';

					if(field.type == 'textarea'){
						blocOptions += '<textarea  class="ws-options-input" name="'+field.name+'" style="width:100%;height:50px;margin-top:15px;">'
							+JSON.stringify(WS.getOption(field.name))+'</textarea>';
						field.hint += "<br/><br/><small>Il suffit de cliquer en dehors du cadre pour enregistrer l'option</small>";
					}
					else{
						blocOptions += '<p>Pas encore dev les autres types de input!</p>';
					}
					blocOptions += '<p>'+field.hint+'</p>';
				}

				blocOptions += '</div></div></div>';
			}
			blocOptions += '</div>';
			$('.advanced-button').parent().before(blocOptions);
			$('.ws-options-input').change(function(){
				WS.setOption($(this).attr('name'), JSON.parse($(this).val()));
				_.toast("L'option \"" + $('#'+$(this).attr('name')).text() + '" a été mise à jour !');
			});
		}
		WS.require('settings.v2.js', function(){
			var defaultAdvanced = LW.pages.settings.advanced;
			LW.pages.settings.advanced = function(){
				defaultAdvanced();
				WS.displayOptionsForm();
			}
		});
	}

	//ONLY STARTING HERE
	LW.on('pageload', function(){
		
		//système de gestion des options
		WS.addOptions('leekwars_multiaccount', {
			'title' : '[UserScript] Multi-compte',
			'fields' : [
				{'name':'multiaccount-accounts', 'label':'Liste des comptes', 'type':'textarea','hint':'Au format suivant : {"pseudo":"mdp1","pseudo2":"mdp2"} (sans espace)<br/><br/>Il faudra faire un petit F5 pour que le menu se mette en haut à droite au survol de votre avatar/pseudo.'}
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

var script = document.createElement('script'); 
script.type = 'text/javascript'; 
script.innerHTML = ""+leekwars_multiaccount+"leekwars_multiaccount();";//lol
document.getElementsByTagName('head')[0].appendChild(script);