/**
 * Main Javascript Script UI Initialization
 * @author polux <polux@poluxfr.org>
 */


$(document).ready(function() {

    var DocMngr = $('div');
    //$(DocMngr).DocMngr();

    var elem = $('#myged-documenttable-panel');
    //$(elem).tabs();
    var myWidget = $(elem).AppGUIMainWidget();
    myWidget.AppGUIMainWidget('setTitle','Mon Titre');

    //$('#myged-content-panel').tabs();
    //$(elem).AppGUIMainWidget("inittest");

});
