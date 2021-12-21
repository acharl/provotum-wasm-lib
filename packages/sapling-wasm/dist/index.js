/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./types */ "./src/types.ts"), exports);
__exportStar(__webpack_require__(/*! ./sapling */ "./src/sapling.ts"), exports);


/***/ }),

/***/ "./src/internal/decrypt.ts":
/*!*********************************!*\
  !*** ./src/internal/decrypt.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.__wasm__decrypt = void 0;
function __wasm__decrypt(encryptions, sealer, r, params, sk, pk, provotum) {
    return provotum.decrypt(encryptions, sealer, r, params, sk, pk);
}
exports.__wasm__decrypt = __wasm__decrypt;


/***/ }),

/***/ "./src/internal/init.ts":
/*!******************************!*\
  !*** ./src/internal/init.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.__wasm__initLib = void 0;
function __wasm__initLib(provotum) {
    return provotum.initLib();
}
exports.__wasm__initLib = __wasm__initLib;


/***/ }),

/***/ "./src/internal/keygen.ts":
/*!********************************!*\
  !*** ./src/internal/keygen.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.__wasm__keygen = exports.__wasm__setupElgamal = void 0;
function __wasm__setupElgamal(sk_as_string, provotum) {
    return provotum.setupElgamal(sk_as_string);
}
exports.__wasm__setupElgamal = __wasm__setupElgamal;
function __wasm__keygen(r, sealer, params, sk, pk, provotum) {
    return provotum.keygen(r, sealer, params, sk, pk);
}
exports.__wasm__keygen = __wasm__keygen;


/***/ }),

/***/ "./src/internal/utils.ts":
/*!*******************************!*\
  !*** ./src/internal/utils.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


/* Internal Utils */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.invalidTypeError = exports.rejectPromise = exports.uninitialized = exports.stringFrom = exports.numberFrom = exports.isHexString = exports.numberToBytes = exports.bufferFromOfLength = exports.bufferFrom = void 0;
// Buffer
function bufferFrom(value, name, expectedType) {
    if (Buffer.isBuffer(value)) {
        return value;
    }
    else if (isHexString(value)) {
        return Buffer.from(value, 'hex');
    }
    else if (typeof value === 'number') {
        return numberToBytes(value);
    }
    else if (typeof value !== 'string' && value !== undefined && value !== null) {
        return Buffer.from(value);
    }
    else {
        throw invalidTypeError(name, expectedType);
    }
}
exports.bufferFrom = bufferFrom;
function bufferFromOfLength(value, minLength, name, expectedType) {
    let buffer = bufferFrom(value, name, expectedType);
    if (minLength === undefined || minLength <= buffer.byteLength) {
        return buffer;
    }
    const leadingBuffer = Buffer.alloc(minLength - buffer.byteLength);
    leadingBuffer.fill(0);
    return Buffer.concat([leadingBuffer, buffer]);
}
exports.bufferFromOfLength = bufferFromOfLength;
function numberToBytes(number) {
    const buffer = Buffer.alloc(4);
    buffer.fill(0);
    buffer.writeInt32BE(number);
    let firstNonZero = 0;
    for (let i = 0; i < buffer.byteLength; i++) {
        if (buffer[0] !== 0x00) {
            firstNonZero = i;
            break;
        }
    }
    return firstNonZero > 0 ? buffer.slice(firstNonZero) : buffer;
}
exports.numberToBytes = numberToBytes;
// String
const hexRe = /^(0x)?[0-9a-fA-F]*$/;
function isHexString(string) {
    return typeof string === 'string' && hexRe.test(string);
}
exports.isHexString = isHexString;
// Number
function numberFrom(value, name, expectedType) {
    if (typeof value === 'number') {
        return value;
    }
    else if (typeof value === 'string') {
        return parseInt(value);
    }
    else {
        throw invalidTypeError(name, expectedType);
    }
}
exports.numberFrom = numberFrom;
function stringFrom(value, name, expectedType) {
    if (typeof value === 'string') {
        return value;
    }
    else if (typeof value === 'number' || typeof value === 'bigint') {
        return value.toString();
    }
    else {
        throw invalidTypeError(name, expectedType);
    }
}
exports.stringFrom = stringFrom;
// Error
function uninitialized() {
    throw new Error('sapling-wasm uninitialized');
}
exports.uninitialized = uninitialized;
async function rejectPromise(methodName, error) {
    return Promise.reject(typeof error === 'string' ? `${methodName}: ${error}` : error);
}
exports.rejectPromise = rejectPromise;
function invalidTypeError(name, expectedType) {
    return name !== undefined && expectedType !== undefined
        ? new Error(`\`${name}\` is of invalid type, expected ${expectedType}`)
        : new TypeError();
}
exports.invalidTypeError = invalidTypeError;


/***/ }),

/***/ "./src/sapling.ts":
/*!************************!*\
  !*** ./src/sapling.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decrypt = exports.keygen = exports.setupElgamal = exports.initLib = void 0;
const decrypt_1 = __webpack_require__(/*! ./internal/decrypt */ "./src/internal/decrypt.ts");
const init_1 = __webpack_require__(/*! ./internal/init */ "./src/internal/init.ts");
const keygen_1 = __webpack_require__(/*! ./internal/keygen */ "./src/internal/keygen.ts");
const utils_1 = __webpack_require__(/*! ./internal/utils */ "./src/internal/utils.ts");
const provotumPromise = Promise.resolve().then(() => __webpack_require__(/*! ../pkg */ "./pkg/index.js")).catch((error) => {
    console.error(error);
    throw new Error(`Could not load sapling-wasm: ${error}`);
});
async function initLib() {
    try {
        const provotum = await provotumPromise;
        return init_1.__wasm__initLib(provotum);
    }
    catch (error) {
        return utils_1.rejectPromise('initLibError', error);
    }
}
exports.initLib = initLib;
async function setupElgamal(sk_as_string) {
    try {
        const provotum = await provotumPromise;
        return keygen_1.__wasm__setupElgamal(sk_as_string, provotum);
    }
    catch (error) {
        return utils_1.rejectPromise('keygenError', error);
    }
}
exports.setupElgamal = setupElgamal;
async function keygen(r, sealer, params, sk, pk) {
    try {
        const provotum = await provotumPromise;
        return keygen_1.__wasm__keygen(r, sealer, params, sk, pk, provotum);
    }
    catch (error) {
        return utils_1.rejectPromise('keygenError', error);
    }
}
exports.keygen = keygen;
async function decrypt(encryptions, sealer, r, params, sk, pk) {
    try {
        const provotum = await provotumPromise;
        return decrypt_1.__wasm__decrypt(encryptions, sealer, r, params, sk, pk, provotum);
    }
    catch (error) {
        return utils_1.rejectPromise('keygenError', error);
    }
}
exports.decrypt = decrypt;


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./pkg/index.js":
/*!**********************!*\
  !*** ./pkg/index.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__wbg_error_09919627ac0992f5": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbg_error_09919627ac0992f5),
/* harmony export */   "__wbg_log_3445347661d4505e": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbg_log_3445347661d4505e),
/* harmony export */   "__wbg_log_d0e90c0768752c96": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbg_log_d0e90c0768752c96),
/* harmony export */   "__wbg_new_693216e109162396": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbg_new_693216e109162396),
/* harmony export */   "__wbg_stack_0ddaca5d1abfb52f": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbg_stack_0ddaca5d1abfb52f),
/* harmony export */   "__wbindgen_json_parse": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbindgen_json_parse),
/* harmony export */   "__wbindgen_json_serialize": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbindgen_json_serialize),
/* harmony export */   "__wbindgen_object_drop_ref": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbindgen_object_drop_ref),
/* harmony export */   "__wbindgen_throw": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.__wbindgen_throw),
/* harmony export */   "decrypt": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.decrypt),
/* harmony export */   "initLib": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.initLib),
/* harmony export */   "keygen": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.keygen),
/* harmony export */   "setupElgamal": () => (/* reexport safe */ _index_bg_js__WEBPACK_IMPORTED_MODULE_1__.setupElgamal)
/* harmony export */ });
/* harmony import */ var _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index_bg.wasm */ "./pkg/index_bg.wasm");
/* harmony import */ var _index_bg_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index_bg.js */ "./pkg/index_bg.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_index_bg_js__WEBPACK_IMPORTED_MODULE_1__, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__]);
([_index_bg_js__WEBPACK_IMPORTED_MODULE_1__, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__] = __webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__);


});

