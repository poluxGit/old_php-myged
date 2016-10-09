/**
 * Main Javascript Script UI Initialization
 * @author polux <polux@poluxfr.org>
 */


$(document).ready(function() {
    // Launching UI Manager.
    var elem = $('#myged-container');
    $.MyGEDUI().initGUI('#myged-container','#myged-main-logger','#myged-main-message');
    $.MyGEDUI().setTitleContainer('Mon Container @ PoLuX');
});
