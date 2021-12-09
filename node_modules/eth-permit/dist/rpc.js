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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = exports.getChainId = exports.setChainIdOverride = exports.signData = exports.send = void 0;
const randomId = () => Math.floor(Math.random() * 10000000000);
exports.send = (provider, method, params) => new Promise((resolve, reject) => {
    var _a;
    const payload = {
        id: randomId(),
        method,
        params,
    };
    const callback = (err, result) => {
        if (err) {
            reject(err);
        }
        else if (result.error) {
            console.error(result.error);
            reject(result.error);
        }
        else {
            resolve(result.result);
        }
    };
    const _provider = ((_a = provider.provider) === null || _a === void 0 ? void 0 : _a.provider) || provider.provider || provider;
    if (_provider.getUncheckedSigner /* ethers provider */) {
        _provider
            .send(method, params)
            .then((r) => resolve(r))
            .catch((e) => reject(e));
    }
    else if (_provider.sendAsync) {
        _provider.sendAsync(payload, callback);
    }
    else {
        _provider.send(payload, callback).catch((error) => {
            if (error.message ===
                "Hardhat Network doesn't support JSON-RPC params sent as an object") {
                _provider
                    .send(method, params)
                    .then((r) => resolve(r))
                    .catch((e) => reject(e));
            }
            else {
                throw error;
            }
        });
    }
});
const splitSignatureToRSV = (signature) => {
    const r = '0x' + signature.substring(2).substring(0, 64);
    const s = '0x' + signature.substring(2).substring(64, 128);
    const v = parseInt(signature.substring(2).substring(128, 130), 16);
    return { r, s, v };
};
const signWithEthers = (signer, fromAddress, typeData) => __awaiter(void 0, void 0, void 0, function* () {
    const signerAddress = yield signer.getAddress();
    if (signerAddress.toLowerCase() !== fromAddress.toLowerCase()) {
        throw new Error('Signer address does not match requested signing address');
    }
    const _a = typeData.types, { EIP712Domain: _unused } = _a, types = __rest(_a, ["EIP712Domain"]);
    const rawSignature = yield (signer.signTypedData
        ? signer.signTypedData(typeData.domain, types, typeData.message)
        : signer._signTypedData(typeData.domain, types, typeData.message));
    return splitSignatureToRSV(rawSignature);
});
exports.signData = (provider, fromAddress, typeData) => __awaiter(void 0, void 0, void 0, function* () {
    if (provider._signTypedData || provider.signTypedData) {
        return signWithEthers(provider, fromAddress, typeData);
    }
    const typeDataString = typeof typeData === 'string' ? typeData : JSON.stringify(typeData);
    const result = yield exports.send(provider, 'eth_signTypedData_v4', [fromAddress, typeDataString])
        .catch((error) => {
        if (error.message === 'Method eth_signTypedData_v4 not supported.') {
            return exports.send(provider, 'eth_signTypedData', [fromAddress, typeData]);
        }
        else {
            throw error;
        }
    });
    return {
        r: result.slice(0, 66),
        s: '0x' + result.slice(66, 130),
        v: parseInt(result.slice(130, 132), 16),
    };
});
let chainIdOverride = null;
exports.setChainIdOverride = (id) => { chainIdOverride = id; };
exports.getChainId = (provider) => __awaiter(void 0, void 0, void 0, function* () { return chainIdOverride || exports.send(provider, 'eth_chainId'); });
exports.call = (provider, to, data) => exports.send(provider, 'eth_call', [{
        to,
        data,
    }, 'latest']);
