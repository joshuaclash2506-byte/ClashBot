const { Client } = require('clashofclans.js');

// CoC-Client mit deinem API-Key initialisieren
const cocClient = new Client({
    keys: [process.env.CLASH_OF_CLANS_TOKEN] 
});

/**
 * Holt die Clan-Statistiken (Mitglieder, Liga, Kriegslog)
 * @param {string} clanTag 
 */
async function getClanStats(clanTag) {
    if (!clanTag.startsWith('#')) clanTag = `#${clanTag}`;
    
    try {
        const clan = await cocClient.getClan(clanTag);
        
        return {
            name: clan.name,
            tag: clan.tag,
            badgeUrl: clan.badgeUrls?.medium || null,
            memberCount: clan.members,
            liga: clan.warLeague ? clan.warLeague.name : 'Keine Liga',
            isWarLogPublic: clan.isWarLogPublic,
            warWins: clan.warWins
        };
    } catch (error) {
        throw error;
    }
}

/**
 * Holt das Rathaus-Level (RH) eines Spielers
 * @param {string} playerTag 
 */
async function getPlayerStats(playerTag) {
    if (!playerTag.startsWith('#')) playerTag = `#${playerTag}`;
    
    try {
        const player = await cocClient.getPlayer(playerTag);
        
        return {
            name: player.name,
            tag: player.tag,
            townHall: player.townHallLevel,
            trophies: player.trophies,
            clanName: player.clan ? player.clan.name : 'Clanlos'
        };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getClanStats,
    getPlayerStats
};
