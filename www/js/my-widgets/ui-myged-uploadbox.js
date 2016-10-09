/**
 * uploadFilesWidget Widget
 *
 * @author polux@poluxfr.org
 *
 * @example http://stackoverflow.com/questions/12954529/jquery-html5-file-drag-and-drop
 */
$.widget('mgd.uploadFilesWidget',{
    /* Default Options */
    options:{
        // Defaults options
        APIBaseUrl:'php-myged/api/v1/',
        progress : false, // TO DEV v2

        // Callbacks
        upload:null,
        uploadComplete:null
    },
    fileToUpload:null,
    /**
     * Default Constructor
     */
    _create : function(options)
    {
        console.debug('uploadFilesWidget - WIDGET _CREATE - #'+this.element.attr('id')+'.');

        this.element.addClass('myged-upload-box');
        this.fileToUpload = new Array;
    },
    /**
     * Initialization - Binding events
     */
    _init: function()
    {
        console.debug('uploadFilesWidget - WIDGET _INIT - Binding Events on #'+this.element.attr('id')+'.');

        this.element.on('dragenter', this._dragEnterEvent);
        this.element.on('dragover', this._dragOverEvent);
        this.element.on('dragleave', this._dragLeaveEvent);
        this.element.on('drop', $.proxy(this._dropEvent, this));
    },
    /**
     * Load file by navigator before UPLOAD IT
     */
    _readFile:function(key,obj)
    {
        var reader = new FileReader();

        console.debug('uploadFilesWidget - Upload request about \''+obj.name+'\', type: '+obj.type+' - Reading File.');

        // When file reading will be done => upload!
        reader.onload = $.proxy(this._uploadFile, this);
        reader.readAsDataURL(obj);

        this.currentFile = obj.name;
        this.currentType = obj.type;

        console.debug('uploadFilesWidget - End of Reading!');
    },
    /**
     * Upload file
     */
    _uploadFile : function(evt)
    {
        var pic = {};

        console.debug('uploadFilesWidget - Upload (file:'+this.currentFile+').');

        // HTTP Data
        pic.file = evt.target.result.split(',')[1];
        pic.filename = this.currentFile;
        pic.filetype = this.currentType;

        // Serialize
        var str = jQuery.param(pic);

        // Launch HTTP Request
        $.ajax({
            type: 'POST',
            url: this.options.APIBaseUrl+'file/',
            data: str,
            dataType: 'json',
            success: $.proxy(this.uploadComplete, this)
        });
    },
    /**
     * Upload CallBack
     */
    uploadComplete : function(data){
        console.debug('uploadFilesWidget - Upload finish successfully (file:'+this.currentFile+').');
        $(this.element).text(data);
        $(this.element).removeClass('myged-upload-dragOver');
    },
    /**
     * Drag & Drop Events Behaviour
     */
    _dragEnterEvent:function(e){
        console.debug('uploadFilesWidget - DragEnter Events - Event reached !');
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('myged-upload-dragOver');
        return true;
    },
    _dragLeaveEvent:function(e){
        console.debug('uploadFilesWidget - DragLeave Events - Event reached !');
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('myged-upload-dragOver');
        return false;
    },
    _dragOverEvent:function(e){
        console.debug('uploadFilesWidget - DragOver Events - Event reached !');
        e.preventDefault();
        e.stopPropagation();
        return false;
    },
    _dropEvent:function(e){

        $(e.target).removeClass('myged-upload-dragOver');
        $(e.target).addClass('myged-upload-uploading');

        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                $.each(e.originalEvent.dataTransfer.files,$.proxy(this._readFile, this));
            }
        }
        else {
            $(e.target).removeClass('myged-upload-uploading');
        }
        return false;
    },
});
