import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getClanStats } from '../../services/clashService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('clancheck')
        .setDescription('Zeigt Statistiken zu einem Clash of Clans Clan')
        .addStringOption(option => 
            option.setName('tag')
                .setDescription('Das Clan-Kürzel (z.B. #XYZ123)')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        
        const clanTag = interaction.options.getString('tag');

        try {
            const clanData = await getClanStats(clanTag);
            const kriegslog = clanData.isWarLogPublic ? 'Öffentlich 🔓' : 'Privat 🔒';

            const embed = new EmbedBuilder()
                .setTitle(`🛡️ Clan-Statistiken für ${clanData.name} (${clanData.tag})`)
                .setColor(0xD4AF37)
                .addFields(
                    { name: '👥 Mitglieder', value: `${clanData.memberCount} / 50`, inline: true },
                    { name: '🏆 Clan-Liga', value: `${clanData.liga}`, inline: true },
                    { name: '⚔️ Kriegslog', value: kriegslog, inline: true },
                    { name: '🏅 Kriegs-Siege', value: `${clanData.warWins}`, inline: true }
                )
                .setFooter({ text: 'Clash of Clans Stats' })
                .setTimestamp();

            if (clanData.badgeUrl) {
                embed.setThumbnail(clanData.badgeUrl);
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            if (error.status === 404) {
                return interaction.editReply('❌ Dieser Clan wurde nicht gefunden. Überprüfe das Kürzel.');
            }
            await interaction.editReply('⚠️ Fehler beim Abrufen der Clan-Daten.');
        }
    },
};
