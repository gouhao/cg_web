/**
 * Created by gouhao on 2017/3/7 0007.
 */
(function () {
    var TAG = 'SharePersonController';

    var parentDepartment = new Department();
    var currentDepartment;
    var contactsDiv;
    var folderDepartment = new Array();
    var folderDepartmentDiv;
    var selectedIds = new Array();
    var areaList, personList;

    mui.init({
        beforeback:onBack
    });

    function onBack() {
      parentDepartment = null;
      currentDepartment = null;
      areaList = null;
      personList = null;
    };
    mui.plusReady(function() {
        mui('.mui-scroll-wrapper').scroll({
            indicators: true
        });
        initData();

    });

    function initAction() {
        document.getElementById('commit').addEventListener('click', commit);
    };

    function commit() {
        if(selectedIds.length > 0) {
            var targetWebview = plus.webview.getWebviewById('start-apply.html');
            mui.fire(targetWebview, 'addNewSharePerson', {data:selectedIds});
            mui.back();
        } else {
            mui.alert('请选择要共享的人', '未选择共享人');
        }
    };

    function initData() {
     var self = plus.webview.currentWebview();
        var shareList = self.extras.shareList;
        if(shareList.length > 0) {
         Array.prototype.push.apply(selectedIds, shareList);
     }
        parentDepartment.id = '1';
        parentDepartment.description = '组织架构';
        getContacts(function (result) {
            if(result == HTTP_RESULT_SUCCESS) {
                consoleLog(TAG, 'get database success');
                folderDepartment.push(parentDepartment);
                initUi();
                initAction();
            } else {
                consoleLog(TAG, 'get database error');
            }
        });


    };

    function getContacts(callback) {
        var database = new GetPersonListWorker();
        database.getAreaList(function (result) {
           if(result) {
               parentDepartment = result;
               if(callback) {
                   callback(HTTP_RESULT_SUCCESS);
               }
           }  else {
               if(callback) {
                   callback(HTTP_RESULT_ERROR);
               }
           }
        });
    };
    function initUi() {
        contactsDiv = document.getElementById('contactsList');
        folderDepartmentDiv = document.getElementById('folderDepartment');

        currentDepartment = parentDepartment;
        document.querySelector('.mui-loading').style.display = 'none';
        createDepartmentUi(parentDepartment);
    };

    function createDepartmentUi(item) {
        removeElementNode(contactsDiv);
        for (var j in item.sonDepartmentList) {
            var li = createLiItem(item.sonDepartmentList[j].description);
            li.id = j;
            li.addEventListener('click', function() {
                currentDepartment = currentDepartment.sonDepartmentList[this.getAttribute('id')];
                createDepartmentUi(currentDepartment);
                folderDepartment.push(currentDepartment);
                createFolderDepartment();
            });
            contactsDiv.appendChild(li);
        }
        for (var i in item.personList) {
            contactsDiv.appendChild(createCheckboxItem(
                item.personList[i]));
        }
    };

    function createFolderDepartment() {
        removeElementNode(folderDepartmentDiv);
        folderDepartmentDiv.style.display = 'block';
        for(var i in folderDepartment) {
            var item = folderDepartment[i];

            var label = document.createElement('label');
            label.id = item.id;
            label.innerText = item.description;
            label.addEventListener('click', function(){
                var id = this.getAttribute('id');
                if(id != folderDepartment[folderDepartment.length - 1].id) {
                    removeFolderDepartmentDiv(id);
                }
            });
            if(i > 0) {
                var t = document.createElement('label');
                t.innerText = '>';
                folderDepartmentDiv.appendChild(t);
            }
            folderDepartmentDiv.appendChild(label);

        }
    };

    function removeFolderDepartmentDiv(id) {
        if(id != -1) {
            while(folderDepartment.length > 1 && folderDepartment[folderDepartment.length - 1].id != id) {
                folderDepartment.pop();
            }
        }

        if(folderDepartment.length > 1) {
            createFolderDepartment();
        } else {
            removeElementNode(folderDepartmentDiv);
        }

        currentDepartment = folderDepartment[folderDepartment.length - 1];
        createDepartmentUi(currentDepartment);
    };

    function createCheckboxItem(item) {
        var div = document.createElement('div');
        div.className = 'mui-input-row mui-checkbox mui-right';

        var label = document.createElement('label');
        label.innerText = item.name;

        var checkBox = document.createElement('input');
        checkBox.name = 'checkbox';
        checkBox.type = 'checkbox';
        checkBox.value = item.id;
        if(containsSelectedItem(item.id)) {
            checkBox.checked = true;
        }
        checkBox.addEventListener('click', function(){
            if(this.checked) {
                selectedIds.push(item);
            } else {
                removeSelectId(this.value);
            }
        });
        div.appendChild(label);
        div.appendChild(checkBox);
        return div;
    };

    function containsSelectedItem(item) {
        for(var i in selectedIds) {
            if(selectedIds[i].id == item) {
                return true;
            }
        }
        return false;
    };
    function removeSelectId(id) {
        for(var i in selectedIds) {
            var t = selectedIds[i];
            if(t.id == id){
                selectedIds.splice(i, 1);
                return;
            }
        }
    };
    function createLiItem(liText) {
        var li = document.createElement('li');
        li.className = 'mui-table-view-cell';
        li.style.listStyleType = 'none';
        li.style.listStylePosition = 'inside';
        li.innerText = liText;
        return li;
    };

})();
