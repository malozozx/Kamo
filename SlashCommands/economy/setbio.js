const { MessageEmbed } = require('discord.js');
const db = require("../../utils/db");
const { chunk } = require('../../All_Files/functions');

module.exports = {
    name: "setbio",
    description: "set bio for your profile",
    category: 'economy',
    options: [
        {
            name: 'input',
            description: 'amout to deposit ',
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction, args) => {
        const input = interaction.options.getString('input');
        let user = interaction.member;
        if (!input) {
            let fetchInfo = await await await db.get(`info_${user.id}`)
            if (fetchInfo) {
                let embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor({ 
                        name: 'Current bio:', 
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                    })
        .setDescription(`\`${fetchInfo}\``)
        .setFooter({ 
            text: interaction.guild.name, 
            iconURL: interaction.guild.iconURL({ dynamic: true }) 
      })
                return interaction.editReply({ embeds: [embed] })
            }
        }
        let newInfo = input;
        if (!newInfo) return interaction.editReply({ content: 'Enter the new bio.' });
        if (newInfo.length > 60) return interaction.editReply({ content: `Max \`60\` characters.` });
        await db.set(`info_${user.id}`, newInfo);

        let notesEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor({ 
                name: `Bio Updated!`, 
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
            })
            .setDescription(`**New Bio:**\n${newInfo}`)
        .setFooter({ 
            text: interaction.guild.name, 
            iconURL: interaction.guild.iconURL({ dynamic: true }) 
        })
        interaction.editReply({ embeds: [notesEmbed] });
    }
};