const {glob} = require('glob'), {promisify} = require('util'), globPromise = promisify(glob), chalk = require('chalk')
module.exports = async (client) => {
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`)
    eventFiles.map((a) => require(a))

    const cmds = await globPromise(`${process.cwd()}/Commands/*/*.js`)
    const arr = []

    cmds.map((value) => {
        const file = require(value)
        if (!file?.name) return
        const splitted = value.split('/')
        const directory = splitted[splitted.length - 2]
        file.directory = directory
        client.commands.set(file.name, file)
        if (file.slash?.run) {
            file.slash.name = file.name
            file.slash.description = file.description
            arr.push(file.slash)
        }
    })
    client.on('ready', async () => {        
        // Register for a single guild
        client.guilds.cache.get('824352390676611144').commands.set(arr).catch(console.log)
        // Register for all the guilds, can take up to one hour.
        // await client.application.commands.set(arr);
    })
}