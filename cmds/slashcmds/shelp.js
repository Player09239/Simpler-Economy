import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function slash_help(interaction, commandName, client, helpcd) {
    let b = await bot.findOne({ client: client.user.id })

    if (commandName === `help`) {
        let u = await data.findOne({ userId: interaction.user.id })
        b.totalCommandsExecuted += 1
        b.totalMessagesSent += 1

        await b.save()

        if (helpcd.has(interaction.user.id)) {
            const cooldownEmbed = new EmbedBuilder()
                .setTitle('Cooldown')
                .setColor('Red')
                .setDescription(`Please try again <t:${u.last.help + 20}:R>.`)
                .setTimestamp()

            return interaction.reply({ embeds: [cooldownEmbed] })
        }

        const help = new EmbedBuilder()
            .setTitle('Help')
            .setColor('#36393F')
            .setDescription(`
**${interaction.user.username}**

**>** **Prefix** \`/\`

**Commands**
**>** **help** Show this message
**>** **invest** Invest your cookies
- invest <amount>
**>** **view-piggy** View your piggy bank
**>** **view-vault** View the server vault
**>** **dep-piggy** Deposit cookies into your piggy bank
- dep-piggy <amount>
**>** **dep-vault** Deposit cookies/gems into the server vault
- dep-vault <currency> <amount>
**>** **with-piggy** Withdraw cookies from your piggy bank
- with-piggy <amount>
**>** **balance** View your balance
**>** **daily** Claim your daily cookies
**>** **claim-drop** Claim the server's drop
**>** **about** About this bot
**>** **walk** Walk to earn cookies
**>** **mine** Mine for a chance to earn gems
**>** **leaderboard** View the global leaderboard
- leaderboard <type>
**>** **server-info** View server information

                `)
            .setTimestamp()

        interaction.reply({ embeds: [help] })

        u.last.help = Math.floor(Date.now() / 1000)
        await u.save()
        helpcd.add(interaction.user.id)
        setTimeout(() => {
            helpcd.delete(interaction.user.id)
        }, 20000)
    }
}