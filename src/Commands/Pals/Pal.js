const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const pals = require("../../../contents/pals.json");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("pal")
        .setDescription("Get information about a Pal.")
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Name of the Pal")
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const choices = Object.keys(pals);
        const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue)).slice(0, 25);
        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    },

    async execute(interaction) {
        const userSelection = interaction.options.getString("name");

        if (!pals[userSelection]) {
            const notFoundEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("Invalid Pal Name")
                .setDescription(`The Pal "${userSelection}" does not exist. Please use **/pals** to find a list of available Pals.`);

            await interaction.reply({ embeds: [notFoundEmbed] });
            return;
        }

        const selectedPal = pals[userSelection];

        const embed = new EmbedBuilder()
            .setColor("#00C9FF")
            .setTitle(userSelection)
            .setFields(
                { name: "No:", value: selectedPal.no, inline: false },
                { name: "Element(s):", value: selectedPal.element, inline: false },
                { name: "Partner Skill:", value: selectedPal.partner_skill, inline: false },
                { name: "Work Suitabilities:", value: selectedPal.work_suitability, inline: false },
                { name: "Wiki Page:", value: selectedPal.wiki_page, inline: false }
            );

        if (selectedPal.image !== "") {
            const attachment = new AttachmentBuilder()
                .setFile(`./assets/pals/${selectedPal.image}`)
                .setName(`image.png`);

            const embed2 = new EmbedBuilder()
                .setColor("#00C9FF")
                .setTitle(`${userSelection}`)
                .setImage("attachment://image.png");

            await interaction.reply({ files: [attachment], embeds: [embed2, embed] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    },
};