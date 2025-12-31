const { MessageEmbed } = require("discord.js");
const db = require("../../utils/db");
module.exports = {
        name: "withdraw",
        category: "economy",
        description: "withdraw to your balance",
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
        let member2 = await db.get(`bank_${user.id}`)

        if (input == 'all') {
            let money = await db.get(`bank_${user.id}`)
            let embed = new MessageEmbed()
              .setColor("RANDOM")
              .setDescription(`You don't have any money in your bank.`)
            if (!money) return interaction.editReply({embeds :[embed]})
            await db.subtract(`bank_${user.id}`, money)
            await db.add(`money_${user.id}`, money)
            let embed5 = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`✅ You have withdrawn all your coins.`);
           interaction.editReply({embeds :[embed5]})

        } else {

            let embed6 = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`❌ Your Amount Is Not A Number!`)

            if(isNaN(input)) {
                return interaction.editReply({embeds :[embed6]})
            }
            let embed4 = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`You don't have enough money.`);

            if (parseInt(member2) < parseInt(input)) {
                return interaction.editReply({embeds :[embed4]})
            }

            let embed5 = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`✅ You have withdrawn ${input} coins.`);

            interaction.editReply({embeds :[embed5]})
            await db.subtract(`bank_${user.id}`, parseInt(input))
            await db.add(`money_${user.id}`, parseInt(input))
        }
    }
}