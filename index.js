require('dotenv').config()
const { Client, GatewayIntentBits, Message } = require('discord.js')
const mongoose = require('mongoose')

// Import EVENTS
const msg = require('./msgCreate')
const drop = require('./randomdrops')

// Import Prefix CMDS
const balance = require('./balance')
const walk = require('./walk')
const about = require('./about')
const dep_piggy = require('./dep-piggy')
const view_piggy = require('./view-piggy')
const daily = require('./daily')
const with_piggy = require('./with-piggy')
const claim_drop = require('./claim-drop')
const invest = require('./invest')
const help = require('./help')
const leaderboard = require('./leaderboard')
const view_vault = require('./view-vault')
const dep_vault = require('./dep-vault')
const mine = require('./mine')
const server_info = require('./server-info')
const forcetake = require('./forcetake')
const forcegive = require('./forcegive')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ]
})

client.on('ready', () => {
  console.log(`> ${client.user.tag} is logged in`)
})

client.on('messageCreate', async (message) => {
  await msg(message, client)
  await drop(message, client)

  await balance(message, client)
  await walk(message, client)
  await about(message, client)
  await dep_piggy(message, client)
  await view_piggy(message, client)
  await daily(message, client)
  await with_piggy(message, client)
  await claim_drop(message, client)
  await invest(message, client)
  await help(message, client)
  await leaderboard(message, client)
  await view_vault(message, client)
  await dep_vault(message, client)
  await mine(message, client)
  await server_info(message, client)  
  await forcetake(message, client)
  await forcegive(message, client)

})

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('> Connected to MongoDB');
  })
  .catch((err) => {
    console.error('> Failed to connect to MongoDB:', err);
  });

client.login(process.env.TOKEN)

