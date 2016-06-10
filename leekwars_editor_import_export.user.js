// ==UserScript==
// @name          [Leek Wars] Editor - Import & Export
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.4
// @description   Permet d'importer et d'exporter ses IA
// @author        jojo123 && caragane
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_editor_import_export.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_editor_import_export.user.js
// @require       https://raw.githubusercontent.com/Stuk/jszip/master/dist/jszip.min.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

_.view.loaded['editor.import_popup'] = "<div class='title'>Remplacement de l'ia \"{ai}\"</div><div class='content'>Cette action est irreversible !</div><div class='actions'><div class='dismiss'>{#delete_cancel}</div><div id='import' class='green'>Importer</div></div>";

LW.on('pageload', function()
{
        if (LW.currentPage == 'editor')
        {
                $('#editor-page .tabs').prepend('<div id="export-button" class="tab" title="" style="font-size: 12px; line-height: 18px;">Tout Exporter</div>');
                $('#export-button').click(export_all_functions);
                $('#editor-page .tabs').prepend('<div id="export-button" class="tab" title="" style="font-size: 12px; line-height: 18px;">Exporter</div>');
                $('#export-button').click(export_function);
                $('#editor-page').append('<div id="upload_box" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,0.6);z-index:999;color:#fff;text-align:center;padding-top:50px;display:none">Importation d\'une IA</div>');
        }
});

$(document).on('drop', '#editor-page', function(e)
{
        if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.effectAllowed == 'all')
        {
                e.preventDefault();
                e.stopPropagation();
                upload(e.originalEvent.dataTransfer.files);
                $('#upload_box').hide();
        }
});

$(document).on('dragenter', '#editor-page', function(e)
{
        if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.effectAllowed == 'all')
        {
                e.preventDefault();
                e.stopPropagation();
                $('#upload_box').show();
        }
});

$(document).on('dragover', '#editor-page', function(e)
{
        if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.effectAllowed == 'all')
        {
                e.preventDefault();
                e.stopPropagation();
                $('#upload_box').show();
        }
});

$(document).on('dragleave', '#editor-page', function(e)
{
        if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.effectAllowed == 'all')
        {
                if ($(e.target).is($('#upload_box')))
                {
                        e.preventDefault();
                        e.stopPropagation();
                        $('#upload_box').hide();
                }
        }
});

function export_function()
{
        if (current == null)
                return;

        var name = editors[current].name;
        name = name;
        var content = editors[current].editor.getValue();

        var a = document.createElement('a');
        document.body.appendChild(a);
        a.download = name;
        a.href = "data:text/plain;charset=utf-8,"+encodeURIComponent(content);
        a.click();
        a.remove();
}

function export_all_functions()
{
        var zip = new JSZip();

        for(var i in editors)
        {
                $.ajax({
                        url: 'https://leekwars.com/api/ai/get/' + i +'/$',
                        dataType: "json",
                        success: function(result){
                                zip.file(result.ai.name, result.ai.code);
                        },
                        async: false
                });
        }

        var a = document.createElement('a');
        document.body.appendChild(a);
        a.download = "LeekScript.zip";
        zip.generateAsync({type:"base64"}).then(function(content){
               a.href = "data:application/zip;base64," + content;
               a.click();
               a.remove(); 
        });
}

function upload(files)
{
        for (var i = 0; i < files.length; i++)
        {
                upload_file(files[i]);
        }
}

function upload_file(file)
{
        var reader = new FileReader();
        reader.onload = function(e)
        {
                var content = e.target.result;
                var name = file.name;

                var alreadyExist = 0;
                for (var i in editors)
                        if (editors[i].name == name) alreadyExist++;

                if (alreadyExist == 0)
                {
                        _.post('ai/new', {}, function(data)
                        {
                                if (data.success)
                                {
                                        var ai = data.ai;
                                        current = ai.id;
                                        _.post('ai/save/', {ai_id: current, code: content}, function(data)
                                        {
                                                editors[ai.id] = new Editor(ai.id, ai.name, true, ai.level, ai.code);
                                                $('.CodeMirror').css('font-size', _fontSize);
                                                editors[current].editor.setValue(content);
                                                editors[current].updateName(name);
                                                editors[current].save();
                                                editors[current].loaded = false;
                                                editors[current].show();
                                                _.toast('IA : "'+name+'" importée !');
                                        });
                                }
                                else
                                        _.toast('Erreur serveur !');
                        });
                }
                else if (alreadyExist == 1)
                {
                        var current = null;
                        for (var i in editors)
                                if (editors[i].name == name) current = i;

                        var importPopup = new _.popup.new('editor.import_popup', {ai: name});
                        importPopup.find('#import').click(function()
                        {
                                _.post('ai/save/', {ai_id: current, code: content}, function(data)
                                {
                                        editors[current].editor.setValue(content);
                                        editors[current].save();
                                        editors[current].loaded = false;
                                        editors[current].show();
                                        _.toast('IA : "'+name+'" importée !');
                                });
                                importPopup.dismiss();
                        });
                        importPopup.show(e)
                }
                else
                {
                        _.toast('Erreur ! Plusieures IA sont nommée : "'+name+'"');
                }
        }
        reader.readAsText(file);
}
