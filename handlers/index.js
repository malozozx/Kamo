const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");

const globPromise = promisify(glob);

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const colors = require("colors")


const { readdirSync } = require("fs");

const { afk } = require("../utils/afk");

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    const arrayOfSlashCommands = [];
    readdirSync(`${process.cwd()}/SlashCommands`).forEach((value) => {
        const directory = value;
        const slashCommands = readdirSync(`${process.cwd()}/SlashCommands/${value}`);
        slashCommands.filter(file => file.endsWith(".js")).forEach((value) => {
            const file = require(`${process.cwd()}/SlashCommands/${directory}/${value}`);

            if (file.name) {

                let everything;
                everything = { name: file.name, description: file.description, options: file.options };
                arrayOfSlashCommands.push(everything);
                client.slashCommands.set(file.name, file);
                client.commands.set(file.name, file);
            }
        }
        );
    });



    client.on("ready", async () => {
        const rest = new REST({ version: '9' }).setToken(process.env.token);

        try {
            // Fetch all global commands
            const globalCommands = await rest.get(
                Routes.applicationCommands(client.user.id)
            );

            // Fetch all guilds
            const guilds = client.guilds.cache;

            // Delete guild-specific commands for each guild to remove duplicates
            for (const [guildId, guild] of guilds) {
                const guildCommands = await rest.get(
                    Routes.applicationGuildCommands(client.user.id, guildId)
                );
                
                if (guildCommands.length > 0) {
                    console.log(`Cleaning up ${guildCommands.length} guild commands for ${guild.name}...`);
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, guildId),
                        { body: [] }
                    );
                }
            }

            // Push global commands once
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: arrayOfSlashCommands }
            );
            console.log("[ / Commands ]: Pushed Globally and cleaned duplicates".green.bold);
            
        } catch (error) {
            console.error(`[error during command sync]: ${error} `.red.bold);
        }
    });

    client.on("interactionCreate", async (interaction) => {
        await interaction.deferReply({ ephemeral: false }).catch(() => { });
        if(interaction.guildId == null){
            return interaction.editReply("This command is only available in a server").catch(() => { });
        }
        if (interaction.isCommand()) {
            const cmd = client.slashCommands.get(interaction.commandName);
            if (!cmd)
                return interaction.followUp({ content: "An error has occured " });
            const args = [];
            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            cmd.run(client, interaction);
        }


        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }

    })


    client.on("messageCreate", async (message) => {

        if(afk.has(message.author.id)){
            afk.delete(message.author.id)
            message.reply("You are no longer AFK")
            message

            .member
                            .setNickname(


message.author.username

                            )
        }

    })

};