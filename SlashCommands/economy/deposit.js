const { MessageEmbed } = require("discord.js");
const db = require("../../utils/db");

module.exports = {
    name: "deposit",
    category: "economy",
    description: "deposit to your bank",
    options: [
        {
            name: 'amount',
            description: 'amout to deposit ',
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction, args) => {
        const input = interaction.options.getString('amount');
        let user = interaction.member;
        let member = await db.get(`money_${user.id}`)

        if (input == 'all') {
            let money = await db.get(`money_${user.id}`)

            let embedbank = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription("❌ You don't have money to deposit.")
            if (!money) return interaction.editReply({ embeds: [embedbank] })

            await db.subtract(`money_${user.id}`, money)
            await db.add(`bank_${user.id}`, money)
            let sembed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`✅ You have deposited all your coins.`);
            interaction.editReply({ embeds: [sembed] })

        } else {
            let embed6 = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`This amount is not a number.`)

            if (isNaN(input)) {
                return interaction.editReply({ embeds: [embed6] })
            }

            let embed4 = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`You don't have enough money.`);

            if (parseInt(member) < parseInt(input)) {
                return interaction.editReply({ embeds: [embed4] })
            }

            let embed5 = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`You have deposited ${input} into bank.`);

            interaction.editReply({ embeds: [embed5] })
            await db.subtract(`money_${user.id}`, parseInt(input))
            await db.add(`bank_${user.id}`, parseInt(input))

        }
    }
}