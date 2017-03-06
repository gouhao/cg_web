var HTTP_TIMEOUT = 10000;

var HTTP_RESULT_SUCCESS = 'success';
var HTTP_RESULT_ERROR = 'error';
var HTTP_AUTHORIZATION_HEADER = {
	'authorization': localStorage.getItem(KEY_TOKEN),
	'Content-Type': 'application/json'
};

var HTTP_SERVER = 'http://112.126.68.157:8088/mis/';

var HTTP_LOGIN = HTTP_SERVER + 'pms.pesuser.loginfromserver/global';

var HTTP_LOGOUT = HTTP_SERVER + 'pms.pesuser.logoutfromserver/global';

var HTTP_GET_USERINFO = HTTP_SERVER + 'pms.pesuser.getpesuserbytokenfromserver/global';

var HTTP_MODIFY_PASSWORD = HTTP_SERVER + 'pms.pesuser.updatepasswordfromserver/global';

var HTTP_GET_APPLY_LIST = HTTP_SERVER + 'pms.purchase.getapplybypagefromserer/global';

var HTTP_ADD_NEW_APPLY = HTTP_SERVER + 'pms.purchase.createapplyfromserver/global';

var HTTP_UPLOAD_FILE_PART1 = HTTP_SERVER + 'system.common.uploadfileurl/global/~~/';

var HTTP_UPLOAD_FILE_PART2 = '/file';

var HTTP_GET_APPLY_DETAIL = HTTP_SERVER + 'pms.purchase.getapplybyidfromserver/global';

var HTTP_EDIT_APPLY = HTTP_SERVER + 'pms.purchase.updateapplyfromserver/global';

var HTTP_SUBMIT_APPLY_AGAIN = HTTP_SERVER + 'pms.purchase.resetapplyfromserver/global';

var HTTP_DEAL_APPLY = HTTP_SERVER + 'pms.purchase.reviewapplyfromserver/global';

var HTTP_ADD_BUY_NUMBER = HTTP_SERVER + 'pms.purchase.createapplyoutfromserver/global';

var HTTP_EDIT_BUY_NUMBER = HTTP_SERVER + 'pms.purchase.updateapplyoutfromserver/global';

var HTTP_DELETE_BUY_NUMBER = HTTP_SERVER + 'pms.purchase.deleteapplyoutfromserver/global';

function muiPost(url, dataObject, successFun, errorFun) {
	var jsonStr = JSON.stringify(dataObject);
	console.log('url:' + url + ', data:' + jsonStr);
	mui.ajax(url, {
		async: true,
		data: jsonStr,
		type: 'post',
		headers: { 'Content-Type': 'application/json' },
		dataType: 'json',
		timeout: HTTP_TIMEOUT,
		success: successFun,
		error: errorFun ? defaultError : errorFun
	});
};

function muiPostHeader(url, headerObject, successFun, errorFun) {
	console.log('url:' + url + ', header:' + JSON.stringify(headerObject));
	mui.ajax(url, {
		async: true,
		type: 'post',
		dataType: 'json',
		headers: headerObject,
		timeout: HTTP_TIMEOUT,
		success: successFun,
		error: errorFun ? errorFun : defaultError
	});
};

function muiPostDataWithAuthorization(url, dataObject, successFun, errorFun) {
	muiPostDataAndHeader(url, HTTP_AUTHORIZATION_HEADER, dataObject, successFun, errorFun);	
};

function muiPostDataAndHeader(url, headerObject, dataObject, successFun, errorFun) {
	var dataJson = JSON.stringify(dataObject);
	console.log('url:' + url + ', header:' + JSON.stringify(headerObject) +
		', data:' + dataJson);
	mui.ajax(url, {
		async: true,
		data: dataJson,
		type: 'post',
		dataType: 'json',
		headers: headerObject,
		timeout: HTTP_TIMEOUT,
		success: successFun,
		error: errorFun ? errorFun : defaultError
	});
};

function defaultError(xhr, type, errorThrown) {
	console.log('type:' + type + ', xhr:' + xhr.responseText + ', errorThrown=' + errorThrown);
};