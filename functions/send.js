
/**
 * @param {Client} client
 */
module.exports = async (client) => {


    // send({ content: "msg"}, message)

    client.send = function (options, cha) {
        const _ = cha.channel || this.channels.cache.get(cha);
        _.send({
            embeds: [{
                color: `${client.color.cool}`,
                author: {
                    iconURL: this.user.displayAvatarURL({ dynamic: true }),
                    name: options?.author || this.user.username,
                },
                description: options.content
            }]
        }).catch(() => { });
    }


    // ------------------------

    /**
     client.embed({
        description: "e", 
        footer: "LOL"
      }, message)
     */

    client.embed = function (options, chan) {
        const _ = chan.channel || this.channels.cache.get(chan)
        _.send({
            embeds: [
                Object.assign(options, {
                    color: `${client.color.cool}`
                })
            ]
        }).catch(() => { });
    }


}