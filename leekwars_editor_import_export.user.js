// ==UserScript==
// @name          [Leek Wars] Editor - Import & Export
// @namespace     https://github.com/jogalaxy/leekwars_v2
// @version       0.6
// @description   Permet d'importer et d'exporter ses IA
// @author        jojo123 && caragane && antoine
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

    var secured = confirm("Ask validation for each and every file?");

    $.each(event.target.files, function(i, file) {
        var name = file.name;
        var reader = new FileReader();
        reader.onload = function(e) { 
            var content = e.target.result;
            if (content != null) {
                var occurences = 0;
                for (var i in editors)
                    if(editors[i].name == name) occurences ++;

                    if(occurences == 0) {
                        $.ajax({
                            url: "https://leekwars.com/api/ai/new",
                            type: "POST",
                            dataType: "json",
                            async: false,
                            data: {folder_id: "0", token: "$"},
                            success: function(result) {
                                var ai = result.ai;
                                $.ajax({
                                    url: "https://leekwars.com/api/ai/rename",
                                    type: "POST",
                                    dataType: "json",
                                    async: false,
                                    data: {ai_id: ai.id, new_name: name, token: "$"},
                                    success: function(result) {
                                        $.ajax({
                                            url: "https://leekwars.com/api/ai/save",
                                            type: "POST",
                                            dataType: "json",
                                            async: false,
                                            data: {ai_id: ai.id, code: content, token: "$"},
                                            success: function(result) {
                                                _.toast(name+" has been created!");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else if (occurences == 1) {
                        var current = null;
                        for (var i in editors)
                            if(editors[i].name == name) current = i;

                        if (!secured || secured && confirm('Are you sure you want to override '+name+'?')) {
                            editors[current].editor.setValue(content);
                            editors[current].save();
                            editors[current].loaded = false;
                            editors[current].show();

                            _.toast(name+" has been modified!");
                        } else {
                            _.toast(name+" has been bypassed!");
                        }

                    } else {
                        _.toast(name+" already exists multiple times. Not doing anything.");
                    }                

                } else _.toast(name+" is empty and cannot be imported");
            };
            reader.readAsText(file);
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