/***/ }),

/***/ "./pkg/index_bg.js":
/*!*************************!*\
  !*** ./pkg/index_bg.js ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setupElgamal": () => (/* binding */ setupElgamal),
/* harmony export */   "keygen": () => (/* binding */ keygen),
/* harmony export */   "initLib": () => (/* binding */ initLib),
/* harmony export */   "decrypt": () => (/* binding */ decrypt),
/* harmony export */   "__wbindgen_json_serialize": () => (/* binding */ __wbindgen_json_serialize),
/* harmony export */   "__wbindgen_object_drop_ref": () => (/* binding */ __wbindgen_object_drop_ref),
/* harmony export */   "__wbindgen_json_parse": () => (/* binding */ __wbindgen_json_parse),
/* harmony export */   "__wbg_log_d0e90c0768752c96": () => (/* binding */ __wbg_log_d0e90c0768752c96),
/* harmony export */   "__wbg_log_3445347661d4505e": () => (/* binding */ __wbg_log_3445347661d4505e),
/* harmony export */   "__wbg_new_693216e109162396": () => (/* binding */ __wbg_new_693216e109162396),
/* harmony export */   "__wbg_stack_0ddaca5d1abfb52f": () => (/* binding */ __wbg_stack_0ddaca5d1abfb52f),
/* harmony export */   "__wbg_error_09919627ac0992f5": () => (/* binding */ __wbg_error_09919627ac0992f5),
/* harmony export */   "__wbindgen_throw": () => (/* binding */ __wbindgen_throw)
/* harmony export */ });
/* harmony import */ var _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index_bg.wasm */ "./pkg/index_bg.wasm");
/* module decorator */ module = __webpack_require__.hmd(module);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__]);
_index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];


