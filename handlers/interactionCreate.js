module.exports = async (client, interaction) => { 
 
    if (interaction.isCommand()) {
    
        await interaction.deferReply({ ephemeral: false }).catch(() => { });

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) {
            return interaction.followUp({ content: "An error has occurred: Command not found." });
        }

        const args = [];
        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

   
        if (!interaction.member && interaction.guild) {
            interaction.member = await interaction.guild.members.fetch(interaction.user.id).catch(() => {});
        }

    
        try {
            await cmd.run(client, interaction, args);
        } catch (error) {
            console.error(error);
            if (interaction.deferred) {
                interaction.followUp({ content: "There was an error executing this command!" });
            }
        }
    }

  
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => { });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) {
            try {
                await command.run(client, interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
};