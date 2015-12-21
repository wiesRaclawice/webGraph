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
    createEdge : function(idFrom, idTo) {return WebGraph.Implementation.createEdge(idFrom, idTo);},
    deleteEdge : function(id) {return WebGraph.Implementation.deleteEdge(id);},
    createNeighbor : function(id) {return WebGraph.Implementation.createNeighbor(id);}
};


//Implementation
WebGraph.Implementation = {
    createNode : function( _x, _y) {
        var id = graph.getNewId();

        //TODO Find a way to make contents relative to each other
        var contents = [
            new WebGraph.Graph.Node.Id(id),
            new WebGraph.Graph.Node.Title(id, "Some title")
        ];

        var node = new WebGraph.Graph.Node(id,_x,_y,100,100,contents);

        graph.addNode(node);
        return id;
    },

    deleteNode : function(_id) {
        this.id = "#id" + _id;
        d3.select('#SVGcanvas').select(this.id).remove();
        graph.deleteNode(_id);
    },

    createNeighbor : function(_id) {
        this.id = _id;
        this.node = graph.nodes[this.id];
        this.neighborId = WebGraph.createNode(this.node.x + 140, this.node.y + 20);
        WebGraph.createEdge(this.id, this.neighborId);
    },

    createEdge : function(_idFrom, _idTo) {
        this.from = _idFrom;
        this.to = _idTo;
        var edge = new WebGraph.Graph.Edge(graph.getNewId(), this.from, this.to);
        graph.addEdge(edge);
    },

    deleteEdge : function(_id) {
        this.id = _id;
        d3.select('#SVGcanvas').selectAll('g').select('line#' + this.id).remove();
        graph.deleteEdge(this.id);
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
            '</div>' +
            '</div>' +
            '</div>');
        $('body').append($contextMenu);
        $('#context-menu-new-node').click(function (e) {
            e.preventDefault();
            WebGraph.createNode(ev.pageX, ev.pageY);
            $contextMenu.remove();
        });
        $('#mainBoard').click(function () {
            $contextMenu.remove();
        });
        return false;
    });

    $('#clear-graph').click(function () {
        graph.clear();
    });


});

WebGraph.Graph = function(_nodes, _edges) {
    this.nodes = _nodes;
    this.edges = _edges;
    this.idCounter = 0;

    this.getNewId = function() {
        var counter = this.idCounter;
        this.idCounter = counter + 1;
        return counter;
    };

    this.clear = function() {
        this.nodes = [];
        this.edges = [];
        d3.select("#SVGcanvas").selectAll("*").remove();
    };

    this.findNodeById = function(id) {
        return this.nodes[id];
    };

    this.addNode = function(_node) {
        this.nodes[_node.id] = _node;
        _node.draw();
    };

    this.deleteNode = function(_id) {
        delete this.nodes[_id];
    };

    this.addEdge = function(_edge) {
        this.edges[_edge.id] = _edge;
        _edge.draw();
    }

    this.deleteEdge = function(_id) {
        delete this.edges[_id];
    }
};

