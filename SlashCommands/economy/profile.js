const { MessageEmbed } = require('discord.js')
const db = require("../../utils/db")

module.exports = {
    name : 'profile',
    category : 'economy',
    description : 'show your profile',
    options: [
        {
            name: 'user',
            description: 'User to get his profile',
            type: 6,
        },
    ],
run: async(client, interaction, args)=> {
        const user = interaction.options.getMember('user') || interaction.member;

        if(user.user.bot) {
            let botEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription("❌ You can't use this command with a bot.");
            return interaction.editReply({ embeds: [botEmbed] });
        }

        let money = await db.get(`money_${user.id}`)
        if (money === null) money = 0;

        let bank = await db.get(`bank_${user.id}`)
        if (bank === null) bank = 0;

        let bio = await db.get(`info_${user.id}`);
        if (bio === null) bio = "No bio set.";

      const embed = new MessageEmbed()
      .setColor(`GREEN`)
      .setAuthor({ name: `${user.user.username}'s Profile`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`> 👤 User: ${user}\n> 🖐🏻 Pocket: \`${money}\`\n> 🏛️ Bank: \`${bank}\` \n\n **Bio:**\n\`\`\`\n${bio}\n\`\`\``)
      .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
     
        await interaction.editReply({embeds : [embed]})
    }
}
