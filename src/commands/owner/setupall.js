const { SlashCommandBuilder, MessageFlags, ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../../config/config');
const tierSystem = require('../../utils/tierSystem');
const roleConfig = require('../../utils/roleConfig');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function hexToInt(hex) {
    return parseInt(String(hex).replace('#', ''), 16);
}

function roleColorHex(role) {
    if (!role || !role.color) return null;
    return '#' + role.color.toString(16).padStart(6, '0');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setupall')
        .setDescription('Set up all required roles and categories for this server')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (interaction.user.id !== '1105165947590938866') {
            return interaction.reply({
                content: '<:crosss:1572295157200457819> Only the bot owner can use this command.',
                flags: MessageFlags.Ephemeral
            });
        }

        const guild = interaction.guild;
        const guildId = guild.id;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const created = [];
        const reused = [];
        const failed = [];

        const specs = [];

        // Tier roles (per gamemode)
        for (const gamemode of (config.gamemodes || [])) {
            const display = config.gamemodeNames?.[gamemode] || gamemode;
            for (const tier of tierSystem.ACTIVE_TIERS) {
                specs.push({
                    key: `tier_${gamemode}_${tier}`,
                    name: `${display} ${tier}`,
                    color: tierSystem.getTierColor(tier),
                    category: 'Tier',
                    gamemode,
                    tier
                });
            }
        }

        // General roles
        const generalRoles = [
            { key: 'sser', name: 'SSer', color: '#F1C40F', category: 'General' },
            { key: 'registered', name: 'Registered', color: '#95A5A6', category: 'General' },
            { key: 'priority', name: 'Priority (VIP)', color: '#9B59B6', category: 'General' },
            { key: 'admin', name: 'Admin', color: '#E74C3C', category: 'General' },
            { key: 'verified_tester', name: 'Verified Tester', color: '#2ECC71', category: 'General' },
            { key: 'manager', name: 'Manager', color: '#3498DB', category: 'General' },
            { key: 'overseas', name: 'Overseas', color: '#1ABC9C', category: 'General' },
            { key: 'sr_mod', name: 'Sr.Mod', color: '#E67E22', category: 'General' },
            { key: 'mod', name: 'Mod', color: '#F39C12', category: 'General' },
            { key: 'helper', name: 'Helper', color: '#27AE60', category: 'General' },
            { key: 'trial_staff', name: 'Trial Staff', color: '#BDC3C7', category: 'General' },
            { key: 'restricted', name: 'Restricted', color: '#7F8C8D', category: 'General' },
            { key: 'waitlist', name: 'Waitlist Role', color: '#5865F2', category: 'General' },
            { key: 'high_result_manager', name: 'High Result Manager', color: '#8E44AD', category: 'General' },
            { key: 'retire_result_manager', name: 'Retire Result Manager', color: '#C0392B', category: 'General' },
            { key: 'staff', name: 'Staff', color: '#2C3E50', category: 'General' }
        ];
        specs.push(...generalRoles);

        // Tester roles per gamemode
        for (const gamemode of (config.gamemodes || [])) {
            const display = config.gamemodeNames?.[gamemode] || gamemode;
            specs.push({
                key: `tester_gamemode_${gamemode}`,
                name: `${display} Tester`,
                color: '#5865F2',
                category: 'Tester',
                gamemode
            });
        }

        // Waitlist roles per gamemode (reuse the general Waitlist Role name? Create per-gamemode names)
        for (const gamemode of (config.gamemodes || [])) {
            const display = config.gamemodeNames?.[gamemode] || gamemode;
            specs.push({
                key: `waitlist_${gamemode}`,
                name: `${display} Waitlist`,
                color: '#5865F2',
                category: 'Waitlist',
                gamemode
            });
        }

        // Create/reuse roles
        await interaction.editReply({ content: `Setting up ${specs.length} roles...` });

        const roleMap = new Map(); // key -> role
        let processed = 0;
        for (const spec of specs) {
            const existing = guild.roles.cache.find(r => r.name.toLowerCase() === spec.name.toLowerCase());
            if (existing) {
                reused.push(spec.key);
                roleMap.set(spec.key, existing);
            } else {
                try {
                    const role = await guild.roles.create({
                        name: spec.name,
                        color: hexToInt(spec.color),
                        reason: 'AsianTiers /setupall'
                    });
                    created.push(spec.key);
                    roleMap.set(spec.key, role);
                    await sleep(300);
                } catch (error) {
                    failed.push(`${spec.key}: ${error?.message || error}`);
                }
            }
            processed++;
            if (processed % 10 === 0) {
                await interaction.editReply({ content: `Setting up roles... ${processed}/${specs.length}` }).catch(() => {});
            }
        }

        // Categories
        const categorySpecs = [
            { key: 'tickets', name: 'Tickets' },
            { key: 'high_tests', name: 'High Tests' },
            { key: 'transcripts', name: 'Transcripts' },
            { key: 'queues', name: 'Queues' }
        ];

        await interaction.editReply({ content: 'Setting up categories...' });

        const categoryMap = new Map();
        for (const spec of categorySpecs) {
            const existing = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === spec.name.toLowerCase());
            if (existing) {
                reused.push(`category:${spec.key}`);
                categoryMap.set(spec.key, existing);
            } else {
                try {
                    const category = await guild.channels.create({
                        name: spec.name,
                        type: ChannelType.GuildCategory,
                        reason: 'AsianTiers /setupall'
                    });
                    created.push(`category:${spec.key}`);
                    categoryMap.set(spec.key, category);
                    await sleep(300);
                } catch (error) {
                    failed.push(`category:${spec.key}: ${error?.message || error}`);
                }
            }
        }

        const summary = [
            '✅ Setup complete.',
            `Created: ${created.length}`,
            `Reused: ${reused.length}`,
            `Failed: ${failed.length}`
        ];
        if (failed.length > 0) {
            summary.push('', 'Failed items:', failed.slice(0, 20).join('\n'));
        }
        summary.push('', 'Run /saveroleids to save all IDs to the database.');

        await interaction.editReply({ content: summary.join('\n') });
    }
};