"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var form_data_1 = __importDefault(require("form-data"));
var Imgbox = /** @class */ (function () {
    function Imgbox() {
        var _this = this;
        this.setConfig = function (csrf, cookie) {
            _this.csrf = csrf;
            _this.cookie = cookie;
        };
        this.getToken = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, config, response, result, token_id, token_secret, gallery_id, gallery_secret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            gallery: true,
                            gallery_title: '',
                            comments_enabled: 0,
                        };
                        config = {
                            headers: {
                                'X-CSRF-Token': this.csrf,
                                Cookie: this.cookie,
                            },
                        };
                        this.config = config;
                        return [4 /*yield*/, this.client.post('/ajax/token/generate', data, config)];
                    case 1:
                        response = _a.sent();
                        result = response.data;
                        if (!result.ok)
                            throw new Error(result.message);
                        token_id = result.token_id, token_secret = result.token_secret, gallery_id = result.gallery_id, gallery_secret = result.gallery_secret;
                        this.token = { token_id: token_id, token_secret: token_secret, gallery_id: gallery_id, gallery_secret: gallery_secret };
                        return [2 /*return*/];
                }
            });
        }); };
        this.getAuthenticityToken = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, csrf, cookie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/')];
                    case 1:
                        response = _a.sent();
                        csrf = response.data
                            .split('input name="authenticity_token" type="hidden" value="')[1]
                            .split('"')[0];
                        cookie = (response.headers['set-cookie'] && response.headers['set-cookie'][1].split(';')[0]) + '; request_method=POST';
                        this.setConfig(csrf, cookie);
                        return [2 /*return*/];
                }
            });
        }); };
        this.upload = function (images) { return __awaiter(_this, void 0, void 0, function () {
            var form, _i, images_1, image, config, data, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        form = new form_data_1.default();
                        form.append('token_id', this.token.token_id);
                        form.append('token_secret', this.token.token_secret);
                        form.append('content_type', 2);
                        form.append('thumbnail_size', '100c');
                        form.append('gallery_id', this.token.gallery_id);
                        form.append('gallery_secret', this.token.gallery_secret);
                        form.append('comments_enabled', 0);
                        for (_i = 0, images_1 = images; _i < images_1.length; _i++) {
                            image = images_1[_i];
                            form.append('files[]', image.buffer, image.filename);
                        }
                        config = {
                            headers: __assign(__assign(__assign({}, form.getHeaders()), this.config.headers), { 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0', 'X-Requested-With': 'XMLHttpRequest', Origin: 'https://imgbox.com', Accept: 'application/json, text/javascript, */*; q=0.01', 'Accept-Language': 'en-US,en;q=0.5', 'Accept-Encoding': 'gzip, deflate, br', DNT: 1, Connection: 'keep-alive', Referer: 'https://imgbox.com/', 'Sec-GPC': 1 }),
                            maxContentLength: Infinity,
                            maxBodyLength: Infinity,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.post('/upload/process', form, config)];
                    case 2:
                        data = (_a.sent()).data;
                        result = __assign({ ok: true, gallery_edit: "https://imgbox.com/gallery/edit/".concat(this.token.gallery_id, "/").concat(this.token.gallery_secret) }, data);
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [2 /*return*/, {
                                ok: false,
                                message: error_1.message,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // IDK what kind of type definition I had to fill in this function
        // Dear future me forgive meeee :'<
        this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAuthenticityToken()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getToken()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.upload];
                }
            });
        }); };
        this.client = axios_1.default.create({ baseURL: 'https://imgbox.com' });
    }
    return Imgbox;
}());
exports.default = Imgbox;
