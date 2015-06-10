// ==UserScript==
// @name          [Leek Wars] Team Management Enhancer
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.2
// @description   Diminution de la taille des poireaux sur la page d'équipe et amélioration de la gestion de poireaux
// @author        WhiteSlash
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_team_management_enhancer.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_team_management_enhancer.user.js
// @match         http://leekwars.com/*
// @include       http://leekwars.com/*
// @grant         none
// ==/UserScript==


function leekwars_team_management_enhancer(){
	//don't mind that
	var require = function(files, callback){
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

	//ONLY STARTING HERE
	$(function(){
		require('team.v2.js', function(){
			//on se greffe comme un sale à la fin de la fonction tournaments qui est la dernière appelée sur la page
			//donc on est sûr d'avoir tout le HTML
			var defaultFunction = LW.pages.team.tournaments;
			LW.pages.team.tournaments = function(){
				defaultFunction();

				//Tchat
			    $('#team-chat-messages').css('max-height', '300px');
			    //Modif de toutes les compos
			    $('.content.leeks .leek').css('position', 'relative');
			    $('.content.leeks .leek svg').css({'position':'absolute','top':'0px', 'left' :'0px', 'width':'30px', 'height':'40px', 'opacity': '0.5'});
			    $('.content.leeks .leek svg image').each(function(){
			        if($(this).attr('xlink:href').search('/leek/')==-1){
			            $(this).hide();
			        }
			        else{
			            //On garde les proportions en mettant un max en largeur
			            $(this).attr('width','30');
			            $(this).attr('height','40');
			            $(this).attr('x','0');
			            $(this).attr('y','0');
			        }
			    });
			    $('.content.leeks .leek .name').css({'position':'relative','font-size':'14px', color:'black', 'font-weight':'bold'});
			     $('.content.leeks .leek .fights').css({'position':'absolute', 'top':'0px', 'left':'30px'});
			    $('.content.leeks .leek .fights span').css({'font-size':'14px'});
			    $('.content.leeks .leek .fights img').css({'height':'13px', 'width':'13px'});
			    $('.compo .leeks').css('min-height', '50px');
			    
			    //Gestion de la dernière compo pour la caler à droite
			    $('.panel.compo').css({'width':'68%'});
			    var detachedCompo = $('.panel.compo[compo=-1]').detach();
			 	//pour finir on lui file une grosse hauteur pour être sûr que ça soit bien visible sur toutes nos compos
			 	var totalHeight = $('.panel.compo').last().offset().top
			 		+ $('.panel.compo').last().height()
				 	- $('.panel.compo').first().offset().top;

				 	console.log(totalHeight);
			 	//et on la remet
			 	detachedCompo.insertAfter('.no-compos')
			    	.css({'float': 'right','width': '30%', 'min-height':totalHeight+'px'})
			    	//.find('.compo-title').hide();
			}
		});
	});
}

var script = document.createElement('script'); 
script.type = 'text/javascript'; 
script.innerHTML = ""+leekwars_team_management_enhancer+"leekwars_team_management_enhancer();";//lol
document.getElementsByTagName('head')[0].appendChild(script);