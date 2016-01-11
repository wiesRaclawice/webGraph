$(function() {

    WebGraph.initGraph();

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
        WebGraph.clearGraph();
    });

    $('#save-graph').click(function () {
        WebGraph.saveGraph();
    });

    $('#load-graph').click(function() {
        $('#mainBoard').append('' +
            '<div id="json-parse" class="form-group">' +
            '<label for="graph-json">JSON:</label>' +
            '<textarea class="form-control" rows="5" id="graph-json"></textarea>' +
            '<button id="parse" class="btn btn-primary" style="margin-right: 10px;">Parse</button>' +
            '</div>');

        $('#parse').on("click", function () {
            var string = $('#graph-json')[0].value;
            WebGraph.loadGraph(string);
            $('#json-parse').remove();
        })
    });


});