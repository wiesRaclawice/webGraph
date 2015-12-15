
function draw() {
    var canvas = document.getElementById('mainBoard');
    var context = canvas.getContext('2d');


    canvas.addEventListener('contextmenu', function(ev){
            ev.preventDefault();
            $contextMenu = $('' +
                '<div id="jsCanvasGraph-context-menu" style="position: absolute; top: '+ev.pageY+'px; left: '+ev.pageX+'px; width: 90px;">' +
                '<div class="panel panel-default">' +
                '<div class="panel-body">' +
                '<form class="form-horizontal">' +
                '<div class="form-group">' +
                '<button type="button" class="btn btn-default">New Node</button>' +
                '</div>'+
                '</div>');
            $('body').append($contextMenu);
            return false;
        }
    , false);
}


/**
 * Created by Sabina on 2015-12-15.
 */
