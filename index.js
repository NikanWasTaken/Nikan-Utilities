const {Collection, Client, Discord} = require('discord.js')
const fs = require('fs')
const client = new Client({
    disableEveryone: true
})
const mongoose = require("mongoose")
const config = require('./config.json')
const prefix = config.prefix
const token = config.token
module.exports = client;
client.commands = new Collection();
client.aliases = new Collection();
client.snipes = new Collection();


mongoose.connect('mongodb+srv://Nikan:Nikan@1234@warn-system.jv3y3.mongodb.net/test', {
useUnifiedTopology: true,
useNewUrlParser: true, 
}).then(console.log("Connected to mongo.db!"))

client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 



client.login(token)
