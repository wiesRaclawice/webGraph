var WebGraph = {};
var graph = {};

//PUBLIC INTERFACE
/*
createNode
deleteNode
createEdge
deleteEdge
createNeighbor
 */
WebGraph = {
    //engine
    initGraph : function() { return WebGraph.Development.initGraph(); },
    clearGraph : function() { return WebGraph.Development.clearGraph();},
    saveGraph : function() {return WebGraph.Development.saveGraph();},
    loadGraph: function(string) {return WebGraph.Development.loadGraph(string);},
    //graph
    createNode : function(x, y) {return WebGraph.Development.createNode(x, y);},
    deleteNode : function(id) {return WebGraph.Development.deleteNode(id);},
    createEdge : function(idFrom, idTo, title) {return WebGraph.Development.createEdge(idFrom, idTo, title);},
    deleteEdge : function(id) {return WebGraph.Development.deleteEdge(id);},
    createNeighbor : function(id) {return WebGraph.Development.createNeighbor(id);}
};


//Development interface
/*
createNode
deleteNode
createNeighbor
createEdge
deleteEdge
changeBackgroundColor
changeTextColor
changeBorderColor
changeEdgeColor
changeURL
changeDescription
changeTitle
 */
WebGraph.Development = {

    initGraph : function() {
        graph = new WebGraph.Graph([],[]);
    },

    clearGraph : function() {
        graph.clear();
    },

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
        this.neighborId = WebGraph.createNode(this.node.x + this.node.transX + 200, this.node.y + this.node.transY + 20);
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
        this.id = _id
        d3.select('#SVGcanvas').selectAll("g.links").select('line#' + this.id).remove();
        graph.deleteEdge(this.id.substr(2));
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
        this.id = "#id" + _id;
        d3.select('#SVGcanvas').select('g.links').select(this.id).style("stroke", _newColor);
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
    },

    changeTitle : function(_id, _newTitle) {
        this.id = "#id" + _id;
        d3.select("#SVGcanvas").select(this.id).select("#title").text(_newTitle);
        graph.nodes[_id].elements[1].value = _newTitle;
    },

    saveGraph: function() {
        var string = JSON.stringify(graph, null, 2);
        alert(string);
    },

    loadGraph: function(_string) {
        WebGraph.clearGraph();
        var json = JSON.parse(_string);
        //Create nodes
        for (var i = 0; i<json.nodes.length; i++) {
            if (json.nodes[i] == null) continue;
            var contents = [];
            for(var k=0; k<json.nodes[i].elements.length; k++) {
                switch(json.nodes[i].elements[k].type) {
                    case "Id" :
                        contents.push(new WebGraph.Graph.Node.Id(json.nodes[i].elements[k].id));
                        break;
                    case "Title" :
                        contents.push(new WebGraph.Graph.Node.Title(json.nodes[i].elements[k].id,json.nodes[i].elements[k].value));
                        break;
                    case "Description" :
                        contents.push(new WebGraph.Graph.Node.Description(json.nodes[i].elements[k].id, json.nodes[i].elements[k].value));
                        break;
                    case 'Image' :
                        contents.push(new WebGraph.Graph.Node.Image(json.nodes[i].elements[k].id, json.nodes[i].elements[k].value));
                        break;
                    default :
                        throw "Element "+json.nodes[i].elements[k].type+" not supported";
                        break;
                }

            }

            var node;
            node = new WebGraph.Graph.Node(i,json.nodes[i].x,json.nodes[i].y, json.nodes[i].width, json.nodes[i].height, json.nodes[i].color, json.nodes[i].borderColor, contents);
            node.transX = json.nodes[i].transX;
            node.transY = json.nodes[i].transY;
            node.textColor = json.nodes[i].textColor;
            graph.addNode(node);


        }

        //Create edges
        for (var i = 0; i < json.edges.length; i++) {
            if (json.edges[i] == null) continue;
            var edge = new WebGraph.Graph.Edge(json.edges[i].id, json.edges[i].from, json.edges[i].to, json.edges[i].title);
            edge.color = json.edges[i].color;
            graph.addEdge(edge);
        }

        //Update counter
        graph.idCounter = json.idCounter;

    }
};




