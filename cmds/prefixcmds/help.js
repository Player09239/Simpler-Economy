const { EmbedBuilder, Message, Client } = require('discord.js')
const bot = require('./bot')
const user = require('./data')

module.exports = async (message, client, helpcd) => {
    let b = await bot.findOne({ client: client.user.id })

    const args = message.content.trim().split(/ +/)
    const command = args.shift();

    if (command === `${b.prefix}help`) {
        b.totalCommandsExecuted += 1
        b.totalMessagesSent += 1

        await b.save()

        let u = await user.findOne({ userId: message.author.id })
        
        if (helpcd.has(message.author.id)) {
            const cooldownEmbed = new EmbedBuilder()
                .setTitle('Cooldown')
                .setColor('Red')
                .setDescription(`Please try again <t:${u.last.help + 20}:R>.`)
                .setTimestamp()

            return message.channel.send({ embeds: [cooldownEmbed] })
        }

        const help = new EmbedBuilder()
            .setTitle('Help')
            .setColor('#36393F')
            .setDescription(`
**${message.author.username}**

**>** **Prefix** \`${b.prefix}\`

**Commands**
**>** **${b.prefix}help** Show this message
**>** **${b.prefix}invest** Invest your cookies
- ${b.prefix}invest <amount>
**>** **${b.prefix}view-piggy** View your piggy bank
**>** **${b.prefix}view-vault** View the server vault
**>** **${b.prefix}dep-piggy** Deposit cookies into your piggy bank
- ${b.prefix}dep-piggy <amount>
**>** **${b.prefix}dep-vault** Deposit cookies/gems into the server vault
- ${b.prefix}dep-vault <currency> <amount>
**>** **${b.prefix}with-piggy** Withdraw cookies from your piggy bank
- ${b.prefix}with-piggy <amount>
**>** **${b.prefix}balance** View your balance
**>** **${b.prefix}daily** Claim your daily cookies
**>** **${b.prefix}claim-drop** Claim the server's drop
**>** **${b.prefix}about** About this bot
**>** **${b.prefix}walk** Walk to earn cookies
**>** **${b.prefix}mine** Mine for a chance to earn gems
**>** **${b.prefix}leaderboard** View the global leaderboard
- ${b.prefix}leaderboard <type>
**>** **${b.prefix}server-info** View server information

                `)
            .setTimestamp()

        message.channel.send({ embeds: [help] })

        u.last.help = Math.floor(Date.now() / 1000)
        await u.save()
        helpcd.add(message.author.id)
        setTimeout(() => {
            helpcd.delete(message.author.id)
        }, 20000)
    }
}