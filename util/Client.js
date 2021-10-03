const {Client, Collection} = require('discord.js')
const {connect} = require('mongoose')
const chalk = require('chalk')
module.exports = class extends Client {
    constructor () {
        super({ // Client options (https://discord.js.org/#/docs/main/stable/typedef/ClientOptions)
            allowedMentions: { parse: [] },
            intents: 32767 // All intents
        })
        this.commands = new Collection()
        this.owners = [ 'Your ID', 'Another owner ID' ]
        this.config = require('../config.json')
        this.db(this.config.mongo)
        this.login(this.config.token)
        this.setStatus([ 'All the', 'client status', 'you want' ])
        
        this.prefix = '!' // Your default prefix.
    }
    db(s) { // MongoDB connection
        if (s) connect(s, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log(chalk.green('Connected to DB')), (er) => console.log(chalk.red('Error connecting to DB: ' + er)))
    }
    setStatus(a) { // Set changing status
        setInterval(() => this.user.setActivity(a[Math.floor(Math.random() * a.length)], {type: 'WATCHING'}), 20000)
    }
    log(...args) {
        console.log(chalk.green(`[${new Date().toLocaleString()}] -`, ...args)) // client.log() function
    }
    init = require('./handler')(this) // starting handlers
}