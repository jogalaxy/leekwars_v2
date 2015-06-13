// ==UserScript==
// @name          Fonctions Userscripts de WhiteSlash
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.1
// @description   Rajoute certains utilitaires utilisés par tous mes userscripts. Pas besoin d'installer.
// @author        WhiteSlash
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/ws_lib.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/ws_lib.user.js
// @match         http://leekwars.com/*
// @include       http://leekwars.com/*
// @grant         none
// ==/UserScript==

//function ws_lib(){

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

					var hintTmp = field.hint;
					if(field.type == 'textarea'){
						blocOptions += '<textarea  class="ws-options-input" name="'+field.name+'" style="width:100%;height:50px;margin-top:15px;">'
							+JSON.stringify(WS.getOption(field.name))+'</textarea>';
						hintTmp += (field.hint.length>0?"<br/><br/>":"")+"<small>Il suffit de cliquer en dehors du cadre pour enregistrer l'option</small>";
					}
					else{
						blocOptions += '<p>Pas encore dev les autres types de input!</p>';
					}
					blocOptions += '<p>'+hintTmp+'</p>';
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
//}

//var script = document.createElement('script'); 
//script.type = 'text/javascript'; 
//script.innerHTML = ""+ws_lib+"ws_lib();";//lol
//document.getElementsByTagName('head')[0].appendChild(script);