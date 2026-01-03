const { MessageEmbed } = require("discord.js");
const db = require("../../utils/db");
const ms = require("pretty-ms");

module.exports = {
    name: "weekly",
    category: "economy",
    description: "get weekly money",
    run: async (client, interaction, args) => {
        // REMOVED: interaction.deferReply() (It was causing the crash)

        let user = interaction.member;
        let timeout = 604800000; // 7 days in milliseconds
        var amount = Math.floor(Math.random() * 5000);

        // Fix: Removed triple await
        let weekly = await db.get(`weekly_${user.id}`);

        if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
            let time = ms(timeout - (Date.now() - weekly));

            let timeEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`You can collect it again in ${time}.`);

            // Use editReply because your handler already deferred this
            await interaction.editReply({ embeds: [timeEmbed] });
        } else {
            let moneyEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`You've collected ${amount} coins from weekly.`);

            // Use editReply because your handler already deferred this
            await interaction.editReply({ embeds: [moneyEmbed] });

            await db.add(`money_${user.id}`, amount);
            await db.set(`weekly_${user.id}`, Date.now());
        }
    }
}