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
    createEdge : function(idFrom, idTo, title) {return WebGraph.Implementation.createEdge(idFrom, idTo, title);},
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
            new WebGraph.Graph.Node.Title(id, "Some title"),
            new WebGraph.Graph.Node.Description(id, "Description"),
            new WebGraph.Graph.Node.Image(id, "")
        ];

        var node = new WebGraph.Graph.Node(id,_x,_y,140,140,"#C6F7F7","#FFFFFF", contents);

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
        this.neighborId = WebGraph.createNode(this.node.x + 200, this.node.y + 20);
        WebGraph.createEdge(this.id, this.neighborId, "Sample title");
    },

    createEdge : function(_idFrom, _idTo, _title) {
        this.from = _idFrom;
        this.to = _idTo;
        this.title = _title
        var edge = new WebGraph.Graph.Edge(graph.getNewId(), this.from, this.to, this.title);
        graph.addEdge(edge);
    },

    deleteEdge : function(_id) {
        this.id = _id;
        d3.select('#SVGcanvas').selectAll("g.links").select('line#' + this.id).remove();
        graph.deleteEdge(this.id);
    },

    changeBackgroundColor : function(_id, _newColor) {
        this.id = "#id" + _id;
        var value = _newColor;
        d3.select('#SVGcanvas').select(this.id).select("rect").style("fill", value);
        graph.nodes[_id].color = value;
    },

    changeTextColor : function(_id, _newColor) {
        this.id = "#id" + _id;
        var value = _newColor;
        d3.select('#SVGcanvas').select(this.id).selectAll("text").style("fill", value);
        graph.nodes[_id].textColor = value;
    },

    changeBorderColor : function(_id, _newColor) {
        this.id = "#id" + _id;
        var value = _newColor;
        d3.select('#SVGcanvas').select(this.id).select("rect").style("stroke", value);
        graph.nodes[_id].borderColor = value;
    },

    changeEdgeColor : function(_id, _newColor) {
        this.id = "#id" + graph.edges[_id].from;
        d3.select('#SVGcanvas').select(this.id).select('.links').selectAll('*').style("stroke", _newColor);
        graph.edges[_id].color = _newColor;
    },

    changeURL : function(_id, _newURL) {
        this.id = "#id" + _id;
        d3.select('#SVGcanvas').select(this.id).select('image').attr("xlink:href", _newURL);
        graph.nodes[_id].elements[3].value = _newURL;
    },

    changeDescription : function(_id, _newDescription) {
        this.id = "#id" + _id;
        d3.select('#SVGcanvas').select(this.id).select('#description').text(_newDescription);
        graph.nodes[_id].elements[2].value = _newDescription;
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

WebGraph.Graph.Node = function(_id, _x, _y, _width, _height, _color, _textColor, _elements) {
    this.id = _id;
    this.x = _x;
    this.y = _y;
    this.width = (_width != null)?_width:100;
    this.height = (_height != null)?_height:100;
    this.color = _color;
    this.borderColor = "#000000";
    this.textColor = _textColor;
    this.elements = _elements;
    $context = this;

    this.draw = function() {
        var offset = $("#mainBoard").offset();
        d3.select("#SVGcanvas")
            .append("g")
            .attr("id", "id" + this.id)
            .attr("class", "node")
            .append("g")
            .attr("class", "links");

        d3.select("#SVGcanvas")
            .select("g#id" + this.id)
            .append("rect")
            .attr("id", this.id)
            .attr("x", this.x   - offset.left)
            .attr("y", this.y - offset.top)
            .attr("rx", 20)
            .attr('ry', 20)
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", this.color)
            .style("stroke", this.borderColor)
            .style("stroke-width", 2)
            .style("opacity", "1");

        var nodeSelector = "g.node#id" + this.id;
        var nodeId = this.id;

        $("svg").find(nodeSelector).on("contextmenu", function (ev) {
            if ($contextMenu != null) $contextMenu.remove();
            ev.preventDefault();
            $target = ev.target.tagName;
            if (($target == "rect") || ($target = "text")) {
                $contextMenu = $('' +
                    '<div id="node-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
                    '<form class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<div class="col-sm-12">' +
                    '<button id="node-context-menu-edit-node" class="btn btn-success" style="margin-right: 10px; width: 120px;">Edit Node</button>' +
                    '<button id="node-context-menu-delete-node" class="btn btn-danger" style="margin-right: 10px; width: 120px;">Delete Node</button>' +
                    '<button id="node-context-menu-new-neighbor" class="btn btn-info" style="margin-right: 10px; width: 120px;">Add neighbor</button>' +
                    '<button id="node-context-menu-new-edge" class="btn btn-warning" style="margin-right: 10px; width: 120px;">New Edge</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                $('body').append($contextMenu);
                $('#node-context-menu-edit-node').click( function(e) {
                    e.preventDefault();
                    if ($contextMenu != null) $contextMenu.remove();
                    //TODO Functions still don't change the nodes
                    $contextMenu = $('' +
                        '<div id="edge-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 180px;">' +
                        '<form class = "form-horizontal" role = "form">' +
                        '<div class = "form-group">' +
                        '<label for = "color" class = "col-sm-2 control-label" style="width: 180px;">Background color</label>' +
                        '<div class = "col-sm-5" style="width: 180px;">' +
                        '<input id="colorpicker" type="text" value="' + graph.nodes[nodeId].color +'" class="form-control" />' +
                        '<button id="change-background-color" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                        '</div>' +
                            '<label for = "text-color" class="col-sm-2 control-label" style="width: 180px;">Text color</label>' +
                            '<div class="col-sm-5" style="width: 180px;">' +
                                '<input id="textColorpicker" type="text" value="' + graph.nodes[nodeId].textColor +'" class="form-control" />' +
                        '<button id="change-text-color" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                            '</div>' +
                        '<label for = "border-color" class="col-sm-2 control-label" style="width: 180px;">Border color</label>' +
                        '<div class="col-sm-5" style="width: 180px;">' +
                        '<input id="borderColorpicker" type="text" value="' + graph.nodes[nodeId].borderColor +'" class="form-control" />' +
                        '<button id="change-border-color" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                        '</div>' +
                        '<label for="description" class="col-sm-2 control-label" style="width: 180px;">Description</label>' +
                        '<div class="col-sm-5" style="width: 180px">' +
                        '<input id ="description-changer" type="text" value="' + graph.nodes[nodeId].elements[2].value + '" class="form-control" />' +
                        '<button id="change-description" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                            '</div>' +
                        '<label for="image-url" class="col-sm-2 control-label" style="width: 180px;">Image URL</label>' +
                        '<div class="col-sm-5" style="width: 180px">' +
                        '<input id ="image-url" type="text" value="' + graph.nodes[nodeId].elements[3].value + '" class="form-control" />' +
                        '<button id="change-url" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                        '</div>' +
                        '</div>' +
                    '</form>' +
                    '<\div>');


                    $('body').append($contextMenu);
                    $('#change-background-color').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Implementation.changeBackgroundColor(nodeId, $('#colorpicker')[0].value);
                    });
                    $('#change-text-color').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Implementation.changeTextColor(nodeId, $('#textColorpicker')[0].value);
                    });
                    $('#change-border-color').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Implementation.changeBorderColor(nodeId, $('#borderColorpicker')[0].value);
                    });
                    $('#change-description').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Implementation.changeDescription(nodeId, $('#description-changer')[0].value);
                    })
                    $('#change-url').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Implementation.changeURL(nodeId, $('#image-url')[0].value);
                    });

                    return false;
                });
                $('#node-context-menu-delete-node').click( function(e) {
                    e.preventDefault();
                    WebGraph.deleteNode(ev.target.id);
                    $contextMenu.remove();
                    return false;

                });
                $('#node-context-menu-new-neighbor').click ( function (e) {
                    e.preventDefault();
                    WebGraph.createNeighbor(ev.target.id);
                    $contextMenu.remove();
                    return false;
                });
                $('#node-context-menu-new-edge').click ( function (e) {
                    e.preventDefault();
                    $contextMenu.remove();
                    $contextMenu = $('' +
                        '<div id="new-edge-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 40px;">' +
                        '<form class="form-inline" role="form">' +
                        '<div class="form-group">' +
                            '<label for="idTo">NodeTo Id: </label>' +
                            '<input type="text" class="form-control" id="nodeTo" style="width: 80px">' +
                            '<label for="edgeTitle">Title: </label>' +
                            '<input type="text" class="form-control" id="edgeTitle" style="width :80px">' +
                        '</div>' +
                            '<button class="btn btn-default" id="submitEdge">Create Edge</button>' +
                        '</form>' +
                        '</div>');
                    $('body').append($contextMenu);
                    $('#submitEdge').click ( function () {
                        WebGraph.createEdge(ev.target.id, $('#nodeTo')[0].value, $('#edgeTitle')[0].value);
                        $contextMenu.remove();
                        return false;
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

WebGraph.Graph.Edge = function(_id, _from, _to, _title) {
    this.id = _id;
    this.from = _from;
    this.to = _to;
    this.title = _title;
    this.color = "#76DE43";

    var nodeFrom = graph.nodes[this.from];
    var nodeTo = graph.nodes[this.to];

    var offset = $("#mainBoard").offset();

    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id" + this.from)
            .selectAll(".links")
            .append("line")
            .attr("id", "id" + this.id)
            .attr("x1", nodeFrom.x - offset.left + nodeFrom.width/2)
            .attr("y1", nodeFrom.y - offset.top + nodeFrom.height/2)
            .attr("x2", nodeTo.x - offset.left + nodeTo.width/2)
            .attr("y2", nodeTo.y - offset.top + nodeTo.height/2)
            .style("stroke", this.color)
            .style("stroke-width", 3);

        var lineId = "line#id" + this.id;
        var edgeId = this.id;
        var color = this.color;
        $('svg').find("g.node").find(lineId).on("contextmenu", function (ev) {
            ev.preventDefault();
            $contextMenu = $('' +
                '<div id="edge-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 90px;">' +
                '<form class="form-horizontal">' +
                '<div class="form-group">' +
                '<div class="col-sm-12">' +
                '<button id="edge-context-menu-delete-edge" class="btn btn-danger" style="margin-right: 10px;">Delete Edge</button>' +
                '</div>' +
                '<label for = "edgeColor" class = "col-sm-2 control-label" style="width: 180px;">Edge color</label>' +
                '<div class = "col-sm-5" style="width: 180px;">' +
                '<input id="edgeColorpicker" type="text" value="' + graph.edges[edgeId].color +'" class="form-control" />' +
                '<button id="change-edge-color" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                '</div>' +
                '</div>');
            $('body').append($contextMenu);
            $('#edge-context-menu-delete-edge').on("click", function(e) {
                e.preventDefault();
                WebGraph.deleteEdge(ev.target.id);
                $contextMenu.remove();
                return false;
            })
            $('#change-edge-color').on("click", function(e) {
                e.preventDefault();
                WebGraph.Implementation.changeEdgeColor(edgeId, $('#edgeColorpicker')[0].value);
            })

            return false;
        })


        $('svg').find("g.node").find(lineId).on("click", function(ev) {
            ev.preventDefault();
            var edgeId = ev.target.id.substring(2,ev.target.id.length);
            var edge = graph.edges[edgeId];
            $contextMenu = $('' +
                '<div id="edge-click-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 40px;">' +
                '<form class="form-inline" role="form">' +
                '<div class="form-group">' +
                '<input type="text" class="form-control" id="edgeTitle" style="width: 120px" value="' + edge.title +'">' +
                '</div>' +
                '<button class="btn btn-default" id="editEdge">Edit Edge</button>' +
                '</form>' +
                '</div>');
            $('body').append($contextMenu);
            $('#editEdge').on("click", function (e) {
                e.preventDefault();
                edge.title = $('#edgeTitle')[0].value;
                $contextMenu.remove();
                return false;
            })
            $('#mainBoard').click(function (e) {
                $contextMenu.remove();
            });
            return false;
        })

    }
};

WebGraph.Graph.Node.Title = function(_id, _title) {

    this.title = _title;
    this.id = _id;
    var offset = $('#mainBoard').offset();
    var textColor = "";
    if (graph.nodes[this.id] != undefined) {
        textColor = graph.nodes[this.id].textColor;
    } else {textColor = "#000000"};

    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id" + this.id)
            .append("text")
            .attr("id", "title")
            .attr("x", graph.nodes[this.id].x - offset.left + 10)
            .attr("y", graph.nodes[this.id].y - offset.top + 40)
            .attr("fill", textColor)
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

WebGraph.Graph.Node.Image = function(_id, _value, _width) {
    this.id = _id;
    this.value = (_value != "")?_value : "https://cdn2.iconfinder.com/data/icons/designers-and-developers-icon-set/32/image-512.png";
    this.width = (_width != null)?_width : 55;

    var offset = $('#mainBoard').offset();


    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id" + this.id)
            .append("image")
            .attr("x", graph.nodes[this.id].x - offset.left + (graph.nodes[this.id].width)/2 - this.width/2)
            .attr("y", graph.nodes[this.id].y - offset.top + 70)
            .attr("width", this.width)
            .attr("height", this.width)
            .attr("xlink:href", this.value);
    }


}

WebGraph.Graph.Node.Description = function(_id, _value) {
    this.id = _id;
    this.value = _value;
    var offset = $('#mainBoard').offset();
    var textColor = "";
    if (graph.nodes[this.id] != undefined) {
        textColor = graph.nodes[this.id].textColor;
    } else {textColor = "#000000"};

    this.draw = function() {
        d3.select("#SVGcanvas")
            .select("#id" + this.id)
            .append("text")
            .attr("id", "description")
            .attr("x", graph.nodes[this.id].x - offset.left + 10)
            .attr("y", graph.nodes[this.id].y - offset.top + 60)
            .attr("fill", textColor)
            .text(this.value);
    };
}


