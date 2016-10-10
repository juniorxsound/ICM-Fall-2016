//JQUERY
var $ = require('jquery');
//VIBRANT
var Vibrant = require('node-vibrant');

$(document).ready( function(){
console.log('Jquery loaded');

  var appandImage = function(number){
    $('body').append('<img style="display:none;filter: grayscale(100%); -webkit-filter: grayscale(100%);" id="imgnumber'+number+'" src="assets/pics/p' + number +'.jpeg" height="100px">');
  };

  var analyzeImage = function(imageNumber){
    var v = new Vibrant('assets/pics/p'+imageNumber+'.jpeg');
    v.getSwatches(function(e, s) {
      if (e) {
        console.log(e)
      } else {
        currentColor = s;
      }
    })

  }
    $('#begin-button').click(function(){
      $('#landing-screen').fadeOut(250, function(){
        console.log('App started');
        //Create All Image Elements and push them to the DOM
              for (var i = 1; i < 84; i++){
                appandImage(i);
              }
        //Fade In Animation
        $('body img').each(function(index){
          $(this).delay(250+(index*4)).fadeIn(500);
        });
        //Create hover events for all images
        for (var i = 0; i < $('img').length; i++){
          $('#imgnumber'+i).mouseover(function(){
            $( this ).css({'filter:': 'grayscale(0%)', '-webkit-filter': 'grayscale(0%)'});
            $('#colors').animate({
              'bottom': '0'
            }, 500);
            analyzeImage(i);
            console.log(currentColor);
              //var col = color(currentColor.Vibrant.rgb[0], currentColor.Vibrant.rgb[1], currentColor.Vibrant.rgb[2]);
              var vib = currentColor.Vibrant.getHex();
              var lvib = currentColor.LightVibrant.getHex();
              var lmut = currentColor.LightMuted.getHex();
              var dvib = currentColor.DarkVibrant.getHex();
              var dmut = currentColor.DarkMuted.getHex();

                $('#one').css({'background-color': vib});
                $('#two').css({'background-color': lvib});
                $('#three').css({'background-color': lmut});
                $('#four').css({'background-color': dvib});
                $('#five').css({'background-color': dmut});

              $('.swatch').each(function(index){
                $( this ).animate({'opacity': '1'}, (index*100)+300);
              });
          });
          $('#imgnumber'+i).mouseleave(function(){
            $( this ).css({'filter:': 'grayscale(100%)', '-webkit-filter': 'grayscale(100%)'});
          });
        }
      });
    });


});
