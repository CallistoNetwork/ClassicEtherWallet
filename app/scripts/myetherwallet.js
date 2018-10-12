"use strict";
const _map = require("lodash/map");
// const {ethUtil, nodes, globalFuncs, coinPriceService, etherUnits} = window;

const defaultWalletBalance = {
    usdPrice: 0,
    gbpPrice: 0,
    eurPrice: 0,
    btcPrice: 0,
    chfPrice: 0,
    usdBalance: 0,
    gbpBalance: 0,
    eurBalance: 0,
    btcBalance: 0,
    chfBalance: 0,
    balance: 0
};

var Wallet = function(priv, pub, path, hwType, hwTransport) {
    if (typeof priv !== "undefined") {
        this.privKey = priv.length === 32 ? priv : Buffer(priv, "hex");
    }
    this.pubKey = pub;
    this.path = path;
    this.hwType = hwType;
    this.hwTransport = hwTransport;
    this.type = "default";

    this.balances = Object.keys(nodes.alternativeBalance).reduce(
        (total, key) => {
            total[key] = Object.assign(
                {},
                nodes.alternativeBalance[key],
                defaultWalletBalance
            );

            return total;
        },
        {}
    );
};
Wallet.generate = function(icapDirect) {
    if (icapDirect) {
        while (true) {
            var privKey = ethUtil.crypto.randomBytes(32);
            if (ethUtil.privateToAddress(privKey)[0] === 0) {
                return new Wallet(privKey);
            }
        }
    } else {
        return new Wallet(ethUtil.crypto.randomBytes(32));
    }
};
Wallet.prototype.setTokens = function() {
    const { popTokens: _popTokens } = Token;

    const popTokens = _popTokens.map(token =>
        Object.assign(token, { local: false })
    );

    let _localTokens = globalFuncs.localStorage.getItem("localTokens", null);
    let _tokens = [];
    if (_localTokens) {
        try {
            _tokens = JSON.parse(_localTokens);
        } catch (e) {
            _tokens = [];
        }
    }
    const localTokens = _tokens.map(token =>
        Object.assign(token, { address: token.contractAddress, local: true })
    );

    const addr = this.getAddressString();
    this.tokenObjs = []
        .concat(popTokens, localTokens)
        .map(
            token =>
                new Token(
                    token.address,
                    addr,
                    globalFuncs.stripTags(token.symbol),
                    token.decimal,
                    token.type,
                    token.node,
                    token.local
                )
        );

    return Promise.all(
        this.tokenObjs
            .filter(token => token.type === ajaxReq.type)
            .map(token => {
                token.fetchBalance();
            })
    );
};

Wallet.prototype.setBalance = function() {
    for (let coin in this.balances) {
        Object.assign(this.balances[coin], defaultWalletBalance);
    }
    return Promise.all([this._setBalances(), this.setTokens()]);
};

Wallet.prototype.setBalanceOfNetwork = function() {
    ajaxReq.getBalance(this.getChecksumAddressString(), result => {
        if (!(!result.error && result.data)) {
            return false;
        }
        this._saveBalance(ajaxReq.type, result);
    });
};

Wallet.prototype.sumBalances = function() {
    const balances = Object.values(this.balances);

    const _btcBalances = _map(balances, "btcBalance").map(Number);
    const _usdBalances = _map(balances, "usdBalance").map(Number);
    const _eurBalances = _map(balances, "eurBalance").map(Number);
    const _gbpBalances = _map(balances, "gbpBalance").map(Number);
    const _chfBalances = _map(balances, "chfBalance").map(Number);

    const btcBalance = _btcBalances.reduce((total, btc) => total + btc, 0);
    const usdBalance = _usdBalances.reduce((total, usd) => total + usd, 0);
    const eurBalance = _eurBalances.reduce((total, i) => total + i, 0);
    const gbpBalance = _gbpBalances.reduce((total, i) => total + i, 0);
    const chfBalance = _chfBalances.reduce((total, i) => total + i, 0);
    return {
        btcBalance,
        usdBalance,
        eurBalance,
        gbpBalance,
        chfBalance
    };
};

