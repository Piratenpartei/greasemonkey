// ==UserScript==
// @name        LQFB Hessen
// @description    Provides a better topic lists overview
// @namespace   Piraten
// @author         nowrap
// @include     https://lqfb.piratenpartei-hessen.de/area/list.html*
// @version     1.14
// ==/UserScript==

// Topic list
	var topics = {
		landespolitik: [1, 2, 3, 5, 4, 7, 6, 23],
		kommunalpolitik: [15, 17, 16, 18, 19, 20],
		lv: [8, 10, 14, 12],
		kvs: [21, 22, 24],
	};

// Add jQuery
	var script = document.createElement('script');
	script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
	document.getElementsByTagName('head')[0].appendChild(script);

// Add Twitter Bootstrap
	script.addEventListener('load', function() { 
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'https://www.piratenpartei-hessen.de/bootstrap/css/bootstrap.css';
		link.type = 'text/css';
		document.body.insertBefore(link, null);

		var script2 = document.createElement('script');
		script2.src = 'https://www.piratenpartei-hessen.de/bootstrap/js/bootstrap-tab.js';
		document.getElementsByTagName('head')[0].appendChild(script2);

		// When jQuery is loaded
		script2.addEventListener('load', function() { 
		  jQuery = unsafeWindow['jQuery'];
		  jQuery.noConflict();
		  /* You put your jQuery code here, which must use the jQuery namespace. See Note. */
		  jQuery(document).ready(function() {
			GM_addStyle("li.active { background-color: transparent !important; } div.tab-pane { background-color: transparent !important; }");

			var oldTable = jQuery("table.area_list");

			var sort;
			var rows;

			var landespolitikTable = oldTable.clone();
			sort = [];
			rows = landespolitikTable.find("tr.ui_list_row");
			rows.each(function(index, row) {
				var links = jQuery(row).find("a");
				var link = jQuery(links[0]);
				var html = link.html();
				var href = link.attr("href");
				href = href.replace("https://lqfb.piratenpartei-hessen.de/", "../");
				href = href.replace("../area/show/", "");
				href = href.replace(".html", "");
				href = parseInt(href);

				if (jQuery.inArray(href, topics.landespolitik) == -1) {
					jQuery(row).remove();
				} else {
					sort.push({id: html, row: row});
					jQuery(row).remove();
				}
			});
			sort.sort(rowsById);
			jQuery(sort).each(function(index, s) {
				landespolitikTable.find("tbody").append(s.row);
			});

			var kommunalpolitikTable = oldTable.clone();
			sort = [];
			rows = kommunalpolitikTable.find("tr.ui_list_row");
			rows.each(function(index, row) {
				var links = jQuery(row).find("a");
				var link = jQuery(links[0]);
				var html = link.html();
				var href = link.attr("href");
				href = href.replace("https://lqfb.piratenpartei-hessen.de/", "../");
				href = href.replace("../area/show/", "");
				href = href.replace(".html", "");
				href = parseInt(href);

				if (jQuery.inArray(href, topics.kommunalpolitik) == -1) {
					jQuery(row).remove();
				} else {
					sort.push({id: html, row: row});
					jQuery(row).remove();
				}
			});
			sort.sort(rowsById);
			jQuery(sort).each(function(index, s) {
				kommunalpolitikTable.find("tbody").append(s.row);
			});

			var kvsTable = oldTable.clone();
			sort = [];
			rows = kvsTable.find("tr.ui_list_row");
			rows.each(function(index, row) {
				var links = jQuery(row).find("a");
				var link = jQuery(links[0]);
				var html = link.html();
				var href = link.attr("href");
				href = href.replace("https://lqfb.piratenpartei-hessen.de/", "../");
				href = href.replace("../area/show/", "");
				href = href.replace(".html", "");
				href = parseInt(href);

				if (jQuery.inArray(href, topics.kvs) == -1) {
					jQuery(row).remove();
				} else {
					sort.push({id: html, row: row});
					jQuery(row).remove();
				}
			});
			sort.sort(rowsById);
			jQuery(sort).each(function(index, s) {
				kvsTable.find("tbody").append(s.row);
			});
			
			var lvTable = oldTable.clone();
			sort = [];
			rows = lvTable.find("tr.ui_list_row");
			rows.each(function(index, row) {
				var links = jQuery(row).find("a");
				var link = jQuery(links[0]);
				var html = link.html();
				var href = link.attr("href");
				href = href.replace("https://lqfb.piratenpartei-hessen.de/", "../");
				href = href.replace("../area/show/", "");
				href = href.replace(".html", "");
				href = parseInt(href);

				if (jQuery.inArray(href, topics.lv) == -1) {
					jQuery(row).remove();
				} else {
					sort.push({id: html, row: row});
					jQuery(row).remove();
				}
			});
			sort.sort(rowsById);
			jQuery(sort).each(function(index, s) {
				lvTable.find("tbody").append(s.row);
			});
			
			var all = jQuery.merge(topics.landespolitik, jQuery.merge(topics.kommunalpolitik, jQuery.merge(topics.lv, topics.kvs)));
			var sonstigesTable = oldTable.clone();
			sort = [];
			rows = sonstigesTable.find("tr.ui_list_row");
			rows.each(function(index, row) {
				var links = jQuery(row).find("a");
				var link = jQuery(links[0]);
				var html = link.html();
				var href = link.attr("href");
				href = href.replace("https://lqfb.piratenpartei-hessen.de/", "../");
				href = href.replace("../area/show/", "");
				href = href.replace(".html", "");
				href = parseInt(href);

				if (jQuery.inArray(href, all) != -1) {
					jQuery(row).remove();
				} else {
					sort.push({id: html, row: row});
					jQuery(row).remove();
				}
			});
			sort.sort(rowsById);
			jQuery(sort).each(function(index, s) {
				sonstigesTable.find("tbody").append(s.row);
			});	

			
			var tabs = '<ul class="nav nav-tabs" id="myTab">';
			tabs += '<li class="active"><a href="#landespolitik">Landespolitik</a></li>';
			tabs += '<li><a href="#kommunalpolitik">Kommunalpolitik</a></li>';
			tabs += '<li><a href="#lv">LV</a></li>';
			tabs += '<li><a href="#kvs">KVs</a></li>';

			tabs += '<li><a href="#sonstiges">Sonstiges</a></li>';
			tabs += '</ul>';
			
			tabs += '<div class="tab-content">';
			tabs += '<div class="tab-pane active" id="landespolitik">'+landespolitikTable[0].outerHTML+'</div>';
			tabs += '<div class="tab-pane" id="kommunalpolitik">'+kommunalpolitikTable[0].outerHTML+'</div>';
			tabs += '<div class="tab-pane" id="lv">'+lvTable[0].outerHTML+'</div>';
			tabs += '<div class="tab-pane" id="kvs">'+kvsTable[0].outerHTML+'</div>';
			tabs += '<div class="tab-pane" id="sonstiges">'+sonstigesTable[0].outerHTML+'</div>';
			tabs += '</div>';

			var parentDiv = oldTable.parent();
			oldTable.remove();
			
			parentDiv.append(tabs);
			
			jQuery('#myTab a').click(function (e) {
				e.preventDefault();
				jQuery(this).tab('show');
			});
			
			jQuery('#myTab a:first').tab('show');
		  });
		}, false);
	}, false);
	
function rowsById(a, b) {
    var a1 = a.id, b1= b.id;
    if(a1== b1) return 0;
    return a1> b1? 1: -1;
}