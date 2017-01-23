# LeekWars UserScripts

## Import-Export Script

This script provides 3 features:

* **Export** allows to export the currently selected file in the editor as a file;
* **Export All** allows to export a zip file containing all of the AIs, included in their respective folders;
* **Import** allows to import files in the editors. It has a couple limitations though:

### Import limitations:

Because I didn't spend much time on it, the import script will:

* Create the file and import its content in case it doesn't exist on leekwars yet,
* Replace the content of an existing file, the files are matched by their names,
* Do nothing in case it finds multiple files with the same names, even if they're in different folders. Blame me or pullrequest if that's annoying for you :)
* Also it will ask a confirmation before overriding an existing file, which you can bypass at the beginning of the import process by saying you don't want validation.

Also, only files can be selected from the import file chooser. I can be a bit annoying in case you have several files in several folders. Hopefully, I prepared a small script for you:

`prepare_import.sh`

which you can run from the root of your repository. It'll flatten all of your files in a `to_import` directory, that you can use in order to import your files.

Again, that's perhaps not the solution you would be looking for, but it works for me, so it could potentially help you :)

Have fun using the scripts, and do not hesitate to contribute ;)


# Application mobile (non officielle)

Dernière version : 0.5

https://mega.nz/#!W85BVQbD!frtbWZOwVtiqqruc6koAZ2yjEbFITj19LEZ-zTfm-eE