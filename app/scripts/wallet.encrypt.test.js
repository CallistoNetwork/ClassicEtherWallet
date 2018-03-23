describe('wallet encryption', function () {

    it('can update password', function () {

        var wallet = Wallet.generate(false);

        var password = 'testing123';

        var opts = {
            kdf: globalFuncs.kdf,
            n: globalFuncs.scrypt.n
        };


        var wStr = wallet.toV3(password, opts);

        var privKey = wallet.toJSON().privKey;

        var wallet_ = new Wallet(privKey);

        var newPassword = 'NEW PASSWORD 123456';

        var wStr_ = wallet_.toV3(newPassword, opts);


        console.log(JSON.stringify(wStr));
        console.log(JSON.stringify(wStr_));


        var unlocked_wallet = Wallet.getWalletFromPrivKeyFile(JSON.stringify(wStr), password);
        var unlocked_wallet_ = Wallet.getWalletFromPrivKeyFile(JSON.stringify(wStr_), newPassword);


        var wJson = unlocked_wallet.toJSON();
        var wJson_ = unlocked_wallet_.toJSON();


        assert.equal(wJson.privKey, wJson_.privKey);
        assert.equal(wJson.pubKey, wJson_.pubKey);

        assert.equal(wJson.address, wJson_.address);


        // i manually un

        // wJson.privKey == wJson_.privKey;
        // wJson.pubKey == wJson_.pubKey;
        // wJson.address == wJson_.address;


    })
})
