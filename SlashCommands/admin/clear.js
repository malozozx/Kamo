const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "clear",
    category: "admin",
    description: "clear message",
    options: [
        {
            name: "number",
            description: "Amount of messages to delete (up to 5000)",
            type: 4, // Integer
            required: false
        },
    ],
    run: async (client, interaction, args) => {
        // Assume interaction.deferReply({ ephemeral: true }) was called in the interactionCreate event
        let num = interaction.options.getInteger("number") || 5000;

        // 1. Permissions Check (User)
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            const banError = new MessageEmbed()
                .setDescription('**You don\'t have permissions to delete messages!**')
                .setColor("RED");
            return interaction.editReply({ embeds: [banError] });
        } 

        // 2. Permissions Check (Bot) - Corrected guild.members.me
        if (!interaction.guild.members.me.permissions.has('MANAGE_MESSAGES')) {
            const banError1 = new MessageEmbed()
                .setDescription('**I don\'t have permissions to delete messages!**')
                .setColor("RED");
            return interaction.editReply({ embeds: [banError1] });
        }

        // Limit to 5000
        if (num > 5000) num = 5000;
        if (num < 1) num = 1;

        // We delete the "thinking" reply so it doesn't get deleted by bulkDelete
        try {
            await interaction.deleteReply();
        } catch (e) {
            console.log("Interaction reply already gone or not deferred");
        }

        let deletedTotal = 0;
        let remaining = num;

        while (remaining > 0) {
            // bulkDelete requires between 2 and 100. 
            // If remaining is 1, we use 2 and filter, or just fetch and delete.
            let batch = remaining > 100 ? 100 : (remaining === 1 ? 2 : remaining);

            // Delete batch. 'true' filters out messages older than 14 days
            const deleted = await interaction.channel.bulkDelete(batch, true).catch(err => {
                console.error("BulkDelete Error:", err.message);
                return null;
            });

            // If no messages were deleted (likely hit the 14-day limit), stop the loop
            if (!deleted || deleted.size === 0) {
                break;
            }

            deletedTotal += deleted.size;
            remaining -= deleted.size;

            // Stop if we've reached or exceeded the goal
            if (remaining <= 0) break;

            // Wait 1.5 seconds to be safer with Rate Limits during large clears
            await new Promise(res => setTimeout(res, 1500));
        }

        const embed = new MessageEmbed()
            .setDescription(`\`\`${deletedTotal} messages were deleted \`\``)
            .setColor("#ff0000");

        // Send confirmation and delete it after 5 seconds
        await interaction.channel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => {
                msg.delete().catch(() => {}); // Catch error if message already deleted
            }, 5000);
        });
    }
}