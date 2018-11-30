module.exports = () => ({
    template: require("./eos-keypair.html"),
    link: scope =>
        (scope.ADDRESS = ethUtil.toChecksumAddress(
            "0xd0a6E6C54DbC68Db5db3A091B171A77407Ff7ccf"
        ))
});
