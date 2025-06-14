require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Deploying Commands');
        await rest.put(
            Routes.applicationCommands('1362806385057730651'),
            { body: [
                new SlashCommandBuilder()
                    .setName('about')
                    .setDescription('About this bot')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('balance')
                    .setDescription('View your balance')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('help')
                    .setDescription('View the bot\'s commands')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('invest')
                    .setDescription('Invest your cookies')
                    .addStringOption(option => 
                        option.setName('amount')
                            .setDescription('Amount of cookies to invest')
                            .setRequired(true))
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('view-piggy')
                    .setDescription('View your piggy bank')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('dep-piggy')
                    .setDescription('Deposit cookies into your piggy bank')
                    .addStringOption(option => 
                        option.setName('amount')
                            .setDescription('Amount of cookies to deposit')
                            .setRequired(true))
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('with-piggy')
                    .setDescription('Withdraw cookies from your piggy bank')
                    .addStringOption(option => 
                        option.setName('amount')
                            .setDescription('Amount of cookies to withdraw')
                            .setRequired(true))
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('view-vault')
                    .setDescription('View the server vault')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('dep-vault')
                    .setDescription('Deposit cookies/gems into the server vault')
                    .addStringOption(option => 
                        option.setName('currency')
                            .setDescription('Currency to deposit (cookies/gems)')
                            .setRequired(true))
                    .addStringOption(option => 
                        option.setName('amount')
                            .setDescription('Amount to deposit (or "all")')
                            .setRequired(true))
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('claim-drop')
                    .setDescription('Claim the server\'s drop')
                    .toJSON(),
            ]}
        );
        console.log('Finished Deploying Commands');
    } catch (error) {
        console.error(error);
    }
})();