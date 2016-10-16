/**
 * uploadFilesWidget Widget
 *
 * @author polux@poluxfr.org
 *
 * @example http://stackoverflow.com/questions/12954529/jquery-html5-file-drag-and-drop
 */
$.widget('mgd.mygedDocumentDialogWidget',{
    /* Dialog Options */
    popupOptions:{
        autoOpen : false,
        draggable: false,
        buttons: {},
        appendTo: false,
        title: 'Nouveau Document',
        closeOnEscape:true,
        modal:true,
        minHeight:500,
        minWidth:600,
        resizable:false,
        closeText:false
        /*classes
        closeOnEscape
        closeText
        dialogClass
        draggable
        height
        hide
        maxHeight
        maxWidth
        minHeight
        minWidth
        modal
        position
        resizable
        show
        title
        width*/
    },
    /* Default Options */
    options:{
        // Defaults options
        APIBaseUrl:'/php-myged/api/v1/',
        progress : false, // TO DEV v2
        // Callbacks
        upload:null,
        uploadComplete:null
    },
    HTMLFormObj : null,
    /* Fields HTML INPUT Element */
    FieldsHTMLItem:{
        DocID: null,
        FileID:null,
        FileName:null,
        DocCode:null,
        TypeDocID:null,
        CatID:null,
        TierID:null,
        DocTitre:null,
        DocDesc:null,
        MetaDocs:null
    },
    /**
     * Default Constructor
     */
    _create : function(options)
    {
        console.debug('DocumentDialogWidget - WIDGET _CREATE - #'+this.element.attr('id')+'.');
        this.element.dialog(this.popupOptions);
        this._initWidget();
        if(options && options.file_id)
        {
            this.FieldsHTMLItem.FileID.val(options.file_id);
        }
    },
    /**
     * Initialization - Binding events
     */
    _initWidget: function()
    {
        console.debug('DocumentDialogWidget - WIDGET _INIT - Main initialization method. on #'+this.element.attr('id')+'.');

        this._buildHTMLFormElements();
        this._loadData();
        this._bindFormControlsEvents();
    },
    /**
     * Build and append to current element the HTML Form structure generated
     */
    _buildHTMLFormElements: function()
    {
        console.debug('DocumentDialogWidget - WIDGET _INIT - Building HTML Form into #'+this.element.attr('id')+'.');

        var formItem = $('<form>').attr({
                id:'myged-dialog-form-createdoc',
                class:'myged-dialog-form-createdoc',
                method: 'x-www-form-urlencoded'
            }),

            /* ID du Document */
            iptDocid = $('<input>').attr({
                id:'myged-dialog-form-createdoc-docid',
                type:'hidden',
                name:'doc_id',
                readonly:true
            }),

            fdlsetAutoFields = $('<fieldset>').attr({
                id:'myged-dialog-form-createdoc-fdlst-autofields',
                class:'myged-dialog-form-createdoc-fdlst-autofields'
            }),

            /* Type de Document */
            iptTypeDocid = $('<select>').attr({
                id:'myged-dialog-form-createdoc-tdocid',
                name:'tdoc_id',
                list:'typedocs'
            }),

            lblTypeDocid = $('<label>').attr({
                for:'tdoc_id',
                title:'Type du Document.'
            }).text('Type '),

            /* Catégorie de Document */
            iptCatDocid = $('<select>').attr({
                id:'myged-dialog-form-createdoc-catid',
                name:'cat_id',
            }),

            lblCatDocid = $('<label>').attr({
                for:'cat_id',
                title:'Catégorie du Document.'
            }).text('Catégorie '),

            /* Tier de Document */
            iptTierDocid = $('<select>').attr({
                id:'myged-dialog-form-createdoc-tierid',
                name:'tier_id',
            }),

            lblTierDocid = $('<label>').attr({
                for:'tier_id',
                title:'Tier du Document.'
            }).text('Tier '),

            /* Titre du Document */
            iptTitleDocid = $('<input>').attr({
                id:'myged-dialog-form-createdoc-doctitle',
                name:'doc_title'
            }),

            lblTitleDocid = $('<label>').attr({
                for:'doc_title',
                title:'Titre du Document.'
            }).text('Titre'),

            /* Code du Document */
            iptCodeDocid = $('<input>').attr({
                id:'myged-dialog-form-createdoc-doccode',
                name:'doc_code',
                readonly:true
            }),

            lblCodeDocid = $('<label>').attr({
                for:'doc_code',
                title:'Code Unique du Document.'
            }).text('Code'),

            /* Description du Document */
            iptDescriptionDoc = $('<textarea>').attr({
                id:'myged-dialog-form-createdoc-docdesc',
                name:'doc_desc'
            }),

            lblDescriptionDoc = $('<label>').attr({
                for:'doc_desc',
                title:'Description du Document.'
            }).text('Description'),

            /* Fieldset Metat data suppélemùntaire */
            fldsetTypeDocMeta = $('<fieldset>').attr({
                id:'myged-dialog-form-createdoc-tdocmetas',
                class:'myged-dialog-form-createdoc-tdocmetas',
                title:'Informations complémentaires sur le document.'
            }),
            lblTypeDocMeta = $('<legend>').attr({
                for:'myged-dialog-form-createdoc-tdocmetas',
                title:'Infos. complémentaires.'
            }).text('Autres informations'),

            /* Button SUBMIT */
            btnSubmitForm = $('<button>').attr({
                id:'myged-dialog-form-createdoc-btnsubmit',
                name:'submit'
            }).text('Créer'),

            /* Button CANCEL */
            btnCancelForm = $('<button>').attr({
                id:'myged-dialog-form-createdoc-btncancel',
                name:'cancel'
            }).text('Annuler'),
            /* Fichier */
            iptFileid = $('<input>').attr({
                id:'myged-dialog-form-createdoc-fileid',
                name:'file_id',
                type:'hidden',
                readonly:true
            }),

            lblFileid = $('<label>').attr({
                for:'file_id',
                title:'Fichier du document.'
            }).text('Fichier'),

            /* Fichier */
            iptFileName = $('<input>').attr({
                id:'myged-dialog-form-createdoc-filename',
                name:'file_name',
                type:'text',
                readonly:true
            }),

            lblFileName = $('<label>').attr({
                for:'file_name',
                title:'Fichier du document.'
            }).text('Fichier'),

            /* Fieldset TypeDoc, Cat, Tiers */
            fdlsetSelects = $('<fieldset>').attr({
                id:'myged-dialog-form-createdoc-fdlst-selects',
                class:'myged-dialog-form-createdoc-fdlst-selects'
            })

            /* Fieldset Main attributes */
            fdlsetMainAttributes = $('<fieldset>').attr({
                id:'myged-dialog-form-createdoc-fdlst-mainattributes',
                class:'myged-dialog-form-createdoc-fdlst-mainattributes'
            })
            ,
            legendAutoFields = $('<legend>').attr({
                for:'myged-dialog-form-createdoc-fdlst-autofields',
                title:'Identifiants'
            }).text('Identifiants')
            ,
            legendSelects = $('<legend>').attr({
                for:'myged-dialog-form-createdoc-fdlst-selects',
                title:'Caractéristiques'
            }).text('Caractéristiques')
            ,
            legendMainAttributes = $('<legend>').attr({
                for:'myged-dialog-form-createdoc-fdlst-mainattributes',
                title:'Infos. communes .'
            }).text('Prinicpaux attributs'),

            /* Fichier */
            iptDateDoc = $('<input>').attr({
                id:'myged-dialog-form-createdoc-fileid',
                name:'date_val',
                type:'date'
            }),

            lblDateDoc = $('<label>').attr({
                for:'date_val',
                title:'Date du document.'
            }).text('Date')
            ;

            // Fieldset AutoFields (CODE & ID & File reférence)!
            fdlsetAutoFields.append(legendAutoFields);
            fdlsetAutoFields.append(iptDocid);
            fdlsetAutoFields.append(lblCodeDocid);
            fdlsetAutoFields.append(iptCodeDocid);
            //fdlsetAutoFields.append(lblFileid);
            fdlsetAutoFields.append(iptFileid);
            fdlsetAutoFields.append(lblFileName);
            fdlsetAutoFields.append(iptFileName);

            formItem.append(fdlsetAutoFields);

            // Fieldset 'Selects' Inputs !
            fdlsetSelects.append(legendSelects);
            fdlsetSelects.append(lblTypeDocid);
            fdlsetSelects.append(iptTypeDocid);
            fdlsetSelects.append($('<br>'));
            fdlsetSelects.append(lblCatDocid);
            fdlsetSelects.append(iptCatDocid);
            fdlsetSelects.append($('<br>'));
            fdlsetSelects.append(lblTierDocid);
            fdlsetSelects.append(iptTierDocid);

            formItem.append(fdlsetSelects);

            // Main Attributes ! (title & description)
            fdlsetMainAttributes.append(legendMainAttributes);
            fdlsetMainAttributes.append(lblDateDoc);
            fdlsetMainAttributes.append(iptDateDoc);
            fdlsetMainAttributes.append(lblTitleDocid);
            fdlsetMainAttributes.append(iptTitleDocid);
            fdlsetMainAttributes.append(lblDescriptionDoc);
            fdlsetMainAttributes.append(iptDescriptionDoc);

            formItem.append(fdlsetMainAttributes);

            // Metadata according TypeDocs!
            fldsetTypeDocMeta.append(lblTypeDocMeta);
            formItem.append(fldsetTypeDocMeta);

            // Buttons
            formItem.append(btnCancelForm);
            formItem.append(btnSubmitForm);

            this.HTMLFormObj = formItem;
            this.FieldsHTMLItem.DocID = iptDocid;
            this.FieldsHTMLItem.FileID = iptFileid;
            this.FieldsHTMLItem.FileName = iptFileName;
            this.FieldsHTMLItem.DocCode = iptCodeDocid;
            this.FieldsHTMLItem.TypeDocID = iptTypeDocid;
            this.FieldsHTMLItem.CatID = iptCatDocid;
            this.FieldsHTMLItem.TierID = iptTierDocid;
            this.FieldsHTMLItem.DocTitre = iptTitleDocid;
            this.FieldsHTMLItem.DocDesc = iptDescriptionDoc;
            this.FieldsHTMLItem.MetaDocs = [];

            this.element.append(formItem);
    },
    _updateDocCodeInputValue:function()
    {
        var strDocCode = '';
        strDocCode += 'D-FACT-' + Math.floor(Math.random() * 10000000000000001);
        this.FieldsHTMLItem.DocCode.val(strDocCode);
    },

    /**
     * Main FORM submit Event overiding
     */
    _eventSubmitForm:function(event){
        console.debug('DocumentDialogWidget - Submit Event launched for #'+this.element.attr('id')+'.');
        event.preventDefault();

        // TODO ADD VALIDATION !

        // Launch Requests Processes
        this._creationRequestForDocument();
    },

    /**************************************************************************
     * Request Process about Creation of a new Document
     * ************************************************************************/
    _creationRequestForDocument:function(){
        console.debug('DocumentDialogWidget - Request Init for Creation of Document. #'+this.element.attr('id')+'.');
        this._updateDocCodeInputValue();
        var promiseDocument = this._promiseCreateDoc();
        promiseDocument
            .done($.proxy(this._callbackCreateNewDoc,this))
            .fail(function(msg){alert(JSON.stringify(msg));});

    },
    /**************************************************************************
     * Request Process about Creation of Meta of a Document
     * ************************************************************************/
    _creationRequestForMetaDocument:function(){
        console.debug('DocumentDialogWidget - Request Init for Creation of Document. #'+this.element.attr('id')+'.');
        var lStrDocId = this.FieldsHTMLItem.DocID.val();
        var promiseDocument = this._promiseCreateMetaDoc(lStrDocId);
        promiseDocument
            .done($.proxy(this._callbackCreateNewDoc,this))
            .fail(function(msg){alert(JSON.stringify(msg));});
    },
    _promiseCreateDoc: function() {

        // POST Data!
        var dataPOST = [];
        //dataPOST.push({name: 'doc_id', value: this.FieldsHTMLItem.DocID.val()});
        dataPOST.push({name: 'tdoc_id', value: this.FieldsHTMLItem.TypeDocID.val() });
        dataPOST.push({name: 'doc_title', value: this.FieldsHTMLItem.DocTitre.val()});
        //dataPOST.push({name: 'cat_id', value: this.FieldsHTMLItem.CatID.val()});
        //dataPOST.push({name: 'tier_id', value: this.FieldsHTMLItem.TierID.val()});
        dataPOST.push({name: 'doc_desc', value: this.FieldsHTMLItem.DocDesc.val()});
        dataPOST.push({name: 'doc_code', value: this.FieldsHTMLItem.DocCode.val()});

        // dataPOST['tdoc_id']=;
        // dataPOST['doc_title']=this.FieldsHTMLItem.DocTitre.val();
        // dataPOST['cat_id']=this.FieldsHTMLItem.CatID.val();
        // dataPOST['tier_id']=this.FieldsHTMLItem.TierID.val();
        // dataPOST['doc_desc']=this.FieldsHTMLItem.DocDesc.val();
        // dataPOST['doc_code']='code1'; //this.FieldsHTMLItem.DocCode.val();
        //dataPOST['doc_title']=this.FieldsHTMLItem.DocTitre.val();

        return $.ajax({
            url:      this.options.APIBaseUrl +'document/',
            type:     'POST',
            data:     this.HTMLFormObj.serialize(),
            delay :   1,
            dataType: "json"
        });
    },
    _promiseCreateMetaDoc: function(pStrDocument) {
        // POST Data!
        var dataPOST = [];
        //dataPOST.push({name: 'doc_id', value: this.FieldsHTMLItem.DocID.val()});
        dataPOST.push({name: 'tdoc_id', value: this.FieldsHTMLItem.TypeDocID.val() });
        dataPOST.push({name: 'doc_title', value: this.FieldsHTMLItem.DocTitre.val()});
        //dataPOST.push({name: 'cat_id', value: this.FieldsHTMLItem.CatID.val()});
        //dataPOST.push({name: 'tier_id', value: this.FieldsHTMLItem.TierID.val()});
        dataPOST.push({name: 'doc_desc', value: this.FieldsHTMLItem.DocDesc.val()});
        dataPOST.push({name: 'doc_code', value: this.FieldsHTMLItem.DocCode.val()});

        // dataPOST['tdoc_id']=;
        // dataPOST['doc_title']=this.FieldsHTMLItem.DocTitre.val();
        // dataPOST['cat_id']=this.FieldsHTMLItem.CatID.val();
        // dataPOST['tier_id']=this.FieldsHTMLItem.TierID.val();
        // dataPOST['doc_desc']=this.FieldsHTMLItem.DocDesc.val();
        // dataPOST['doc_code']='code1'; //this.FieldsHTMLItem.DocCode.val();
        //dataPOST['doc_title']=this.FieldsHTMLItem.DocTitre.val();

        return $.ajax({
            url:      this.options.APIBaseUrl +'document/',
            type:     'POST',
//            data:     $.param(dataPOST),
            data:     this.HTMLFormObj.serialize(),
            delay :   1,
            dataType: "json"
        });
    },
    /**
     * CallBack Load Meta TypeDoc
     *
     * @example pTDocArray [ "meta_id" = "mtdoc-factures-01","tdoc_id"= "tdoc-factures","meta_title"= "Date de Facturation","meta_desc"= "Date de Facturation.","meta_datatype"= "date"
     */
    _callbackCreateNewDoc: function(data)
    {
        console.debug('DocumentDialogWidget - CREATION - CallBack DOC_ID:'+data);
        this.FieldsHTMLItem.DocID.val(data);
        this.element.dialog('close');
    },
    /**************************************************************************
     * Load Meta data attributes  according tdocs choosen
     * ************************************************************************/
    _loadMetaTypeDoc:function(pStrTypeDocId){
        if(pStrTypeDocId)
        {
            console.debug('[ mygedDocumentDialogWidget#'+this.element.attr('id')+' ] - Loading Metadata defintion from Type selected (val:'+pStrTypeDocId+').');

            var fldMeta = $('#myged-dialog-form-createdoc-tdocmetas');

            $(fldMeta).slideUp(1000,$.proxy(function(){
                this._launchPromiseMetaTDocs(pStrTypeDocId);
            },this));
        }
    },
    _launchPromiseMetaTDocs:function(pStrTypeDocId){
        if(pStrTypeDocId)
        {
            var promiseTDocMeta = this._promiseGetMetaTypeDoc(pStrTypeDocId);
            promiseTDocMeta.done($.proxy(this._callbackStoreMetaTypeDoc,this));
        }
    },
    _promiseGetMetaTypeDoc: function(pStrTypeDocId) {
        return $.ajax({
            url:this.options.APIBaseUrl +'typedocument/'+pStrTypeDocId+'/getmeta/',
            type: 'GET',
            delay : 1,
            dataType: "json"});
    },
    /**
     * CallBack Load Meta TypeDoc
     *
     * @example pTDocArray [ "meta_id" = "mtdoc-factures-01","tdoc_id"= "tdoc-factures","meta_title"= "Date de Facturation","meta_desc"= "Date de Facturation.","meta_datatype"= "date"
     */
    _callbackStoreMetaTypeDoc: function(pTDocArray)
    {
        console.debug('[ mygedDocumentDialogWidget#'+this.element.attr('id')+' ] - Meta TypeDocument loaded (items count: '+pTDocArray.length.toString()+').');

        // Generate Meta Input fields!
        // Clean Fieldset!
        var fldMeta = $('#myged-dialog-form-createdoc-tdocmetas');
        var legendMeta = $('<legend>').attr({
            for:'myged-dialog-form-createdoc-tdocmetas',
            title:'Infos. complémentaires.'
        }).text('Autres informations');

        fldMeta.empty();
        fldMeta.append(legendMeta);

        // For all meta !
        $.each(pTDocArray,function(index, metatdoc) {

            var divHTMLElem = $('<div>').attr({
                id   :'myged-dialog-form-createdoc-divmetatdoc-'+metatdoc.meta_id,
                title : metatdoc.meta_desc
            });

            var labelHTMLElem = $('<label>').attr({
                for   :metatdoc.meta_id,
                title : metatdoc.meta_desc
            }).text(metatdoc.meta_title);

            var iptHTMLElem = $('<input>').attr({
                id   :metatdoc.meta_id,
                name :metatdoc.meta_id,
                type : metatdoc.meta_datatype,
                pattern : metatdoc.meta_pattern,
                placeholder : metatdoc.meta_placeholder
            });

            if(metatdoc.meta_required && metatdoc.meta_required === 'Y')
            {
                iptHTMLElem.attr('required','required');
            }

            if(metatdoc.meta_mask && metatdoc.meta_mask === 'Y')
            {
                iptHTMLElem.mask(metatdoc.meta_mask);
            }

            divHTMLElem.append(labelHTMLElem);
            divHTMLElem.append(iptHTMLElem);
            fldMeta.append(divHTMLElem);
        });

        var jSonMTDocs = JSON.stringify(pTDocArray);
        if(sessionStorage.getItem('mtdocs'))
        {
            sessionStorage.removeItem('mtdocs');
        }
        sessionStorage.setItem('mtdocs',jSonMTDocs);
        $(fldMeta).slideDown(1000);
    },

    /**
     * LoadData form storageSession about
     * Categories
     * Tiers
     * Types Document
     * ....
     */
    _loadData:function(){
        console.debug('DocumentDialogWidget - WIDGET _INIT - Loading Data into #'+this.element.attr('id')+'.');

        var selectCats = $('#myged-dialog-form-createdoc-catid');
        var dataCats = JSON.parse(sessionStorage.getItem('cats'));


        var newOptionsForSelectDefault = $('<option>').attr({
            value:'',
            label:'Sélectionner une catégorie',
            title:'par defaut'
        });
        selectCats.append(newOptionsForSelectDefault);


        // Categories loading from sessionStorage !
        $.each(dataCats , function (idx,categorie){
            var newOptionsForSelect = $('<option>').attr({
                value:categorie.cat_id,
                label:categorie.cat_title,
                title:categorie.cat_code
            });
            selectCats.append(newOptionsForSelect);
        });

        var selectTier = $('#myged-dialog-form-createdoc-tierid');
        var dataTiers = JSON.parse(sessionStorage.getItem('tiers'));

        var newOptionsForSelectDefault = $('<option>').attr({
            value:'',
            label:'Sélectionner un Tier',
            title:'par defaut'
        });
        selectTier.append(newOptionsForSelectDefault);
        // Categories loading from sessionStorage !
        $.each(dataTiers , function (idx,tier){
            var newOptionsForSelect = $('<option>').attr({
                value:tier.tier_id,
                label:tier.tier_title,
                title:tier.tier_code
            });
            selectTier.append(newOptionsForSelect);
        });

        var selectTypeDoc = $('#myged-dialog-form-createdoc-tdocid');
        var dataTypeDoc = JSON.parse(sessionStorage.getItem('tdocs'));

        var newOptionsForSelectDefault = $('<option>').attr({
            value:'',
            label:'Sélectionner un type',
            title:'par defaut'
        });
        selectTypeDoc.append(newOptionsForSelectDefault);

        // Categories loading from sessionStorage !
        $.each(dataTypeDoc , function (idx,typedoc){
            var newOptionsForSelect = $('<option>').attr({
                value:typedoc.tdoc_id,
                label:typedoc.tdoc_title,
                title:typedoc.tdoc_code
            });
            selectTypeDoc.append(newOptionsForSelect);
        });
    },
    /**
     * Binding Events on HTML Form controls
     */
    _bindFormControlsEvents:function(){
        // Switch TypeDoc => Update MetaTypeDocAttributes Part!
        this.FieldsHTMLItem.TypeDocID.on('change',
                $.proxy(
                    function()
                    {
                        var TypeDocSelected = $("#myged-dialog-form-createdoc-tdocid option:selected").val();
                        if(TypeDocSelected)
                        {
                            this._loadMetaTypeDoc(TypeDocSelected);
                        }
                    },this
                )
        );

        // Overide SUBMIT event of main Form (CREATE_MODE Only)
        this.HTMLFormObj.submit(
            $.proxy(this._eventSubmitForm,this)
        );

        //  CANCEL button Click Event !
        $('#myged-dialog-form-createdoc-btncancel').click(
            $.proxy(function(event){
                this.element.dialog('close');
                event.preventDefault();
                this.HTMLFormObj.trigger("reset");
            },this)
        );
    },
    openDialog:function()
    {

        this.element.dialog('open');
    },
    setFileID:function(fileid)
    {

        this.FieldsHTMLItem.FileID.val(fileid);
        var lArrFileData = $.MyGEDUI().getFilesData(fileid);
        this.FieldsHTMLItem.FileName.val(lArrFileData['file_originalname']);
        this.FieldsHTMLItem.DocTitre.val(lArrFileData['file_originalname']);
    },
    _populateTypeDocumentsSelect:function(){

    }
});
