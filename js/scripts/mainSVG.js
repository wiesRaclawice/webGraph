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
            new WebGraph.Graph.Node.Title(_graph, id, "Some title")
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
        alert(ev.currentTarget);
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
        return true;
    });

    $('#clear-graph').click(function (e) {
        graph.clear();
    });

    $("svg").find("g.node").find("rect").on("click", function (ev) {
        if ($contextMenu != null) $contextMenu.remove();
        ev.preventDefault();
        alert(ev.currentTarget);
        $contextMenu = $('' +
            '<div id="context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
            '<form class="form-horizontal">' +
            '<div class="form-group">' +
            '<div class="col-sm-12">' +
            '<button id="context-menu-edit-node" class="btn btn-success" style="margin-right: 10px;">Edit</button>' +
            '</div>' +
            '</div>' +
            '</div>');
        $('body').append($contextMenu);

        $('#mainBoard').click(function (e) {
            $contextMenu.remove();
        });
        return true;
    })
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
    $context = this;

    this.draw = function() {
        var obj = d3.select("#SVGcanvas")
            .append("g")
            .attr("id", "id" + this.id)
            .attr("class", "node")
            .append("rect")
            .attr("x", this.x   - $('#mainBoard').offset().left)
            .attr("y", this.y - $('#mainBoard').offset().top)
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "purple")
            .style("opacity", "0.1")
            .style("border", "1px black solid");


        this.elements[0].draw();
    }

    this.contextMenu = function(ev) {
            if ($contextMenu != null) $contextMenu.remove();
            ev.preventDefault();
            alert(typeof ev);
            $contextMenu = $('' +
                '<div id="context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
                '<form class="form-horizontal">' +
                '<div class="form-group">' +
                '<div class="col-sm-12">' +
                '<button id="context-menu-edit-node" class="btn btn-success" style="margin-right: 10px;">Edit</button>' +
                '</div>' +
                '</div>' +
                '</div>');
            $('body').append($contextMenu);

            /*$('#mainBoard').click(function (e) {
                $contextMenu.remove();
            });*/
            return false;
    }
}

WebGraph.Graph.Edge = function(_id, _from, _to) {
    this.id = _id;
    this.from = _from;
    this.to = _to;
}

WebGraph.Graph.Node.Title = function(_graph, _id, _title) {

    this.title = _title;
    this.id = _id;
    this.graph = _graph; //TODO: Need to refactor this ASAP!!!!!

    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id" + this.id)
            .append("text")
            .attr("x", this.graph.nodes[this.id].x - $('#mainBoard').offset().left + 10)
            .attr("y", this.graph.nodes[this.id].y - $('#mainBoard').offset().top + 20)
            .text(this.title);
    };
}


