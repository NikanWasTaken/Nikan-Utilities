const client = require("../../index.js");

client.on("ready", (client) => {

  console.log(`Connected to ${client.user.tag}`)

  client.user.setActivity(`${client.guilds.cache.get(`${client.server.id}`).name}`, { type: "WATCHING" })
  /**
   *
  const statusArray =
    [
      "Minecraft | PLAYING",
      `over ${client.guilds.cache.get(client.server.id).name} | WATCHING`,
      "spotify | LISTENING",
      "#general | WATCHING",
      "with my cat | PLAYING",
      `${client.guilds.cache.get(client.server.id).members.cache.size} Users | WATCHING`,
      "Members Joining | WATCHING",
      "Birds flying | STREAMING",
      "the events | COMPETING",
      "with my emojis | PLAYING",
      "Dreams zzz | WATCHING",
      "Nightmares 😨 | WATCHING",
      "Fortnite | PLAYING",
    ];
  setInterval(() => {
  
    const random = statusArray[~~(Math.random() * statusArray.length)].split(" | ");
    const name = random[0];
    const type = random[1];
  
    client.user.setActivity(`${name}`, { type: `${type}`, url: "https://twitch.tv/nikanwastaken" })
  }, 10000)
  
     */

});

