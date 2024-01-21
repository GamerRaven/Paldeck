const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pal = require("../../../contents/pals.json");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("pals")
        .setDescription("Get a list of all available Pals")
        .setDMPermission(false),

    async execute(interaction) {

        const palNames = Object.keys(pal).sort();

        const pals = palNames.map((pal) => `**${pal}**`).join("\n\n")

        const embed = new EmbedBuilder()
            .setColor("#00C9FF")
            .setTitle("Heres a list of all available Pals!")
            .setDescription(pals)

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};