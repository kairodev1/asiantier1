const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const config = require('../../config/config');
const emojis = require('../../config/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendhighpanel')
        .setDescription('Send the High Tests panel'),

    async execute(interaction) {

    
// ==========================================
// ADMINISTRATOR ONLY
// ==========================================

if (!interaction.memberPermissions?.has('Administrator')) {
    return interaction.reply({
        content:
            '<:crosss:1572295157200457819>s:1567480131713241108> You need Administrator permission to use this command.',
        ephemeral: true
    });
}


        // ==========================================
        // EMOJIS
        // ==========================================

        const diaPotEmoji =
            emojis.gamemodes?.DiaPot ||
            '<:diapot:1534871592730099743>';

        // EXACT CUSTOM <:trophy:1572294715343249538> EMOJI
        const <:trophy:1572294715343249538>Emoji =
            '<:<:trophy:1572294715343249538>~1:1567483693130584136>';

        // ==========================================
        // EMBED
        // ==========================================

        const embed =
            new EmbedBuilder()
                .setColor(0x5865F2)

                .setAuthor({
                    name: 'AsianTiers | HIGH TESTS — NOW OPEN',
                    iconURL:
                        'https://cdn.discordapp.com/emojis/1534871592730099743.png'
                })

                .setDescription(
                    '> **High Tests are now officially open!**'
                )

                .addFields({
                    name:
                        `${<:trophy:1572294715343249538>Emoji} | HT Requirements`,

                    value:
                        '• You must be **LT3 or higher** to apply for a High Test.\n' +
                        '• You must pass your **HT Evaluation** before opening an **HT Ticket**.'
                })

                .addFields({
                    name:
                        '────────────────────────────',

                    value:
                        '**Good luck with your tests!**',

                    inline: false
                });

        // ==========================================
        // GAMEMODE BUTTONS
        // ==========================================

        const gamemodes = [
            'Axe',
            'Sword',
            'Mace',
            'SMP',
            'UHC',
            'DiaPot',
            'spearmace',
            'diasmp',
            'manhunt',
            'shieldlessuhc',
            'cart',
            'Nethpot',
            'Crystal'
        ];

        const rows = [];

        for (let i = 0; i < gamemodes.length; i += 4) {

            const row =
                new ActionRowBuilder();

            for (
                const gamemode
                of gamemodes.slice(i, i + 4)
            ) {

                const button =
                    new ButtonBuilder()
                        .setCustomId(
                            `high_test_${gamemode}`
                        )
                        .setLabel(
                            config.gamemodeNames?.[gamemode] || gamemode
                        )
                        .setStyle(
                            ButtonStyle.Primary
                        );

                const emoji =
                    emojis.gamemodes?.[gamemode];

                if (emoji) {

                    const match =
                        emoji.match(
                            /<a?:\w+:(\d+)>/
                        );

                    if (match) {
                        button.setEmoji({
                            id: match[1]
                        });
                    }
                }

                row.addComponents(button);
            }

            rows.push(row);
        }

        // ==========================================
        // SEND PANEL
        // ==========================================

        await interaction.channel.send({
            embeds: [embed],
            components: rows
        });

        return interaction.reply({
            content:
                '<:tick:1572295109154701352>:1567480091267825714> High Tests panel sent.',
            ephemeral: true
        });
    }
};