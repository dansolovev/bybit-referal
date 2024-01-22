const axios = require('axios')
const crypto = require('crypto')



const { BYBIT_API_KEY, BYBIT_API_SECRET  } = process.env

const checkIsUserReferral = async (uid) => {

    const baseUrl = 'https://api.bybit.com'
    const timestamp = Date.now().toString()
    const method = 'GET'
    const recvWindow = 5000
    const path = '/v5/user/aff-customer-info'
    const queryString = `api_key=${BYBIT_API_KEY}&uid=${uid}`

    const sign = crypto.createHmac('sha256', BYBIT_API_SECRET)
        .update(timestamp + BYBIT_API_KEY + recvWindow + queryString)
        .digest('hex')

    const headers = {
        'X-BAPI-SIGN-TYPE': '2',
        'X-BAPI-SIGN': sign,
        'X-BAPI-API-KEY': BYBIT_API_KEY,
        'X-BAPI-TIMESTAMP': timestamp,
        'X-BAPI-RECV-WINDOW': recvWindow.toString()
    }

    const config = {
        method: method,
        url: baseUrl + path,
        headers: headers,
        data: queryString
    }

    return  axios.get('https://api.bybit.com/v5/user/aff-customer-info', {
        headers,
        params: {
            api_key: BYBIT_API_KEY,
            uid
        }
    })
        .then(function (response) {
            if (response.data?.result?.uid) return true
            else return false
        })
        .catch(function (error) {
            return false
        })
}

module.exports = {
    checkIsUserReferral
}
