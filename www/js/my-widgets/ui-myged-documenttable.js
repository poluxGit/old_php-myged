/**
 * AppGUIMainWidget Widget
 *
 * @author polux@poluxfr.org
 */
$.widget('myged.mygedDocumentTableWidget',{
    /* Default Options */
    options:{
        /* API Url */
        APIBaseUrl      :'php-myged/api/v1/',

        /* Default Widget CSS Classes */
        CssClassTABLE   :'myged-documenttable',
        CssClassTHEAD   :'myged-documenttable-header',
        CssClassTH      :'myged-documenttable-header',      // None effective!
        CssClassTR1     :'myged-documenttable-row-style1',
        CssClassTR2     :'myged-documenttable-row-style2',
        CssClassTR      :'myged-documenttable-row',
        CssClassTBODY   :'myged-documenttable-body',

        /* CallBacks */
        test:null
    },
    rows:null,
    /**
     * Default Constructor
     */
    _create : function(options)
    {
        console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - WIDGET _CREATE - Building Table Static Header');

        $(this.element).empty();
        $(this.element).addClass(this.options.CssClassTABLE);
        var uiDataTableHeader = $('<thead>').addClass(this.options.CssClassTHEAD);
        var uiDataTableTBody = $('<tbody>').addClass(this.options.CssClassTBODY).text(' ');

        var uiDataTableHeaderColumns = '<th/><th><span id="myged-documenttable-column-type">Type</span></th><th><span id="myged-documenttable-column-title">Nom</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-code">Code</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-categorie">Categorie</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-tier">Tier</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-description">Description</span></th>';
        uiDataTableHeaderColumns += '<th><span id="myged-documenttable-column-actions">Actions</span></th>';

        uiDataTableHeader.append(uiDataTableHeaderColumns);

        $(this.element).append(uiDataTableHeader);
        $(this.element).append(uiDataTableTBody);
    }, //end _create()

    /**
     * Initialization - Loading Data ..
     */
    _init: function()
    {
        console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - INIT - Refreshing Widget !');
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
     * Returns number of documents
     */
    nbDocuments: function() {

        var lIntNbDocs = 0;
        if(this.element.data('docs')){
            var docsArray = null;
            if(sessionStorage['docs'])
            {
                docsArray = JSON.parse(sessionStorage['docs']);
            }
            else {
                docsArray = JSON.parse(this.element.data('docs'));
            }
            lIntNbDocs = docsArray.length;
        }
        console.log('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - nbDocuments => '+lIntNbDocs.toString()+' item(s).');
        return lIntNbDocs;
    },
    refresh: function(){
        this._refresh();
    },

    /**
     * RefreshingData
     */
    _refresh: function(){
        console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Refreshing all Data !');
        this._loadCategories();
        this._loadTiers();
        this._loadTypeDocs();
        this._loadDocuments();
        //promiseDocs.always(this._callbackBindEventOnDocumentTable);
    },
    /**
     * Generate and add a Row  the Files Table
     */
    _addDefaultRow:function(){
        // Logging !
        console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Adding the defaultrow.');
        this.element.children('tbody').empty();
        var newTR = $('<tr>');
        var newTD = $('<td>').attr({
            colspan:8
        }).text('Aucun document trouvé!');
        newTR.append(newTD);
        this.element.children('tbody').append(newTR);
    },
    /**
     * Generate and add a Row to the Document Table
     */
    _addDataRow:function(idx,obj){
        // Logging !
        console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Adding a row to Document Table.');

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
                        .attr('id',obj.doc_id)
                        .addClass(CssClass);


        var arrTypeDoc = $.MyGEDUI().getTypeDocData(obj.tdoc_id);
        var arrCatDoc = $.MyGEDUI().getCategorieData(obj.cat_id);

        var libCatDoc = '';
        if(arrCatDoc)
        {
            libCatDoc = arrCatDoc.cat_title;
        }


        var arrTierDoc = $.MyGEDUI().getTierData(obj.tier_id);

        var libTierDoc = '';
        if(arrTierDoc)
        {
            libTierDoc = arrTierDoc.tier_title;
        }

        var contentHTML = '';
        contentHTML += '<td><input type=checkbox name="chk'+obj.doc_id+'" class="myged-datarow-checkbox" /></td>';
        contentHTML += '<td>'+arrTypeDoc.tdoc_title+'</td>';
        contentHTML += '<td>'+obj.doc_title+'</td>';
        contentHTML += '<td>'+obj.doc_code+'</td>';
        contentHTML += '<td>'+libCatDoc+'</td>';
        contentHTML += '<td>'+libTierDoc+'</td>';
        contentHTML += '<td>'+obj.doc_desc+'</td>';
        contentHTML += '<td class="myged-documenttable-row-column-actions"> <image src="styles/icons/glasses.png" width=20 height=20 class="myged-documenttable-rows-view-action" /> <image src="styles/icons/edit.png" width=20 height=20 /><image src="styles/icons/garbage.png" width=20 height=20 />  </td>';

        newTR.html(contentHTML);
        this.element.children('tbody').append(newTR);

    }, //end _addDataRow
    _loadDocuments: function()
    {
        console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Loading Documents...');
        var promiseDocs = this._promiseGetAllDocuments();
        promiseDocs.done($.proxy(this._callbackPopulateDocumentTable,this));
    },
    /**
     * API Restful Promises
     */
     _promiseGetAllDocuments: function() {
         return $.ajax({
             url:this.options.APIBaseUrl +'document/',
             type: 'GET',
             delay : 1,
             dataType: "json"});
     },
     _callbackPopulateDocumentTable: function(pDocsArray)
     {
         if(pDocsArray && pDocsArray.length > 0)
         {
             console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Documents loaded (items count: '+pDocsArray.length.toString()+').');

             this.element.children('tbody').empty();
             $.each(pDocsArray,$.proxy(this._addDataRow,this));

             // Store Data
             var jSonDocs = JSON.stringify(pDocsArray);
             this.element.data('docs',jSonDocs);

             if(sessionStorage.getItem('docs'))
             {
                 sessionStorage.removeItem('docs');
             }
             sessionStorage.setItem('docs',jSonDocs);
        }
        else {
            console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - No Documents to load.');
            this._addDefaultRow();
        }

     },
     _callbackBindEventOnDocumentTable: function()
     {
         console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Binding JS Events on Table rows...');
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
         console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Binding JS Events on Table rows... done successfully !');
     },
     /**
      * Load Categories
      */
     _loadCategories: function(){
         console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Loading Categories ...');
         var promiseCat = this._promiseGetCategories();
         promiseCat.done($.proxy(this._callbackStoreCategories,this));
         //promiseCat.always(function(){  });
     },
     _promiseGetCategories: function() {
         return $.ajax({
             url:this.options.APIBaseUrl +'categorie',
             type: 'GET',
             delay : 1,
             dataType: "json"});
     },
     _callbackStoreCategories: function(pCatArray)
     {
         console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Categories loaded (items count: '+pCatArray.length.toString()+').');
         var jSonCats = JSON.stringify(pCatArray);
         this.element.data('cats',jSonCats);
         if(sessionStorage.getItem('cats'))
         {
             sessionStorage.removeItem('cats');
         }
         sessionStorage.setItem('cats',jSonCats);
     },
     /**
      * Load Tiers
      */
     _loadTiers: function(){
         console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Loading Tiers ...');
         var promiseTiers = this._promiseGetTiers();
         promiseTiers.done($.proxy(this._callbackStoreTiers,this));

     },
     _promiseGetTiers: function() {
         return $.ajax({
             url:this.options.APIBaseUrl +'tier',
             type: 'GET',
             delay : 1,
             dataType: "json"});
     },
     _callbackStoreTiers: function(pTiersArray)
     {
         console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Tiers loaded (items count: '+pTiersArray.length.toString()+').');
         var jSonTiers = JSON.stringify(pTiersArray);
         this.element.data('tiers',jSonTiers);
         if(sessionStorage.getItem('tiers'))
         {
             sessionStorage.removeItem('tiers');
         }
         sessionStorage.setItem('tiers',jSonTiers);
     },
     /**
      * Load TypeDoc
      */
     _loadTypeDocs: function(){
         console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - Loading Type Docs ...');
         var promiseTDoc = this._promiseGetTypeDocs();
         promiseTDoc.done($.proxy(this._callbackStoreTypeDocs,this));

     },
     _promiseGetTypeDocs: function() {
         return $.ajax({
             url:this.options.APIBaseUrl +'typedocument',
             type: 'GET',
             delay : 1,
             dataType: "json"});
     },
     _callbackStoreTypeDocs: function(pTDocArray)
     {
         console.debug('[ mygedDocumentTableWidget#'+this.element.attr('id')+' ] - TypeDocument loaded (items count: '+pTDocArray.length.toString()+').');
         var jSonTDocs = JSON.stringify(pTDocArray);
         this.element.data('tiers',jSonTDocs);
         if(sessionStorage.getItem('tdocs'))
         {
             sessionStorage.removeItem('tdocs');
         }
         sessionStorage.setItem('tdocs',jSonTDocs);
     },
});
