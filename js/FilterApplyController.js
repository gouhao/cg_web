(function () {
    var selectedId = 'all';
    mui.plusReady(onPlusReady);

    function onPlusReady(){
        selectedId = plus.webview.currentWebview().extras.data;
        document.getElementById(selectedId).style.backgroundColor = 'gray';
        document.querySelector('.mui-content').addEventListener('tap', onClick, false);
        document.getElementById('table').addEventListener('touchstart', buttonTouch, false);
        document.getElementById('table').addEventListener('touchend', buttonTouch, false);
    };

    function buttonTouch(event) {
        if(event.type == 'touchstart'){
            document.getElementById(selectedId).style.backgroundColor = 'lightgray';
            document.getElementById(event.target.id).style.backgroundColor = 'gray';
        }
    };
    function onClick(event){
        var target = plus.webview.getWebviewById('myApply.html');
        mui.fire(target, 'selectedType', {data:event.target.id});
        mui.back();
    };
})();



