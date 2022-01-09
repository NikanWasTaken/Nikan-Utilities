const { Client, MessageEmbed } = require("discord.js");


module.exports = {
    name: "role",
    description: 'Role commands',
    cooldown: 10000,
    permissions: ["BAN_MEMBERS"],
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
    run: async ({ client, interaction }) => {

        const cannotPerform = new MessageEmbed()
            .setDescription(`You don't have permissions to perform that action!`)
            .setColor("RED")

        const subs = interaction.options.getSubcommand(["edit", "list"])

        if (subs === "edit") {

            const role = interaction.options.getRole("role")
            const user = interaction.options.getMember("user")
            const action = interaction.options.getString("action")

            if (action === "add") {


                if (
                    role.position >= interaction.guild.me.roles.highest.position ||
                    interaction.member.roles.highest.position <= user.roles.highest.position ||
                    role.permissions.has("BAN_MEMBERS") ||
                    role.managed
                )
                    return interaction.followUp({ embeds: [cannotPerform] }).then(() => {
                        client.delete.interaction(interaction)
                    })

                let embed = new MessageEmbed()
                    .setDescription(`${user.user} has been added the role ${role}`)
                    .setColor(`${client.color.moderation}`)
                await user.roles.add(role)
                await interaction.followUp({ embeds: [embed] })

            } else if (action === "remove") {

                if (
                    role.position >= interaction.guild.me.roles.highest.position ||
                    interaction.member.roles.highest.position <= user.roles.highest.position ||
                    role.managed
                )
                    return interaction.followUp({ embeds: [cannotPerform] }).then(() => {
                        client.delete.interaction(interaction)
                    })

                let embed = new MessageEmbed()
                    .setDescription(`${user.user} has been removed the role ${role}`)
                    .setColor(`${client.color.moderation}`)
                await user.roles.remove(role)
                await interaction.followUp({ embeds: [embed] })

            }

        } else if (subs === "list") {

            const user = interaction.options.getMember("user");

            const roles = user.roles.cache.sort((a, b) => b.position - a.position).filter(r => r.id !== interaction.guild.id);

            const embed = new MessageEmbed()
                .setAuthor({ name: `${user.user.tag}`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
                .setColor(`${client.color.moderation}`)
                .setTitle(`Role List for ${user.displayName}`)
                .setDescription(roles ?
                    `${roles.map((r) => {
                        return [
                            `${r} **|** ${r.id}`
                        ]
                    }).join("\n")}
                    ` : "This user doesn't have any roles!")
                .setFooter({ text: `Total Roles: ${roles.size}` })
            interaction.followUp({ embeds: [embed] })
        }

    },
};