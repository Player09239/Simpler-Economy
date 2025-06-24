import { EmbedBuilder, Client, Message } from 'discord.js'
import data from './data.js'
import bot from './bot.js'
import server from './server.js'
import { format } from './functions.ts'

export async function slash_invest(interaction, commandName, client) {
    try {
        let b = await bot.findOne({ client: client.user.id })

        if (commandName === 'invest') {

            const amountArg = interaction.options.getString('amount') || interaction.options.getInteger('amount') || 'all';

            let u = await data.findOne({ userId: interaction.user.id })

            b.totalCommandsExecuted += 1
            b.totalMessagesSent += 1
            await b.save()

            // If user has an active investment
            if (u.investment && u.investment.active) {
                const now = Date.now();
                if (now < u.investment.finish) {
                    const remaining = u.investment.finish - now;
                    const hours = Math.floor(remaining / (60 * 60 * 1000));
                    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
                    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

                    const waitEmbed = new EmbedBuilder()
                        .setTitle('Error')
                        .setColor('Red')
                        .setDescription(`
**${interaction.user.username}**

Your investment is not ready yet!

**>** **Invested** ${await format(u.investment.amount)} 🍪
**>** **Time Remaining** ${hours}h ${minutes}m ${seconds}s
                        `)
                        .setTimestamp()
                    return interaction.reply({ embeds: [waitEmbed], ephemeral: true })
                }

                // Time is up, claim investment
                // RNG: 40% lose (50-99%), 60% gain (101-150%)
                const rng = Math.random();
                let percent;
                let resultAmount;
                let color;
                if (rng < 0.4) {
                    // Lose: 50% - 99%
                    percent = Math.floor(Math.random() * 50) + 50; // 50-99
                    resultAmount = Math.floor(u.investment.amount * (percent / 100));
                    color = '#36393F';
                } else {
                    // Gain: 101% - 150%
                    percent = Math.floor(Math.random() * 50) + 101; // 101-150
                    resultAmount = Math.floor(u.investment.amount * (percent / 100));
                    color = '#36393F';
                }

                u.cookies += resultAmount;
                u.investment.active = false;
                u.markModified && u.markModified('investment');
                await u.save();

                const resultEmbed = new EmbedBuilder()
                    .setTitle('Investment Results')
                    .setColor(color)
                    .setDescription(`
**${interaction.user.username}**

**>** **Invested** ${await format(u.investment.amount)} 🍪
**>** **Returned** ${await format(resultAmount)} 🍪

**>** **Your Cookies** ${await format(u.cookies)} 🍪
                    `)
                    .setTimestamp()

                return interaction.reply({ embeds: [resultEmbed] })
            }

            // No active investment, start a new one
            const err1 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription(`Arguments missing, expected: **/invest <amount>**`)
                .setTimestamp()

            const err2 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`amount` param expected number')
                .setTimestamp()

            const err3 = new EmbedBuilder()
                .setTitle('Error')
                .setColor('Red')
                .setDescription('`amount` param expected number more than 0')
                .setTimestamp()

            if (!amountArg) return interaction.reply({ embeds: [err1], ephemeral: true })

            let amount;
            if (typeof amountArg === "string" && amountArg.toLowerCase() === "all") {
                amount = u.cookies;
                if (amount <= 0) {
                    const errAll = new EmbedBuilder()
                        .setTitle('Error')
                        .setColor('Red')
                        .setDescription('You have no cookies to invest!')
                        .setTimestamp();
                    return interaction.reply({ embeds: [errAll], ephemeral: true });
                }
            } else {
                if (isNaN(amountArg)) {
                    return interaction.reply({ embeds: [err2], ephemeral: true })
                }
                amount = Math.floor(parseInt(amountArg));
                if (amount <= 0) {
                    return interaction.reply({ embeds: [err3], ephemeral: true })
                }
                if (amount > u.cookies) {
                    const err4 = new EmbedBuilder()
                        .setTitle('Error')
                        .setColor('Red')
                        .setDescription(`You don\'t have enough cookies for this investment!\n\n**>** **Amount Missing** ${await format(amount - u.cookies)} 🍪`)
                        .setTimestamp()
                    return interaction.reply({ embeds: [err4], ephemeral: true })
                }
            }

            // Remove cookies and set investment
            u.cookies -= amount;
            u.investment = {
                amount: amount,
                start: Date.now(),
                finish: Date.now() + 3 * 60 * 60 * 1000, // 3 hours
                active: true
            }
            await u.save();

            const success = new EmbedBuilder()
                .setTitle('Investment Started')
                .setColor('#36393F')
                .setDescription(`
**${interaction.user.username}**

**>** **Invested Cookies** ${await format(amount)} 🍪
**>** **Results in** 3h 0m 0s
                `)
                .setTimestamp()

            interaction.reply({ embeds: [success] })
        }
    } catch (error) {
        const internal_error = new EmbedBuilder()
            .setTitle('Internal Error')
            .setDescription(`\`${error}\``)
            .setColor('Red')
            .setTimestamp()

        interaction.reply({ embeds: [internal_error], ephemeral: true })

        console.error(`> [${interaction.guild?.id}] Error Detected: ${error}`)
    }
}