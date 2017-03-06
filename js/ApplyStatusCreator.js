/**
 * Created by gouhao on 2017/3/2 0002.
 */

var STATUS_APPLYING_COLOR = '#7cc0f8';
var STATUS_REFUSE_COLOR = '#ff847b';
var STATUS_PASS_COLOR = '#28d8a5';
var STATUS_READY_COLOR = '#ffc926';
var STATUS_FINISH_COLOR = '#4fc3ff';
var STATUS_GIVE_UP_COLOR = '#f989c0';
var STATUS_FINANCE_CHECKING_COLOR = '#f989c0';


var STATUS_APPLYING_TEXT = '审批中';
var STATUS_REFUSE_TEXT = '已拒绝';
var STATUS_PASS_TEXT = '已通过';
var STATUS_READY_TEXT = '备案中';
var STATUS_FINISH_TEXT = '已完结';
var STATUS_GIVE_UP_TEXT = '已撤销';

function getStatusColor(status) {
    switch(status) {
        case 1:
            return STATUS_APPLYING_COLOR;
            break;
        case 2:
            return STATUS_REFUSE_COLOR;
            break;
        case 3:
            return STATUS_PASS_COLOR;
            break;
        case 4:
            return STATUS_FINANCE_CHECKING_COLOR;
            break;
        case 5:
            return STATUS_READY_COLOR;
            break;
        case 6:
            return STATUS_GIVE_UP_COLOR;
            break;
        default:
            return STATUS_APPLYING_COLOR;
    }
};

function getStatusText(status) {
    switch(status) {
        case 1:
            return STATUS_APPLYING_TEXT;
            break;
        case 2:
            return STATUS_REFUSE_TEXT;
            break;
        case 3:
            return STATUS_PASS_TEXT;
            break;
        case 4:
            return STATUS_FINANCE_CHECKING_TEXT;
            break;
        case 5:
            return STATUS_READY_TEXT;
            break;
        case 6:
            return STATUS_GIVE_UP_TEXT;
            break;
        default:
            return STATUS_APPLYING_TEXT;
    }
};
