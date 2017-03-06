var accountInput, passwordInput;
mui.init();

mui.plusReady(onPlusReady);

function onPlusReady(){
	initUi();
	initAction();
};

function initUi(){
	accountInput = document.getElementById('account');
	passwordInput = document.getElementById('passwordInput');
};

function initAction(){
	document.getElementById('commit').addEventListener('click', commitAccount);
};


function commitAccount(){
	muiOpenWindowWithoutWaiting('modify-guesture-password.html');
};



