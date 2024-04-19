"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var is_url_1 = __importDefault(require("is-url"));
var crypto_1 = __importDefault(require("crypto"));
function default_1(data) {
    // data = 'https://url.images'
    var validFormatedUrlString = typeof data === 'string' && (0, is_url_1.default)(data);
    if (validFormatedUrlString) {
        return {
            code: 1,
            data: [data],
        };
    }
    // data = ['https://', 'http://', 'https://']
    var isArrayOfUrlString = data.every(is_url_1.default);
    if (isArrayOfUrlString) {
        return {
            code: 1,
            data: data,
        };
    }
    // data = [{ filename: 'asda.jpg', url: 'https://' }, { filename: 'asda.jpg', url: 'https://'}]
    var isObjectWithUrl = data.every(function (value) {
        return value.filename && (0, is_url_1.default)(value.url);
    });
    if (isObjectWithUrl) {
        return {
            code: 2,
            data: data,
        };
    }
    // data = [{ filename: 'asda.jpg', buffer: Buffer }, { filename: 'asda.jpg', buffer: Buffer }]
    var isObjectWithBuffer = data.every(function (value) {
        return value.filename && Buffer.isBuffer(value.buffer);
    });
    if (isObjectWithBuffer) {
        return {
            code: 3,
            data: data,
        };
    }
    // data = [ Buffer, Buffer, Buffer ]
    var isArrayOfBuffer = data.every(function (value) {
        return Buffer.isBuffer(value.buffer);
    });
    if (isArrayOfBuffer) {
        return {
            code: 3,
            data: data.map(function (buffer) {
                return {
                    filename: crypto_1.default.randomUUID() + '.jpg',
                    buffer: buffer,
                };
            }),
        };
    }
    // data = Buffer
    var isBuffer = Buffer.isBuffer(data);
    if (isBuffer) {
        return {
            code: 3,
            data: [
                {
                    filename: crypto_1.default.randomUUID() + '.jpg',
                    buffer: data,
                },
            ],
        };
    }
    return {
        code: 0,
        data: [],
    };
}
exports.default = default_1;
