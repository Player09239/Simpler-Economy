const { EmbedBuilder, Message, Client } = require('discord.js')
const user = require('./data')
const bot = require('./bot')
const format = require('./numformat')

module.exports = async (interaction, commandName, client, dep_piggycd) => {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === `dep-piggy`) {
            let u = await user.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1

            await b.save()

            if (dep_piggycd.has(interaction.user.id)) {
                const cooldownEmbed = new EmbedBuilder()
                    .setTitle('Cooldown')
                    .setColor('Red')
                    .setDescription(`Please try again <t:${u.last.dep_piggy + 10}:R>.`)
                    .setTimestamp()

                return interaction.reply({ embeds: [cooldownEmbed] })
            }

            const err2 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`amount` param expected number')
                .setTimestamp()

            const err3 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`amount` param expected numbers more than 0')
                .setTimestamp()
        
            const amount = interaction.options.getString('amount')
            if (amount.toLowerCase() === 'all') {
                const targetamount = u.cookies
                u.cookies = 0
                u.piggybank = u.piggybank + targetamount
                await u.save()

                const success = new EmbedBuilder()
                    .setTitle('Deposited')
                    .setColor('#36393F')
                    .setDescription(`
**${interaction.user.username}**

**>** **Deposited Cookies** ${await format(targetamount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Your Piggy Bank** ${await format(u.piggybank)} 🍪
                    `)
                    .setTimestamp()

                return interaction.reply({ embeds: [success] })
            }

            if (isNaN(Number(amount))) {
                return interaction.reply({ embeds: [err2] })
            }   

            const targetamount = Math.floor(Number(amount))

            if (targetamount < 1) return interaction.reply({ embeds: [err3] }) 

            const err4 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription(`You don\'t have enough cookies for this deposit!\n\n**>** **Amount Missing** ${await format(targetamount - u.cookies)} 🍪`)
                .setTimestamp()

            if (targetamount > u.cookies) return interaction.reply({ embeds: [err4] })

            u.cookies = u.cookies - targetamount
            u.piggybank = u.piggybank + targetamount

            await u.save()

            const success = new EmbedBuilder()
                .setTitle('Deposited')
                .setColor('#36393F')
                .setDescription(`
**${interaction.user.username}**

**>** **Deposited Cookies** ${await format(targetamount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
**>** **Your Piggy Bank** ${await format(u.piggybank)} 🍪
                `)
                .setTimestamp()

            interaction.reply({ embeds: [success] })     
            
            u.last.dep_piggy = Math.floor(Date.now() / 1000)
            await u.save()
            dep_piggycd.add(interaction.user.id)
            setTimeout(() => {
                dep_piggycd.delete(interaction.user.id)
            }, 10000)
        }
    } catch (error) {
        const internal_error = new EmbedBuilder()
            .setTitle('Internal Error')
            .setDescription(`\`${error}\``)
            .setColor('Red')
            .setTimestamp()

        interaction.reply({ embeds: [internal_error] })

        console.error(`> [${interaction.guild.id}] Error Detected: ${error}`)
    }
}