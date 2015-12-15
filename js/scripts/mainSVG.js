var WebGraph = {};

//PUBLIC INTERFACE
WebGraph = {
    //engine
    initGraph : function() { return false; },
    clearGraph : function() { return false;},
    loadGraph : function() { return false;},
    saveGraph : function() {return false;},
    //graph
    createNode : function(x, y) {return WebGraph.Engine.createNode(x, y);},
    deleteNode : function() {return false;},
    createEdge : function() {return false;},
    deleteEdge : function() {return false;}
};

WebGraph.Engine = {
    createNode : function(x, y) {
        $data =  '<svg height="100" width="100">' +
            '<circle cx="' + x + '" cy="' + y + '" r="40" stroke="black" stroke-width="3" fill="red" />' +
            'Sorry, your browser does not support inline SVG.' +
            '</svg>';

        $('#mainBoard').append($data);
    }
};

function load() {

    $contextMenu = null;

    $('#mainBoard').on("contextmenu", function (ev) {
        ev.preventDefault();
        $contextMenu = $('' +
            '<div id="jsCanvasGraph-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
            '<form class="form-horizontal">' +
                '<div class="form-group">' +
                    '<div class="col-sm-12">' +
                        '<button id="context-menu-new-node" class="btn btn-success" style="margin-right: 10px;">New Node</button>' +
                        '<button id="context-menu-delete-node" class="btn btn-danger" style="margin-right: 10px;">Delete Node</button>' +
                        '<button id="context-menu-nothing" class="btn btn-info" style="margin-right: 10px;">This is shit.</button>' +
                    '</div>' +
                '</div>' +
            '</div>');
        $('body').append($contextMenu);
        $('#context-menu-new-node').click(function (e) {
            e.preventDefault();
            WebGraph.createNode(ev.pageX, ev.pageY);
            $contextMenu.remove();
        });
        $('#mainBoard').click(function (e) {
            $contextMenu.remove();
        });
        return false;
    });
}
/**
 * Created by Sabina on 2015-12-15.
 */
