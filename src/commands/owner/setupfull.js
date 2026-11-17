const { SlashCommandBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config/config');
const emojis = require('../../config/emojis');
const tierSystem = require('../../utils/tierSystem');
const roleConfig = require('../../utils/roleConfig');
const supabase = require('../../database/supabase');

const OWNER_ID = '1105165947590938866';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function hexToInt(hex) { return parseInt(String(hex).replace('#', ''), 16); }

const gamemodes = config.gamemodes || [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setupfull')
        .setDescription('Complete AsianTiers server setup')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: '<:crosss:1570104768628531290> Only the bot owner can use this command.', flags: MessageFlags.Ephemeral });
        }

        const confirmRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('setupfull_confirm').setLabel('Confirm Setup').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('setupfull_cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({
            content: 'This will create the complete AsianTiers setup for this server. Continue?',
            components: [confirmRow],
            flags: MessageFlags.Ephemeral
        });
    }
};
```

But button handling needs be in interactionCreate. We'll add. The actual setup logic should be in a shared helper to avoid duplication. Let's create `src/utils/setupFull.js` exporting `runSetupFull(interaction)` async. Then command button calls it. Also /updateroleid can call role sync part.

Let's create helper.<|end|><|start|>助手 to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="path">
C:\Users\ME\Downloads\asiantiers-main\asiantiers-main\src\utils\setupFull.js