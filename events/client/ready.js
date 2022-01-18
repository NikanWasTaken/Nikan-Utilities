const clientExported = require("../../index.js");
const chalk = require("chalk");
const { mem } = require("node-os-utils");
const { version } = require("discord.js");

clientExported.on("ready", (client) => {

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
      "Boo nuggies | WATCHING",
      "Fortnite | PLAYING",
    ];

  setInterval(() => {

    const random = statusArray[~~(Math.random() * statusArray.length)].split(" | ");
    const name = random[0];
    const type = random[1];

    client.user.setActivity(`${name}`, { type: `${type}`, url: "https://twitch.tv/nikanwastaken" })
  }, 10000)

  console.log(chalk.greenBright.bold("Connected!"))
  console.log(
    [
      `${chalk.whiteBright.bold("Logged Into:")} ${chalk.blueBright(`${client.user.tag}`)}`,
      `${chalk.yellow.bold("➜ Registered:")}`,
      `• ${chalk.cyanBright(`${client.commands.size} commands`)}`,
      `• ${chalk.cyanBright(`${client.slashCommands.size} slash commands`)}`,
      chalk.red("——————————[Statistics]——————————"),
      `${chalk.bgBlueBright.red("• Memory:")} ${chalk.bgBlueBright.blueBright(`${client.convert.byte(mem.totalMem())}`)}`,
      `${chalk.bgBlueBright.red("• NodeJs:")} ${chalk.bgBlueBright.blueBright(`v${process.version}`)}`,
      `${chalk.bgBlueBright.red("• DiscordJs:")} ${chalk.bgBlueBright.blueBright(`v${version}`)}`,
      `${chalk.bgBlueBright.red("• Memory:")} ${chalk.bgBlueBright.blueBright(`${client.convert.byte(mem.totalMem())}`)}`,
    ].join("\n")
  )
});

