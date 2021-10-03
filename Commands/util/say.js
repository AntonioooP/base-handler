// Ping command example, will run with slash commands and prefix 
module.exports = {
    name: 'say', // obligatory
    description: 'say something', // obligatory
    aliases: [ 'somealias' ], // Add alias for normal commands, optional
    dev: false, // only the owner can use this command, default false
    run(client, message, args, Discord, send, embed) { // Optional if using slash command
        send(args[0] ? args.join(' ') : 'You need to specify a text') // Instead of message.channel.send()
    },
    slash: { // obligatory if not using normal command (optional)
        options: [ { // array of slash command options (optional)
            name: 'word',
            description: 'say something',
            type: 'STRING',
            required: true
        }],
        run(client, interaction, args, Discord, send, embed) { // obligatory if using slash
            send(args[0]) // Instead of interaction.followUp()
        }
    }
}