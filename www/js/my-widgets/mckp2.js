/**
 * AppGUIMainWidget Widget
 *
 * @author polux@poluxfr.org
 */
$.widget('myged.AppGUIMainWidget',{
    options:{
        title:'Titre par défaut',
        APIBaseUrl:'php-myged/api/v1/'
    },
    htmlitemsel:{
        titleHeader:'myged-doctable-container-title',
        docTable:'myged-documenttable-panel',
        divPopupUpload: 'myged-dialog-upload'
    },
    /**
     * Default Constructor
     * -> Render Widget
     */
    _create : function(options)
    {
        console.debug('AppGUIMainWidget - WIDGET _CREATE - Begin ...');

        if(options)
        {
            this.options.title  = options.title;
        }
        // Adding specific widget CssClass
        $(this.element).addClass('myged-doctable-container');

        // Build HTML Items
        this._buildHTMLTitleContainer(this.options.title);
        this._buildHTMLActionBar();
        this._buildHTMLDocumentTable();

        console.debug('AppGUIMainWidget - WIDGET _CREATE - Finished successfully!');
    },
    setTitle:function(titleNewValue)
    {
        this.options.title = titleNewValue;
        $('#'+this.htmlitemsel.titleHeader).text(titleNewValue);
    },
    /**
     * Build Main Document HTML Action Button Bar
     */
    _buildHTMLActionBar:function()
    {
        /* Definie HTML Table */
        //var uiDataTable = '<table class="myged-documenttable"> toto </table>';
        var divButtonAction = '<div class="myged-documenttable-panel-buttons">';
        var datatableToRefresh = this;


        divButtonAction += '<button class="myged-documenttable-panel-button" id="myged-panel-reload" value="test" ><image src="styles/icons/reload.png" width=20 height=20 /></button>';
        divButtonAction += '<button class="myged-documenttable-panel-button" id="myged-panel-upload" value="test" ><image src="styles/icons/upload-1.png" width=20 height=20 /></button>';
        divButtonAction += '</div>';
        $(this.element).append(divButtonAction);


        $("#myged-panel-reload").on('click',function(event) {
            datatableToRefresh._loadDocuments();
        });

        var popupUpload = $(this.options.divPopupUpload);
        $("#myged-panel-upload").on('click',function(event) {
            popupUpload.dialog("open");
        });
        console.debug('HTML Action Bar added to page.');
    },
    _buildHTMLTitleContainer:function(titleValue)
    {
        console.debug('AppGUIMainWidget - WIDGET - Rendering Title - Starting ...');
        var headerTitle = '<header id="myged-doctable-container-title"> '+titleValue+'</header>';
        $(this.element).append(headerTitle);
        console.debug('AppGUIMainWidget - WIDGET - Rendering Title - Finished successfully!');
    },
    /**
     * Build Main Document HTML Table Header
     */
    _buildHTMLDocumentTable:function()
    {
        /* Definie HTML Table */
        var uiDataTable = '<table class="myged-documenttable">';
        var uiDataTableHeader = '<thead class="myged-documenttable-header">';
        var uiDataTableHeaderColumns = '<th/><th><span id="myged-documenttable-column-type">Type</span></th><th><span id="myged-documenttable-column-title">Nom</span></th>';

        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-code">Code</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-categorie">Categorie</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-tier">Tier</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-description">Description</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-actions">Actions</span></th>';

        var finalHTML = uiDataTable + uiDataTableHeader + uiDataTableHeaderColumns + '</thead><tbody class="myged-documenttable-body"></tbody></table>';

        $(this.element).append(finalHTML);
        console.debug('HTML Document Table added to page.');
    },
    /**
     * Initialization - Loading Data ..
     */
    _init: function()
    {
        console.debug('Loading Documents - Starting !');
        this._loadDocuments();
        console.debug('Loading Documents - Finishing !');

    },
    _displayMsg:function(StrMessage)
    {

    },
    _displayErrorMsg:function(ErrorCode,StrMessage)
    {

    },
    /**
     * Load Documents
     */
    _loadDocuments: function(){
        // Loading Categories to Side Panel!
        var promiseDocs = this._promiseGetAllDocuments();

        promiseDocs.done(this._callbackPopulateDocumentTable);
        promiseDocs.always(this._callbackBindEventOnDocumentTable);
    },
    /**
     * API Restful Promises
     */
     _promiseGetAllDocuments: function() {
         return $.ajax({
             url:this.options.APIBaseUrl +'document',
             type: 'GET',
             delay : 1,
             dataType: "json"});
     },
     _callbackPopulateDocumentTable: function(pDocsArray)
     {
         console.debug('Loading Documents - CallBack Starting !');
         var tableTBodyDocs = $('.myged-documenttable tbody');

         $('.myged-documenttable tbody tr').remove();
         $(tableTBodyDocs).html('');

         //alert('cb');

         var contentHTML = '';

         $.each(pDocsArray,function(idx,obj) {

             var CssClass = 'myged-documenttable-row-style1';
             if(idx % 2 === 0)
             {
                 CssClass = 'myged-documenttable-row-style2';
             }

             contentHTML += '<tr id="'+obj.doc_id+'" class="myged-documenttable-row '+CssClass+'">';
             contentHTML += '<td><input type=checkbox name="chk'+obj.doc_id+'" class="myged-datarow-checkbox" /></td>';
             contentHTML += '<td>'+obj.tdoc_id+'</td>';
             contentHTML += '<td>'+obj.doc_title+'</td>';
             contentHTML += '<td>'+obj.doc_code+'</td>';
             contentHTML += '<td>FACTURE - TODEV</td>';
             contentHTML += '<td> Tiers - TO DEV </td>';
             contentHTML += '<td>'+obj.doc_desc+'</td>';
             contentHTML += '<td class="myged-documenttable-row-column-actions"> <image src="styles/icons/glasses.png" width=20 height=20 class="myged-documenttable-rows-view-action" /> <image src="styles/icons/edit.png" width=20 height=20 /><image src="styles/icons/garbage.png" width=20 height=20 />  </td>';
             contentHTML += '</tr>';
             console.debug('DocumentTable - New DocumentRow added successfully (doc ID :' +obj.doc_id + ').');
         });
         $(tableTBodyDocs).html(contentHTML);
         sessionStorage.setItem('documents',pDocsArray);
         console.debug('Loading Documents - CallBack Finishing !');
     },
     _callbackBindEventOnDocumentTable: function()
     {
         console.debug('Binding JS Events on Table rows...');
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


         var btnImg = $('.myged-documenttable-rows-view-action');

         $(btnImg).on('click', function(event) {

             var docid = $(event.delegateTarget).parent().parent().attr('id');
             console.debug('Action View Panel called on row for document "' + docid + '".');
             //alert(docid);
         });

            /* contentHTML += '<tr id="'+obj.doc_id+'" class="myged-documenttable-row '+CssClass+'">';
             contentHTML += '<td><input type=checkbox name=chk /></td>';
             contentHTML += '<td>'+obj.doc_title+'</td>';
             contentHTML += '<td>'+obj.doc_code+'</td>';
             contentHTML += '<td>FACTURE - TODEV</td>';
             contentHTML += '<td> Tiers - TO DEV </td>';
             contentHTML += '<td>'+obj.doc_desc+'</td>';
             contentHTML += '<td class="myged-documenttable-row-column-actions"> <image src="styles/icons/glasses.png" width=20 height=20 /> <image src="styles/icons/edit.png" width=20 height=20 /><image src="styles/icons/garbage.png" width=20 height=20 />  </td>';
             contentHTML += '</tr>';
             console.debug('DocumentTable - New DocumentRow added successfully (doc ID :' +obj.doc_id + ').');
         });
         $(tableTBodyDocs).html(contentHTML);
         sessionStorage.setItem('documents',pDocsArray);*/
         console.debug('Binding JS Events on Table rows... done successfully !');
     },
     /**
      * Load Categories
      */
     _loadCategories: function(){
         // Loading Categories into Memory
         var promiseCat = this._promiseGetCategories();
         promiseCat.done(this._callbackStoreCategories);
         //promiseCat.always(function(){  });
     },
     _promiseGetCategories: function() {
         return $.ajax({
             url:this.options.baseAPIURL +'categorie',
             type: 'GET',
             delay : 1,
             dataType: "json"});
     },
     _callbackStoreCategories: function(pCatArray)
     {
         sessionStorage.setItem('Categories',JSON.stringify(pCatArray));
     },
});
