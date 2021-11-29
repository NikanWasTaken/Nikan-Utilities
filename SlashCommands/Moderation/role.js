const { Client, CommandInteraction, MessageEmbed } = require("discord.js");


module.exports = {
    name: "role",
    description: 'Role commands',
    cooldown: 10000,
    userPermissions: ["BAN_MEMBERS"],
    options: [
        {
            name: "edit",
            description: "Edits a role for a user!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "The user that you want to edit their role!",
                    required: true,
                    type: "USER",
                },
                {
                    name: "role",
                    description: "The role you want to add or remove!",
                    required: true,
                    type: "ROLE",
                },
                {
                    name: "action",
                    description: "The action you want to apply to the user and the role!",
                    required: true,
                    type: "STRING",
                    choices: [
                        {
                            name: "Add the role!",
                            value: "add",
                        },
                        {
                            name: "Remove the role!",
                            value: "remove",
                        }
                    ]
                },

            ]

        },
        {
            name: "list",
            description: "Lists all the roles for a user!",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "The user you want to list their roles!",
                    required: true,
                    type: "USER",
                }
            ]
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const subs = interaction.options.getSubcommand(["edit", "list"])

        if (subs === "edit") {

            const role = interaction.options.getRole("role")
            const user = interaction.options.getMember("user")
            const action = interaction.options.getString("action")

            if (action === "add") {

                let errorembed = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't manage that role for that user!`).setColor(`${client.embedColor.failed}`)
                let ee = new MessageEmbed().setDescription(`${client.botEmoji.failed} You may not give random people staff roles!`).setColor(`${client.embedColor.failed}`)
                let e1 = new MessageEmbed().setDescription(`${client.botEmoji.failed} You don't have permissions to edit roles for that person!`).setColor(`${client.embedColor.failed}`)

                if (role.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [errorembed] })
                if(interaction.member.roles.highest.position <= user.roles.highest.position) return interaction.followUp({ embeds: [e1] })
                if(role.permissions.has("BAN_MEMBERS")) return interaction.followUp({ embeds: [ee] })
                if (role.managed) return interaction.followUp({ embeds: [errorembed] })

                let embed = new MessageEmbed().setDescription(`Added the role ${role.name} to \`${user.user.tag}\``).setColor(`${client.embedColor.moderation}`)
                interaction.followUp({ embeds: [embed] })
                user.roles.add(role)

            } else if (action === "remove") {

                let errorembed = new MessageEmbed().setDescription(`${client.botEmoji.failed} I can't manage that role for that user!`).setColor(`${client.embedColor.failed}`)
                let e1 = new MessageEmbed().setDescription(`${client.botEmoji.failed} You don't have permissions to edit roles for that person!`).setColor(`${client.embedColor.failed}`)

                if (role.position >= interaction.guild.me.roles.highest.position) return interaction.followUp({ embeds: [errorembed] })
                if(interaction.member.roles.highest.position <= user.roles.highest.position) return interaction.followUp({ embeds: [e1] })
                if (role.managed) return interaction.followUp({ embeds: [errorembed] })

                let embed = new MessageEmbed().setDescription(`Removed the role ${role.name} from \`${user.user.tag}\``).setColor(`${client.embedColor.moderation}`)
                interaction.followUp({ embeds: [embed] })
                user.roles.remove(role)

            }

        } else if (subs === "list") {

            const user = interaction.options.getMember("user");

            const embed = new MessageEmbed()
                .setAuthor(`Roles for ${user.user.username}`, user.user.displayAvatarURL({ dynamic: true }))
                .setFooter(`Requested By ${interaction.user.username}`)
                .setColor("BLURPLE")
                .setTimestamp()
                .setThumbnail(`${interaction.guild.iconURL({ dynamic: true} )}`)
                .setDescription(`Here is all the roles for the member: ${user.user.tag}\n\n${user.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== interaction.guild.id).map((role, i) => {

                   return [
                       `• ${role.name} | \`${role.id}\``
                   ]

                }).join("\n")
                    }\n\n➢ In total they have **${user.roles.cache.size}** roles!`)

                    interaction.followUp({ embeds: [embed] })
        }

    },
};