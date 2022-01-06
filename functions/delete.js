// Deletes messages and interactions after 5 seconds

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    let deleteMessageFunction = function (message, msg) {

        setTimeout(() => {
            message?.delete()
            msg?.delete()
        }, 5000)
    }

    let deleteInteractionFunction = function (interaction) {

        setTimeout(() => {
            interaction?.deleteReply()
        }, 5000)
    }

    client.delete = {
        message: deleteMessageFunction,
        interaction: deleteInteractionFunction
    }

}