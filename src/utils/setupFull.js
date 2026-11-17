const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config/config');
const emojis = require('../config/emojis');
const tierSystem = require('./tierSystem');
const roleConfig = require('./roleConfig');
const supabase = require('../database/supabase');

const OWNER_ID = '1105165947590938866';
const gamemodes = config.gamemodes || [];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function hexToInt(hex) { return parseInt(String(hex).replace('#', ''), 16); }

async function findOrCreateRole(guild, name, color) {
    const existing = guild.roles.cache.find(r => r.name.toLowerCase() === name.toLowerCase());
    if (existing) return { role: existing, created: false };
    try {
        const role = await guild.roles.create({ name, color: hexToInt(color), reason: 'AsianTiers /setupfull' });
        await sleep(250);
        return { role, created: true };
    } catch (e) {
        return { role: null, created: false, error: e };
    }
}

async function findOrCreateCategory(guild, name) {
    const existing = guild.channels.cache.find(c => c.type === 4 && c.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    const cat = await guild.channels.create({ name, type: 4, reason: 'AsianTiers /setupfull' });
    await sleep(250);
    return cat;
}

async function findOrCreateTextChannel(guild, name, parent) {
    const existing = guild.channels.cache.find(c => c.type === 0 && c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
        if (parent && existing.parentId !== parent.id) await existing.setParent(parent).catch(() => {});
        return existing;
    }
    const ch = await guild.channels.create({ name, type: 0, parent, reason: 'AsianTiers /setupfull' });
    await sleep(250);
    return ch;
}

function buildPanelComponents(gamemode) {
    const display = config.gamemodeNames?.[gamemode] || gamemode;
    const emoji = emojis.gamemodes?.[gamemode] || '';
    const match = emoji.match(/<a?:\w+:(\d+)>/);
    const btn = new ButtonBuilder()
        .setCustomId(`waitlist_${String(gamemode).toLowerCase()}`)
        .setLabel(display)
        .setStyle(ButtonStyle.Success);
    if (match) btn.setEmoji({ id: match[1] });
    return [new ActionRowBuilder().addComponents(btn)];
}

async function sendPanel(channel, gamemode) {
    const display = config.gamemodeNames?.[gamemode] || gamemode;
    const emoji = emojis.gamemodes?.[gamemode] || '';
    const embed = new EmbedBuilder()
        .setTitle(`${emoji} ${display} Testing Waitlist`.trim())
        .setColor(0x8B0000)
        .setDescription('Click a button below to join/leave the waitlist.')
        .setFooter({ text: 'AsianTiers • Testing Waitlist' })
        .setTimestamp();
    const msg = await channel.send({ embeds: [embed], components: buildPanelComponents(gamemode) });
    return msg.id;
}

async function runSetupFull(interaction) {
    const guild = interaction.guild;
    const guildId = guild.id;
    const created = [];
    const reused = [];
    const failed = [];

    await interaction.editReply({ content: 'Setting up roles...' });

    const roleSpecs = [];
    const general = [
        { name: 'Owner', color: '#F1C40F', key: null, category: 'General' },
        { name: 'Admin', color: '#E74C3C', key: 'admin', category: 'General' },
        { name: 'Moderator', color: '#3498DB', key: 'mod', category: 'General' },
        { name: 'SSer', color: '#F1C40F', key: 'sser', category: 'General' },
        { name: 'Registered', color: '#95A5A6', key: 'registered', category: 'General' },
        { name: 'Priority (VIP)', color: '#9B59B6', key: 'priority', category: 'General' },
        { name: 'Verified Tester', color: '#2ECC71', key: 'verified_tester', category: 'General' },
        { name: 'Manager', color: '#3498DB', key: 'manager', category: 'General' },
        { name: 'Overseas', color: '#1ABC9C', key: 'overseas', category: 'General' },
        { name: 'Sr.Mod', color: '#E67E22', key: 'sr_mod', category: 'General' },
        { name: 'Helper', color: '#27AE60', key: 'helper', category: 'General' },
        { name: 'Trial Staff', color: '#BDC3C7', key: 'trial_staff', category: 'General' },
        { name: 'Restricted', color: '#7F8C8D', key: 'restricted', category: 'General' },
        { name: 'Waitlist Role', color: '#5865F2', key: 'waitlist', category: 'General' },
        { name: 'High Result Manager', color: '#8E44AD', key: 'high_result_manager', category: 'General' },
        { name: 'Retire Result Manager', color: '#C0392B', key: 'retire_result_manager', category: 'General' },
        { name: 'Staff', color: '#2C3E50', key: 'staff', category: 'General' }
    ];
    roleSpecs.push(...general);

    for (const gm of gamemodes) {
        const display = config.gamemodeNames?.[gm] || gm;
        for (const tier of tierSystem.ACTIVE_TIERS) {
            roleSpecs.push({ name: `${display} ${tier}`, color: tierSystem.getTierColor(tier), key: `tier_${gm}_${tier}`, category: 'Tier', gamemode: gm, tier });
        }
    }
    for (const gm of gamemodes) {
        const display = config.gamemodeNames?.[gm] || gm;
        roleSpecs.push({ name: `${display} Tester`, color: '#5865F2', key: `tester_gamemode_${gm}`, category: 'Tester', gamemode: gm });
    }
    for (const gm of gamemodes) {
        const display = config.gamemodeNames?.[gm] || gm;
        roleSpecs.push({ name: `${display} Waitlist`, color: '#5865F2', key: `waitlist_${gm}`, category: 'Waitlist', gamemode: gm });
    }
    const retiredTiers = Object.values(tierSystem.RETIRED_TIER_MAP);
    for (const gm of gamemodes) {
        const display = config.gamemodeNames?.[gm] || gm;
        for (const rt of retiredTiers) {
            const base = rt.replace(/^R/, '');
            roleSpecs.push({ name: `${display} ${rt}`, color: tierSystem.getTierColor(base), key: null, category: 'Retired', gamemode: gm, tier: rt });
        }
    }

    let processed = 0;
    for (const spec of roleSpecs) {
        const { role, created: wasCreated, error } = await findOrCreateRole(guild, spec.name, spec.color);
        if (error) { failed.push(`${spec.name}: ${error.message}`); }
        else {
            if (wasCreated) created.push(spec.name); else reused.push(spec.name);
            if (spec.key && role) {
                try {
                    await roleConfig.upsertRoleConfig(spec.key, role.name, spec.category, spec.gamemode || null, spec.tier || null, spec.color, role.id, guildId);
                } catch (e) { failed.push(`save ${spec.key}: ${e.message}`); }
            }
        }
        processed++;
        if (processed % 20 === 0) await interaction.editReply({ content: `Setting up roles... ${processed}/${roleSpecs.length}` }).catch(() => {});
    }

    // aliases
    const priorityRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'priority (vip)');
    if (priorityRole) {
        for (const alias of ['vip', 'booster']) {
            try { await roleConfig.upsertRoleConfig(alias, priorityRole.name, 'General', null, null, '#' + priorityRole.color.toString(16).padStart(6, '0'), priorityRole.id, guildId); } catch (e) {}
        }
    }
    const verifiedTesterRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'verified tester');
    if (verifiedTesterRole) {
        try { await roleConfig.upsertRoleConfig('tester', verifiedTesterRole.name, 'General', null, null, '#' + verifiedTesterRole.color.toString(16).padStart(6, '0'), verifiedTesterRole.id, guildId); } catch (e) {}
    }
    const srModRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'sr.mod');
    if (srModRole) {
        try { await roleConfig.upsertRoleConfig('srmod', srModRole.name, 'General', null, null, '#' + srModRole.color.toString(16).padStart(6, '0'), srModRole.id, guildId); } catch (e) {}
    }

    await interaction.editReply({ content: 'Setting up categories and channels...' });

    const queuesCat = await findOrCreateCategory(guild, 'Queues');
    const ticketsCat = await findOrCreateCategory(guild, 'Tickets');
    const transcriptsCat = await findOrCreateCategory(guild, 'Transcripts');
    const mainCat = await findOrCreateCategory(guild, 'AsianTiers');

    for (const [key, cat] of [['queues', queuesCat], ['tickets', ticketsCat], ['transcripts', transcriptsCat], ['main', mainCat]]) {
        try { await roleConfig.upsertCategoryConfig(key, cat.name, cat.id, guildId); } catch (e) { failed.push(`category ${key}: ${e.message}`); }
    }

    const resultsChannel = await findOrCreateTextChannel(guild, 'results', mainCat);
    const transcriptChannel = await findOrCreateTextChannel(guild, 'transcripts', transcriptsCat);

    await interaction.editReply({ content: 'Creating queue channels and panels...' });
    for (const gm of gamemodes) {
        const channelName = `${String(gm).toLowerCase()}-queue`;
        const channel = await findOrCreateTextChannel(guild, channelName, queuesCat);
        try {
            let panelId = null;
            const { data: qrow } = await supabase.from('queues').select('panel_message_id').eq('channel_id', channel.id).maybeSingle();
            if (qrow?.panel_message_id) {
                try {
                    await channel.messages.fetch(qrow.panel_message_id);
                    panelId = await sendPanel(channel, gm);
                } catch (e) {
                    panelId = await sendPanel(channel, gm);
                }
            } else {
                panelId = await sendPanel(channel, gm);
            }

            const { data: existing } = await supabase.from('queues').select('id').eq('channel_id', channel.id).maybeSingle();
            if (existing) {
                await supabase.from('queues').update({ gamemode: gm, channel_id: channel.id, panel_message_id: panelId, status: 'CLOSED', guild_id: guildId }).eq('channel_id', channel.id);
            } else {
                await supabase.from('queues').insert({ guild_id: guildId, gamemode: gm, channel_id: channel.id, panel_message_id: panelId, status: 'CLOSED' });
            }
        } catch (e) {
            failed.push(`queue ${gm}: ${e.message}`);
        }
    }

    await roleConfig.clearRoleConfigCache(guildId);

    const summary = [
        '✅ /setupfull complete.',
        `Roles created: ${created.length}`,
        `Roles reused: ${reused.length}`,
        `Failures: ${failed.length}`,
        `Results channel: #${resultsChannel.name}`,
        `Transcript channel: #${transcriptChannel.name}`
    ];
    if (failed.length > 0) summary.push('', 'Failures:', failed.slice(0, 25).join('\n'));

    await interaction.editReply({ content: summary.join('\n') });
}

module.exports = { runSetupFull, OWNER_ID };
```

Now update /setupfull command to use button and helper. Need interactionCreate button handling for setupfull_confirm/cancel. Let's update setupfull.js command.<|end|><|start|>Assistant to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="path">
C:\Users\ME\Downloads\asiantiers-main\asiantiers-main\src\commands\owner\setupfull.js