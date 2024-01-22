const fs = require('fs')
const path = require('path')


const filePath = path.join(__dirname, 'referrals.json')

const getReferrals = () => {
    const jsonString = fs.readFileSync("./referrals.json")
    return JSON.parse(jsonString) || {}
}

const getReferral = async (chatId) => {
    const referrals = await getReferrals()
    return referrals[chatId]
}


const addReferral = async (chatId, uid) => {
    const referrals = await getReferrals()
    if (referrals) {
        referrals[chatId] = uid
        fs.writeFile(filePath, JSON.stringify(referrals, null, 2), (err) => {
            if (err) {
                console.error('Ошибка при записи в файл:', err);
            }
        })
    }
}

module.exports = {
    getReferrals,
    addReferral,
    getReferral
}
