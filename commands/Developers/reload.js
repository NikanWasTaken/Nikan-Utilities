const { MessageEmbed } = require('discord.js')
const glob = require("glob");
require("dotenv").config()

module.exports = {
    name: 'reload',
    category: 'Developers',
    developerOnly: true,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run: async (client, message, args) => {


        client.commands.sweep(() => true)

        glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
            
            if (err) return console.log(err);
            filePaths.forEach((file) => {
                delete require.cache[require.resolve(file)];

                const pull = require(file);
                
                if (pull.name) {

                    client.commands.set(pull.name, pull);
                }


            });

        });


        glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
            
            if (err) return console.log(err);
            filePaths.forEach((file) => {
                delete require.cache[require.resolve(file)];

                const pull = require(file);
                
                if (pull.name) {

                    client.slashCommands.set(pull.name, pull);

                }


            });

        });


       message.reply({ content: "Messages commanads and slash commands have been reloaded!" })
        
    }
}