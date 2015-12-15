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
            alert("New node!");
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
