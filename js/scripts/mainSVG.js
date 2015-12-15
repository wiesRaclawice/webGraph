var WebGraph = {};

//PUBLIC INTERFACE
WebGraph = {
    //engine
    initGraph : function() { return false; },
    clearGraph : function() { return false;},
    loadGraph : function() { return false;},
    saveGraph : function() {return false;},
    //graph
    createNode : function(x, y) {return WebGraph.Implementation.createNode(x, y);},
    deleteNode : function() {return false;},
    createEdge : function() {return false;},
    deleteEdge : function() {return false;}
};


//Implementation
WebGraph.Implementation = {
    createNode : function(x, y) {
        //TODO: Saving nodes and dynamically changing ids
        d3.select("#SVGcanvas")
            .append("circle")
            .attr("id", "node1")
            .attr("cx", x   - $('#mainBoard').position().left)
            .attr("cy", y)
            .attr("r", 10)
            .style("fill", "purple");
    }
};

function load() {

    $contextMenu = null;

    $('#mainBoard').on("contextmenu", function (ev) {
        ev.preventDefault();
        $contextMenu = $('' +
            '<div id="context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
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
