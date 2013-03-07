// ==UserScript==
// @name           100k Banner Remover
// @description    Removes annoying 100k banner
// @author         nowrap
// @include        http://*.piratenpad.*
// @include        https://*.piratenpad.*
// @version        1.0
// ==/UserScript==

//Parent Element
grandparent = document.getElementById('padbody'); 

var removeBanner = function() {
	var found = false;
	for (var i=0; i<grandparent.childNodes.length; i++) {
		if (grandparent.childNodes[i].nodeName == "DIV" && !found) {
			found = true;
			grandparent.removeChild(grandparent.childNodes[i]);
		}
	}

	document.getElementById('padpage').style.top = 0;
}

//fires off the function to start with
removeBanner();