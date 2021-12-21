const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
require("dotenv").config()
const mongooseConnectionString = process.env.MONGOOSE;
const mongoose = require('mongoose')

/**
 * @param {Client} client
 */
module.exports = async (client) => {


  var commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
  commandFiles.map((value) => {
    const file = require(value);
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    if (file.name) {
      const properties = { directory, ...file };
      client.commands.set(file.name, properties);
    }
  });

  // Events
  const eventFiles = await globPromise(`${process.cwd()}/events/**/*.js`);
  eventFiles.map((value) => require(value));

  // Slash Commands
  const slashCommands = await globPromise(
    `${process.cwd()}/SlashCommands/*/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    client.slashCommands.set(file.name, file);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    if (file.userPermissions) file.defaultPermission = false
    arrayOfSlashCommands.push(file);
  });

  client.on("ready", async () => {

    const guild = client.guilds.cache.get(`${client.server.id}`)
    await guild.commands.set([])
      .then((cmd) => {
        const getRoles = (commandName) => {
          const permissions = arrayOfSlashCommands.find(x => x.name === commandName).permissions
          if (!permissions) return null;
          return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed)
        }
        const fullPermissions = cmd.reduce((accumulator, x) => {
          const roles = getRoles(x.name)
          if (!roles) return accumulator

          const permissions = roles.reduce((a, v) => {
            return [
              ...a, {
                id: v.id,
                type: "ROLE",
                permission: true
              }
            ]
          }, [])
          return [
            ...accumulator,
            {
              id: x.id,
              permissions,
            }
          ]
        }, [])

        guild.commands.permissions.set({
          fullPermissions
        })

      })


  });


  // mongoose 

  if (!mongooseConnectionString) return;

  mongoose.connect(mongooseConnectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(console.log("Connected to mongo.db!"))
};
