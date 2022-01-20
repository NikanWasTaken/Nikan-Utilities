const client = require("../../index.js")
const fetch = require("node-fetch")
const { MessageEmbed } = require("discord.js")


client.on("messageCreate", async (message) => {

  if (message.channel.id === "890149926581989446" && !message.author.bot) {

    try {

      fetch(`https://api.monkedev.com/fun/chat?msg=${encodeURIComponent(message.content)}&uid=${message.author.id}&key=nqoVrH7ajApow841kxTeLJGkq`)
        .then(response => response.json())
        .then(data => {
          message.reply({
            content: `${data.response}`,
            allowedMentions: { repliedUser: false }
          })
        })
        .catch(() => {
          message.reply({ content: `I didn't catch what you were trying to say, could you repeat it?` })
        })

    } catch (error) {
      const embed = new MessageEmbed()
        .setAuthor({ name: "An error has occurred", iconURL: client.user.displayAvatarURL() })
        .setDescription(`\`\`\`js\n${error}\n\`\`\``)
        .setColor("RED")
      message.reply({
        embeds: [embed]
      })
    }
  }
})