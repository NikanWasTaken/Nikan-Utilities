const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require("../../index.js");

client.on("ready", () => {
  console.log(`${client.user.tag} ✅`);

  const statusArray = ["Minecraft | PLAYING", "over Nikan's World | WATCHING", "spotify | LISTENING", "#general | WATCHING", "with my cat | PLAYING", `${client.users.cache.size} Users | WATCHING`, "Members Joining | WATCHING", "Birds flying | STREAMING", "the events | COMPETING", "with my emojis | PLAYING", "Dreams zzz | WATCHING"]

  setInterval(() => {

    const random = statusArray[~~(Math.random() * statusArray.length)].split(" | ")
    const name = random[0]
    const type = random[1]

    client.user.setActivity(`${name}`, { type: `${type}`, url: "https://twitch.tv/nikanwastaken" })
  }, 10000)


});

client.on("threadCreate", async (t) => {
  if (!t.joinable) return
  t.join()

})


client.on("messageCreate", async (message) => {

  if (message.content.includes(process.env.TOKEN) || message.content.includes(process.env.MONGOOSE)) {

    if (message.editable) {

      let row = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setLabel("Very good website for you")
          .setURL("http://www.absolutelynothing.com/")

      )
      const embed = new MessageEmbed()
        .setDescription("Omg omg a secret ➜ || your mum ||").setColor("RED")
      return message.edit({ embeds: [embed], content: " ", components: [row] })
    } else if (!message.editable) {
      if (!message.deletable) return
      return message.delete()
    }
  }

})