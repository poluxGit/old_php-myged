/**
 * My Widget Test
 *
 */
$(function() {
    $.widget("iP.myButton", {
               _create: function() {
                  this._button = $("<button>");
                  this._button.text("My first Widget Button");
                  this._button.width(this.options.width)
                  this._button.css("background-color", this.options.color);
                  this._button.css("position", "absolute");
                  this._button.css("left", "100px");
                  $(this.element).append(this._button);
               },

               move: function(dx) {
                  var x = dx+parseInt(this._button.css("left"));
                  this._button.css("left", x);
                  if(x>400){ this._trigger("outbounds",{},  {position:x}); }
               }
            });
            $("#button3").myButton();
            $("#button3").myButton("move", 200);
         });