/*
IMPLEMENTATION
addNode
deleteNode
addEdge
deleteEdge
 */
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
        d3.select("#SVGcanvas").select("g.links").selectAll("*").remove();
        d3.select("#SVGcanvas").selectAll("g.node").remove();
    };

    this.addNode = function(_node) {
        this.nodes[_node.id] = _node;
        _node.draw();
    };

    this.deleteNode = function(_id) {
        this.nodes[_id] = null;
        delete this.nodes[_id];
    };

    this.addEdge = function(_edge) {
        this.edges[_edge.id] = _edge;
        _edge.draw();
    }

    this.deleteEdge = function(_id) {
        this.edges[_id] = null;
        delete this.edges[_id];
    }
};

WebGraph.Graph.Node = function(_id, _x, _y, _width, _height, _color, _textColor, _elements) {
    this.id = _id;
    this.x = Math.round(_x/10)*10;
    this.y = Math.round(_y/10)*10;
    this.width = (_width != null)?_width:100;
    this.height = (_height != null)?_height:100;
    this.color = _color;
    this.borderColor = "#000000";
    this.textColor = _textColor;
    this.elements = _elements;
    this.transX = 0;
    this.transY = 0;
    var context = this;

    var drag = d3.behavior.drag()
            .on("drag", function(d) {
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
                context.transX = d.x;
                context.transY = d.y;
                context.changeEdges();
            })
            .on("dragend", function(d) {
                d3.select(this).attr("transform", "translate(" + Math.round(d.x/10)*10 + "," + Math.round(d.y/10)*10 + ")");
            })

    this.changeEdges = function() {
        for (var i = 0; i < graph.edges.length; i++) {
            if (graph.edges[i] == null) continue;
            var edge = graph.edges[i];
            var id = "line#id" + edge.id;
            var offset = $("#mainBoard").offset();
            if (edge.from == this.id) {
                d3.select('#SVGcanvas').select("g.links").select(id).attr("x1", this.x + this.width/2 + this.transX - offset.left)
                    .attr("y1", this.y + this.width/2 + this.transY - offset.top);
            } else if (edge.to == this.id) {
                d3.select("#SVGcanvas").select("g.links").select(id).attr("x2", this.x + this.width/2 + this.transX - offset.left)
                    .attr("y2", this.y + this.width/2 + this.transY - offset.top);
            }
        }
    }

    this.draw = function() {
        var data = [{x:0, y:0}];
        var offset = $("#mainBoard").offset();
        d3.select("#SVGcanvas")
            .append("g")
            .data(data)
            .attr("id", "id" + this.id)
            .attr("class", "node")
            .call(drag)
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
            if (($target == "rect") || ($target == "text")) {
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
                    $contextMenu = $('' +
                        '<div id="edge-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; width: 540px; height: 200px; border: 1px black solid; background-color: white;">' +
                        '<table style="width: 300px">' +
                        '<form class = "form-horizontal" role = "form">' +
                        '<tr><td>' +
                        '<label for = "color" class = "col-sm-2 control-label" style="width: 180px;">Background color</label>' +
                        '<div class = "col-sm-5" style="width: 180px;">' +
                        '<input id="colorpicker" type="text" value="' + graph.nodes[nodeId].color +'" class="form-control" />' +
                        '<button id="change-background-color" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                        '</div>' +
                            '</td><td>' +
                            '<label for = "text-color" class="col-sm-2 control-label" style="width: 180px;">Text color</label>' +
                            '<div class="col-sm-5" style="width: 180px;">' +
                                '<input id="textColorpicker" type="text" value="' + graph.nodes[nodeId].textColor +'" class="form-control" />' +
                        '<button id="change-text-color" class="btn btn-primary" style="margin-right: 20px; width: 120px;">Change</button>' +
                            '</div>' +
                            '</td><td>' +
                        '<label for = "border-color" class="col-sm-2 control-label" style="width: 180px;">Border color</label>' +
                        '<div class="col-sm-5" style="width: 180px;">' +
                        '<input id="borderColorpicker" type="text" value="' + graph.nodes[nodeId].borderColor +'" class="form-control" />' +
                        '<button id="change-border-color" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                        '</div>' +
                            '</td></tr><tr><td>' +
                        '<label for="description" class="col-sm-2 control-label" style="width: 180px;">Description</label>' +
                        '<div class="col-sm-5" style="width: 180px">' +
                        '<input id ="description-changer" type="text" value="' + graph.nodes[nodeId].elements[2].value + '" class="form-control" />' +
                        '<button id="change-description" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                            '</div>' +
                            '</td><td>' +
                    '<label for="title" class="col-sm-2 control-label" style="width: 180px;">Title</label>' +
                    '<div class="col-sm-5" style="width: 180px">' +
                    '<input id ="title-changer" type="text" value="' + graph.nodes[nodeId].elements[1].value + '" class="form-control" />' +
                    '<button id="change-title" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                    '</div></td><td>' +
                        '<label for="image-url" class="col-sm-2 control-label" style="width: 180px;">Image URL</label>' +
                        '<div class="col-sm-5" style="width: 180px">' +
                        '<input id ="image-url" type="text" value="' + graph.nodes[nodeId].elements[3].value + '" class="form-control" />' +
                        '<button id="change-url" class="btn btn-primary" style="margin-right: 10px; width: 120px;">Change</button>' +
                        '</div>' +
                        '</div>' +
                            '</table>' +
                    '</form>' +
                    '<\div>');


                    $('body').append($contextMenu);
                    $('#change-background-color').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Development.changeBackgroundColor(nodeId, $('#colorpicker')[0].value);
                        return false;
                    });
                    $('#change-text-color').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Development.changeTextColor(nodeId, $('#textColorpicker')[0].value);
                        return false;
                    });
                    $('#change-border-color').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Development.changeBorderColor(nodeId, $('#borderColorpicker')[0].value);
                        return false;
                    });
                    $('#change-title').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Development.changeTitle(nodeId, $('#title-changer')[0].value);
                        return false;
                    })
                    $('#change-description').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Development.changeDescription(nodeId, $('#description-changer')[0].value);
                        return false;
                    })
                    $('#change-url').on("click", function(e) {
                        e.preventDefault();
                        WebGraph.Development.changeURL(nodeId, $('#image-url')[0].value);
                        return false;
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
            .select("g.links")
            .append("line")
            .attr("id", "id" + this.id)
            .attr("x1", nodeFrom.x + nodeFrom.transX - offset.left + nodeFrom.width/2)
            .attr("y1", nodeFrom.y + nodeFrom.transY - offset.top + nodeFrom.height/2)
            .attr("x2", nodeTo.x + nodeTo.transX - offset.left + nodeTo.width/2)
            .attr("y2", nodeTo.y + nodeTo.transY - offset.top + nodeTo.height/2)
            .style("stroke", this.color)
            .style("stroke-width", 3);

        var lineId = "line#id" + this.id;
        var edgeId = this.id;
        var color = this.color;
        $('svg').find("g.links").find(lineId).on("contextmenu", function (ev) {
            ev.preventDefault();

            $contextMenu = $('' +
                '<div id="edge-context-menu" style="position: absolute; top: ' + ev.pageY + 'px; left: ' + ev.pageX + 'px; background-color: white; border: 1px black solid; width: 180px; height:160px;">' +
                '<form class="form-vertical">' +
                    '<table style="width:180px">' +
                '<div class="form-group">' +
                    '<tr><td>' +
                '<label for = "edgeColor" class = "col-sm-2 control-label" style="width: 180px;">Edge color</label>' +
                '<div class = "col-sm-5" style="width: 180px;">' +
                '<input id="edgeColorpicker" type="text" value="' + graph.edges[edgeId].color +'" class="form-control" />' +
                '<button id="change-edge-color" class="btn btn-primary" style="margin-right: 10px; width: 150px;">Change</button>' +
                '</div>' +
                    '<br/>' +
                    '</td></tr><tr><td>' +
                '<label for = "done" class = "col-sm-2 control-label" style="width: 180px;"></label>' +
                '<div class="col-sm-5">' +
                '<button id="edge-context-menu-delete-edge" class="btn btn-danger" style="margin-right: 10px; width:150px">Delete Edge</button>' +
                '</div>' +
                    '</td></tr>' +
                '</div>' +
            '</table>' +
            '</form>' +
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
                WebGraph.Development.changeEdgeColor(edgeId, $('#edgeColorpicker')[0].value);
                return false;
            })

            return false;
        })


        $('svg').find("g.links").find(lineId).on("click", function(ev) {
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
    this.type = "Title";
    this.value = _title;
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
            .text(this.value);
    };
};

WebGraph.Graph.Node.Id = function (_id) {
    this.type = "Id"
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
    this.type = "Image";
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
    this.type="Description"
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


