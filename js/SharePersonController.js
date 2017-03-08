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
//      var self = plus.webview.currentWebview();
//      if(self.shareList.length > 0) {
//          Array.prototype.push.apply(selectedIds, self.shareList);
//      }
        getContacts(function (result) {
            if(result == HTTP_RESULT_SUCCESS) {
                consoleLog(TAG, 'get database success');
                dealPerson();
                folderDepartment.push(parentDepartment);
                initUi();
                initAction();
            } else {
                consoleLog(TAG, 'get database error');
            }
        });


    };

    function dealPerson() {
        var dataList = [];
      for(var i in areaList) {
          var item = areaList[i];
          var department = new Department(item);
          for(var j = 0; j < personList.length; j++) {
              var subItem = personList[j];
              if(subItem.orgStructure == item.codeName) {
                  department.personList.push(subItem);
              }
          };
          dataList.push(department);
      }
      dealArea(dataList)
    };

    function dealArea(dataList) {
      for(var i in dataList) {
          var item = dataList[i];
          for(var j in dataList) {
              if(dataList[j].parentCode == item.codeName) {
                  item.sonDepartmentList.push(dataList[j]);
              }
          }
      }

      for(var k in dataList) {
          if(!dataList[k].parentCode) {
              parentDepartment.sonDepartmentList.push(dataList[k]);
              return;
          }
      }
    };

    function getContacts(callback) {
        var database = new GetPersonListWorker();consoleLog(TAG, 'get area list');
        database.getAreaList(function (result) {
           if(result.length > 0) {
               consoleLog(TAG, 'area list length: ' + result.length);
               areaList = result;
               database.getPersonList(function (result) {
                   if(result.length > 0) {
                       consoleLog(TAG, 'person list length: ' + result.length);
                       personList = result;
                       if(callback) {
                           callback(HTTP_RESULT_SUCCESS);
                       }
                   } else {
                       if(callback) {
                           callback(HTTP_RESULT_ERROR);
                       }
                   }
               });
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
                if(folderDepartment.length > 1) {
                    createFolderDepartment();
                }
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
            label.innerText = item.name;
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
            while(folderDepartment[folderDepartment.length - 1].id != id) {
                folderDepartment.pop();
            }
        }

        if(folderDepartment.length > 1) {
            createFolderDepartment();
        } else {
            removeElementNode(folderDepartmentDiv);
            folderDepartmentDiv.style.display = 'none';
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
                selectedIds.push(this.value);
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
            if(selectedIds[i] == item) {
                return true;
            }
        }
        return false;
    };
    function removeSelectId(id) {
        for(var i in selectedIds) {
            var t = selectedIds[i];
            if(t == id){
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

    function createTestDepartmentData() {
        parentDepartment.id = 1;
        parentDepartment.name = '联系人';

        var d1 = new Department;
        d1.id = 4;
        d1.name = '西安分公司';

        var d2 = new Department;
        d2.id = 5;
        d2.name = '郑州总公司';

        var item1 = new Department;
        item1.id = 2;
        item1.name = 'APK组';
        for (var i = 10; i < 20; i++) {
            var person = new Person;
            person.id = i;
            person.name = 'APK Person' + (i - 10);
            item1.personList.push(person);
        }
        var item2 = new Department;
        item2.id = 3;
        item2.name = 'ROM组';
        for (var i = 20; i < 30; i++) {
            var person = new Person;
            person.id = i;
            person.name = 'ROM Person' + (i - 20);
            item2.personList.push(person);
        }
        d1.sonDepartmentList.push(item1);
        d1.sonDepartmentList.push(item2);

        parentDepartment.sonDepartmentList.push(d2);
        parentDepartment.sonDepartmentList.push(d1);
    };

})();
