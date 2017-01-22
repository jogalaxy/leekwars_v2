// ==UserScript==
// @name          [Leek Wars] Editor - Import & Export
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.5
// @description   Permet d'importer et d'exporter ses IA
// @author        jojo123 && caragane
// @projectPage   https://github.com/jogalaxy/leekwars_v2
// @downloadURL   https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_editor_import_export.user.js
// @updateURL     https://github.com/jogalaxy/leekwars_v2/raw/master/leekwars_editor_import_export.user.js
// @require       https://raw.githubusercontent.com/Stuk/jszip/master/dist/jszip.min.js
// @match         *://*.leekwars.com/*
// @grant         none
// ==/UserScript==

LW.on('pageload', function()
{
    if (LW.currentPage == 'editor')
        {
            $('#editor-page .tabs').prepend('<div id="export-button" class="tab">Export All</div>');
            $('#export-button').click(export_all_functions);
            $('#editor-page .tabs').prepend('<div id="export-button" class="tab">Export</div>');
            $('#export-button').click(export_function);
            $('#editor-page .tabs').prepend('<div id="uploader" class="tab" title="">Import</div>');
            $('#editor-page .tabs').prepend('<input type="file" multiple id="importer" style="display:none;"/>');
            $('#uploader').click(function(){$('#importer').click();});
            $('#importer').on('change', importFiles);
        }
    });

function importFiles(event) {
    _.toast("Implementation in progress...");
    $.each(e.target.files, function(i, file) {
        console.debug("Processing file: "+file.name);
    });
}

function export_function()
{
    if (current == null) {
        return;
    }

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

    $.ajax({
        url: 'https://leekwars.com/api/ai/get-farmer-ais/$',
        dataType: 'json',
        success: function (workspace) {
            $.each(workspace.ais, function (i, aiFile) {
                var tree = [];
                if (aiFile.folder != 0) {
                    tree.unshift(workspace.folders.filter(function (f) { return f.id == aiFile.folder; }) [0]);
                    while (tree[0].folder != 0)
                        tree.unshift(workspace.folders.filter(function (f) {
                            return f.id == tree[0].folder;
                        }) [0]);
                }
                var path = '';
                $.each(tree, function (i, f) {
                    path = path + '/' + f.name;
                });
                path = path + '/' + aiFile.name;
                path = path.substring(1, path.length);
                $.ajax({
                    url: 'https://leekwars.com/api/ai/get/' + aiFile.id + '/$',
                    dataType: 'json',
                    success: function (result) {
                        zip.file(path, result.ai.code);
                    },
                    async: false
                });
            });
        },
        async: false
    });

    var a = document.createElement('a');
    document.body.appendChild(a);
    a.download = "LeekScript.zip";
    zip.generateAsync({type:"base64"}).then(function(content){
        a.href = "data:application/zip;base64," + content;
        a.click();
        a.remove(); 
    });
}

/*
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
*/