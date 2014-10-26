var GridDiv = (function(my) {
  var 
  tracked_items  = [],
  min_width      = 100,
  min_height     = 100,
  max_height     = 400,

  fill_height    = true,
  grid_dom       = null;

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
  function set_attributes(hash) {
    if (hash.grid_dom) { grid_dom = hash.grid_dom; }

    if (hash.min_width) { min_width = hash.min_width; }
    if (hash.min_height) { min_height = hash.min_height; }

    if (hash.max_height) { max_height = hash.max_height; }
    if (hash.fill_height != undefined) { fill_height = hash.fill_height; }

    return true;
  }  

  function add_dom(element) {
    tracked_items.push($("<td>").attr("uuid", uuid()).html(element)[0]); 
    return true;
  }

  function remove_by_uuid(uuid) {
    $.each(tracked_items, function(i, item) {
      if ($(item).attr("uuid") == uuid) { 
        tracked_items.splice(i,1); 
      }
    });
    sync();
  }
  function clear() {
    tracked_items = [];
  }

  function resize_grid() {
    // Reset the grid's width and height properties
    var grid_height = $("tr", grid_dom).length * min_height;
    var grid_width = $("tr", grid_dom).width();

    var rows = $("tr", grid_dom).length;
    var columns = $("td", $("tr", grid_dom)[0]).length;


    // Check if it exceeds the max high
    var max_grid_height = Math.max(max_height  * rows, $(window).height() - $(grid_dom).offset().top - 20);
    if (grid_height < max_grid_height) { grid_height = max_grid_height; }

    //$("td", grid_dom).height(fill_height ?  max_grid_height / rows :  min_height);
    //$("td", grid_dom).width( grid_width / columns);

    // Make the height equal the width if possible
    if (grid_height > $(grid_dom).width()) { grid_height = $(grid_dom).width(); }


    if (fill_height) { 
      $(grid_dom).height($(window).height() - $(grid_dom).offset().top - 20); 
    } else {
      $(grid_dom).height(''); 
    }
  }

  function sync() { 
    refill_grid(); 
    resize_grid();
    return true; 
  }

  function grid_dimensions(number_of_elements) {
    var cols = 1; 
    var rows = number_of_elements / 2;
    while (cols * rows < number_of_elements) { cols++; }
    while (rows > cols + 1) { rows--; cols++;}

    if (cols % 1 != 0) { cols = cols + 0.5 }
    if (rows % 1 != 0) { rows = rows + 0.5 }

    return [rows, cols];
  }

  function item_dimensions_too_small (cols, rows, min_row_width) {
    var available_height = $(window).height - $(grid_dom).offset().top;
    if (min_height > available_height / rows) {
      return true;
    }

    if (min_width > $(grid_dom).width() / cols) {
      return true;
    }

    return false;
  }

  function clean_container() { grid_dom.innerHTML = ''; }
  function fixed_dimensions(dimensions) {
    var cols = dimensions[1],
      rows = dimensions[0];

    while (item_dimensions_too_small(cols, rows, min_width)) {
      rows = rows + 1;
      cols = cols - 1;
    }

    return [rows, cols];
  }
  function refill_grid() {
    clean_container();
    
    var stack_size = tracked_items.length, add_rows = [];
    var dimensions = fixed_dimensions(grid_dimensions(tracked_items.length));

    var rows = dimensions[0],
    cols = dimensions[1];

    for (var i = 0; i < rows; i++) { 
      add_rows.push($("<tr>")[0]); 
    }
    for (
      var index = 0, current_col = 0, current_row = 0; 
      index < tracked_items.length; 
      index++, current_col++
    ) {
      if (current_col > cols + 1) { 
        current_row++; 
        current_col = 0; 
      }
      $(add_rows[current_row]).append(tracked_items[index]);
      current_col++;
    }

    for (var i = 0; i < rows; i++) { 
      if ($(add_rows[i]).html() != "") { $(grid_dom).append(add_rows[i]); }
    }
  }
  
  return {
    add_dom : add_dom,
    remove_by_uuid : remove_by_uuid,
    
    set_attributes : set_attributes,
    sync : sync,
    clear: clear
  };
});
