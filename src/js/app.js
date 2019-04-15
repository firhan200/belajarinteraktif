interact('.pointer')    // target elements with the 'slider' class
  .draggable({                        // make the element fire drag events
    origin: 'self',                   // (0, 0) will be the element's top-left
    inertia: true,                    // start inertial movement if thrown
    modifiers: [
      interact.modifiers.restrict({
        restriction: 'self'           // keep the drag coords within the element
      })
    ]
  })
  .on('dragmove', function (event) {  // call this listener on every dragmove
    const sliderWidth = interact.getElementRect(event.target.parentNode).width
    const value = event.pageX / sliderWidth

    if(value < 0.95){
        event.target.style.paddingLeft = (value * 100) + '%'
        event.target.setAttribute('data-value', value.toFixed(2))
    }

  })

$(".feedback-benar").hide();
$(".feedback-salah").hide();

$("#calculate-pointer").click(function(){
    var pointer1 = parseFloat(document.getElementById('pointer1').getAttribute('data-value'));
    var pointer2 = parseFloat(document.getElementById('pointer2').getAttribute('data-value'));
    var pointer3 = parseFloat(document.getElementById('pointer3').getAttribute('data-value'));
    var result = pointer1 + pointer2 + pointer3;

    $("#result").text(result);

    //correction
    if(result===2){
        $(".feedback-salah").hide();
        $(".feedback-benar").slideDown();
    }else{
        $(".feedback-benar").hide();
        $(".feedback-salah").slideDown();
    }
})