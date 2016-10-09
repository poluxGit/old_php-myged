/**
 * MyMain Page Javascript Object - Gui Manager
 *
 * @author polux@poluxfr.org
 */
 (function ($) {
     $.MyGEDUI = function (options) {
         /* Options */
         var opts = $.extend({}, $.MyGEDUI.defaults, options),
         /* Static Data */
         data = [],
         logs = [
             user = [],
             logUI = [],
             msg  = []
         ],
         /* Internal Selectors */
         HTMLMainItem           = null,
         HTMLItemHeaderTitle    = null,
         HTMLItemTableDocuments = null,
         HTMLItemTableFiles     = null,
         HTMLItemButtonToolbar  = null,
         HTMLItemUploadBox      = null,
         HTMLLogDiv             = null,
         HTMLMsgDiv             = null,
         /**
          * GUI Initialization
          * ----------------------------------------------------
          * -> building dynamicaly HTML Elements of this GUI
          * -> loading referentials Data
          * ----------------------------------------------------
          */
         _initUI = function (sel) {
             console.debug('MyGEDUI - MainController - Initializing Interface Items.');
             this.HTMLMainItem = $(sel);

             _addHTMLTitleContainer();
             _addHTMLButtonsToolbar();
             this.HTMLMainItem.append($('<BR/>'));
             _addHTMLUploadBox();
             this.HTMLMainItem.append($('<BR/>'));
             _addHTMLDocumentTable();
             _addHTMLFilesTable();

             // Widget Init!
             this.HTMLItemUploadBox.uploadFilesWidget();
             this.HTMLItemTableDocuments.mygedDocumentTableWidget();
             this.HTMLItemTableFiles.mygedFilesTableWidget();

             // Default Mode
             _showDocumentView();
         },
         _isDocumentView = function(){

             return this.HTMLItemTableDocuments.is(':visible');

         },
         _showDocumentView = function(){
             this.HTMLItemTableFiles.hide();
             this.HTMLItemTableDocuments.show();
         },
         _showFileView = function(){
             this.HTMLItemTableDocuments.hide();
             this.HTMLItemTableFiles.show();
         },
         /**
          * Log Container set up
          */
         _setLogContainer = function(sel)
         {
            var itemLog = $(sel);
            if(itemLog && itemLog.length !== 0)
            {
                this.HTMLLogDiv = itemLog;
                this.HTMLLogDiv.addClass('myged-mainpage-logger');
            }
            else {
                console.error('HTML Item for Logger not founded (selector:\''+sel+'\')');
            }
         },
         /**
          * Message container set up
          */
         _setMsgContainer = function(sel)
         {
             var itemMsg = $(sel);
             if(itemMsg && itemMsg.length !== 0)
             {
                 this.HTMLMsgDiv = itemMsg;
                 this.HTMLMsgDiv.addClass('myged-mainpage-message');
             }
             else {
                 console.error('HTML Item for Message not founded (selector:\''+sel+'\')');
             }
         },
         /**
          * Return Object Header Title
          */
         _getHtmlHeaderObj = function()
         {
             return this.HTMLItemHeaderTitle;
         },
         /**
          * Return Object Header Title
          */
         _getHtmlLogObj = function()
         {
             return this.HTMLLogDiv;
         },
         /**
          * Return Object Header Title
          */
         _getHtmlMsgObj = function()
         {
             return this.HTMLMsgDiv;
         },
         /**
          * _buildHTMLTitleContainer
          * ----------------------------------------------------
          */
         _addHTMLTitleContainer = function()
         {
             console.debug('MyGEDUI - MainController - Adding Title (HEADER#myged-doctable-container-title).');
             var headerTitle = $('<header>').attr('id','myged-doctable-container-title').text('Titre par défaut');
             this.HTMLItemHeaderTitle = headerTitle;
             this.HTMLMainItem.append(headerTitle);
         },
         /**
          * _buildHTMLDocumentTable
          * ----------------------------------------------------
          */
         _addHTMLDocumentTable = function()
         {
             /* Definie HTML Table */
             console.debug('MyGEDUI - MainController - Adding Documents (TABLE#myged-doctable).');
             var uiDataTable = $('<table>').attr('id','myged-doctable');
             this.HTMLItemTableDocuments = uiDataTable;
             this.HTMLMainItem.append(uiDataTable);
         },
         /**
          * _buildHTMLDocumentTable
          * ----------------------------------------------------
          */
         _addHTMLFilesTable = function()
         {
             /* Definie HTML Table */
             console.debug('MyGEDUI - MainController - Adding Files tables (TABLE#myged-filestable).');
             var uiDataTable = $('<table>').attr('id','myged-filestable');
             this.HTMLItemTableFiles = uiDataTable;
             this.HTMLMainItem.append(uiDataTable);

         },
         /**
          * _buildHTMLTitleContainer
          * ----------------------------------------------------
          */
         _addHTMLUploadBox = function()
         {
             console.debug('MyGEDUI - MainController - Adding UploadBox (DIV#myged-doctable-container-uploadbox).');
             var divUploadBox = $('<div>').attr('id','myged-doctable-container-uploadbox').text('Drop your files HERE');
             this.HTMLItemUploadBox = divUploadBox;
             this.HTMLMainItem.append(divUploadBox);
         },
         /**
          * Build Main Document HTML Action Button Bar
          */
         _addHTMLButtonsToolbar = function()
         {
             /* Definie HTML Table */
             console.debug('MyGEDUI - MainController - Adding Buttons Toolbar (DIV#myged-doctable-container-toolbar).');

             var divButtonAction = $('<div>')
                                        .attr('id','myged-doctable-container-toolbar')
                                        .addClass('myged-documenttable-panel-buttons');

             var buttonRefresh = $('<button>')
               .attr('id','myged-panel-reload')
               .attr('title','Recharge les données')
               .addClass('myged-documenttable-panel-button')
               .html("<image src='styles/icons/reload.png' width=20 height=20 />");

            var buttonViewFiles = $('<button>')
              .attr('id','myged-panel-viewfiles')
              .attr('title','Visualiser les fichiers')
              .addClass('myged-documenttable-panel-button')
              .html("<image src='styles/icons/copy.png' width=20 height=20 />");
             // Refresh Documents Button!
             divButtonAction.append(buttonRefresh);
             divButtonAction.append(buttonViewFiles);

            // Add Button to HTML Page
            this.HTMLItemButtonToolbar = divButtonAction;
            this.HTMLMainItem.append(divButtonAction);
            this.HTMLMainItem.append($('<p>').css('clear:both'));

            // Binding - Reload Action  !
            $('#myged-panel-reload').click(
                    $.proxy(
                        function()
                        {
                            var lStrMsg = 'Files';
                            if(_isDocumentView() === true)
                            {
                                lStrMsg = 'Documents';
                            }
                            $.MyGEDUI().addLog('Reloading data for \''+lStrMsg+'\' table !');

                            if(_isDocumentView() === true)
                            {
                                $.when(this.HTMLItemTableDocuments.mygedDocumentTableWidget('refresh'))
                                    .then($.MyGEDUI().showMessage('Documents rechargés ! Nb. Documents : '+this.HTMLItemTableDocuments.mygedDocumentTableWidget('nbDocuments')));
                            }
                            else {
                                $.when(this.HTMLItemTableFiles.mygedFilesTableWidget('refresh'))
                                    .then($.MyGEDUI().showMessage('Fichiers rechargés ! Nb. Fichiers : '+this.HTMLItemTableFiles.mygedFilesTableWidget('nbFiles')));
                            }
                        }
                        ,this)
                    );
            // Binding - Reload Action  !
            $('#myged-panel-viewfiles').click(
                    $.proxy(
                        function()
                        {
                            var lStrMsg = 'Documents';
                            if(_isDocumentView() === true)
                            {
                                lStrMsg = 'Files';
                            }
                            $.MyGEDUI().addLog('Switching view to \''+lStrMsg+'\' view !');

                            if(_isDocumentView() === true)
                            {
                                _showFileView();
                            }
                            else {
                                _showDocumentView();
                            }
                        }
                        ,this)
                    );
         },//end _addHTMLButtonsToolbar
         /**
          * Show Message
          */
         _addLogItems = function(itemStr)
         {
             var newLiLog = $('<li>').addClass('myged-mainpage-logger-last').text(itemStr);
             var ulLog = this.HTMLLogDiv.children('ul'); //.prepend(newLiLog);
             ulLog.children('li.myged-mainpage-logger-last').removeClass('myged-mainpage-logger-last');
             ulLog.fadeOut( 800 ).prepend(newLiLog).fadeIn(1200);
         },
         /**
          * Show Message
          */
         _showMessage = function(msg)
         {
             this.HTMLMsgDiv.html(msg);
             this.HTMLMsgDiv.fadeIn(1200);
             this.HTMLMsgDiv.click($.proxy(function(){ this.HTMLMsgDiv.fadeOut(1200);  },this)); //this.HTMLMsgDiv.show();
         }
         ;
         return {
             /* Public initialize Method */
             initGUI: function (selContainer,selLog,selMsg) {
                 console.debug('MyGEDUI - initGUI - Starting on \''+selContainer+'\'!');
                 _initUI(selContainer);
                 console.debug('MyGEDUI - initGUI - Logger Element on \''+selLog+'\'!');
                 _setLogContainer(selLog);
                 console.debug('MyGEDUI - initGUI - Message Element on \''+selMsg+'\'!');
                 _setMsgContainer(selMsg);
             },
             /* Define Title of Container */
             setTitleContainer: function (title) {
                 console.debug('MyGEDUI - setTitleContainer - Starting!');
                 _getHtmlHeaderObj().html(title);
             },
             showMessage: function(msg)
             {
                 _showMessage(msg);
             },
             showError: function(error)
             {

             },
             addLog: function(itemStr)
             {
                 _addLogItems(itemStr);
             }
         }
     };
     $.MyGEDUI.defaults = {
         start: '1'
     };

 })(jQuery);
