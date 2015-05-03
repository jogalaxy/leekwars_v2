// ==UserScript==
// @name          [Leek Wars] Tchat Pseudo Autocomplete
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.1
// @description   Ajout de l'autocomplétion pour les pseudos dans le tchat
// @author        jojo123
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_pseudo_autocomplete.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_tchat_pseudo_autocomplete.user.js
// @match         http://beta.leekwars.com/*
// @grant         none
// ==/UserScript==

LW.init(function()
{

	_.view.load('main', false, function()
	{

		LW.chat.autocompleteNames = [];

		function autocompleteChat(chat)
		{

			var startNamePos = chat.getSelectionStart();
			var endNamePos = chat.getSelectionStart()-1;

			while(--startNamePos >= 0)
				if (chat.val().substr(startNamePos,1) == " ")
					break;

			while(++endNamePos < chat.val().length)
				if (chat.val().substr(endNamePos,1) == " ")
					break;

			var currentName = chat.val().substring(startNamePos + 1, endNamePos);

			if (LW.chat.autocompleteNames.length == 0 && currentName.length > 0)
			{

				for (var lang in LW.chat.messages)
				{
					for (var message in LW.chat.messages[lang])
					{
						var name = LW.chat.messages[lang][message][2];
						if (name.substr(0, currentName.length).toLowerCase() == currentName.toLowerCase() && LW.chat.autocompleteNames.indexOf(name) == -1)
								LW.chat.autocompleteNames.push(name);
					}
				}

				if (LW.chat.autocompleteNames.length > 0)
				{

					var before = chat.val().substring(0, startNamePos + 1);
					var after = chat.val().substring(endNamePos);
					currentName = LW.chat.autocompleteNames[LW.chat.autocompleteNames.length-1];

					chat.val(before + currentName + after);
					chat.setCursorPosition(startNamePos + currentName.length + 1);

				}

			}
			else
			{
				var currentPos = LW.chat.autocompleteNames.indexOf(currentName);
				if (currentPos != -1)
				{
					currentPos++;
					if (currentPos > LW.chat.autocompleteNames.length - 1) currentPos = 0;

					var before = chat.val().substring(0, startNamePos + 1);
					var after = chat.val().substring(endNamePos);
					currentName = LW.chat.autocompleteNames[currentPos];

					chat.val(before + currentName + after);
					chat.setCursorPosition(startNamePos + currentName.length + 1);
				}
			}

		}

		$(document).on('keydown', '#social-panel .chat-input', function(e)
		{
			if (e.keyCode === 9)
			{
				e.preventDefault();
				autocompleteChat($('#social-panel .chat-input'));
			}
			else
			{
				LW.chat.autocompleteNames = [];
			}
		});

		$(document).on('keydown', '#chat-input', function(e)
		{
			if (e.keyCode === 9)
			{
				e.preventDefault();
				autocompleteChat($('#chat-input'));
			}
			else
			{
				LW.chat.autocompleteNames = [];
			}
		});

		$(document).on('click', '#social-panel .chat-input', function(e)
		{
			LW.chat.autocompleteNames = [];
		});

		$(document).on('click', '#chat-input', function(e)
		{
			LW.chat.autocompleteNames = [];
		});

	});

});



/**
 * Cursor Functions
 *
 * Used for setting and getting text cursor position within an input
 * and textarea field. Also used to get and set selection range.
 * 
 * @author Branden Cash
 * @email brandencash@crutzdesigns.com
 */
 
(function( $ ){
  jQuery.fn.getCursorPosition = function(){
    if(this.lengh == 0) return -1;
    return $(this).getSelectionStart();
  }
  
  jQuery.fn.setCursorPosition = function(position){
    if(this.lengh == 0) return this;
    return $(this).setSelection(position, position);
  }
  
  jQuery.fn.getSelection = function(){
    if(this.lengh == 0) return -1;
    var s = $(this).getSelectionStart();
    var e = $(this).getSelectionEnd();
    return this[0].value.substring(s,e);
  }
  
  jQuery.fn.getSelectionStart = function(){
    if(this.lengh == 0) return -1;
    input = this[0];
    
    var pos = input.value.length;
    
    if (input.createTextRange) {
      var r = document.selection.createRange().duplicate();
      r.moveEnd('character', input.value.length);
      if (r.text == '') 
        pos = input.value.length;
      pos = input.value.lastIndexOf(r.text);
    } else if(typeof(input.selectionStart)!="undefined")
      pos = input.selectionStart;
    
    return pos;
  }
  
  jQuery.fn.getSelectionEnd = function(){
    if(this.lengh == 0) return -1;
    input = this[0];
    
    var pos = input.value.length;
    
    if (input.createTextRange) {
      var r = document.selection.createRange().duplicate();
      r.moveStart('character', -input.value.length);
      if (r.text == '') 
        pos = input.value.length;
      pos = input.value.lastIndexOf(r.text);
    } else if(typeof(input.selectionEnd)!="undefined")
      pos = input.selectionEnd;
    
    return pos;
  }
  
  jQuery.fn.setSelection = function(selectionStart, selectionEnd) {
    if(this.lengh == 0) return this;
    input = this[0];
    
    if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    } else if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    
    return this;
  }
})( jQuery );