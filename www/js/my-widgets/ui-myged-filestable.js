/**
 * AppGUIMainWidget Widget
 *
 * @author polux@poluxfr.org
 */
$.widget('myged.mygedFilesTableWidget',{
    /* Default Options */
    options:{
        /* API Url */
        APIBaseUrl      :'php-myged/api/v1/',

        /* Default Widget CSS Classes */
        CssClassTABLE   :'myged-filestable',
        CssClassTHEAD   :'myged-filestable-header',
        CssClassTH      :'myged-filestable-header',      // None effective!
        CssClassTR1     :'myged-filestable-row-style1',
        CssClassTR2     :'myged-filestable-row-style2',
        CssClassTR      :'myged-filestable-row',
        CssClassTBODY   :'myged-filestable-body',

        /* CallBacks */
        test:null
    },
    rows:null,
    /**
     * Default Constructor
     */
    _create : function(options)
    {
        console.debug('mygedFilesTableWidget#'+this.element.attr('id')+' - WIDGET _CREATE - Building Table Static Header');

        $(this.element).empty();
        $(this.element).addClass(this.options.CssClassTABLE);
        var uiDataTableHeader = $('<thead>').addClass(this.options.CssClassTHEAD);
        var uiDataTableTBody = $('<tbody>').addClass(this.options.CssClassTBODY).text('TO INIT');

        var uiDataTableHeaderColumns = '';
        uiDataTableHeaderColumns += '<th><span id="myged-filestable-column-filename">Nom du fichier</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-filestable-column-size">Taille</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-filestable-column-mime">Mime</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-filestable-column-actions">Actions</span></th>';

        uiDataTableHeader.append(uiDataTableHeaderColumns);

        $(this.element).append(uiDataTableHeader);
        $(this.element).append(uiDataTableTBody);
    }, //end _create()

    /**
     * Initialization - Loading Data ..
     */
    _init: function()
    {
        console.debug('mygedFilesTableWidget#'+this.element.attr('id')+' - INIT - Refreshing Widget !');
        this._refresh();
    },

    // _setOptions is called with a hash of all options that are changing
    // always refresh when changing options
    _setOptions: function() {
        // _super and _superApply handle keeping the right this-context
        this._superApply( arguments );
        this._refresh();
    },

    // _setOption is called for each individual option that is changing
    _setOption: function( key, value ) {
        this._super( key, value );
    },

    /**
     * Returns number of files
     */
    nbFiles: function() {

        var lIntNbDocs = 0;
        if(this.element.data('files')){
            var docsArray = null;
            if(sessionStorage['files'])
            {
                docsArray = JSON.parse(sessionStorage['files']);
            }
            else {
                docsArray = JSON.parse(this.element.data('files'));
            }
            lIntNbDocs = docsArray.length;
        }
        console.log('mygedFilesTableWidget#'+this.element.attr('id')+' - nbFiles => '+lIntNbDocs.toString()+' item(s).');
        return lIntNbDocs;
    },
    refresh: function(){
        this._refresh();
    },

    /**
     * RefreshingData
     */
    _refresh: function(){
        console.debug('mygedFilesTableWidget#'+this.element.attr('id')+' - Refreshing all Data !');
        this._loadFiles();
    },
    /**
     * Generate and add a Row to the Files Table
     */
    _addDataRow:function(idx,obj){
        // Logging !
        console.debug('mygedFilesTableWidget#'+this.element.attr('id')+' - Adding a row to Files Table.');

        var CssClass = this.options.CssClassTR;
        // Alternate CSS class on rows
        if(idx % 2 === 0)
        {
            CssClass += ' '+this.options.CssClassTR1;
        }
        else {
            CssClass += ' '+this.options.CssClassTR2;
        }

        var newTR = $('<tr>')
                        .attr('id',obj.file_id)
                        .addClass(CssClass);

        var contentHTML = '';
        contentHTML += '<td>'+obj.file_originalname+'</td>';
        contentHTML += '<td>'+obj.file_size+'</td>';
        contentHTML += '<td>'+obj.file_mime+'</td>';
        contentHTML += '<td class="myged-filestable-row-column-actions"> ';
        contentHTML += '<image src="styles/icons/download-1.png" width=20 height=20 class="myged-filestable-rows-download-action" title="Télécharger le fichier" />';
        contentHTML += '<image src="styles/icons/book.png" width=20 height=20 title="Créer un document" class="myged-filestable-rows-createDoc-action" />';
        contentHTML += '<image src="styles/icons/garbage.png" width=20 height=20 class="myged-filestable-rows-delete-action" title="Supprimer le fichier" />';
        contentHTML += '</td>';
        newTR.html(contentHTML);
        this.element.children('tbody').append(newTR);

    }, //end _addDataRow
    _loadFiles: function()
    {
        console.debug('mygedFilesTableWidget#'+this.element.attr('id')+' - Loading Files...');
        var promiseDocs = this._promiseGetAllFiles();
        promiseDocs.done($.proxy(this._callbackPopulateFilesTable,this)).always($.proxy(this._callbackBindEventOnFilesTable,this));
    },
    /**
     * API Restful Promises
     */
     _promiseGetAllFiles: function() {
         return $.ajax({
             url:this.options.APIBaseUrl +'file/',
             type: 'GET',
             delay : 1,
             dataType: "json"});
     },
     _callbackPopulateFilesTable: function(pDocsArray)
     {
         console.debug('[ mygedFilesTableWidget#'+this.element.attr('id')+' ] - Documents loaded (items count: '+pDocsArray.length.toString()+').');

         this.element.children('tbody').empty();
         $.each(pDocsArray,$.proxy(this._addDataRow,this));

         // Store Data
         var jSonDocs = JSON.stringify(pDocsArray);
         this.element.data('files',jSonDocs);

         if(sessionStorage.getItem('files'))
         {
             sessionStorage.removeItem('files');
         }
         sessionStorage.setItem('files',jSonDocs);

     },
     _callbackBindEventOnFilesTable: function()
     {
         console.debug('[ mygedFilesTableWidget#'+this.element.attr('id')+' ] - Binding JS Events on Table rows...');
         var tableTBodyDocRows = $('.myged-documenttable tbody TR');

         $(tableTBodyDocRows).on('click', this, function(event) {
             var docid = $(this).attr('id');
             var Objcheckbox = $("input[name=chk"+docid+"]");

             if($(Objcheckbox).is(':checked')){
                $(Objcheckbox).prop('checked',false);
            }
            else {
                $(Objcheckbox).prop('checked',true);
            }//alert(docid);
         });

         // Download buttons!
         var btnDlImg = $('.myged-filestable-rows-download-action');

         $(btnDlImg).on('click', function(event) {
             var docid = $(event.delegateTarget).parent().parent().attr('id');
             console.debug('Action Download File called on row for file "' + docid + '".');
         });

         // CreateDoc buttons!
         var btnCreateDocImg = $('.myged-filestable-rows-createDoc-action');

         $(btnCreateDocImg).on('click', function(event) {
             var docid = $(event.delegateTarget).parent().parent().attr('id');
             console.debug('Action CreateDoc File called on row for file "' + docid + '".');
         });

         // Delete buttons!
         var btnDeleteFileImg = $('.myged-filestable-rows-delete-action');

         $(btnDeleteFileImg).on('click', $.proxy(function(event) {
             var docid = $(event.delegateTarget).parent().parent().attr('id');
             console.debug('Action Delete File called on row for file "' + docid + '".');
             $.ajax({
                 url:this.options.APIBaseUrl +'file/'+docid,
                 type: 'DELETE',
                 delay : 1,
                 dataType: "json"});
         },this));

     },
});
