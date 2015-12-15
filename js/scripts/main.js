var WebGraph = {};

//PUBLIC INTERFACE
WebGraph = {
    //engine
    initGraph : function() { return false; },
    clearGraph : function() { return false;},
    loadGraph : function() { return false;},
    saveGraph : function() {return false;},
    //graph
    createNode : function(context, x, y) {return WebGraph.Engine.createNode(context, x, y);},
    deleteNode : function() {return false;},
    createEdge : function() {return false;},
    deleteEdge : function() {return false;}
};

WebGraph.Engine = {
    createNode : function(context, x, y) {
        $data =  '<svg>' +
            '<circle cx="' + x + '" cy="' + y + '" r="40" stroke="black" stroke-width="3" fill="red" />' +
            '</svg>';

        var $mySrc = 'data:image/svg+xml;base64,'+window.btoa($data);

        var $source = new Image();
        $source.src = $mySrc;

        $source.onload = function() {
            context.drawImage($source, 0,0);
        }

    }
};


function draw() {
    var canvas = document.getElementById('mainBoard');
    var context = canvas.getContext('2d');

    canvas.addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
            $contextMenu = $('' +
                '<div id="jsCanvasGraph-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
                '<form class="form-horizontal">' +
                '<div class="form-group">' +
                '<button id="context-menu-new-node" class="btn btn-success" style="margin-right: 10px;">New Node</button>' +
                '</div>' +
                '</div>');
            $('body').append($contextMenu);
            $('#context-menu-new-node').click(function(e){
                e.preventDefault();
                WebGraph.createNode(context, ev.pageX, ev.pageY);
                $contextMenu.remove();
            });
            return false;
        }
        , false);

}


/**
 * Created by Sabina on 2015-12-15.
 */
