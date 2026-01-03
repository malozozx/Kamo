const { MessageEmbed } = require("discord.js");
const db = require("../../utils/db");
const ms = require("pretty-ms");

module.exports = {
    name: "daily",
    category: "economy",
    description: "get daily money",
    options: [],
    run: async (client, interaction, args) => {
        let user = interaction.member;
        let timeout = 86400000;
        var amount = Math.floor(Math.random() * 5000)

        // Fixed: Removed triple await and simplified ID reference
        let daily = await db.get(`daily_${user.id}`);

        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = ms(timeout - (Date.now() - daily));

            let timeEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`You can collect your daily again in ${time}.`);

            // Works with your handler's deferReply
            await interaction.editReply({ embeds: [timeEmbed] })
        } else {
            let moneyEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`You've collected your ${amount} from daily.`);

            // Works with your handler's deferReply
            await interaction.editReply({ embeds: [moneyEmbed] })

            // Fixed: Removed double awaits
            await db.add(`money_${user.id}`, amount);
            await db.set(`daily_${user.id}`, Date.now());
        }
    }
}