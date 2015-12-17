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
        var id = _graph.getNewId();
        var contents = [
            new WebGraph.Graph.Node.Title(id, "Some title")
        ];

        var node = new WebGraph.Graph.Node(id,_x,_y,100,100,contents);

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
    this.idCounter = 0;

    this.getNewId = function() {
        var counter = this.idCounter;
        this.idCounter = counter + 1;
        return counter;
    }

    this.clear = function() {
        this.nodes = [];
        this.edges = [];
        d3.select("#SVGcanvas").selectAll("*").remove();
    }

    this.findNodeById = function(id) {
        return this.nodes[id];
    }

    this.addNode = function(_node) {
        this.nodes[_node.id] = _node;
    }
}

WebGraph.Graph.Node = function(_id, _x, _y, _width, _height, _elements) {
    this.id = _id;
    this.x = _x;
    this.y = _y;
    this.width = (_width != null)?_width:100;
    this.height = (_height != null)?_height:100;
    this.elements = _elements;

    this.draw = function() {
        d3.select("#SVGcanvas")
            .append("g")
            .attr("id", "id" + this.id)
            .append("rect")
            .attr("x", this.x   - $('#mainBoard').offset().left)
            .attr("y", this.y - $('#mainBoard').offset().top)
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "purple")
            .style("opacity", "0.1");

        this.elements[0].draw();
    }
}

WebGraph.Graph.Edge = function(_id, _from, _to) {
    this.id = _id;
    this.from = _from;
    this.to = _to;
}

WebGraph.Graph.Node.Title = function(_id, _title) {

    this.title = _title;
    this.id = _id;

    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id0")
            .append("text")
            .attr("x", this.nodes[this.id].x)
            .attr("y", this.nodes[this.id].y)
            .text(this.title);
    };
}


