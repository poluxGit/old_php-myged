/**
 * Widget 'DocumentManager'
 * @author polux@poluxfr.org
 */
$.widget('myged.DocMngr',{
    /* Options */
    options : {
        title : 'Container Test',
        titleDocPanel : 'My files',
        rootUrl : 'php-myged'
    },
    /* HTML Items References */
    sfilter : '',
    objCategoriesList : null,
    objTiersList : null,

    _create: function() {
       this.sfilter = '';
       console.debug('DocumentManager Widget Initialization!');
    },
    _init: function(){
        this.update();
    },
    _destroy: function() {

    },
    _setOption: function (key, value) {

    },
    update: function(){
        $.when(this._loadCategories())
            .then(this._loadTiers())
            .then(this._loadDocuments())
            .done(this.refreshUI());
    },
    refreshUI:function(){
        $('#myged-maintitle').text(this.options.title);
        //$('#myged-documentpanel-title').text(this.options.titleDocPanel);
        $('.myged-selectable').selectable();

    },
    /* Load categories */
    _loadCategories: function(){
        // Loading Categories to Side Panel!
        var promiseCat = this._promiseGetCategories();

        promiseCat.done(this.cbCategoriesItems);
        promiseCat.always(function(){  });
    },
    /* Load Tiers */
    _loadTiers: function(){
        // Loading Categories to Side Panel!
        var promiseTiers = this._promiseGetTiers();

        promiseTiers.done(this.cbTiersItems);
        promiseTiers.always(function(){  });
    },
    /* Load Documents */
    _loadDocuments: function(){
        // Loading Categories to Side Panel!
        var promiseDocs = this._promiseGetDocuments();

        promiseDocs.done(this.cbDocumentsItems);
        promiseDocs.always(function(){  });
    },
    /* *************************************************************************
     * Promise List to load Data through API
     * ************************************************************************/
    _promiseGetCategories: function() {
        return $.ajax({
            url:'php-myged/api/v1/categorie',
            type: 'GET',
            delay : 1,
            dataType: "json"});
    },
    _promiseGetTiers: function() {
        return $.ajax({
            url:'php-myged/api/v1/tier',
            type: 'GET',
            delay : 1,
            dataType: "json"});
    },
    _promiseGetDocuments: function() {
        return $.ajax({
            url:'php-myged/api/v1/document',
            type: 'GET',
            delay : 1,
            dataType: "json"});
    },

    /* *************************************************************************
     * Call Backs
     * ************************************************************************/
    cbCategoriesItems: function(pCatArray)
    {
        var ulListCat = $('#myged-select-categories');
        _.each(pCatArray,function(obj, idx) {
            ulListCat.add('li').attr('id',obj.cat_id).attr('title',obj.cat_desc).text(obj.cat_title);
            console.debug('Add categorie with ID : '+obj.cat_id+ ' to menu.')
        });

        sessionStorage.setItem('Categories',pCatArray);
        $('#myged-select-categories').selectable();
    },
    cbTiersItems: function(pTiersArray)
    {
        var ulListTiers = $('#myged-select-tiers');
        _.each(pTiersArray,function(obj, idx) {
            ulListTiers.add('li').attr('id',obj.tier_id).attr('title',obj.tier_desc).text(obj.tier_title);
            console.debug('Add Tier with ID : '+obj.tier_id+ ' to menu.')
        });

        sessionStorage.setItem('Tiers',pTiersArray);
        $('#myged-select-tiers').selectable();
    },
    cbDocumentsItems: function(pDocsArray)
    {
        var tableTBodyDocs = $('#myged-documentpanel-datatable tbody');
        $('#myged-documentpanel-datatable tbody tr').remove();
        //$(tableTBodyDocs).empty('');
        var contentHTML = '';

        $.each(pDocsArray,function(idx,obj) {
            contentHTML += '<tr id="'+obj.doc_id+'">';
            contentHTML += '<td><input type=checkbox name=chk /></td>';
            contentHTML += '<td>'+obj.doc_title+'</td>';
            contentHTML += '<td>'+obj.doc_code+'</td>';
            contentHTML += '<td>FACTURE - TODEV</td>';
            contentHTML += '<td></td>';
            contentHTML += '</tr>';
            console.debug('Add new document row into table. (doc ID :' +obj.doc_id + ').');
        });
        $(tableTBodyDocs).html(contentHTML);
        sessionStorage.setItem('Documents',pDocsArray);
    }

});
