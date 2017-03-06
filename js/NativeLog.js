/**
 * Created by gouhao on 2017/3/3 0003.
 */
function NativeLog(plus, tag) {
    this.log = plus.android.importClass('android.util.NativeLog');
    this.tag = tag;
};

NativeLog.prototype.e = function (msg) {
    this.log.e(this.tag, msg);
};

NativeLog.prototype.i = function (msg) {
    this.log.i(this.tag, msg);
};

NativeLog.prototype.d = function (msg) {
    this.log.d(this.tag, msg);
};
