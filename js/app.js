function removeElementNode(element) {
	while(element.hasChildNodes()) {
		element.removeChild(element.firstChild);
	}
};

function removeElementNodeBeforeIndex(element, index) {
	var count = element.childElementCount - index;
	while(element.childElementCount > count) {
		element.removeChild(element.firstChild);
	}
};

function muiOpenWindowWithoutWaiting(targetUrl, data) {
	mui.openWindow({
		url: targetUrl,
		waiting: {
			autoShow: false
		},
		extras: {
			extras: data
		}
	});
};

function consoleLog(tag, msg) {
	console.log(tag + ':' + msg);
};
