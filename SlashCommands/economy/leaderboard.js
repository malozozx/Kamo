const { MessageEmbed } = require('discord.js');
const db = require("../../utils/db");

module.exports = {
        name: "leaderboard",
        category: 'economy',
        description: 'who the rich ?',
        options: [],
run: async(client, interaction, args)=> {
        let money = (await db.all())
            .filter(data => data.id.startsWith(`money_`))
            .map(data => ({ id: data.id, value: parseInt(data.value) || 0 }))
            .filter(data => data.value > 0)
            .sort((a, b) => b.value - a.value);

        if (!money.length) {
            let noEmbed = new MessageEmbed()
                .setAuthor({ 
                    name: interaction.member.displayName, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setColor("GREEN")
            .setFooter({ text: "No one have money, claim your daily/weekly reward to be the top one✨" })
            return interaction.editReply({embeds : [noEmbed]})
        };

        money.length = 10;
        var finalLb = "";
        for (var i in money) {
            if (money[i].value === null) money[i].value = 0
            const user = await client.users.fetch(money[i].id.split('_')[1]).catch(() => null);
            const userName = user ? user.tag : `User (${money[i].id.split('_')[1]})`;
            finalLb += `**${parseInt(i) + 1}. ${userName}** - ${money[i].value} :dollar:\n`;
        };

        const embed = new MessageEmbed()
            .setTitle(`Leaderboard Of ${interaction.guild.name}`)
            .setColor("RANDOM")
            .setDescription(finalLb)
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        interaction.editReply({embeds :[embed]});
    }
};