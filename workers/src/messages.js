"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sendSMS = require('./service/sms').sendSMS;
var _a = require('./service/orders'), updateOrder = _a.updateOrder, publishSuccess = _a.publishSuccess, publishFail = _a.publishFail;
var decodeMessage = require('./lib').decodeMessage;
//Subscribe events.
var newSMS = function (pub, client, channel, message) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, uuid, number, text, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                msg = decodeMessage(message);
                //Validate the message.
                if (!(msg != null && msg.uuid && msg.number && msg.text))
                    console.log('Bad message format:', message);
                uuid = msg.uuid, number = msg.number, text = msg.text;
                return [4 /*yield*/, sendSMS(uuid, number, text)];
            case 1:
                result = _a.sent();
                console.log('SMS send result:', result);
                //Record in cache the operation status.  
                return [4 /*yield*/, updateOrder(client, uuid, 'OK')];
            case 2:
                //Record in cache the operation status.  
                _a.sent();
                //Publish in a queue.
                publishSuccess(client, uuid);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                //Detect sms sent exception.
                if (err_1 && err_1.status && err_1.status === 'SENT_ERROR')
                    publishFail(client, err_1.uuid);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var smsSendOk = function (message) {
};
var smsSendFail = function (message) {
};
module.exports = {
    newSMS: newSMS,
    smsSendOk: smsSendOk,
    smsSendFail: smsSendFail
};
