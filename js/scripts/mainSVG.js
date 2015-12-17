var WebGraph = {};

//PUBLIC INTERFACE
WebGraph = {
    //engine
    initGraph : function() { return false; },
    clearGraph : function() { return false;},
    loadGraph : function() { return false;},
    saveGraph : function() {return false;},
    //graph
    createNode : function(graph, x, y) {return WebGraph.Implementation.createNode(graph, x, y);},
    deleteNode : function() {return false;},
    createEdge : function() {return false;},
    deleteEdge : function() {return false;}
};


//Implementation
WebGraph.Implementation = {
    createNode : function(_graph, _x, _y) {
        var node = new WebGraph.Graph.Node(1,_x,_y,25,25,"circle");
        _graph.addNode(node);
        node.draw();
    }
};

$(function() {

    graph = new WebGraph.Graph([],[]);

    $contextMenu = null;

    $('#mainBoard').on("contextmenu", function (ev) {
        if ($contextMenu != null) $contextMenu.remove();
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
            WebGraph.createNode(graph, ev.pageX, ev.pageY);
            $contextMenu.remove();
        });
        $('#mainBoard').click(function (e) {
            $contextMenu.remove();
        });
        return false;
    });

    $('#clear-graph').click(function (e) {
        graph.clear();
    });
})

WebGraph.Graph = function(_nodes, _edges) {
    this.nodes = _nodes;
    this.edges = _edges;

    this.clear = function() {
        this.nodes = [];
        this.edges = [];
        d3.select("#SVGcanvas").selectAll("*").remove();
    }

    this.addNode = function(_node) {
        this.nodes.push(_node);
    }
}

WebGraph.Graph.Node = function(_id, _x, _y, _width, _height, _shape) {
    this.id = _id;
    this.x = _x;
    this.y = _y;
    this.width = (_width != null)?_width:25;
    this.height = (_height != null)?_height:25;
    this.shape = (_shape != null)?_shape:"circle";

    this.draw = function() {
        d3.select("#SVGcanvas")
            .append("circle")
            .attr("id", this.id)
            .attr("cx", this.x   - $('#mainBoard').offset().left)
            .attr("cy", this.y - $('#mainBoard').offset().top)
            .attr("r", this.width)
            .style("fill", "purple");
    }
}

WebGraph.Graph.Edge = function(_id, _from, _to) {
    this.id = _id;
    this.from = _from;
    this.to = _to;
}


