// ==UserScript==
// @name          [Leek Wars] Tchat mute
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.2.2
// @description   Ajout de la fonctionnalité de mute sur le tchat. Ne fonctionne que sur le tchat normal.
// @author        WhiteSlash
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_mute.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_mute.user.js
// @match         http://leekwars.com/*
// @include       http://leekwars.com/*
// @grant         none
// ==/UserScript==

function leekwars_tchat_mute(){
	
	$(function(){
		WS.require('forum.v2.js', function(){
			var aMuted = {};
			var useLocalStorage = true;
			try {
		        localStorage.setItem(1, 1);
		        localStorage.removeItem(1);
		        
		        aMuted = JSON.parse(localStorage.getItem('tchat/muted'));
		        //si c'est la première fois qu'on arrive
		        if(!aMuted){
		        	aMuted = {};
		        	localStorage.setItem('tchat/muted', JSON.stringify(aMuted));
		        }
		    } catch(e) {
		        //tant pis on le fait en live
		        useLocalStorage = false;
		    }

			var setMute = function(pseudo){
				aMuted[pseudo] = 1;
				if(useLocalStorage)
					localStorage.setItem('tchat/muted', JSON.stringify(aMuted));
			}
			var isMuted = function(pseudo){
				return aMuted[pseudo] !== undefined;
			}
			var removeMute = function(pseudo){
				if(aMuted[pseudo])
					delete aMuted[pseudo];
				if(useLocalStorage)
					localStorage.setItem('tchat/muted', JSON.stringify(aMuted));
			}

			//On bloque la réception des chieurs
			var defaultAddMessage = chatAddMessage;
			chatAddMessage = function(chat, author, authorName, msg, time, color, avatarChanged, lang){
				if(isMuted(authorName))
					return false;
				defaultAddMessage(chat, author, authorName, msg, time, color, avatarChanged, lang)
			}

			//On ajoute des commandes
			var defaultSend = forumChatSend;
			forumChatSend = function(){
				var text = $.trim($('#chat-input').val());

				var message = '';
				if(text.substr(0,6)=='/mute '){
					var pseudo = text.substr(6).trim();
					setMute(pseudo);
					message = pseudo + ' a bien été mute. Tapez /mutelist pour avoir la liste des personnes mute.';
				}
				else if(text.substr(0,8)=='/unmute '){
					var pseudo = text.substr(8).trim();
					message = pseudo + ' a bien été demute. Tapez /mutelist pour avoir la liste des personnes mute.';
					removeMute(pseudo);
				}
				else if(text.substr(0,9)=='/mutelist'){
					var a = [];
					for(var i in aMuted){
						a.push(i);
					}
					message = 'Joueurs mute : ' + a.join(', ');
				}

				if(message.length){
					chatAddMessage(
						'#chat-messages'
						, LW.farmer.id
						, LW.farmer.name
						, message
						, parseInt(new Date().getTime() / 1000, 10)
						, ''
						, LW.farmer.avatar_changed
						, 'fr'
					);

					$('#chat-input').val("").height(0);
				}
				else{
					defaultSend();
				}
			}

			//au premier chargement, si on a des muted, on l'affiche dans le tchat
			var a = [];
			for(var i in aMuted){
				a.push(i);
			}
			if(a.length){
				var defaultWsConnected = LW.pages.forum.wsconnected;
				LW.pages.forum.wsconnected = function(){
					defaultWsConnected();
					chatAddMessage(
						'#chat-messages'
						, LW.farmer.id
						, LW.farmer.name
						, "[Leek Wars] Tchat mute. Personnes mute : " + a.join(', ')
						, parseInt(new Date().getTime() / 1000, 10)
						, ''
						, LW.farmer.avatar_changed
						, 'fr'
					);
				}
			}
		});
	});
}


function injectMe(){
	//ajout de ce userscript dans la page
	var script = document.createElement('script'); 
	script.type = 'text/javascript'; 
	script.innerHTML = ""+leekwars_tchat_mute+"leekwars_tchat_mute();";//lol
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
