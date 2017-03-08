(function () {
    /**
	 *var STATUS_APPLYING_COLOR = '#7cc0f8';
     var STATUS_REFUSE_COLOR = '#ff847b';
     var STATUS_PASS_COLOR = '#28d8a5';
     var STATUS_READY_COLOR = '#ffc926';
     var STATUS_FINISH_COLOR = '#4fc3ff';
     var STATUS_GIVE_UP_COLOR = '#f989c0';
     var STATUS_FINANCE_CHECKING_COLOR = '#f989c0';
     * @type {[*]}
     */
	var bgColorList = ['#7cc0f8', '#ff847b', '#28d8a5', '#ffc926', '#4fc3ff', '#f989c0'];
    var detailNum = -1;
    var detailList = new Array();
    var sharePersonList = new Array();
    var notifyDiv;
    var attachmentImgList = new Array();
    var saveUrls = [];
    var applyTitileInput, applyMarkInput, totalPriceSpan;
    var shareUserList = [];
    mui.plusReady(function() {
        initViews();
        initAction();
    });

    function initAction() {
        document.getElementById('addAttachmentImg').addEventListener('click', selectPicture);
        document.getElementById('addNotifyImg').addEventListener('click', function() {
            muiOpenWindowWithoutWaiting('share-person.html', { shareList: sharePersonList })
        });
        document.getElementById('addDetailDiv').addEventListener('click', addNewDetail);
        document.getElementById('submit').addEventListener('click', submitApply);
        window.addEventListener('addNewDetail', createNewDetail);
        window.addEventListener('addNewSharePerson', addNewSharePerson);
    };

    function selectPicture() {
        plus.gallery.pick(
            function(file) {
                var name = getUploadFileName(file);
                console.log(name);
                if(file.size > 5 * 1024 * 1024) {
                    return mui.toast('附件不能超过5M,请重新选择');
                }
                attachmentImgList.push(file);
                var img = document.createElement('img');
                img.src = file;
                var imgList = document.getElementById('attachmentList');
                imgList.insertBefore(img, imgList.firstChild);
            },
            function(e) {
                console.log('pick image error' + e);
            }, {});
    };

    function submitApply() {
        if(applyTitileInput.value.trim() == '') {
            return mui.toast('采购事由不能为空');
        }

        if(detailList.length == 0) {
            return mui.toast('采购明细不能为空');
        }

        if(attachmentImgList.length > 0) {
            uploadImage();
        } else {
            uploadNewApply();
        }
    };

    function uploadImage(){
        for(var i in attachmentImgList){
            var f = attachmentImgList[i];
            var fileName = getUploadFileName(f);
            var url = HTTP_UPLOAD_FILE_PART1 + fileName + HTTP_UPLOAD_FILE_PART2;
            var task = plus.uploader.createUpload(url, {method:'post',blocksize:204800,priority:100 }, uploadFileSuccess);
            task.setRequestHeader('authorization', localStorage.getItem(KEY_TOKEN));
            task.setRequestHeader('Content-Type', 'Multipart/form-data');
            task.addFile(f, {key:fileName});
            task.start();
        };
        uploadNewApply();
    };

    function uploadFileSuccess(response){
        var result = JSON.parse(response.responseText);
        console.log('image upload:' + JSON.stringify(result));
        if(result.result == '1') {
            saveUrls.push(result.saveUrls);
            console.log('image upload success:' + JSON.stringify(result.data));
        } else {
            mui.toast('上传文件失败');
        }
    };

    function getUploadFileName(file){
        return file.substr(file.lastIndexOf('/') + 1, file.lastIndexOf('.'));
    };

    function uploadNewApply(){
        var applyInfo = {
            title : applyTitileInput.value,
            total : totalPriceSpan.innerText,
            remark : applyMarkInput.value,
            fileUrl : saveUrls,
            batchNo : new Date().getFullYear()
        };

        var uploadInfo = {
            jsonObjectApply:applyInfo,
            jsonArrayApplyItem : detailList,
            jsonArrayShareUserAccounts : shareUserList
        };
        muiPostDataWithAuthorization(HTTP_ADD_NEW_APPLY, uploadInfo, addNewApplySuccess);
    };

    function addNewApplySuccess(response) {
        console.log('add new apply: ' + JSON.stringify(response));
        if(response.result == HTTP_RESULT_SUCCESS) {
            mui.alert('提交成功', '成功', '确定', function(){
                mui.back();
            });
        }
    };

    function initViews() {
        notifyDiv = document.getElementById('notify');
        applyTitileInput = document.getElementById('applyTitle');
        applyMarkInput = document.getElementById('applyMark');
        totalPriceSpan = document.getElementById('totalPrice');
    };

    function addNewSharePerson(result) {
        var datas = result.detail.data;
        console.log('share person result size=' + datas.length);
        sharePersonList.splice(0, sharePersonList.length);
        Array.prototype.push.apply(sharePersonList, datas);
        removeElementNodeBeforeIndex(notifyDiv, notifyDiv.childElementCount - 1);
        for(var i in datas) {
            var person = datas[i];

            var div = document.createElement('div');
            div.className = 'share-person-avatar';
			div.style.backgroundColor = bgColorList[Math.floor(Math.random() * 6)];
            var label = document.createElement('label');
            label.className = 'share-person-text';
            label.innerText = person.name;
         	div.appendChild(label);
         	
            notifyDiv.insertBefore(div, notifyDiv.firstChild);
        }
    };

    function addNewDetail() {
        goToNewDetail('');
    };

    function goToNewDetail(data) {
        mui.openWindow({
            url: 'product-details.html',
            waiting: {
                autoShow: false,
            },
            extras: {
                content: data
            }
        });
    };

    function createNewDetail(event) {
        console.log('createNewDetail->' + JSON.stringify(event.detail.data));
        addNewDetailToList(event.detail.data);
        createNewDetailUi();
    };

    function addNewDetailToList(detail) {
        detailList.push(detail);
    };

    function createNewDetailUi() {
        var detailNum = detailList.length - 1;
        var detailDiv = document.getElementById('detailList');
        var div = document.createElement('div');
        div.id = detailNum;
        div.className = 'mui-input-row';
        var label = document.createElement('label');
        var titleStr = '采购明细' + (detailNum + 1);
        detailList[detailNum].title = titleStr;
        var htext = document.createTextNode(titleStr);
        label.appendChild(htext);
        var span = document.createElement('span');
        var nameInput = document.createTextNode('名称  ' + detailList[detailNum].productName);
        span.appendChild(nameInput);
        div.appendChild(label);
        div.appendChild(span);
        div.addEventListener('click', function() {
            goToNewDetail(detailList[this.id]);
        });
        detailDiv.appendChild(div);
    };

    function createDetailInput(labelText, placeHolder) {
        var div = document.createElement('div');
        div.className = 'mui-input-row';
        var label = document.createElement('label');
        var lt = document.createTextNode(labelText);
        label.appendChild(lt);
        div.appendChild(label);
        var input = document.createElement('input');
        input.className = 'mui-input';
        input.type = 'text';
        input.placeholder = placeHolder;
        div.appendChild(input);
        return div;
    };
})();
