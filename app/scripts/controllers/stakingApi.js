const axios = require('axios').default;
const api_host = 'https://clo-staking.deta.dev/clo_staking';

axios.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
};

const getStakingStatus = async (chain,adrs) => {
    let res = await axios.post(api_host, {
            chain: ajaxReq.type.toLowerCase(),
            addresses: adrs
        })
    if(res.status == 200){
        //console.log(res.data.result);
        return res.data.result;
    }
}

module.exports = {
    getStakingStatus: getStakingStatus
};