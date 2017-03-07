var oldPasswordInput, newPasswordInput, commitPasswordInput;
var newPassword;
mui.init();
mui.plusReady(function(){
	initUi();
	initAction();
});

function initUi(){
	oldPasswordInput = document.getElementById('oldPassword');
	newPasswordInput = document.getElementById('newPassword');
	commitPasswordInput = document.getElementById('commitPassword');
};

function initAction(){
	document.getElementById('commit').addEventListener('click', commitModify);
};

function commitModify(){
	var oldValue = oldPasswordInput.value;
	var newValue = newPasswordInput.value;
	var commitValue = commitPasswordInput.value;
	
	if(oldValue.length < 6 || newValue.length < 6 || commitValue < 6) {
		return mui.alert('密码最少为6位');
	}
	if(newValue != commitValue) {
		return mui.alert('两次输入密码不一致');
	}
	newPassword = newValue;
	modifyToServer({oldpassword:oldValue, password:newValue});
};

function modifyToServer(data) {
	muiPostDataWithAuthorization(HTTP_MODIFY_PASSWORD, data, modifySuccess);
};

function modifySuccess(response) {
	if(response.result == HTTP_RESULT_SUCCESS) {
		localStorage.setItem(KEY_PASSWORD, newPassword);
		mui.alert('修改密码成功', '成功');
	} else {
		console.log('modify password error:' + response.errInfo);
		mui.alert(response.errInfo, '失败');
	}
};
