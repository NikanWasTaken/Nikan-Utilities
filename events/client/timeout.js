const client = require("../../index.js");
const Roles = require("../../models/MemberRoles.js");
const leftRoles = require("../../models/LeftMembers.js");


client.on("messageCreate", async (message) => {

    const data = await Roles.find({ guildId: message.guild?.id });
    const finaldata = (await data)?.filter(c => Date.now() > c.until);

    finaldata.forEach((data) => {

        const findmember = message?.guild?.members?.cache?.get(`${data?.userId}`);

        client.log.autoAction({
            type: "Unmute",
            color: "UNMUTE",
            user: `${data?.userId}`,
            reason: `${data?.reason}`
        });

        if (findmember) {

            data?.roles?.map((w) => findmember?.roles.set(w));
            data.delete()

        } else if (!findmember) {

            leftRoles.findOneAndUpdate({ guildid: message.guild.id, user: `${data?.userId}` }, { $set: { roles: [data.roles.map(e => e)] } })
            data.delete()

        }

    })
})