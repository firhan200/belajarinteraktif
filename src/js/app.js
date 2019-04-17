
/* Nomor 1 (Perhitungan) */
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
});
/* Nomor 1 (Perhitungan) */

/* Nomor 2 (Timbangan) */

var listWadahKiri = [];
var listWadahKanan = [];
var justLeaveFrom = '';

function dragMoveListener (event) {
  var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function updateSkorTimbangan(){
  var totalWadahKiri = listWadahKiri.reduce(function(a, b) { return a + b; }, 0);
  var totalWadahKanan = listWadahKanan.reduce(function(a, b) { return a + b; }, 0);

  document.getElementById('total-skor-kiri').innerHTML = totalWadahKiri;
  document.getElementById('total-skor-kanan').innerHTML = totalWadahKanan;

  rotateScale(totalWadahKiri, totalWadahKanan);
}

function rotateScale(leftWeight, rightWeight){
  var totalRotate =  rightWeight - leftWeight;

  if(totalRotate != 0){
    totalRotate = totalRotate / 3;
  }

  document.getElementById('timbangan').style.transform = 'rotate('+totalRotate+'deg)';

  //translate beban if rotate
  if(totalRotate != 0){
    //get all beban
    var listBeban = document.getElementsByClassName('beban');

    for(var counter = 0; counter < listBeban.length ; counter++){
      //check if beban in
      if(listBeban[counter].classList.contains('in')){
        var currentX = parseInt(listBeban[counter].getAttribute('data-x'));
        var currentY = parseInt(listBeban[counter].getAttribute('data-y'));

        var newX = currentX;
        var newY = currentY;

        //normalize total rotate
        var totalRotateNormalize = totalRotate * 1.8;

        //check if left or right
        if(listBeban[counter].classList.contains('left')){
          newY = currentY - totalRotateNormalize;
        }else if(listBeban[counter].classList.contains('right')){
          newY = currentY + totalRotateNormalize;
        }

        listBeban[counter].style.webkitTransition = '1s';
        listBeban[counter].style.transform = 'translate('+newX+'px, '+newY+'px)';
        listBeban[counter].style.webkitTransition = '0s';
      }
    }
  }
}

/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.wadah').dropzone({
  // only accept elements matching this CSS selector
  accept: '.beban',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {
    // add active dropzone feedback
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget;
    var dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('wadah-aktif');
    //beban class
    draggableElement.classList.add('in');
    draggableElement.classList.remove('leave');
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('wadah-aktif');
    //beban class
    event.relatedTarget.classList.remove('in');
    event.relatedTarget.classList.add('leave');

    justLeaveFrom = event.target.getAttribute('data-position');
  },
  ondrop: function (event) {
    event.target.classList.remove('wadah-aktif');
    event.relatedTarget.classList.add('in');

    var currentWeight = parseInt(event.relatedTarget.getAttribute('data-value'));

    if(event.target.getAttribute('data-position')==='left'){
      if(justLeaveFrom==='right')
        listWadahKanan.pop(currentWeight);
        event.relatedTarget.classList.remove('right');

      if(!listWadahKiri.includes(currentWeight))
        listWadahKiri.push(currentWeight);
        event.relatedTarget.classList.add('left');
    }else{
      if(justLeaveFrom==='left')
        listWadahKiri.pop(currentWeight);
        event.relatedTarget.classList.remove('left');

      if(!listWadahKanan.includes(currentWeight))
        listWadahKanan.push(currentWeight);
        event.relatedTarget.classList.add('right');
    }

    updateSkorTimbangan();
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('wadah-aktif');

    console.log(justLeaveFrom);

    //check if leaving wadah
    if(event.relatedTarget.classList.contains('leave')){
      //beban from inside
      event.relatedTarget.classList.remove('leave');
      
      //beban leaving wadah, remove from array
      var currentWeight = parseInt(event.relatedTarget.getAttribute('data-value'));

      if(justLeaveFrom==='left'){
        if(listWadahKiri.includes(currentWeight))
          listWadahKiri.pop(currentWeight);
          event.relatedTarget.classList.remove('left');
      }else if(justLeaveFrom==='right'){
        if(listWadahKanan.includes(currentWeight))
          listWadahKanan.pop(currentWeight);
          event.relatedTarget.classList.remove('right');
      }
    }

    updateSkorTimbangan();
  }
});

interact('.beban')
  .draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrict({
        restriction: "parent",
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      })
    ],
    autoScroll: true,
    // dragMoveListener from the dragging demo above
    onmove: dragMoveListener
  });

document.getElementById('reset-timbangan').addEventListener('click', function(){
  //reset beban
  var listBeban = document.getElementsByClassName('beban');
  for(var counter = 0; counter < listBeban.length; counter++){
    listBeban[counter].style.transform = 'translate(0px, 0px)';
    listBeban[counter].setAttribute('data-x', 0);
    listBeban[counter].setAttribute('data-y', 0);

    //remove added class
    if(listBeban[counter].classList.contains('in')){
      listBeban[counter].classList.remove('in');
    }
    if(listBeban[counter].classList.contains('leave')){
      listBeban[counter].classList.remove('leave');
    }
    if(listBeban[counter].classList.contains('left')){
      listBeban[counter].classList.remove('left');
    }
    if(listBeban[counter].classList.contains('right')){
      listBeban[counter].classList.remove('right');
    }
  }

  //reset timbangan
  document.getElementById('timbangan').style.transform = 'rotate(0deg)';

  //reset array list
  listWadahKiri = [];
  listWadahKanan = [];
  justLeaveFrom = '';

  updateSkorTimbangan();
})
/* Nomor 2 (Timbangan) */