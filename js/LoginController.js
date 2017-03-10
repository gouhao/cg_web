/**
 * Created by gouhao on 2017/3/7 0007.
 */

(function () {
    var TAG = 'LoginController';
    var loginInfo;

    mui.init({
        keyEventBind: {
            backbutton: false,
            menubutton: false
        },
    });
    mui.plusReady(function() {

        var accountInput = document.getElementById('accountInput');
        var passwordInput = document.getElementById('passwordInput');
        document.getElementById('btnLogin').addEventListener('tap', login);
        var loginProgress = document.getElementById('loginProgress');

        loginFromLocal();
    });

    function loginFromLocal() {
        if(localStorage.getItem(KEY_ACCOUNT)){
            console.log('login from local');
            accountInput.value = localStorage.getItem(KEY_ACCOUNT);
            passwordInput.value = localStorage.getItem(KEY_PASSWORD);
            login();
        }
    };
    function login() {
        loginInfo = {
            account: accountInput.value,
            password: passwordInput.value
        };
        if(checkInput()) {
            muiPost(HTTP_LOGIN, loginInfo, loginSuccess);
        }
    };

    function checkInput() {
        if(loginInfo.account.length < 6) {
            mui.toast('账号最短为6位');
            return false;
        }
        if(loginInfo.password.length < 6) {
            mui.toast('密码最短为6位');
            return false;
        }
        return true;
    }



    function loginSuccess(data) {
        if(data.result == HTTP_RESULT_SUCCESS) {
            localStorage.setItem(KEY_ACCOUNT, loginInfo.account);
            localStorage.setItem(KEY_PASSWORD, loginInfo.password);
            localStorage.setItem(KEY_TOKEN, data.data);

            console.log('UserToken:' + data.data);
            if(!localStorage.getItem(KEY_IS_GET_PERSON_LIST)) {
                new CreatePersonListWorker(getContactResult).start();
            } else {
                goToMain();
            }

        } else {
            console.log(data.errInfo);
            mui.alert('账号或密码错误', '登录失败');
        }
    };

    function goToMain() {
        checkYear();
        muiOpenWindowWithoutWaiting('main.html');
        accountInput.value = '';
        passwordInput.value = '';
    };

    function checkYear() {
      if(!localStorage.getItem(KEY_YEAR)) {
          localStorage.setItem(KEY_YEAR, new Date().getFullYear());
      }
    };
    function getContactResult(result) {
        if(result == HTTP_RESULT_SUCCESS) {
            localStorage.setItem(KEY_IS_GET_PERSON_LIST, true);
            goToMain();
        }
    };
})();
