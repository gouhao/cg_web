(function () {
    mui.plusReady(onPlusReady);

    function onPlusReady(){
        initAction();
    };

    function initAction(){
        document.body.addEventListener('click', onClick, false);
    };

    function onClick(event){
        switch(event.target.id){
            case 'cancel':
                mui.back();
                break;
        }
    };
})();

