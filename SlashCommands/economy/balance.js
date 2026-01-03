const { MessageEmbed } = require('discord.js');
const db = require("../../utils/db");

module.exports = {
    name: 'balance',
    category: "economy",
    description: 'Shows your balance.',
    options: [
        {
            name: 'user',
            description: 'User to get balance',
            type: 6,
        },
    ],
    run: async (client, message, args) => {
        // Detect if it's a Slash Command
        const isSlash = !!message.applicationId;

        let member;
        if (isSlash) {
            member = message.options.getMember('user') || message.member;
        } else {
            member = message.mentions.members.first() || 
                     message.guild.members.cache.get(args[0]) || 
                     message.member;
        }

        const send = async (data) => {
            if (isSlash) return await message.editReply(data);
            return await message.channel.send(data);
        };

        if (member.user.bot) {
            let botEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription("Bots have no money 😂");
            return await send({ embeds: [botEmbed] });
        }

        // --- THE FIX ---
        // We use 'await' and then force the result to be treated as a string/number
        let rawBal = await db.get(`money_${member.id}`);
        let bal = (rawBal !== null) ? rawBal : 0;

        let rawBank = await db.get(`bank_${member.id}`);
        let bank = (rawBank !== null) ? rawBank : 0;

        let embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${member.user.username}'s Balance\n\nPocket: \`${bal}\`\nBank: \`${bank}\``);

        await send({ embeds: [embed] });
    }
}