Wallet.prototype._setBalance = function(currency = "ETC") {
    return data => {
        if (data.error) {
            this.balances[currency].balance = data.msg;
            return;
        }

        this._saveBalance(currency, data);
    };
};

Wallet.prototype._saveBalance = function(
    currency = "ETC",
    { data: { balance } }
) {
    const { coinPrices } = window.coinPriceService;
    const etherBal = etherUnits.toEther(balance, "wei");
    this.balances[currency].balance = etherBal;

    if (currency in coinPrices) {
        const data = coinPrices[currency];

        this.balances[currency].usdPrice = etherUnits.toFiat(
            "1",
            "ether",
            data.usd
        );
        this.balances[currency].gbpPrice = etherUnits.toFiat(
            "1",
            "ether",
            data.gbp
        );
        this.balances[currency].eurPrice = etherUnits.toFiat(
            "1",
            "ether",
            data.eur
        );
        this.balances[currency].btcPrice = etherUnits.toFiat(
            "1",
            "ether",
            data.btc
        );
        this.balances[currency].chfPrice = etherUnits.toFiat(
            "1",
            "ether",
            data.chf
        );
        this.balances[currency].usdBalance = etherUnits.toFiat(
            etherBal,
            "ether",
            data.usd
        );
        this.balances[currency].gbpBalance = etherUnits.toFiat(
            etherBal,
            "ether",
            data.gbp
        );
        this.balances[currency].eurBalance = etherUnits.toFiat(
            etherBal,
            "ether",
            data.eur
        );
        this.balances[currency].btcBalance = etherUnits.toFiat(
            etherBal,
            "ether",
            data.btc
        );
        this.balances[currency].chfBalance = etherUnits.toFiat(
            etherBal,
            "ether",
            data.chf
        );
    } else {
        Object.assign(this.balances, {
            [currency]: Object.assign(
                {},
                defaultWalletBalance,
                this.balances[currency]
            )
        });
    }

    return this.balances[currency];
};

Wallet.prototype._setBalances = function() {
    const networks = _map(Object.values(this.balances), "symbol");
    const coin = ajaxReq.type;

    if (!networks.includes(coin)) {
        this.balances[coin] = Object.assign({}, defaultWalletBalance, {
            node: ajaxReq.key,
            symbol: ajaxReq.type
        });
    }
    const requests = Object.values(this.balances);

    return Promise.all(
        requests.map(currency => {
            const { lib } = nodes.nodeList[currency.node];

            return lib.getBalance(
                this.getAddressString(),
                this._setBalance(currency.symbol)
            );
        })
    );
};

