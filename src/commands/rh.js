import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getPlayerStats } from '../../services/clashService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rh')
        .setDescription('Zeigt das Rathaus-Level eines Spielers')
        .addStringOption(option => 
            option.setName('tag')
                .setDescription('Das Spieler-Kürzel (z.B. #XYZ123)')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();
        
        const playerTag = interaction.options.getString('tag');

        try {
            const playerData = await getPlayerStats(playerTag);

            const embed = new EmbedBuilder()
                .setTitle(`👤 Spieler: ${playerData.name} (${playerData.tag})`)
                .setColor(0x0099FF)
                .addFields(
                    { name: '🏰 Rathaus (RH)', value: `Level ${playerData.townHall}`, inline: false },
                    { name: '🏆 Trophäen', value: `${playerData.trophies}`, inline: true },
                    { name: '🛡️ Aktueller Clan', value: `${playerData.clanName}`, inline: true }
                )
                .setFooter({ text: 'Clash of Clans Stats' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            if (error.status === 404) {
                return interaction.editReply('❌ Dieser Spieler wurde nicht gefunden. Überprüfe das Kürzel.');
            }
            await interaction.editReply('⚠️ Fehler beim Abrufen der Spieler-Daten.');
        }
    },
};
