// Normal non prefix command
module.exports = {
    name: 'help',
    description: 'hepl commadn',
    slash: {
        run(client, interaction, args, Discord, send) {
            send('*helps*')
        }
    }
}
