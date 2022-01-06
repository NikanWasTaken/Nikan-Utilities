// Converts a timestamp to seconds, minutes, hours and days

/**
 * @param {Client} client
 */
module.exports = async (client) => {


    let theFunction = function (time) {
        time = time * 1000
        let days = 0
        let hours = 0
        let minutes = 0
        let seconds = 0
        days = Math.floor(time / 86400000)
        time -= days * 86400000
        hours = Math.floor(time / 3600000)
        time -= hours * 3600000
        minutes = Math.floor(time / 60000)
        time -= minutes * 60000
        seconds = Math.floor(time / 1000)
        time -= seconds * 1000
        days = days > 9 ? days : '' + days
        hours = hours > 9 ? hours : '' + hours
        minutes = minutes > 9 ? minutes : '' + minutes
        seconds = seconds > 9 ? seconds : '' + seconds

        let finalDays = (parseInt(days) > 0 ? `**${days}** days •` : '');
        let finalHours = (parseInt(hours) === 0 && parseInt(days) === 0 ? '' : ` **${hours}** hours •`);
        let finalMinutes = (parseInt(minutes) === 0 && parseInt(hours) === 0 && parseInt(days) === 0 ? '' : ` **${minutes}** minutes `);
        let finalSeconds = (parseInt(seconds) === 0 ? '' : `• **${seconds}** seconds`)
        return finalDays + finalHours + finalMinutes + finalSeconds;
    }

    client.convert = {
        time: theFunction
    }

}