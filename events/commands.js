const client = require('../index'), Discord = require('discord.js')

client.on('messageCreate', cmds)
client.on('interactionCreate', cmds)

async function cmds(msg /* msg = msg or interaction */) {
    let embed = new Discord.MessageEmbed().setTimestamp().setColor('BLUE')
    if (msg.isCommand && msg.isCommand()) { // if its an interaction, execute the slash command
        embed.setAuthor(msg.user.tag, msg.user.displayAvatarURL({ dynamic: true }))

        function send(txt, ...components) { // send embed or text and components (optional)
            return new Promise((res, rej) => msg.followUp(typeof txt == 'object' ? { embeds: [txt], components} : { content: txt, components }).then(res, rej))
        }

        await msg.deferReply({ephemeral: false}).catch(() => {})
        const command = client.commands.get(msg.commandName)
        if (!command) return send('An error has occured ')
        const args = []
        for (let option of msg.options.data) {
            if (option.type === 'SUB_COMMAND') {
                if (option.name) args.push(option.name)
                option.options?.forEach((x) => {
                    if (x.name) args.push(x.name)
                    if (x.value) args.push(x.value)
                })
            } else if (option.value) args.push(option.value)
        }
        try {
            await command.slash.run(client, msg, args, Discord, send, embed)
        } catch (err) {
            console.log(err)
            embed.setTitle('An error occured.').setDescription('Please try again later.').setColor('RED').addField('Error', err.msg)
            return send(embed)
        }
    }
    // or if its a message, execute the command
    if (!msg.content) return
    if (msg.author.bot || !msg.guild) return
    
    embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
    function send(txt, ...components) {
        return new Promise((res, rej) => msg.channel.send(typeof txt == 'object' ? { embeds: [txt], components} : { content: txt, components }).then(res, rej))
    }
    if (msg.content.match(new RegExp(`^<@!?${client.user.id}>\\s*(prefix)?$`, 'i'))) {
        embed.setTitle(client.user.username)
        embed.setDescription('My prefix is `' + client.prefix + '`. Run `' + client.prefix + 'help` to see my commands.')
        return send(embed)
    }
    if (!msg.content.toLowerCase().startsWith(client.prefix)) return;
    let [ cmd, ...args ] = msg.content.slice(client.prefix.length).split(/ +/)
    cmd = cmd.toLowerCase()
    if (!cmd) return

    const command = client.commands.get(cmd) || client.commands.find((c) => c.aliases?.includes(cmd))
    if (!command) {
        embed.setTitle('Invalid command.')
        embed.setDescription("This command doesn't exist. Run `" + client.prefix + 'help` to see my commands.')
        embed.setColor('RED')
        return send(embed)
    }

    if (command.dev && !client.owners.includes(msg.author.id)) return
    if (command.run) {
        try {
            await command.run(client, msg, args, Discord, send, embed)
            } catch (err) {
            console.log(err)
            embed.setTitle('An error occured.').setDescription('Please try again later.').setColor('RED').addField('Error', err.msg)
            return send(embed)
        }
    }
}