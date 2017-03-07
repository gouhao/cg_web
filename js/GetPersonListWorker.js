/**
 * Created by gouhao on 2017/3/7 0007.
 */
function GetPersonListWorker() {
    Database.call(this);
};

GetPersonListWorker.prototype = new Database();

GetPersonListWorker.prototype.getAreaList = function () {
    var store = this.database.transaction(this.TABLE_AREA).objectStore(this.TABLE_AREA);
};

GetPersonListWorker.prototype.getPersonList = function () {

};