WebGraph.Graph.Node = function(_id, _x, _y, _width, _height, _elements) {
    this.id = _id;
    this.x = _x;
    this.y = _y;
    this.width = (_width != null)?_width:100;
    this.height = (_height != null)?_height:100;
    this.elements = _elements;
    $context = this;

    this.draw = function() {
        var offset = $("#mainBoard").offset();
        d3.select("#SVGcanvas")
            .append("g")
            .attr("id", "id" + this.id)
            .attr("class", "node")
            .append("rect")
            .attr("id", this.id)
            .attr("x", this.x   - offset.left)
            .attr("y", this.y - offset.top)
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "blue")
            .style("opacity", "0.1");

        $("svg").find("g.node").on("contextmenu", function (ev) {
            if ($contextMenu != null) $contextMenu.remove();
            ev.preventDefault();
            $target = ev.target.tagName;
            if (($target == "rect") || ($target = "text")) {
                $contextMenu = $('' +
                    '<div id="node-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
                    '<form class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<div class="col-sm-12">' +
                    '<button id="node-context-menu-edit-node" class="btn btn-success" style="margin-right: 10px;">Edit Node</button>' +
                    '<button id="node-context-menu-delete-node" class="btn btn-danger" style="margin-right: 10px;">Delete Node</button>' +
                    '<button id="node-context-menu-new-neighbor" class="btn btn-info" style="margin-right: 10px;">Add neighbor</button>' +
                    '<button id="node-context-menu-new-edge" class="btn btn-info" style="margin-right: 10px;">New Edge</button>' +
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

                });
                $('#node-context-menu-new-neighbor').click ( function (e) {
                    e.preventDefault();
                    WebGraph.createNeighbor(ev.target.id);
                    $contextMenu.remove();
                });
                $('#node-context-menu-new-edge').click ( function (e) {
                    e.preventDefault();
                    $contextMenu.remove();
                    //TODO Has to show the id input and then calls to create an edge
                    $contextMenu = $('' +
                        '<div id="new-edge-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 40px;">' +
                        '<form class="form-inline" role="form">' +
                        '<div class="form-group">' +
                            '<label for="idTo">NodeTo Id: </label>' +
                            '<input type="text" class="form-control" id="nodeTo" style="width: 80px">' +
                        '</div>' +
                            '<button class="btn btn-default" id="submitEdge">Create Edge</button>' +
                        '</form>' +
                        '</div>');
                    $('body').append($contextMenu);
                    $('#submitEdge').click ( function () {
                        WebGraph.createEdge(ev.target.id, $('#nodeTo')[0].value);
                        $contextMenu.remove();
                    })
                })
            }

            $('#mainBoard').click(function (e) {
                $contextMenu.remove();
            });
            return false;
        });


        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].draw();
        }

    }


};

WebGraph.Graph.Edge = function(_id, _from, _to) {
    this.id = _id;
    this.from = _from;
    this.to = _to;

    var nodeFrom = graph.nodes[this.from];
    var nodeTo = graph.nodes[this.to];

    var offset = $("#mainBoard").offset();

    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id" + this.from)
            .append("line")
            .attr("id", "id" + this.id)
            .attr("x1", nodeFrom.x - offset.left + nodeFrom.width/2)
            .attr("y1", nodeFrom.y - offset.top + nodeFrom.height/2)
            .attr("x2", nodeTo.x - offset.left + nodeTo.width/2)
            .attr("y2", nodeTo.y - offset.top + nodeTo.height/2)
            .style("stroke", "rgb(255,0,0)")
            .style("stroke-width", 2);

        //TODO Drawing Edge title above the edge
        $('svg').find("g.node").find("line").on("contextmenu", function (ev) {
            ev.preventDefault();
            $contextMenu = $('' +
                '<div id="edge-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
                '<form class="form-horizontal">' +
                '<div class="form-group">' +
                '<div class="col-sm-12">' +
                '<button id="edge-context-menu-delete-edge" class="btn btn-danger" style="margin-right: 10px;">Delete Edge</button>' +
                '</div>' +
                '</div>' +
                '</div>');
            $('body').append($contextMenu);
            $('#edge-context-menu-delete-edge').on("click", function(e) {
                e.preventDefault();
                WebGraph.deleteEdge(ev.target.id);
                $contextMenu.remove();
            })

            return false;
        })

    }
};

WebGraph.Graph.Node.Title = function(_id, _title) {

    this.title = _title;
    this.id = _id;
    var offset = $('#mainBoard').offset();

    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id" + this.id)
            .append("text")
            .attr("id", this.id)
            .attr("x", graph.nodes[this.id].x - offset.left + 10)
            .attr("y", graph.nodes[this.id].y - offset.top + 40)
            .text(this.title);
    };
};

WebGraph.Graph.Node.Id = function (_id) {
    this.id = _id;
    var offset = $('#mainBoard').offset();

    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id" + this.id)
            .append("text")
            .attr("id", this.id)
            .attr("x", graph.nodes[this.id].x - offset.left + 10)
            .attr("y", graph.nodes[this.id].y - offset.top + 20)
            .style("fill", "#999999")
            .style("stroke", "#000000")
            .style("font-size", "16px")
            .text("#id" + this.id);
    }

}


