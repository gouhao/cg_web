/**
 * Created by gouhao on 2017/3/7 0007.
 */

function Database() {
    this.TAG = 'Database';
    this.TABLE_AREA = 'table_area';
    this.TABLE_PERSON = 'table_person';
    this.TABLE_DATA = 'table_data';
    this.version = 1;
    this.dbName = 'cgg';
    this.READ_WRITE = 'readwrite';
    this.READ_ONLY = 'readonly';
    this.indexedDb = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
};

Database.prototype.initDatabase = function (callback) {
    var request = this.indexedDb.open(this.dbName, this.version);
    var success = function (event) {
        if (callback) {
            callback.call(this, event.target.result);
        }
    };
    var fs = success.bind(this);
    request.onsuccess = fs;

    var updateDb = function (e) {
        var newDb = e.target.result;
        if (!newDb.objectStoreNames.contains(this.TABLE_DATA)) {
            newDb.createObjectStore(this.TABLE_DATA, {autoIncrement: true});
        }
    };
    var uT = updateDb.bind(this);
    request.onupgradeneeded = uT;
};

Database.prototype.openDatabase = function (callback) {
    var request = this.indexedDb.open(this.dbName, this.version);
    var fError = this.defaultDatabaseError.bind(this);
    request.onerror = fError;

    var suc = function (event) {
        callback.call(this, event.target.result);
    };
    var fSuc = suc.bind(this);
    request.onsuccess = fSuc;
};

Database.prototype.defaultDatabaseError = function (event) {
    consoleLog(this.TAG, 'database request error');
};

Database.prototype.defaultDatabaseSuccess = function (event) {
    consoleLog(this.TAG, 'database request success');
};


