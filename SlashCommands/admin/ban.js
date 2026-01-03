const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    category: "admin",
    description: 'Ban a user from the server. ',
    options:[
{
     name:"user",
     description:"The user",
     type:6,
     required:true
},
{
     name:"reason",
     description:"The reason of this ban",
     type:3,
     required:true
},
],
    run: async(client, interaction, args) => {
        const mentionedMember = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason') 

        if(! interaction.member.permissions.has('BAN_MEMBERS')) { 
            
            const banError = new MessageEmbed()
            .setDescription('**You don\'t have permissions to ban members!**')
            return interaction.editReply({ embeds: [banError] }) 
            

        } else if(!interaction.guild.me.permissions.has('BAN_MEMBERS')) { 
            
            const banError1 = new MessageEmbed()
            .setDescription('**I don\'t have permissions to ban members!**')
            return interaction.editReply({ embeds: [banError1] }) 
            
        }

        const mentionedPosition = mentionedMember.roles.highest.position
        
        const memberPosition = interaction.member.roles.highest.position 
        
        const botPosition = interaction.guild.me.roles.highest.position 
    

        if(memberPosition <= mentionedPosition) { 
            
            const banErr = new MessageEmbed()
            .setDescription('❌ **You cannot ban this member because their role is higher/equal to yours!**')
            return interaction.editReply({ embeds: [banErr] }) 
            
        } else if (botPosition <= mentionedPosition) { 
            
            const banErr1 = new MessageEmbed()
            .setDescription('**❌ I cannot ban this member because their role is higher/equal to mine!**')
            interaction.editReply({ embeds: [banErr1] }) 
        }

        try{
            const reasonDm = new MessageEmbed() 
                
            .setTitle(`✅ You were banned by ${interaction.member.user.tag}!`)
            .setDescription(`Reason: ${reason}`)
            await mentionedMember.send({ embeds: [reasonDm] }) 
            
            await mentionedMember.ban({ reason: reason }).then(() => { 
                

                const banSuccess = new MessageEmbed()
                .setTitle(`${mentionedMember.user.tag} was banned\nby ${interaction.member.user.tag}`)
                .setDescription(`Reason: ${reason}`)
                interaction.editReply({ embeds: [banSuccess] }) 
                
            })


        } catch (error) {
            const errorEmbed = new MessageEmbed()
            .setDescription('❌ **There was an error while banning this user!**')
            return interaction.editReply({ embeds: [errorEmbed] }) //send an embed when it caught error
        }
    }
} 
