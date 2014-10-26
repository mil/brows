var Brows = (function() {
  var current_path = null;
  var grid = new GridDiv;

  function got_new_model_from_api(model) {
    uninstall_events();
    grid.clear();
    _.each([model.folders, model.files], function(p, i) {
      _.each(p, function(handle) {
        grid.add_dom(
          $("<div></div>")
            .addClass(i == 0 ? "folder"  : "file")
            .text(handle)[0]
        );
      });
    });
    grid.sync();
    install_events();
  }


  function set_path(path) {
    current_path = path;
    $("header .path").text(path);
    $.ajax({
      'url'  : 'http://localhost:4567/api',
        'data' : { 'file_path' : path }, 
      'success' : got_new_model_from_api
    });
  }


  function item_click(e) {
    var path_append = $(e.target).text();
    var new_path = current_path;
    if (path_append == "../") {
      new_path = new_path.substring(0, new_path.lastIndexOf("/"));
    } else {
      new_path += ("/" + path_append);
    }

    set_path(new_path);
  }
  function install_events() { 
    $(".up").on("click", item_click); 
    $("td").on("click", item_click); 
  }
  function uninstall_events() { 
    $(".up").off("click", item_click); 
    $("td").off("click", item_click); 
  }

  function setup_grid() {
    grid.set_attributes({
      'grid_dom' : $("main")[0],
      'min_width' : 300,
      'max_height' : 100,
      'fill_height' : false 
    });
  }

  function initialize($) {
    setup_grid();
    set_path("/home/mil/");
  }

  return {
    initialize : initialize,
    set_path : set_path,
    grid : grid
  };

}());

Zepto(Brows.initialize);
