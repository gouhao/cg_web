(function () {
    var TAG = 'MainController';
    var isShowMenu;
    var slideMenuWrapper;
    var slideMenu;
    var slider;
    var usernameDiv, policeCodeSpan;

    var user;

    var waitDealCountLabel, waitBuyCountLabel, notifyCountLabel;

    function getUserInfo(){
        muiPostDataWithAuthorization(HTTP_GET_USERINFO, '', getUserInfoSuccess);
    };

    function getUserInfoSuccess(response) {
        if(response.result == HTTP_RESULT_SUCCESS) {
            user = response.data;
            usernameDiv.innerText = user.name;
            policeCodeSpan.innerText = user.account;
        } else {
            console.log('get user info error:' + response.errInfo);
        }
    };

    mui.init({
        beforeback: onBack
    });

    var backButtonPress = 0;
    function onBack() {
        if(isShowMenu) {
            isShowMenu = !isShowMenu;
            slideMenuWrapper.offCanvas('close');
            return false;
        }
        backButtonPress++;
        if(backButtonPress > 1) {
            plus.runtime.quit();
        } else {
            plus.nativeUI.toast('再按一次退出应用');
        }
        setTimeout(function() {
            backButtonPress = 0;
        }, 1000);
        return false;
    };

    mui.plusReady(function() {
        initUi();
        initAction();
        getUserInfo();
        getNotifyMessageList();
        getPushMessageCount();
    });

    function getPushMessageCount() {
        muiPostDataWithAuthorization(HTTP_QUERY_PUSH_MESSAGE, '', getPushMessageSuccess);
    };

    function getPushMessageSuccess(response) {
      consoleLog(TAG, 'get push message:' + JSON.stringify(response));
      if(response.result == HTTP_RESULT_SUCCESS) {
          updatePushMessageUi(response.data);
      } else {
          consoleLog(TAG, 'get push message error');
      }
    };

    function updatePushMessageUi(data) {
        if(data.totalNum > 0) {
            waitDealCountLabel.style.display = 'block';
            waitDealCountLabel.innerText = data.totalNum;
        }

        if(data.myAttentionNum > 0) {
            waitBuyCountLabel.style.display = 'block';
            waitBuyCountLabel.innerText = data.myAttentionNum;
        }

    };

    function getNotifyMessageList() {
        var data = {
            currentPage:1,
            pageSize:10,
            messageType:'CgAppPn'
        };
        muiPostDataWithAuthorization(HTTP_QUERY_NOTIFY_MESSAGE_LIST, data, getNotifyMessageListSuccess)
    };

    function getNotifyMessageListSuccess(response){
        consoleLog(TAG, 'get notify message:' + JSON.stringify(response));
        if(response.result == HTTP_RESULT_SUCCESS) {
            updateNotifyMessageUi(response.data);
        } else {
            consoleLog(TAG, 'get notify message list error');
        }
    };

    function updateNotifyMessageUi(data) {
        if(data.totalRecord > 0) {
            notifyCountLabel.style.display = 'block';
        }
    };

    function initUi(){
        slideMenuWrapper = mui('#slideMenuWrapper');
        slideMenu = mui('#mainContent');
        isShowMenu = false;

        slider = mui('#slider');
        slider.slider({
            interval: 2000
        });
        mui('.mui-scroll-wrapper').scroll({ indicators: false });
        mui('.mui-slider-group').on('tap', '.mui-slider-item', function() {
            var id = this.getAttribute('id');
            plus.nativeUI.toast('click ' + id);
        });

        usernameDiv = document.getElementById('username');
        policeCodeSpan = document.getElementById('policeCode');

        waitDealCountLabel = document.getElementById('waitDealCount');
        waitBuyCountLabel = document.getElementById('waitBuyCount');
        notifyCountLabel = document.getElementById('notifyCount');

    };
    function initAction() {
        mui('#menu').on('tap', '.mui-table-view-cell', menuClick);
        document.getElementById('meBtn').addEventListener('tap', function(event) {
            isShowMenu = !isShowMenu;
            if(isShowMenu) {
                slideMenuWrapper.offCanvas('show');
            } else {
                slideMenuWrapper.offCanvas('close');
            }
        });
        document.getElementById('messageBtn').addEventListener('tap', function(event) {
            muiOpenWindowWithoutWaiting('message.html');
        });
        document.getElementById('myApply').addEventListener('tap', function(event) {
            muiOpenWindowWithoutWaiting('myApply.html');
        });
        document.getElementById('waitMeDeal').addEventListener('tap', function(event) {
            muiOpenWindowWithoutWaiting('wait-my-apply.html', {from:FROM_APPLY_DEAL_PERSON});
        });
        document.getElementById('waitMeBuy').addEventListener('tap', function(event) {
            muiOpenWindowWithoutWaiting('wait-my-apply.html', {from:FROM_APPLY_BUY_PERSON});
        });
        document.getElementById('myShare').addEventListener('tap', function(event) {
            muiOpenWindowWithoutWaiting('share-me.html');
        });
        document.getElementById('buy').addEventListener('tap', function(event) {
            muiOpenWindowWithoutWaiting('start-apply.html');
        });
    }

    ;

    function menuClick() {
        switch(this.id) {
            case 'setting':
                muiOpenWindowWithoutWaiting('setting.html');
                break;
            case 'buyIntroduce':
                muiOpenWindowWithoutWaiting('buy-introduce.html');
                break;
            case 'about':
                muiOpenWindowWithoutWaiting('about.html');
                break;
            case 'checkVersion':
                showCheckVersionDialog();
                break;
            case 'quit':
                showQuitDialog();
                break;
        }
    }

    ;

    function showCheckVersionDialog() {
        var menu = ['立即升级', '下次再说'];
        mui.confirm('1.修改了Bug\n\n2.支持某某功能\n\n3.大量优化和稳定\n\n',
            '发现新版本', menu,
            function(e) {
                if(e.index == 0) {
                    mui.toast('update version');
                }
            });
    };

    function showQuitDialog() {
        var menu = ['取消', '确定'];
        mui.confirm('确定退出登录吗?',
            '退出登录', menu,
            function(e) {
                if(e.index == 1) {
                    logout();
                }
            });
    };

    function logout() {
        muiPostDataWithAuthorization(HTTP_LOGOUT,'',  logoutSuccess);
    };

    function logoutSuccess(data) {
        if(data.result == HTTP_RESULT_SUCCESS) {
            localStorage.removeItem(KEY_ACCOUNT);
            quit();
        } else {
            console.log(JSON.stringify(data));
            mui.toast('退出失败!');
        }
    };

    function storageChange(event) {
        console.log('storage change:' + event.key);
        if(event.key == KEY_ACCOUNT) {
            quit();
        }
    };

    function quit() {
        muiOpenWindowWithoutWaiting('login.html', {isQuit:true});
        plus.webview.currentWebview().close();
    };

})();
