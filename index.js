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

// Import Slash CMDS
const slash_claim_drop = require('./sclaim-drop')
const slash_help = require('./shelp')
const slash_invest = require('./sinvest')
const slash_dep_piggy = require('./sdep-piggy')
const slash_with_piggy = require('./swith-piggy')
const slash_balance = require('./sbalance')
const slash_about = require('./sabout')
const slash_daily = require('./sdaily')
const slash_view_piggy = require('./sview-piggy')
const slash_view_vault = require('./sview-vault')
const slash_dep_vault = require('./sdep-vault')
const slash_server_info = require('./sserver-info')
const slash_leaderboard = require('./sleaderboard')
const slash_walk = require('./swalk')
const smine = require('./smine')


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
  try {
    console.log(`> ${client.user.tag} is now online!`)
  } catch (error) {
    console.error('> Error while logging in:', error);
  }
})

// Cooldown for commands
const balancecd = new Set()
const walkcd = new Set()
const aboutcd = new Set()
const dep_piggycd = new Set()
const view_piggycd = new Set()
const with_piggycd = new Set()
const claim_dropcd = new Set()
const helpcd = new Set()
const leaderboardcd = new Set()
const view_vaultcd = new Set()
const dep_vaultcd = new Set()
const minecd = new Set()
const server_infocd = new Set()

client.on('messageCreate', async (message) => {
  await msg(message, client)
  await drop(message, client)

  await balance(message, client, balancecd)
  await walk(message, client, walkcd)
  await about(message, client, aboutcd)
  await dep_piggy(message, client, dep_piggycd)
  await view_piggy(message, client, view_piggycd)
  await daily(message, client)
  await with_piggy(message, client, with_piggycd)
  await claim_drop(message, client, claim_dropcd)
  await invest(message, client)
  await help(message, client, helpcd)
  await leaderboard(message, client, leaderboardcd)
  await view_vault(message, client, view_vaultcd)
  await dep_vault(message, client, dep_vaultcd)
  await mine(message, client, minecd)
  await server_info(message, client, server_infocd)
  await forcetake(message, client)
  await forcegive(message, client)
})

client.on('interactionCreate', async (interaction) => {
  const { commandName } = interaction

  await slash_dep_vault(interaction, commandName, client, dep_vaultcd)
  await slash_claim_drop(interaction, commandName, client, claim_dropcd)
  await slash_help(interaction, commandName, client, helpcd)
  await slash_invest(interaction, commandName, client)
  await slash_dep_piggy(interaction, commandName, client, dep_piggycd)
  await slash_with_piggy(interaction, commandName, client, with_piggycd)
  await slash_balance(interaction, commandName, client, balancecd)
  await slash_about(interaction, commandName, client, aboutcd)
  await slash_view_piggy(interaction, commandName, client, view_piggycd)
  await slash_daily(interaction, commandName, client)
  await slash_view_vault(interaction, commandName, client, view_vaultcd)
  await slash_server_info(interaction, commandName, client, server_infocd)
  await slash_leaderboard(interaction, commandName, client, leaderboardcd)
  await slash_walk(interaction, commandName, client, walkcd)
  await smine(interaction, commandName, client, minecd)

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

