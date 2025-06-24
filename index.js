import * as dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits, Message } from 'discord.js'
import mongoose from 'mongoose'

// Import EVENTS
import { msg } from './msgCreate.js'
import { drop } from './randomdrops.js'

// Import Prefix CMDS
import { balance } from './balance.js'
import { walk } from './walk.js'
import { about } from './about.js'
import { dep_piggy } from './dep-piggy.js'
import { view_piggy } from './view-piggy.js'
import { daily }  from './daily.js'
import { with_piggy } from './with-piggy.js'
import { claim_drop } from './claim-drop.js'
import { invest } from './invest.js'
import { help } from './help.js'
import { leaderboard } from './leaderboard.js'
import { view_vault } from './view-vault.js'
import { dep_vault } from './dep-vault.js'
import { mine } from './mine.js'
import { server_info } from './server-info.js'
import { forcetake } from './forcetake.js'
import { forcegive } from './forcegive.js'

// Import Slash CMDS
import { slash_balance } from './sbalance.js'
import { slash_walk } from './swalk.js'
import { slash_about } from './sabout.js'
import { slash_dep_piggy } from './sdep-piggy.js'
import { slash_view_piggy } from './sview-piggy.js'
import { slash_daily }  from './sdaily.js'
import { slash_with_piggy } from './swith-piggy.js'
import { slash_claim_drop } from './sclaim-drop.js'
import { slash_invest } from './sinvest.js'
import { slash_help } from './shelp.js'
import { slash_leaderboard } from './sleaderboard.js'
import { slash_view_vault } from './sview-vault.js'
import { slash_dep_vault } from './sdep-vault.js'
import { slash_mine } from './smine.js'
import { slash_server_info } from './sserver-info.js'


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
  await slash_mine(interaction, commandName, client, minecd)

})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('> Connected to MongoDB');
  })
  .catch((err) => {
    console.error('> Failed to connect to MongoDB:', err);
  });

client.login(process.env.TOKEN)