Wallet.prototype.getBalance = function() {
    return this.balance;
};
Wallet.prototype.getPath = function() {
    return this.path;
};
Wallet.prototype.getHWType = function() {
    return this.hwType;
};
Wallet.prototype.getHWTransport = function() {
    return this.hwTransport;
};
Wallet.prototype.getPrivateKey = function() {
    return this.privKey;
};
Wallet.prototype.getPrivateKeyString = function() {
    if (typeof this.privKey !== "undefined") {
        return this.getPrivateKey().toString("hex");
    } else {
        return "";
    }
};
Wallet.prototype.getPublicKey = function() {
    if (typeof this.pubKey === "undefined") {
        return ethUtil.privateToPublic(this.privKey);
    } else {
        return this.pubKey;
    }
};
Wallet.prototype.getPublicKeyString = function() {
    if (typeof this.pubKey === "undefined") {
        return "0x" + this.getPublicKey().toString("hex");
    } else {
        return "0x" + this.pubKey.toString("hex");
    }
};
Wallet.prototype.getAddress = function() {
    if (typeof this.pubKey === "undefined") {
        return ethUtil.privateToAddress(this.privKey);
    } else {
        return ethUtil.publicToAddress(this.pubKey, true);
    }
};
Wallet.prototype.getAddressString = function() {
    return "0x" + this.getAddress().toString("hex");
};
Wallet.prototype.getChecksumAddressString = function() {
    return ethUtil.toChecksumAddress(this.getAddressString());
};
Wallet.fromPrivateKey = function(priv) {
    return new Wallet(priv);
};
Wallet.fromParityPhrase = function(phrase) {
    var hash = ethUtil.sha3(new Buffer(phrase));
    for (var i = 0; i < 16384; i++) hash = ethUtil.sha3(hash);
    while (ethUtil.privateToAddress(hash)[0] != 0) hash = ethUtil.sha3(hash);
    return new Wallet(hash);
};
Wallet.prototype.toV3 = function(password, opts) {
    opts = opts || {};
    var salt = opts.salt || ethUtil.crypto.randomBytes(32);
    var iv = opts.iv || ethUtil.crypto.randomBytes(16);
    var derivedKey;
    var kdf = opts.kdf || "scrypt";
    var kdfparams = {
        dklen: opts.dklen || 32,
        salt: salt.toString("hex")
    };
    if (kdf === "pbkdf2") {
        kdfparams.c = opts.c || 262144;
        kdfparams.prf = "hmac-sha256";
        derivedKey = ethUtil.crypto.pbkdf2Sync(
            new Buffer(password),
            salt,
            kdfparams.c,
            kdfparams.dklen,
            "sha256"
        );
    } else if (kdf === "scrypt") {
        // FIXME: support progress reporting callback
        kdfparams.n = opts.n || 262144;
        kdfparams.r = opts.r || 8;
        kdfparams.p = opts.p || 1;
        derivedKey = ethUtil.scrypt(
            new Buffer(password),
            salt,
            kdfparams.n,
            kdfparams.r,
            kdfparams.p,
            kdfparams.dklen
        );
    } else {
        throw new Error("Unsupported kdf");
    }
    var cipher = ethUtil.crypto.createCipheriv(
        opts.cipher || "aes-128-ctr",
        derivedKey.slice(0, 16),
        iv
    );
    if (!cipher) {
        throw new Error("Unsupported cipher");
    }
    var ciphertext = Buffer.concat([
        cipher.update(this.privKey),
        cipher.final()
    ]);
    var mac = ethUtil.sha3(
        Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, "hex")])
    );
    return {
        version: 3,
        id: ethUtil.uuid.v4({
            random: opts.uuid || ethUtil.crypto.randomBytes(16)
        }),
        address: this.getAddress().toString("hex"),
        Crypto: {
            ciphertext: ciphertext.toString("hex"),
            cipherparams: {
                iv: iv.toString("hex")
            },
            cipher: opts.cipher || "aes-128-ctr",
            kdf: kdf,
            kdfparams: kdfparams,
            mac: mac.toString("hex")
        }
    };
};
Wallet.prototype.toJSON = function() {
    return {
        address: this.getAddressString(),
        checksumAddress: this.getChecksumAddressString(),
        privKey: this.getPrivateKeyString(),
        pubKey: this.getPublicKeyString(),
        publisher: "ClassicEtherWallet",
        encrypted: false,
        version: 2
    };
};
Wallet.fromMyEtherWallet = function(input, password) {
    var json = typeof input === "object" ? input : JSON.parse(input);
    var privKey;
    if (!json.locked) {
        if (json.private.length !== 64) {
            throw new Error("Invalid private key length");
        }
        privKey = new Buffer(json.private, "hex");
    } else {
        if (typeof password !== "string") {
            throw new Error("Password required");
        }
        if (password.length < 7) {
            throw new Error("Password must be at least 7 characters");
        }
        var cipher = json.encrypted ? json.private.slice(0, 128) : json.private;
        cipher = Wallet.decodeCryptojsSalt(cipher);
        var evp = Wallet.evp_kdf(new Buffer(password), cipher.salt, {
            keysize: 32,
            ivsize: 16
        });
        var decipher = ethUtil.crypto.createDecipheriv(
            "aes-256-cbc",
            evp.key,
            evp.iv
        );
        privKey = Wallet.decipherBuffer(
            decipher,
            new Buffer(cipher.ciphertext)
        );
        privKey = new Buffer(privKey.toString(), "hex");
    }
    var wallet = new Wallet(privKey);
    if (wallet.getAddressString() !== json.address) {
        throw new Error("Invalid private key or address");
    }
    return wallet;
};
Wallet.fromMyEtherWalletV2 = function(input) {
    var json = typeof input === "object" ? input : JSON.parse(input);
    if (json.privKey.length !== 64) {
        throw new Error("Invalid private key length");
    }
    var privKey = new Buffer(json.privKey, "hex");
    return new Wallet(privKey);
};
Wallet.fromEthSale = function(input, password) {
    var json = typeof input === "object" ? input : JSON.parse(input);
    var encseed = new Buffer(json.encseed, "hex");
    var derivedKey = ethUtil.crypto
        .pbkdf2Sync(Buffer(password), Buffer(password), 2000, 32, "sha256")
        .slice(0, 16);
    var decipher = ethUtil.crypto.createDecipheriv(
        "aes-128-cbc",
        derivedKey,
        encseed.slice(0, 16)
    );
    var seed = Wallet.decipherBuffer(decipher, encseed.slice(16));
    var wallet = new Wallet(ethUtil.sha3(seed));
    if (wallet.getAddress().toString("hex") !== json.ethaddr) {
        throw new Error("Decoded key mismatch - possibly wrong passphrase");
    }
    return wallet;
};
Wallet.fromMyEtherWalletKey = function(input, password) {
    var cipher = input.slice(0, 128);
    cipher = Wallet.decodeCryptojsSalt(cipher);
    var evp = Wallet.evp_kdf(new Buffer(password), cipher.salt, {
        keysize: 32,
        ivsize: 16
    });
    var decipher = ethUtil.crypto.createDecipheriv(
        "aes-256-cbc",
        evp.key,
        evp.iv
    );
    var privKey = Wallet.decipherBuffer(
        decipher,
        new Buffer(cipher.ciphertext)
    );
    privKey = new Buffer(privKey.toString(), "hex");
    return new Wallet(privKey);
};
Wallet.fromV3 = function(input, password, nonStrict) {
    var json =
        typeof input === "object"
            ? input
            : JSON.parse(nonStrict ? input.toLowerCase() : input);
    if (json.version !== 3) {
        throw new Error("Not a V3 wallet");
    }
    var derivedKey;
    var kdfparams;
    if (json.crypto.kdf === "scrypt") {
        kdfparams = json.crypto.kdfparams;
        derivedKey = ethUtil.scrypt(
            new Buffer(password),
            new Buffer(kdfparams.salt, "hex"),
            kdfparams.n,
            kdfparams.r,
            kdfparams.p,
            kdfparams.dklen
        );
    } else if (json.crypto.kdf === "pbkdf2") {
        kdfparams = json.crypto.kdfparams;
        if (kdfparams.prf !== "hmac-sha256") {
            throw new Error("Unsupported parameters to PBKDF2");
        }
        derivedKey = ethUtil.crypto.pbkdf2Sync(
            new Buffer(password),
            new Buffer(kdfparams.salt, "hex"),
            kdfparams.c,
            kdfparams.dklen,
            "sha256"
        );
    } else {
        throw new Error("Unsupported key derivation scheme");
    }
    var ciphertext = new Buffer(json.crypto.ciphertext, "hex");
    var mac = ethUtil.sha3(
        Buffer.concat([derivedKey.slice(16, 32), ciphertext])
    );
    if (mac.toString("hex") !== json.crypto.mac) {
        throw new Error("Key derivation failed - possibly wrong passphrase");
    }
    var decipher = ethUtil.crypto.createDecipheriv(
        json.crypto.cipher,
        derivedKey.slice(0, 16),
        new Buffer(json.crypto.cipherparams.iv, "hex")
    );
    var seed = Wallet.decipherBuffer(decipher, ciphertext, "hex");
    while (seed.length < 32) {
        var nullBuff = new Buffer([0x00]);
        seed = Buffer.concat([nullBuff, seed]);
    }
    return new Wallet(seed);
};
Wallet.prototype.toV3String = function(password, opts) {
    return JSON.stringify(this.toV3(password, opts));
};
Wallet.prototype.getV3Filename = function(timestamp) {
    var ts = timestamp ? new Date(timestamp) : new Date();
    return [
        "UTC--",
        ts.toJSON().replace(/:/g, "-"),
        "--",
        this.getAddress().toString("hex")
    ].join("");
};
Wallet.decipherBuffer = function(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()]);
};
Wallet.decodeCryptojsSalt = function(input) {
    var ciphertext = new Buffer(input, "base64");
    if (ciphertext.slice(0, 8).toString() === "Salted__") {
        return {
            salt: ciphertext.slice(8, 16),
            ciphertext: ciphertext.slice(16)
        };
    } else {
        return {
            ciphertext: ciphertext
        };
    }
};
Wallet.evp_kdf = function(data, salt, opts) {
    // A single EVP iteration, returns `D_i`, where block equlas to `D_(i-1)`

    function iter(block) {
        var hash = ethUtil.crypto.createHash(opts.digest || "md5");
        hash.update(block);
        hash.update(data);
        hash.update(salt);
        block = hash.digest();
        for (var i = 1; i < (opts.count || 1); i++) {
            hash = ethUtil.crypto.createHash(opts.digest || "md5");
            hash.update(block);
            block = hash.digest();
        }
        return block;
    }

    var keysize = opts.keysize || 16;
    var ivsize = opts.ivsize || 16;
    var ret = [];
    var i = 0;
    while (Buffer.concat(ret).length < keysize + ivsize) {
        ret[i] = iter(i === 0 ? new Buffer(0) : ret[i - 1]);
        i++;
    }
    var tmp = Buffer.concat(ret);
    return {
        key: tmp.slice(0, keysize),
        iv: tmp.slice(keysize, keysize + ivsize)
    };
};
Wallet.walletRequirePass = function(ethjson) {
    var jsonArr;
    try {
        jsonArr = JSON.parse(ethjson);
    } catch (err) {
        throw globalFuncs.errorMsgs[3];
    }
    if (jsonArr.encseed != null) return true;
    else if (jsonArr.Crypto != null || jsonArr.crypto != null) return true;
    else if (jsonArr.hash != null && jsonArr.locked) return true;
    else if (jsonArr.hash != null && !jsonArr.locked) return false;
    else if (jsonArr.publisher == "MyEtherWallet" && !jsonArr.encrypted)
        return false;
    else throw globalFuncs.errorMsgs[2];
};
Wallet.getWalletFromPrivKeyFile = function(strjson, password) {
    var jsonArr = JSON.parse(strjson);
    if (jsonArr.encseed != null) return Wallet.fromEthSale(strjson, password);
    else if (jsonArr.Crypto != null || jsonArr.crypto != null)
        return Wallet.fromV3(strjson, password, true);
    else if (jsonArr.hash != null)
        return Wallet.fromMyEtherWallet(strjson, password);
    else if (jsonArr.publisher == "MyEtherWallet")
        return Wallet.fromMyEtherWalletV2(strjson);
    else throw globalFuncs.errorMsgs[2];
};
module.exports = Wallet;
