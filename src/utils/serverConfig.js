const supabase = require('../database/supabase');

const cache = new Map();

async function loadServerConfig(guildId, force = false) {
    if (!guildId) return null;
    const key = String(guildId);
    const now = Date.now();
    const cached = cache.get(key);
    if (!force && cached && (now - cached.loadedAt) < 60000) return cached.data;

    const { data, error } = await supabase
        .from('asian_server_configs')
        .select('*')
        .eq('guild_id', guildId)
        .maybeSingle();

    if (error) throw error;
    cache.set(key, { data: data || null, loadedAt: now });
    return data || null;
}

function getWaitlistChannelsSync(guildId) {
    const cached = cache.get(String(guildId));
    return cached?.data?.waitlist_channels || null;
}

async function getWaitlistChannels(guildId, force = false) {
    const data = await loadServerConfig(guildId, force);
    return data?.waitlist_channels || null;
}

async function getResultsChannel(guildId, force = false) {
    const data = await loadServerConfig(guildId, force);
    return data?.results_channel || null;
}

async function getTicketLogsChannel(guildId, force = false) {
    const data = await loadServerConfig(guildId, force);
    return data?.ticket_logs_channel || null;
}

async function getTestingCategory(guildId, force = false) {
    const data = await loadServerConfig(guildId, force);
    return data?.testing_category || null;
}

async function upsertServerConfig(guildId, payload) {
    const { error } = await supabase
        .from('asian_server_configs')
        .upsert({
            guild_id: guildId,
            waitlist_channels: payload.waitlist_channels || {},
            results_channel: payload.results_channel || null,
            ticket_logs_channel: payload.ticket_logs_channel || null,
            testing_category: payload.testing_category || null,
            updated_at: new Date().toISOString()
        }, { onConflict: 'guild_id' });
    if (error) throw error;
    cache.delete(String(guildId));
}

function clearServerConfigCache(guildId = null) {
    if (guildId) cache.delete(String(guildId));
    else cache.clear();
}

module.exports = {
    loadServerConfig,
    getWaitlistChannels,
    getWaitlistChannelsSync,
    getResultsChannel,
    getTicketLogsChannel,
    getTestingCategory,
    upsertServerConfig,
    clearServerConfigCache
};