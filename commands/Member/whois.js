const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'whois',
    category : 'info',
    description : `Check a user information using ">whois (user)". You can only mention a user in user section.`,
    usage:'<#800421771114709022>, <#844418140796092466>',
    aliases:['userinfo'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

      var permissions = [];
      var badges = [];
      var know = "None"
      let member = message.mentions.members.first() ||  message.guild.members.cache.get(args[0]) || message.member;

    if(member.permissions.has("ADMINISTRATOR")){
        permissions.push("Administrator");
    }

  if(member.permissions.has("MANAGE_ROLES")){
    permissions.push("Manage Roles");
 }

  if(member.permissions.has("MANAGE_CHANNELS")){
    permissions.push("Manage Channels");
}

if(member.permissions.has("MANAGE_MESSAGES")){
  permissions.push("Manage Messages");
}

if(member.permissions.has("MANAGE_WEBHOOKS")){
  permissions.push("Manage Webhooks");
}

if(member.permissions.has("MANAGE_NICKNAMES")){
  permissions.push("Manage Nicknames");
}

if(member.permissions.has("MANAGE_EMOJIS")){
  permissions.push("Manage Emojis");
}

      if(member.permissions.has("KICK_MEMBERS")){
        permissions.push("Kick Members");
    }
    
    if(member.permissions.has("BAN_MEMBERS")){
        permissions.push("Ban Members");
    }
    
    if(member.permissions.has("MENTION_EVERYONE")){
        permissions.push("Mention Everyone");
    }


    if(permissions.length == 0){
        permissions.push("No Key Permissions Found");
    }


    //---------------------------------------------------------------

    if(member.permissions.has("VIEW_AUDIT_LOG")){
        know = "Server Bot Developer"; 
    }

    if(member.permissions.has("MANAGE_MESSAGES")){
        know = "Server Trainee Moderator"; 
    }

    if(member.permissions.has("BAN_MEMBERS")){
        know = "Server Moderator"; 
    }

    if(member.permissions.has("MANAGE_ROLES")){
        know = "Server Head Moderator"; 
    }

    if(member.permissions.has("ADMINISTRATOR")){
        know = "Server Admin"; 
    }


    if(member.user.id == message.guild.owner.id){
        know = 'Server Owner';
    }

    
    // --------------------------------- 

  
    if(member.user.flags.has("HOUSE_BRILLIANCE")){
      badges.push("<:brilliance_badge:871441718237626409> ");
   }

   if(member.user.flags.has("PARTNERED_SERVER_OWNER")){
      badges.push("<:discordpartner:875668174023053332> ");
   }


   if(member.user.flags.has("HOUSE_BALANCE")){
      badges.push("<:balance_badge:871440767644745799> ");
   }


   if(member.user.flags.has("HOUSE_BRAVERY")){
      badges.push("<:bravery_badge:871441031239987250> ");
   }


   if(member.user.flags.has("VERIFIED_BOT")){
      badges.push("<:bot_badge:871448386992242688> ");
   }

   if(member.user.flags.has("TEAM_USER")){
      badges.push("<:discordstaff:875668174601867264> ");
   }

   if(member.user.flags.has("SYSTEM")){
      badges.push("<:system_badge:871451536943898704> ");
   }





      let botcmd = `${message.author}, You can only use this command in <#800421771114709022>.`

            if (message.channel.id === '800421771114709022' || message.channel.id === "844418140796092466") {
           let e = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL( { dynamic:true } ))
           .setTimestamp()
           .addFields({
             name: "Joined",
           value: member.joinedAt.toLocaleDateString("en-us"),
           inline: true
           }, {
            name: "Registered",
           value: member.user.createdAt.toLocaleDateString("en-us"),
           inline: true
           }, {
           name: "Avatar Link",
           value: `[[Click Here]](${member.user.displayAvatarURL()})`,
           inline: true
           }, {
            name: "Highest Role",
            value: member.roles.highest.id === message.guild.id ? "Doesn't have any role!" : `${member.roles.highest}`,
            inline: true
            }, {
            name: "Badges",
            value: `${badges.join(" ")}` || "Doesn't have any badge!", 
            inline: true
          }, {
            name: "Nickname",
            value: member.displayName == member.user.username ? "No Nickname" : member.displayName, 
            inline: true
            }, {
           name: `Roles [${Math.floor(member.roles.cache.size - 1)}]`,
           value: `${member.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== message.guild.id).map(role => role.toString()).join(" ")}` || "Doesn't have any role!",
           inline: false
           }, {
            name: `Key Permissions`,
            value: permissions.join(`, `),
            inline: false
           }, {
            name: `Acknowledgements`,
            value: know,
            inline: false
           })
           .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
           .setFooter(`ID: ${member.user.id}`)
           message.channel.send(e);
           } else 
                message.channel.send(botcmd).then(message => message.delete({timeout: 10000}));
           }

        

}
