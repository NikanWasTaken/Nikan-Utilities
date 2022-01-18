const client = require("../../index.js")


client.on("threadCreate", async (t) => {
    if (!t.joinable) return
    t.join()
})