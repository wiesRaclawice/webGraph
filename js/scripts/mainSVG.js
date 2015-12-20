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
    deleteNode : function(id) {return WebGraph.Implementation.deleteNode(id);},
    createEdge : function() {return false;},
    deleteEdge : function() {return false;}
};


//Implementation
WebGraph.Implementation = {
    createNode : function( _x, _y) {
        var id = graph.getNewId();
        var contents = [
            new WebGraph.Graph.Node.Title(id, "Some title")
        ];

        var node = new WebGraph.Graph.Node(id,_x,_y,100,100,contents);

        graph.addNode(node);
        node.draw();
    },

    deleteNode : function(_id) {
        this.id = "#id" + _id;
        d3.select('#SVGcanvas').select(this.id).remove();
        graph.deleteNode(_id);
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
            '<button id="context-menu-new-edge" class="btn btn-info" style="margin-right: 10px;">New Edge</button>' +
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

    this.deleteNode = function(_id) {
        delete this.nodes[_id];
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
            .attr("id", this.id)
            .attr("x", this.x   - $('#mainBoard').offset().left)
            .attr("y", this.y - $('#mainBoard').offset().top)
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "purple")
            .style("opacity", "0.1")
            .style("border", "1px black solid");

        $("svg").find("g.node").on("contextmenu", function (ev) {
            if ($contextMenu != null) $contextMenu.remove();
            ev.preventDefault();
            var nodeId = ev.target.id;
            var title = graph.nodes[nodeId].elements[0].title;
            $target = ev.target.tagName;
            if (($target == "rect") || ($target = "text")) {
                $contextMenu = $('' +
                    '<div id="node-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
                    '<form class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<div class="col-sm-12">' +
                    '<button id="node-context-menu-edit-node" class="btn btn-success" style="margin-right: 10px;">Edit Node</button>' +
                    '<button id="node-context-menu-delete-node" class="btn btn-danger" style="margin-right: 10px;">Delete Node</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                $('body').append($contextMenu);
                $('#node-context-menu-edit-node').click( function(e) {
                    e.preventDefault();
                    //TODO Editing a node
                    console.log("clicked");
                    $contextMenu.remove();
                });
                $('#node-context-menu-delete-node').click( function(e) {
                    e.preventDefault();
                    WebGraph.deleteNode(ev.target.id);
                    $contextMenu.remove();

                })
            }

            $('#mainBoard').click(function (e) {
                $contextMenu.remove();
            });
            return false;
        })

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
            .select("#id" + this.id)
            .append("text")
            .attr("id", this.id)
            .attr("x", graph.nodes[this.id].x - $('#mainBoard').offset().left + 10)
            .attr("y", graph.nodes[this.id].y - $('#mainBoard').offset().top + 20)
            .text(this.title);
    };
}


