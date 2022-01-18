const Roles = require("../../models/MemberRoles.js");
const client = require("../../index.js")

client.on("messageCreate", async (message) => {

    // Expiring member's mutes
    const data = await Roles.find({ guildId: message?.guild?.id });
    const finaldataMutes = (await data)?.filter(c => Date.now() > c.until);

    finaldataMutes.forEach((data) => {

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

            leftRoles.findOneAndUpdate({ guildid: message?.guild?.id, user: `${data?.userId}` }, { $set: { roles: [data.roles.map(e => e)] } })
            data.delete()

        }
    })

})