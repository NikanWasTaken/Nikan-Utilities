const client = require("../../index.js");
const chalk = require("chalk");
const { mem } = require("node-os-utils");
const { version } = require("discord.js");


client.on("ready", (client) => {


  console.clear();
  console.log(chalk.green.bold("Connected!"));
  console.log(
    chalk.cyan.bold("Logged into"),
    chalk.yellow(`${client.user.tag}`),
  );
  console.log(
    chalk.white("Serving drinks for"),
    chalk.red(
      `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`,
    ),
    chalk.white(
      `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
        ? "Members,"
        : "Member,"
      }`,
    ),
    chalk.red(`${client.guilds.cache.size}`),
    chalk.white(`${client.guilds.cache.size > 1 ? "Servers" : "Server"}`),
  );
  console.log(
    chalk.white(`Prefix :` + chalk.red(` ${client.config.prefix}`)),
    chalk.white("||"),
    chalk.red(`${client.commands.size}`),
    chalk.white(`Commands`),
    chalk.white("||"),
    chalk.red(`${client.slashCommands.size}`),
    chalk.white("Slashs"),
  );
  console.log("");
  console.log(chalk.red.bold("——————————[Statistics]——————————"));
  console.log(
    chalk.cyan.bold(`Node version : ${process.version.replace("v", '')}`),
  );
  console.log(
    chalk.cyan.bold(`Discord.js version : ${version}`),
  )
  console.log(
    chalk.cyan.bold(
      `Memory : ${client.convert.byte(mem.totalMem())}`
    ),
  );

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