const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(_index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
    }
    return cachegetUint8Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(_index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(_index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
/**
* @param {string} sk_as_string
* @returns {any[]}
*/
function setupElgamal(sk_as_string) {
    try {
        const retptr = _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = passStringToWasm0(sk_as_string, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.setupElgamal(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_free(r0, r1 * 4);
        return v1;
    } finally {
        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_add_to_stack_pointer(16);
    }
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {any} _r
* @param {any} _sealer
* @param {any} _params
* @param {any} _sk
* @param {any} _pk
* @returns {any}
*/
function keygen(_r, _sealer, _params, _sk, _pk) {
    try {
        var ret = _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.keygen(addBorrowedObject(_r), addBorrowedObject(_sealer), addBorrowedObject(_params), addBorrowedObject(_sk), addBorrowedObject(_pk));
        return takeObject(ret);
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
*/
function initLib() {
    _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.initLib();
}

/**
* @param {any} _encryptions
* @param {any} _sealer
* @param {any} _r
* @param {any} _params
* @param {any} _sk
* @param {any} _pk
* @returns {any}
*/
function decrypt(_encryptions, _sealer, _r, _params, _sk, _pk) {
    try {
        var ret = _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.decrypt(addBorrowedObject(_encryptions), addBorrowedObject(_sealer), addBorrowedObject(_r), addBorrowedObject(_params), addBorrowedObject(_sk), addBorrowedObject(_pk));
        return takeObject(ret);
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

function __wbindgen_json_serialize(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

function __wbindgen_json_parse(arg0, arg1) {
    var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

const __wbg_log_d0e90c0768752c96 = typeof console.log == 'function' ? console.log : notDefined('console.log');

function __wbg_log_3445347661d4505e(arg0) {
    console.log(getObject(arg0));
};

function __wbg_new_693216e109162396() {
    var ret = new Error();
    return addHeapObject(ret);
};

function __wbg_stack_0ddaca5d1abfb52f(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

function __wbg_error_09919627ac0992f5(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_free(arg0, arg1);
    }
};

function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};


});

/***/ }),

/***/ "./pkg/index_bg.wasm":
/*!***************************!*\
  !*** ./pkg/index_bg.wasm ***!
  \***************************/
/***/ ((module, exports, __webpack_require__) => {

var __webpack_instantiate__ = ([WEBPACK_IMPORTED_MODULE_0]) => {
	return __webpack_require__.v(exports, module.id, "e1dd4c7893dd8117ca3b", {
		"./index_bg.js": {
			"__wbindgen_json_serialize": WEBPACK_IMPORTED_MODULE_0.__wbindgen_json_serialize,
			"__wbindgen_object_drop_ref": WEBPACK_IMPORTED_MODULE_0.__wbindgen_object_drop_ref,
			"__wbindgen_json_parse": WEBPACK_IMPORTED_MODULE_0.__wbindgen_json_parse,
			"__wbg_log_d0e90c0768752c96": WEBPACK_IMPORTED_MODULE_0.__wbg_log_d0e90c0768752c96,
			"__wbg_log_3445347661d4505e": WEBPACK_IMPORTED_MODULE_0.__wbg_log_3445347661d4505e,
			"__wbg_new_693216e109162396": WEBPACK_IMPORTED_MODULE_0.__wbg_new_693216e109162396,
			"__wbg_stack_0ddaca5d1abfb52f": WEBPACK_IMPORTED_MODULE_0.__wbg_stack_0ddaca5d1abfb52f,
			"__wbg_error_09919627ac0992f5": WEBPACK_IMPORTED_MODULE_0.__wbg_error_09919627ac0992f5,
			"__wbindgen_throw": WEBPACK_IMPORTED_MODULE_0.__wbindgen_throw
		}
	});
}
__webpack_require__.a(module, (__webpack_handle_async_dependencies__) => {
	/* harmony import */ var WEBPACK_IMPORTED_MODULE_0 = __webpack_require__(/*! ./index_bg.js */ "./pkg/index_bg.js");
	var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([WEBPACK_IMPORTED_MODULE_0]);
	return __webpack_async_dependencies__.then ? __webpack_async_dependencies__.then(__webpack_instantiate__) : __webpack_instantiate__(__webpack_async_dependencies__);
}, 1);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackThen = typeof Symbol === "function" ? Symbol("webpack then") : "__webpack_then__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var completeQueue = (queue) => {
/******/ 			if(queue) {
/******/ 				queue.forEach(fn => fn.r--);
/******/ 				queue.forEach(fn => fn.r-- ? fn.r++ : fn());
/******/ 			}
/******/ 		}
/******/ 		var completeFunction = fn => !--fn.r && fn();
/******/ 		var queueFunction = (queue, fn) => queue ? queue.push(fn) : completeFunction(fn);
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackThen]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [], result;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						completeQueue(queue);
/******/ 						queue = 0;
/******/ 					});
/******/ 					var obj = { [webpackThen]: (fn, reject) => { queueFunction(queue, fn); dep.catch(reject); } };
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			return { [webpackThen]: (fn) => { completeFunction(fn); }, [webpackExports]: dep };
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue = hasAwait && [];
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var isEvaluating = true;
/******/ 			var nested = false;
/******/ 			var whenAll = (deps, onResolve, onReject) => {
/******/ 				if (nested) return;
/******/ 				nested = true;
/******/ 				onResolve.r += deps.length;
/******/ 				deps.map((dep, i) => {
/******/ 					dep[webpackThen](onResolve, onReject);
/******/ 				});
/******/ 				nested = false;
/******/ 			};
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = () => {
/******/ 					resolve(exports);
/******/ 					completeQueue(queue);
/******/ 					queue = 0;
/******/ 				};
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackThen] = (fn, rejectFn) => {
/******/ 				if (isEvaluating) { return completeFunction(fn); }
/******/ 				if (currentDeps) whenAll(currentDeps, fn, rejectFn);
/******/ 				queueFunction(queue, fn);
/******/ 				promise.catch(rejectFn);
/******/ 			};
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				if(!deps) return outerResolve();
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn, result;
/******/ 				var promise = new Promise((resolve, reject) => {
/******/ 					fn = () => (resolve(result = currentDeps.map(d => d[webpackExports])))
/******/ 					fn.r = 0;
/******/ 					whenAll(currentDeps, fn, reject);
/******/ 				});
/******/ 				return fn.r ? promise : result;
/******/ 			}).then(outerResolve, reject);
/******/ 			isEvaluating = false;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/wasm chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.v = (exports, wasmModuleId, wasmModuleHash, importsObj) => {
      var requires = {'e1dd4c7893dd8117ca3b': () => require('./e1dd4c7893dd8117ca3b_wasm.js')}
      var buffer = requires[wasmModuleHash] ? requires[wasmModuleHash]() : Buffer.alloc(0)

      return WebAssembly.instantiate(buffer, importsObj)
        .then((res) => Object.assign(exports, res.instance.exports));
    };
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm92b3R1bS13YXNtLWxpYi8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9wcm92b3R1bS13YXNtLWxpYi8uL3NyYy9pbnRlcm5hbC9kZWNyeXB0LnRzIiwid2VicGFjazovL3Byb3ZvdHVtLXdhc20tbGliLy4vc3JjL2ludGVybmFsL2luaXQudHMiLCJ3ZWJwYWNrOi8vcHJvdm90dW0td2FzbS1saWIvLi9zcmMvaW50ZXJuYWwva2V5Z2VuLnRzIiwid2VicGFjazovL3Byb3ZvdHVtLXdhc20tbGliLy4vc3JjL2ludGVybmFsL3V0aWxzLnRzIiwid2VicGFjazovL3Byb3ZvdHVtLXdhc20tbGliLy4vc3JjL3NhcGxpbmcudHMiLCJ3ZWJwYWNrOi8vcHJvdm90dW0td2FzbS1saWIvLi9wa2cvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJvdm90dW0td2FzbS1saWIvLi9wa2cvaW5kZXhfYmcuanMiLCJ3ZWJwYWNrOi8vcHJvdm90dW0td2FzbS1saWIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJvdm90dW0td2FzbS1saWIvd2VicGFjay9ydW50aW1lL2FzeW5jIG1vZHVsZSIsIndlYnBhY2s6Ly9wcm92b3R1bS13YXNtLWxpYi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHJvdm90dW0td2FzbS1saWIvd2VicGFjay9ydW50aW1lL2hhcm1vbnkgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly9wcm92b3R1bS13YXNtLWxpYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3Byb3ZvdHVtLXdhc20tbGliL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHJvdm90dW0td2FzbS1saWIvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vcHJvdm90dW0td2FzbS1saWIvd2VicGFjay9ydW50aW1lL3dhc20gY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9wcm92b3R1bS13YXNtLWxpYi93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOlsiX193ZWJwYWNrX3JlcXVpcmVfXy52IzAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0RUFBdUI7QUFDdkIsZ0ZBQXlCOzs7Ozs7Ozs7Ozs7OztBQ0N6QixTQUFnQixlQUFlLENBQzdCLFdBQWdCLEVBQUUsTUFBVyxFQUFFLENBQU0sRUFBRSxNQUFXLEVBQUUsRUFBTyxFQUFFLEVBQU8sRUFDcEUsUUFBc0I7SUFFeEIsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQzlELENBQUM7QUFMRCwwQ0FLQzs7Ozs7Ozs7Ozs7Ozs7QUNMRCxTQUFnQixlQUFlLENBQzNCLFFBQXNCO0lBRXhCLE9BQU8sUUFBUSxDQUFDLE9BQU8sRUFBRTtBQUMzQixDQUFDO0FBSkQsMENBSUM7Ozs7Ozs7Ozs7Ozs7O0FDSkQsU0FBZ0Isb0JBQW9CLENBQ2hDLFlBQW9CLEVBQ3BCLFFBQXNCO0lBRXhCLE9BQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUM7QUFDNUMsQ0FBQztBQUxELG9EQUtDO0FBSUQsU0FBZ0IsY0FBYyxDQUM1QixDQUFNLEVBQUUsTUFBVyxFQUFFLE1BQVcsRUFBRSxFQUFPLEVBQUUsRUFBTyxFQUNsRCxRQUFzQjtJQUV4QixPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUNoRCxDQUFDO0FBTEQsd0NBS0M7Ozs7Ozs7Ozs7OztBQ2hCRCxvQkFBb0I7OztBQUVwQixTQUFTO0FBRVQsU0FBZ0IsVUFBVSxDQUFDLEtBQTRDLEVBQUUsSUFBYSxFQUFFLFlBQXFCO0lBQzNHLElBQUksTUFBTSxDQUFDLFFBQVEs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dXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gJy4vdHlwZXMnXG5leHBvcnQgKiBmcm9tICcuL3NhcGxpbmcnXG4iLCJpbXBvcnQgeyBXYXNtUHJvdm90dW0gfSBmcm9tIFwiLi90eXBlc1wiXG5cbmV4cG9ydCBmdW5jdGlvbiBfX3dhc21fX2RlY3J5cHQoXG4gIGVuY3J5cHRpb25zOiBhbnksIHNlYWxlcjogYW55LCByOiBhbnksIHBhcmFtczogYW55LCBzazogYW55LCBwazogYW55LFxuICBwcm92b3R1bTogV2FzbVByb3ZvdHVtLCBcbik6IGFueSB7XG5yZXR1cm4gcHJvdm90dW0uZGVjcnlwdChlbmNyeXB0aW9ucyxzZWFsZXIsIHIsIHBhcmFtcywgc2ssIHBrKVxufVxuIiwiaW1wb3J0IHsgV2FzbVByb3ZvdHVtIH0gZnJvbSBcIi4vdHlwZXNcIlxuXG5leHBvcnQgZnVuY3Rpb24gX193YXNtX19pbml0TGliKFxuICAgIHByb3ZvdHVtOiBXYXNtUHJvdm90dW0sIFxuKTogYW55IHtcbiAgcmV0dXJuIHByb3ZvdHVtLmluaXRMaWIoKVxufVxuXG5cbiIsImltcG9ydCB7IFdhc21Qcm92b3R1bSB9IGZyb20gXCIuL3R5cGVzXCJcblxuZXhwb3J0IGZ1bmN0aW9uIF9fd2FzbV9fc2V0dXBFbGdhbWFsKFxuICAgIHNrX2FzX3N0cmluZzogc3RyaW5nLCBcbiAgICBwcm92b3R1bTogV2FzbVByb3ZvdHVtLCBcbik6IGFueSB7XG4gIHJldHVybiBwcm92b3R1bS5zZXR1cEVsZ2FtYWwoc2tfYXNfc3RyaW5nKVxufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIF9fd2FzbV9fa2V5Z2VuKFxuICByOiBhbnksIHNlYWxlcjogYW55LCBwYXJhbXM6IGFueSwgc2s6IGFueSwgcGs6IGFueSxcbiAgcHJvdm90dW06IFdhc21Qcm92b3R1bSwgXG4pOiBhbnkge1xucmV0dXJuIHByb3ZvdHVtLmtleWdlbihyLHNlYWxlciwgcGFyYW1zLCBzaywgcGspXG59XG4iLCIvKiBJbnRlcm5hbCBVdGlscyAqL1xuXG4vLyBCdWZmZXJcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlckZyb20odmFsdWU6IEJ1ZmZlciB8IFVpbnQ4QXJyYXkgfCBzdHJpbmcgfCBudW1iZXIsIG5hbWU/OiBzdHJpbmcsIGV4cGVjdGVkVHlwZT86IHN0cmluZyk6IEJ1ZmZlciB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH0gZWxzZSBpZiAoaXNIZXhTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlLCAnaGV4JylcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIG51bWJlclRvQnl0ZXModmFsdWUpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJyAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlKVxuICB9IGVsc2Uge1xuICAgIHRocm93IGludmFsaWRUeXBlRXJyb3IobmFtZSwgZXhwZWN0ZWRUeXBlKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJGcm9tT2ZMZW5ndGgoXG4gIHZhbHVlOiBCdWZmZXIgfCBVaW50OEFycmF5IHwgc3RyaW5nIHwgbnVtYmVyLFxuICBtaW5MZW5ndGg6IG51bWJlcixcbiAgbmFtZT86IHN0cmluZyxcbiAgZXhwZWN0ZWRUeXBlPzogc3RyaW5nXG4pOiBCdWZmZXIge1xuICBsZXQgYnVmZmVyID0gYnVmZmVyRnJvbSh2YWx1ZSwgbmFtZSwgZXhwZWN0ZWRUeXBlKVxuXG4gIGlmIChtaW5MZW5ndGggPT09IHVuZGVmaW5lZCB8fCBtaW5MZW5ndGggPD0gYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICByZXR1cm4gYnVmZmVyXG4gIH1cblxuICBjb25zdCBsZWFkaW5nQnVmZmVyID0gQnVmZmVyLmFsbG9jKG1pbkxlbmd0aCAtIGJ1ZmZlci5ieXRlTGVuZ3RoKVxuICBsZWFkaW5nQnVmZmVyLmZpbGwoMClcblxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChbbGVhZGluZ0J1ZmZlciwgYnVmZmVyXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlclRvQnl0ZXMobnVtYmVyOiBudW1iZXIpOiBCdWZmZXIge1xuICBjb25zdCBidWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgYnVmZmVyLmZpbGwoMClcbiAgYnVmZmVyLndyaXRlSW50MzJCRShudW1iZXIpXG5cbiAgbGV0IGZpcnN0Tm9uWmVybyA9IDBcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXIuYnl0ZUxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGJ1ZmZlclswXSAhPT0gMHgwMCkge1xuICAgICAgZmlyc3ROb25aZXJvID0gaVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmlyc3ROb25aZXJvID4gMCA/IGJ1ZmZlci5zbGljZShmaXJzdE5vblplcm8pIDogYnVmZmVyXG59XG5cbi8vIFN0cmluZ1xuXG5jb25zdCBoZXhSZSA9IC9eKDB4KT9bMC05YS1mQS1GXSokL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSGV4U3RyaW5nKHN0cmluZzogYW55KTogc3RyaW5nIGlzIHN0cmluZyB7XG4gIHJldHVybiB0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJyAmJiBoZXhSZS50ZXN0KHN0cmluZylcbn1cblxuLy8gTnVtYmVyXG5cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJGcm9tKHZhbHVlOiBudW1iZXIgfCBzdHJpbmcsIG5hbWU/OiBzdHJpbmcsIGV4cGVjdGVkVHlwZT86IHN0cmluZyk6IG51bWJlciB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSlcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBpbnZhbGlkVHlwZUVycm9yKG5hbWUsIGV4cGVjdGVkVHlwZSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nRnJvbSh2YWx1ZTogbnVtYmVyIHwgc3RyaW5nIHwgQmlnSW50LCBuYW1lPzogc3RyaW5nLCBleHBlY3RlZFR5cGU/OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYmlnaW50Jykge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgaW52YWxpZFR5cGVFcnJvcihuYW1lLCBleHBlY3RlZFR5cGUpXG4gIH1cbn1cblxuLy8gRXJyb3JcblxuZXhwb3J0IGZ1bmN0aW9uIHVuaW5pdGlhbGl6ZWQoKTogdm9pZCB7XG4gIHRocm93IG5ldyBFcnJvcignc2FwbGluZy13YXNtIHVuaW5pdGlhbGl6ZWQnKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVqZWN0UHJvbWlzZTxUPihtZXRob2ROYW1lOiBzdHJpbmcsIGVycm9yOiBhbnkpOiBQcm9taXNlPFQ+IHtcbiAgcmV0dXJuIFByb21pc2UucmVqZWN0KHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycgPyBgJHttZXRob2ROYW1lfTogJHtlcnJvcn1gIDogZXJyb3IpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZhbGlkVHlwZUVycm9yKG5hbWU/OiBzdHJpbmcsIGV4cGVjdGVkVHlwZT86IHN0cmluZyk6IEVycm9yIHtcbiAgcmV0dXJuIG5hbWUgIT09IHVuZGVmaW5lZCAmJiBleHBlY3RlZFR5cGUgIT09IHVuZGVmaW5lZFxuICAgID8gbmV3IEVycm9yKGBcXGAke25hbWV9XFxgIGlzIG9mIGludmFsaWQgdHlwZSwgZXhwZWN0ZWQgJHtleHBlY3RlZFR5cGV9YClcbiAgICA6IG5ldyBUeXBlRXJyb3IoKVxufVxuIiwiXG5pbXBvcnQgeyBfX3dhc21fX2RlY3J5cHQgfSBmcm9tICcuL2ludGVybmFsL2RlY3J5cHQnXG5pbXBvcnQgeyBfX3dhc21fX2luaXRMaWIgfSBmcm9tICcuL2ludGVybmFsL2luaXQnXG5pbXBvcnQgeyBfX3dhc21fX2tleWdlbiwgX193YXNtX19zZXR1cEVsZ2FtYWwgfSBmcm9tICcuL2ludGVybmFsL2tleWdlbidcbmltcG9ydCB7IFdhc21Qcm92b3R1bSB9IGZyb20gJy4vaW50ZXJuYWwvdHlwZXMnXG5pbXBvcnQgeyByZWplY3RQcm9taXNlIH0gZnJvbSAnLi9pbnRlcm5hbC91dGlscydcblxuY29uc3QgcHJvdm90dW1Qcm9taXNlOiBQcm9taXNlPFdhc21Qcm92b3R1bT4gPSBpbXBvcnQoJy4uL3BrZycpXG4gIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGxvYWQgc2FwbGluZy13YXNtOiAke2Vycm9yfWApXG4gIH0pXG5cblxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdExpYigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcHJvdm90dW06IFdhc21Qcm92b3R1bSA9IGF3YWl0IHByb3ZvdHVtUHJvbWlzZVxuICAgICAgcmV0dXJuIF9fd2FzbV9faW5pdExpYihwcm92b3R1bSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIHJlamVjdFByb21pc2UoJ2luaXRMaWJFcnJvcicsIGVycm9yKVxuICAgIH1cbiAgfVxuXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXR1cEVsZ2FtYWwoc2tfYXNfc3RyaW5nOiBzdHJpbmcpOiBQcm9taXNlPGFueVtdPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHByb3ZvdHVtOiBXYXNtUHJvdm90dW0gPSBhd2FpdCBwcm92b3R1bVByb21pc2VcbiAgICAgIHJldHVybiBfX3dhc21fX3NldHVwRWxnYW1hbChza19hc19zdHJpbmcsIHByb3ZvdHVtKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gcmVqZWN0UHJvbWlzZSgna2V5Z2VuRXJyb3InLCBlcnJvcilcbiAgICB9XG4gIH1cbiAgIFxuXG4gIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBrZXlnZW4ocjogYW55LHNlYWxlcjogYW55LCBwYXJhbXM6IGFueSwgc2s6IGFueSwgcGs6IGFueSk6IFByb21pc2U8YW55W10+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcHJvdm90dW06IFdhc21Qcm92b3R1bSA9IGF3YWl0IHByb3ZvdHVtUHJvbWlzZVxuICAgICAgcmV0dXJuIF9fd2FzbV9fa2V5Z2VuKHIsIHNlYWxlcixwYXJhbXMsIHNrLCBwaywgcHJvdm90dW0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiByZWplY3RQcm9taXNlKCdrZXlnZW5FcnJvcicsIGVycm9yKVxuICAgIH1cbiAgfVxuXG5cblxuICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVjcnlwdChlbmNyeXB0aW9uczogYW55LCBzZWFsZXI6IGFueSwgcjogYW55LCBwYXJhbXM6IGFueSwgc2s6IGFueSwgcGs6IGFueSk6IFByb21pc2U8YW55W10+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcHJvdm90dW06IFdhc21Qcm92b3R1bSA9IGF3YWl0IHByb3ZvdHVtUHJvbWlzZVxuICAgICAgcmV0dXJuIF9fd2FzbV9fZGVjcnlwdChlbmNyeXB0aW9ucywgc2VhbGVyLCByLHBhcmFtcywgc2ssIHBrLCBwcm92b3R1bSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIHJlamVjdFByb21pc2UoJ2tleWdlbkVycm9yJywgZXJyb3IpXG4gICAgfVxuICB9XG4iLCJpbXBvcnQgKiBhcyB3YXNtIGZyb20gXCIuL2luZGV4X2JnLndhc21cIjtcbmV4cG9ydCAqIGZyb20gXCIuL2luZGV4X2JnLmpzXCI7IiwiaW1wb3J0ICogYXMgd2FzbSBmcm9tICcuL2luZGV4X2JnLndhc20nO1xuXG5jb25zdCBoZWFwID0gbmV3IEFycmF5KDMyKS5maWxsKHVuZGVmaW5lZCk7XG5cbmhlYXAucHVzaCh1bmRlZmluZWQsIG51bGwsIHRydWUsIGZhbHNlKTtcblxuZnVuY3Rpb24gZ2V0T2JqZWN0KGlkeCkgeyByZXR1cm4gaGVhcFtpZHhdOyB9XG5cbmxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwO1xuXG5sZXQgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0VWludDhNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldFVpbnQ4TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldFVpbnQ4TWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG5ldyBVaW50OEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldFVpbnQ4TWVtb3J5MDtcbn1cblxuY29uc3QgbFRleHRFbmNvZGVyID0gdHlwZW9mIFRleHRFbmNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RW5jb2RlciA6IFRleHRFbmNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dEVuY29kZXIgPSBuZXcgbFRleHRFbmNvZGVyKCd1dGYtOCcpO1xuXG5jb25zdCBlbmNvZGVTdHJpbmcgPSAodHlwZW9mIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPT09ICdmdW5jdGlvbidcbiAgICA/IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHtcbiAgICByZXR1cm4gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpO1xufVxuICAgIDogZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgIHZpZXcuc2V0KGJ1Zik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG59KTtcblxuZnVuY3Rpb24gcGFzc1N0cmluZ1RvV2FzbTAoYXJnLCBtYWxsb2MsIHJlYWxsb2MpIHtcblxuICAgIGlmIChyZWFsbG9jID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgYnVmID0gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlKGFyZyk7XG4gICAgICAgIGNvbnN0IHB0ciA9IG1hbGxvYyhidWYubGVuZ3RoKTtcbiAgICAgICAgZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBidWYubGVuZ3RoKS5zZXQoYnVmKTtcbiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gYnVmLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDtcbiAgICBsZXQgcHRyID0gbWFsbG9jKGxlbik7XG5cbiAgICBjb25zdCBtZW0gPSBnZXRVaW50OE1lbW9yeTAoKTtcblxuICAgIGxldCBvZmZzZXQgPSAwO1xuXG4gICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7XG4gICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0ICE9PSBsZW4pIHtcbiAgICAgICAgaWYgKG9mZnNldCAhPT0gMCkge1xuICAgICAgICAgICAgYXJnID0gYXJnLnNsaWNlKG9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgICAgcHRyID0gcmVhbGxvYyhwdHIsIGxlbiwgbGVuID0gb2Zmc2V0ICsgYXJnLmxlbmd0aCAqIDMpO1xuICAgICAgICBjb25zdCB2aWV3ID0gZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyICsgb2Zmc2V0LCBwdHIgKyBsZW4pO1xuICAgICAgICBjb25zdCByZXQgPSBlbmNvZGVTdHJpbmcoYXJnLCB2aWV3KTtcblxuICAgICAgICBvZmZzZXQgKz0gcmV0LndyaXR0ZW47XG4gICAgfVxuXG4gICAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0O1xuICAgIHJldHVybiBwdHI7XG59XG5cbmxldCBjYWNoZWdldEludDMyTWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRJbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0SW50MzJNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0SW50MzJNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbmV3IEludDMyQXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0SW50MzJNZW1vcnkwO1xufVxuXG5sZXQgaGVhcF9uZXh0ID0gaGVhcC5sZW5ndGg7XG5cbmZ1bmN0aW9uIGRyb3BPYmplY3QoaWR4KSB7XG4gICAgaWYgKGlkeCA8IDM2KSByZXR1cm47XG4gICAgaGVhcFtpZHhdID0gaGVhcF9uZXh0O1xuICAgIGhlYXBfbmV4dCA9IGlkeDtcbn1cblxuZnVuY3Rpb24gdGFrZU9iamVjdChpZHgpIHtcbiAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoaWR4KTtcbiAgICBkcm9wT2JqZWN0KGlkeCk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuY29uc3QgbFRleHREZWNvZGVyID0gdHlwZW9mIFRleHREZWNvZGVyID09PSAndW5kZWZpbmVkJyA/ICgwLCBtb2R1bGUucmVxdWlyZSkoJ3V0aWwnKS5UZXh0RGVjb2RlciA6IFRleHREZWNvZGVyO1xuXG5sZXQgY2FjaGVkVGV4dERlY29kZXIgPSBuZXcgbFRleHREZWNvZGVyKCd1dGYtOCcsIHsgaWdub3JlQk9NOiB0cnVlLCBmYXRhbDogdHJ1ZSB9KTtcblxuY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKCk7XG5cbmZ1bmN0aW9uIGdldFN0cmluZ0Zyb21XYXNtMChwdHIsIGxlbikge1xuICAgIHJldHVybiBjYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyLCBwdHIgKyBsZW4pKTtcbn1cblxuZnVuY3Rpb24gYWRkSGVhcE9iamVjdChvYmopIHtcbiAgICBpZiAoaGVhcF9uZXh0ID09PSBoZWFwLmxlbmd0aCkgaGVhcC5wdXNoKGhlYXAubGVuZ3RoICsgMSk7XG4gICAgY29uc3QgaWR4ID0gaGVhcF9uZXh0O1xuICAgIGhlYXBfbmV4dCA9IGhlYXBbaWR4XTtcblxuICAgIGhlYXBbaWR4XSA9IG9iajtcbiAgICByZXR1cm4gaWR4O1xufVxuXG5sZXQgY2FjaGVnZXRVaW50MzJNZW1vcnkwID0gbnVsbDtcbmZ1bmN0aW9uIGdldFVpbnQzMk1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0VWludDMyTWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldFVpbnQzMk1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHtcbiAgICAgICAgY2FjaGVnZXRVaW50MzJNZW1vcnkwID0gbmV3IFVpbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldFVpbnQzMk1lbW9yeTA7XG59XG5cbmZ1bmN0aW9uIGdldEFycmF5SnNWYWx1ZUZyb21XYXNtMChwdHIsIGxlbikge1xuICAgIGNvbnN0IG1lbSA9IGdldFVpbnQzMk1lbW9yeTAoKTtcbiAgICBjb25zdCBzbGljZSA9IG1lbS5zdWJhcnJheShwdHIgLyA0LCBwdHIgLyA0ICsgbGVuKTtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsaWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHRha2VPYmplY3Qoc2xpY2VbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuKiBAcGFyYW0ge3N0cmluZ30gc2tfYXNfc3RyaW5nXG4qIEByZXR1cm5zIHthbnlbXX1cbiovXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBFbGdhbWFsKHNrX2FzX3N0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHNrX2FzX3N0cmluZywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgd2FzbS5zZXR1cEVsZ2FtYWwocmV0cHRyLCBwdHIwLCBsZW4wKTtcbiAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgIHZhciB2MSA9IGdldEFycmF5SnNWYWx1ZUZyb21XYXNtMChyMCwgcjEpLnNsaWNlKCk7XG4gICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSAqIDQpO1xuICAgICAgICByZXR1cm4gdjE7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICB9XG59XG5cbmxldCBzdGFja19wb2ludGVyID0gMzI7XG5cbmZ1bmN0aW9uIGFkZEJvcnJvd2VkT2JqZWN0KG9iaikge1xuICAgIGlmIChzdGFja19wb2ludGVyID09IDEpIHRocm93IG5ldyBFcnJvcignb3V0IG9mIGpzIHN0YWNrJyk7XG4gICAgaGVhcFstLXN0YWNrX3BvaW50ZXJdID0gb2JqO1xuICAgIHJldHVybiBzdGFja19wb2ludGVyO1xufVxuLyoqXG4qIEBwYXJhbSB7YW55fSBfclxuKiBAcGFyYW0ge2FueX0gX3NlYWxlclxuKiBAcGFyYW0ge2FueX0gX3BhcmFtc1xuKiBAcGFyYW0ge2FueX0gX3NrXG4qIEBwYXJhbSB7YW55fSBfcGtcbiogQHJldHVybnMge2FueX1cbiovXG5leHBvcnQgZnVuY3Rpb24ga2V5Z2VuKF9yLCBfc2VhbGVyLCBfcGFyYW1zLCBfc2ssIF9waykge1xuICAgIHRyeSB7XG4gICAgICAgIHZhciByZXQgPSB3YXNtLmtleWdlbihhZGRCb3Jyb3dlZE9iamVjdChfciksIGFkZEJvcnJvd2VkT2JqZWN0KF9zZWFsZXIpLCBhZGRCb3Jyb3dlZE9iamVjdChfcGFyYW1zKSwgYWRkQm9ycm93ZWRPYmplY3QoX3NrKSwgYWRkQm9ycm93ZWRPYmplY3QoX3BrKSk7XG4gICAgICAgIHJldHVybiB0YWtlT2JqZWN0KHJldCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkO1xuICAgICAgICBoZWFwW3N0YWNrX3BvaW50ZXIrK10gPSB1bmRlZmluZWQ7XG4gICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkO1xuICAgICAgICBoZWFwW3N0YWNrX3BvaW50ZXIrK10gPSB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG4vKipcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdExpYigpIHtcbiAgICB3YXNtLmluaXRMaWIoKTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7YW55fSBfZW5jcnlwdGlvbnNcbiogQHBhcmFtIHthbnl9IF9zZWFsZXJcbiogQHBhcmFtIHthbnl9IF9yXG4qIEBwYXJhbSB7YW55fSBfcGFyYW1zXG4qIEBwYXJhbSB7YW55fSBfc2tcbiogQHBhcmFtIHthbnl9IF9wa1xuKiBAcmV0dXJucyB7YW55fVxuKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0KF9lbmNyeXB0aW9ucywgX3NlYWxlciwgX3IsIF9wYXJhbXMsIF9zaywgX3BrKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHJldCA9IHdhc20uZGVjcnlwdChhZGRCb3Jyb3dlZE9iamVjdChfZW5jcnlwdGlvbnMpLCBhZGRCb3Jyb3dlZE9iamVjdChfc2VhbGVyKSwgYWRkQm9ycm93ZWRPYmplY3QoX3IpLCBhZGRCb3Jyb3dlZE9iamVjdChfcGFyYW1zKSwgYWRkQm9ycm93ZWRPYmplY3QoX3NrKSwgYWRkQm9ycm93ZWRPYmplY3QoX3BrKSk7XG4gICAgICAgIHJldHVybiB0YWtlT2JqZWN0KHJldCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkO1xuICAgICAgICBoZWFwW3N0YWNrX3BvaW50ZXIrK10gPSB1bmRlZmluZWQ7XG4gICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkO1xuICAgICAgICBoZWFwW3N0YWNrX3BvaW50ZXIrK10gPSB1bmRlZmluZWQ7XG4gICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vdERlZmluZWQod2hhdCkgeyByZXR1cm4gKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoYCR7d2hhdH0gaXMgbm90IGRlZmluZWRgKTsgfTsgfVxuXG5leHBvcnQgZnVuY3Rpb24gX193YmluZGdlbl9qc29uX3NlcmlhbGl6ZShhcmcwLCBhcmcxKSB7XG4gICAgY29uc3Qgb2JqID0gZ2V0T2JqZWN0KGFyZzEpO1xuICAgIHZhciByZXQgPSBKU09OLnN0cmluZ2lmeShvYmogPT09IHVuZGVmaW5lZCA/IG51bGwgOiBvYmopO1xuICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAxXSA9IGxlbjA7XG4gICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYoYXJnMCkge1xuICAgIHRha2VPYmplY3QoYXJnMCk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gX193YmluZGdlbl9qc29uX3BhcnNlKGFyZzAsIGFyZzEpIHtcbiAgICB2YXIgcmV0ID0gSlNPTi5wYXJzZShnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMCwgYXJnMSkpO1xuICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG59O1xuXG5leHBvcnQgY29uc3QgX193YmdfbG9nX2QwZTkwYzA3Njg3NTJjOTYgPSB0eXBlb2YgY29uc29sZS5sb2cgPT0gJ2Z1bmN0aW9uJyA/IGNvbnNvbGUubG9nIDogbm90RGVmaW5lZCgnY29uc29sZS5sb2cnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fd2JnX2xvZ18zNDQ1MzQ3NjYxZDQ1MDVlKGFyZzApIHtcbiAgICBjb25zb2xlLmxvZyhnZXRPYmplY3QoYXJnMCkpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fd2JnX25ld182OTMyMTZlMTA5MTYyMzk2KCkge1xuICAgIHZhciByZXQgPSBuZXcgRXJyb3IoKTtcbiAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fd2JnX3N0YWNrXzBkZGFjYTVkMWFiZmI1MmYoYXJnMCwgYXJnMSkge1xuICAgIHZhciByZXQgPSBnZXRPYmplY3QoYXJnMSkuc3RhY2s7XG4gICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChyZXQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDtcbiAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDBdID0gcHRyMDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBfX3diZ19lcnJvcl8wOTkxOTYyN2FjMDk5MmY1KGFyZzAsIGFyZzEpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUoYXJnMCwgYXJnMSk7XG4gICAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIF9fd2JpbmRnZW5fdGhyb3coYXJnMCwgYXJnMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMCwgYXJnMSkpO1xufTtcblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrVGhlbiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgdGhlblwiKSA6IFwiX193ZWJwYWNrX3RoZW5fX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgY29tcGxldGVRdWV1ZSA9IChxdWV1ZSkgPT4ge1xuXHRpZihxdWV1ZSkge1xuXHRcdHF1ZXVlLmZvckVhY2goZm4gPT4gZm4uci0tKTtcblx0XHRxdWV1ZS5mb3JFYWNoKGZuID0+IGZuLnItLSA/IGZuLnIrKyA6IGZuKCkpO1xuXHR9XG59XG52YXIgY29tcGxldGVGdW5jdGlvbiA9IGZuID0+ICEtLWZuLnIgJiYgZm4oKTtcbnZhciBxdWV1ZUZ1bmN0aW9uID0gKHF1ZXVlLCBmbikgPT4gcXVldWUgPyBxdWV1ZS5wdXNoKGZuKSA6IGNvbXBsZXRlRnVuY3Rpb24oZm4pO1xudmFyIHdyYXBEZXBzID0gKGRlcHMpID0+IChkZXBzLm1hcCgoZGVwKSA9PiB7XG5cdGlmKGRlcCAhPT0gbnVsbCAmJiB0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYoZGVwW3dlYnBhY2tUaGVuXSkgcmV0dXJuIGRlcDtcblx0XHRpZihkZXAudGhlbikge1xuXHRcdFx0dmFyIHF1ZXVlID0gW10sIHJlc3VsdDtcblx0XHRcdGRlcC50aGVuKChyKSA9PiB7XG5cdFx0XHRcdG9ialt3ZWJwYWNrRXhwb3J0c10gPSByO1xuXHRcdFx0XHRjb21wbGV0ZVF1ZXVlKHF1ZXVlKTtcblx0XHRcdFx0cXVldWUgPSAwO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgb2JqID0geyBbd2VicGFja1RoZW5dOiAoZm4sIHJlamVjdCkgPT4geyBxdWV1ZUZ1bmN0aW9uKHF1ZXVlLCBmbik7IGRlcC5jYXRjaChyZWplY3QpOyB9IH07XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4geyBbd2VicGFja1RoZW5dOiAoZm4pID0+IHsgY29tcGxldGVGdW5jdGlvbihmbik7IH0sIFt3ZWJwYWNrRXhwb3J0c106IGRlcCB9O1xufSkpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5hID0gKG1vZHVsZSwgYm9keSwgaGFzQXdhaXQpID0+IHtcblx0dmFyIHF1ZXVlID0gaGFzQXdhaXQgJiYgW107XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIGlzRXZhbHVhdGluZyA9IHRydWU7XG5cdHZhciBuZXN0ZWQgPSBmYWxzZTtcblx0dmFyIHdoZW5BbGwgPSAoZGVwcywgb25SZXNvbHZlLCBvblJlamVjdCkgPT4ge1xuXHRcdGlmIChuZXN0ZWQpIHJldHVybjtcblx0XHRuZXN0ZWQgPSB0cnVlO1xuXHRcdG9uUmVzb2x2ZS5yICs9IGRlcHMubGVuZ3RoO1xuXHRcdGRlcHMubWFwKChkZXAsIGkpID0+IHtcblx0XHRcdGRlcFt3ZWJwYWNrVGhlbl0ob25SZXNvbHZlLCBvblJlamVjdCk7XG5cdFx0fSk7XG5cdFx0bmVzdGVkID0gZmFsc2U7XG5cdH07XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuXHRcdHJlamVjdCA9IHJlajtcblx0XHRvdXRlclJlc29sdmUgPSAoKSA9PiB7XG5cdFx0XHRyZXNvbHZlKGV4cG9ydHMpO1xuXHRcdFx0Y29tcGxldGVRdWV1ZShxdWV1ZSk7XG5cdFx0XHRxdWV1ZSA9IDA7XG5cdFx0fTtcblx0fSk7XG5cdHByb21pc2Vbd2VicGFja0V4cG9ydHNdID0gZXhwb3J0cztcblx0cHJvbWlzZVt3ZWJwYWNrVGhlbl0gPSAoZm4sIHJlamVjdEZuKSA9PiB7XG5cdFx0aWYgKGlzRXZhbHVhdGluZykgeyByZXR1cm4gY29tcGxldGVGdW5jdGlvbihmbik7IH1cblx0XHRpZiAoY3VycmVudERlcHMpIHdoZW5BbGwoY3VycmVudERlcHMsIGZuLCByZWplY3RGbik7XG5cdFx0cXVldWVGdW5jdGlvbihxdWV1ZSwgZm4pO1xuXHRcdHByb21pc2UuY2F0Y2gocmVqZWN0Rm4pO1xuXHR9O1xuXHRtb2R1bGUuZXhwb3J0cyA9IHByb21pc2U7XG5cdGJvZHkoKGRlcHMpID0+IHtcblx0XHRpZighZGVwcykgcmV0dXJuIG91dGVyUmVzb2x2ZSgpO1xuXHRcdGN1cnJlbnREZXBzID0gd3JhcERlcHMoZGVwcyk7XG5cdFx0dmFyIGZuLCByZXN1bHQ7XG5cdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRmbiA9ICgpID0+IChyZXNvbHZlKHJlc3VsdCA9IGN1cnJlbnREZXBzLm1hcChkID0+IGRbd2VicGFja0V4cG9ydHNdKSkpXG5cdFx0XHRmbi5yID0gMDtcblx0XHRcdHdoZW5BbGwoY3VycmVudERlcHMsIGZuLCByZWplY3QpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBmbi5yID8gcHJvbWlzZSA6IHJlc3VsdDtcblx0fSkudGhlbihvdXRlclJlc29sdmUsIHJlamVjdCk7XG5cdGlzRXZhbHVhdGluZyA9IGZhbHNlO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmhtZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGUpO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsICdleHBvcnRzJywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0c2V0OiAoKSA9PiB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VTIE1vZHVsZXMgbWF5IG5vdCBhc3NpZ24gbW9kdWxlLmV4cG9ydHMgb3IgZXhwb3J0cy4qLCBVc2UgRVNNIGV4cG9ydCBzeW50YXgsIGluc3RlYWQ6ICcgKyBtb2R1bGUuaWQpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIl9fd2VicGFja19yZXF1aXJlX18udiA9IChleHBvcnRzLCB3YXNtTW9kdWxlSWQsIHdhc21Nb2R1bGVIYXNoLCBpbXBvcnRzT2JqKSA9PiB7XG5cdHZhciByZXEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0dmFyIHsgcmVhZEZpbGUgfSA9IHJlcXVpcmUoJ2ZzJyk7XG5cdFx0dmFyIHsgam9pbiB9ID0gcmVxdWlyZSgncGF0aCcpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHJlYWRGaWxlKGpvaW4oX19kaXJuYW1lLCBcIlwiICsgd2FzbU1vZHVsZUhhc2ggKyBcIi5tb2R1bGUud2FzbVwiKSwgZnVuY3Rpb24oZXJyLCBidWZmZXIpe1xuXHRcdFx0XHRpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XG5cblx0XHRcdFx0Ly8gRmFrZSBmZXRjaCByZXNwb25zZVxuXHRcdFx0XHRyZXNvbHZlKHtcblx0XHRcdFx0XHRhcnJheUJ1ZmZlcigpIHsgcmV0dXJuIGJ1ZmZlcjsgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikgeyByZWplY3QoZXJyKTsgfVxuXHR9KTtcblx0Ly8gbm8gc3VwcG9ydCBmb3Igc3RyZWFtaW5nIGNvbXBpbGF0aW9uXG5cdHJldHVybiByZXFcblx0XHQudGhlbigoeCkgPT4gKHguYXJyYXlCdWZmZXIoKSkpXG5cdFx0LnRoZW4oKGJ5dGVzKSA9PiAoV2ViQXNzZW1ibHkuaW5zdGFudGlhdGUoYnl0ZXMsIGltcG9ydHNPYmopKSlcblx0XHQudGhlbigocmVzKSA9PiAoT2JqZWN0LmFzc2lnbihleHBvcnRzLCByZXMuaW5zdGFuY2UuZXhwb3J0cykpKTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9