const { EmbedBuilder, Message, Client } = require('discord.js')
const format = require('./numformat')
const server = require('./server')
const bot = require('./bot')

module.exports = async (message, client) => {
    let s = await server.findOne({ guildId: message.guild.id })
    let b = await bot.findOne({ client: client.user.id })

    s.dropsmsg = s.dropsmsg + 1
    await s.save()

    if (s.dropsmsg >= 40) {
        s.isDrop = true
        s.dropsmsg = 0
        s.drop = Math.random()
        await s.save()
            
        b.totalMessagesSent += 1
        await b.save()

        const dropembed = new EmbedBuilder()
            .setTitle('Server Drop')
            .setColor('#36393F')
            .setDescription(`
Type \`${b.prefix}claim-drop\` to claim!

**>** **Prize** ${(100 * s.drop).toFixed(2)}% of piggy bank
            `)
            .setTimestamp()

        message.channel.send({ embeds: [dropembed] })
    }
}