const messages = require('./messages')
const TelegramBot = require('node-telegram-bot-api')
const referralUtils = require('../referrals')
const bybit = require('../bybit-api')
const settings = require('./settings')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })


const start = async () => {

    await bot.setMyDescription({ description: settings.botDescription, parse_mode: 'Markdown' })

    // Hello
    // bot.onText(/\/start/, async (msg) => {
    //     const chatId = msg.chat.id
    //     await bot.sendMessage(chatId,
    //         messages.helloMessage,
    //         {
    //             parse_mode: 'Markdown',
    //             reply_markup: {
    //                 keyboard: [['НАЧАТЬ']],
    //                 resize_keyboard: true,
    //                 one_time_keyboard: true,
    //             },
    //         })
    // })

    // Start
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id
        await bot.sendMessage(chatId,
            messages.startMessage,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [['УЧАСТВОВАТЬ']],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                }
            }
        )
    })

    // Participation
    bot.onText(/УЧАСТВОВАТЬ/, async (msg) => {
        const chatId = msg.chat.id

        await bot.sendMessage(chatId,
            messages.participationMessage,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [['ГОТОВО ✅']],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            })
    })

    // Ready
    bot.onText(/ГОТОВО/, async (msg) => {
        const chatId = msg.chat.id
        await bot.sendMessage(chatId,
            messages.readyMessage,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [['ПРОВЕРИТЬ']],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            })
    })

    // Set uid
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id
        const textArr = msg.text.split(' ')
        textArr.forEach(t => {
            if (parseFloat(t)) {
                referralUtils.addReferral(chatId, parseFloat(t))

                bot.sendMessage(chatId, messages.onUidInputMessage, {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        keyboard: [['ПРОВЕРИТЬ']],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                })
            }
        })
    })

    // Check uid
    bot.onText(/ПРОВЕРИТЬ/, async (msg) => {
        const chatId = msg.chat.id
        const referral = await referralUtils.getReferral(chatId)
        if (referral) {
            const result = await bybit.checkIsUserReferral(referral)
            if (result) {
                await bot.sendMessage(chatId, messages.registrationSuccess, {parse_mode: 'Markdown',})
            } else {
                await bot.sendMessage(chatId, messages.registrationFailed, {parse_mode: 'Markdown',})
            }
        }

    })

}

module.exports = {
    start
}
