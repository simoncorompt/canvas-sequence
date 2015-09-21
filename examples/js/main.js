$(document).ready(function() {

    setTimeout(function() {
        var sequence = new CanvasSequence('canvas', 'img/pngSequence56/vvt0', 201, '.png', function() {
            console.log("Loaded !")
        });

    }, 2000);


});
