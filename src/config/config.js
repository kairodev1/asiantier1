
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
        // New server channels
        results: '1572306585101799487',
        transcriptChannel: '1572306634200449085',

        // Set this when you provide the new ticket category ID
        ticketCategory: null,

        // New server testing category
        testingCategory: '1572306478071681256',

        // New server waitlist channels
        queues: {
            '1572306601992396880': 'Sword',
            '1572306604936798339': 'Mace',
            '1572306608934092881': 'Axe',
            '1572306603510865971': 'DiaPot',
            '1572306606618574871': 'SMP',
            '1572306610640920647': 'UHC',
            '1572306643184783584': 'spearmace',
            '1572306638868844738': 'diasmp',
            '1572306644740608133': 'manhunt',
            '1572306646716260392': 'shieldlessuhc',
            '1572306640928247908': 'cart',
            '1572306598582554679': 'Nethpot',
            '1572306600025137313': 'Crystal'
        }
    },

    // Legacy waitlist role IDs.
    // Replace these with new server role IDs when available.
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

    serverSetup: {
        waitlistChannels: {
            Sword: '1567481416453718046',
            Mace: '1567481418777362593',
            Axe: '1567481421441015842',
            SMP: '1567481420442771526',
            UHC: '1567481422854226021',
            DiaPot: '1567481417661677588',
            spearmace: '1572267251329933392',
            diasmp: '1569964539070517320',
            manhunt: '1572267338429104249',
            shieldlessuhc: '1572267481882566767',
            cart: '1570076107238150247',
            Nethpot: '1567481413878415502',
            Crystal: '1567481414952165412'
        },
        resultsChannel: '1567481403547852871',
        ticketLogsChannel: '1572306634200449085',
        testingCategory: '1567481339475791883'
    },
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
