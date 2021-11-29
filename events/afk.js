const { afk } = require("../models/afk")
const client = require("../index.js")
const moment = require("moment")



client.on('message', async message =>{

    if(!message.guild || message.author.bot) return 

    const MentionedMember = message.mentions.members.first();

    if(MentionedMember) {
        const data = afk.get(MentionedMember.id);

        if(data) {
            const [ timestamp, reason ] = data;
            const Timeago = moment(timestamp).fromNow();

            message.reply(`${MentionedMember.user.username} is currently afk for reason: ${reason} ● ${Timeago}`)

        }
    }

    const getdata = afk.get(message.author.id)
    if(getdata) {
        afk.delete(message.author.id)
        message.reply(`Welcome back! I removed your afk!`)
        message.member.setNickname(message.author.username)
    }
})