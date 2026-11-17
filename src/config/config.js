
module.exports = {
    ownerId: '1434463040622952510',

    colors: {
        primary: 0x8B0000,
        secondary: 0x000000,
        success: 0x2ECC71,
        error: 0xE74C3C
    },

    // Role IDs are stored in Supabase `kairo_role_configs`.
    // Non-role configuration only.
    gamemodes: [
        'Sword',
        'Mace',
        'Axe',
        'DiaPot',
        'SMP',
        'UHC',
        'spearmace',
        'diasmp',
        'manhunt',
        'shieldlessuhc',
        'cart',
        'Nethpot',
        'Crystal'
    ],

    channels: {
        results: '1567481403547852871',
        ticketCategory: '1567481339475791883',
        transcriptChannel: '1567481439816253522',

        queues: {
            '1567481416453718046': 'Sword',
            '1567481418777362593': 'Mace',
            '1567481421441015842': 'Axe',
            '1567481420442771526': 'SMP',
            '1567481422854226021': 'UHC',
            '1567481417661677588': 'DiaPot',
            '1572267251329933392': 'spearmace',
            '1569964539070517320': 'diasmp',
            '1572267338429104249': 'manhunt',
            '1572267481882566767': 'shieldlessuhc',
            '1570076107238150247': 'cart',

            // New gamemodes
            '1567481413878415502': 'Nethpot',
            '1567481414952165412': 'Crystal'
        }
    },

    // Legacy waitlist role IDs (fallback until saved in Supabase)
    roles: {
        waitlist: {
            Axe: '1570451933863346176',
            Sword: '1570451949105582080',
            UHC: '1570451950082719840',
            SMP: '1570451946551386244',
            DiaPot: '1570451948090429531',
            Mace: '1570451943875285094',
            spearmace: '1570451934794481696',
            diasmp: '1570451940905582614',
            manhunt: '1570451936606425299',
            shieldlessuhc: '1570451937692745820',
            cart: '1570451939240448041',
            Nethpot: '1567481413878415502',
            Crystal: '1567481414952165412'
        }
    },

    // Gamemode display names
    gamemodeNames: {
        spearmace: 'SpearMace',
        diasmp: 'Diamond SMP',
        manhunt: 'Manhunt',
        shieldlessuhc: 'ShieldLess UHC',
        cart: 'Cart',
        Nethpot: 'Nethpot',
        Crystal: 'Crystal'
    }
};
