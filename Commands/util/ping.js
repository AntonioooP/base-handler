// Normal non slash command

module.exports = {
    name: 'ping',
    description: 'Ping the bot',
    run(client, message, args, Discord, send) {
        send('Pong! ' + client.ws.ping)
    }
}
