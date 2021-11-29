const client = require("../../index.js")
const fetch = require("node-fetch")


client.on("messageCreate", async (message) => {

    if(message.channel.id === "890149926581989446" && !message.author.bot) {


      try {
        
        fetch(`https://api.monkedev.com/fun/chat?msg=${encodeURIComponent(message.content)}&uid=${message.author.id}&key=nqoVrH7ajApow841kxTeLJGkq`)
        .then(response => response.json())
        .then(data => {
          message.reply({ content: `${data.response}`, allowedMentions: { repliedUser: false}})
        })
        .catch(() => {
          message.reply({ content: `I didn't catch what you were trying to say, could you repeat it?`})
        })

      } catch (error) {
         return
      }
      
    }
})