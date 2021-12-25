const client = require("../../index.js");
const Roles = require("../../models/MemberRoles.js");
const leftRoles = require("../../models/LeftMembers.js");


client.on("guildMemberUpdate", async (oldMember) => {

    const data = await Roles.find({ guildId: oldMember.guild?.id });
    const finaldata = (await data)?.filter(c => Date.now() > c.until);

    finaldata.forEach((data) => {

        const findmember = oldMember?.guild?.members?.cache?.get(`${data?.userId}`);

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

            leftRoles.findOneAndUpdate({ guildid: oldMember?.guild?.id, user: `${data?.userId}` }, { $set: { roles: [data.roles.map(e => e)] } })
            data.delete()

        }

    })
})