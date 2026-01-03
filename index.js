require("dotenv").config();
require('events').EventEmitter.defaultMaxListeners = 50;

const { Discord, Client, Collection,MessageSelectMenu, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");

const ms = require("ms")

const db = require('./utils/db')

const autoLineBreak = require('auto-line-breaks');

const path = require('path');

const { Canvas, resolveImage } = require('canvas-constructor/cairo');

const fs = require("fs")

const axios = require('axios').default;

const pretty = require("pretty-ms")

const { millify } = require("millify");

  const client = new Client({
  intents: 32767,
  });
/////////////////////////// Suggestion Settings ///////////////////////////////
let sugChannels = ['1455375175280230472']; // Change this to your channel IDs
let separatorLine = "https://www.animatedimages.org/data/media/562/animated-line-image-0168.gif";
////////////////////////////////express////////////////////////////////////////
const express = require('express')
const app = express()
app.get('/', function (req, res) {
res.send('KEEP GOIN')
})
app.listen(5000, '0.0.0.0')

////////////////////////////////Ready////////////////////////////////////////
client.on('ready', () => {
console.log(`[API] Logged in as ${client.user.username} by malozozx`);
client.user.setStatus(`dnd`)
client.user.setActivity(`/help`, { type: "WATCHING" })
})

////////////////////////////Important Files/////////////////////////////////
let data = JSON.parse(fs.readFileSync("./All_Files/prefix.json", "utf8"));
let antibots = JSON.parse(fs.readFileSync("./All_Files/antibots.json", "utf8"));
const { chunk } = require('./All_Files/functions');
////////////////////////////////Start////////////////////////////////////////
const default_prefix = ".";
client.on('messageCreate', async message => {
if (!message.guild) return;
  //////////////////////// SUGGESTION SYSTEM START ///////////////////////////
  if (sugChannels.includes(message.channel.id)) {
      if (message.author.bot) return;

      const suggestionText = message.content;

      // 1. Delete the user's original message
      try { 
          await message.delete(); 
      } catch (e) { 
          console.log("Missing Manage Messages Perms"); 
      }

      // 2. Build the Suggestion Embed
      const sugEmbed = new MessageEmbed()
          .setAuthor({ 
              name: message.author.tag, 
              iconURL: message.author.displayAvatarURL({ dynamic: true }) 
          })
          .setColor("GREEN")
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`> **${suggestionText}**`)
          .setTimestamp()
          .setFooter({ text: "Vote by reacting below!" });

      let attachment = message.attachments.first();
      if (attachment) {
          sugEmbed.setImage(attachment.proxyURL);
      }

      // 3. SENDING LOGIC (Optimized for Speed + Order)

      // Start sending the embed (we store the promise)
      const embedPromise = message.channel.send({ embeds: [sugEmbed] });

      // Immediately start sending the line (don't wait for the embed to finish)
      message.channel.send({ files: [separatorLine] }).catch(e => console.log("Error sending line"));

      // 4. Handle Reactions on the sent embed
      embedPromise.then(async (sentMsg) => {
          try {
              await sentMsg.react('✔️');
              await sentMsg.react('❌');
          } catch (e) {
              console.log("Failed to add reactions");
          }
      });

      // 5. Notify the user via DM
      message.author.send(`✅ Your suggestion has been posted in <#${message.channel.id}>`).catch(() => {});

      return;
  }
  //////////////////////// SUGGESTION SYSTEM END //////////////////////////
let SerPrefix = await db.get(`prefix_${message.guild.id}`);
if (SerPrefix === null) SerPrefix = default_prefix;
//args
let command = message.content.split(" ").slice(1);

if (message.content.startsWith(SerPrefix + 'setprefix')) {
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ content: `You don't have permission 🙄`, allowedMentions: { repliedUser: false } })
db.set(`prefix_${message.guild.id}`, command[0]);
const embed = new MessageEmbed()
.setDescription(`This server's prefix is now \`\`${command[0]}\`\`. Commands must now use \`\`${command[0]}\`\` as their prefix. \`\`${command[0]}help\`\` For Help`)
message.channel.send({ embeds: [embed] })
return;
} else
if (message.content.startsWith(SerPrefix + "antibots on")) {
if (message.member.id !== message.guild.ownerId) return message.react('❌')
const on = new MessageEmbed()
.setDescription(`**AntiBots Has been enabled**`)
.setFooter(client.user.tag, client.user.displayAvatarURL({ size: 256, format: 'png', dynamic: true }))
.setTimestamp()
await message.reply({ embeds: [on], allowedMentions: { repliedUser: false } })
antibots[message.guild.id] = {
onoff: "On"
};
fs.writeFile("./All_Files/antibots.json", JSON.stringify(antibots), err => {
if (err)
console.error(err);
});
} else
if (message.content.startsWith(SerPrefix + "antibots off")) {
if (message.member.id !== message.guild.ownerId) return message.react('❌')
const off = new MessageEmbed()
.setDescription(`**AntiBots Has been Disabled**`)
.setFooter(client.user.tag, client.user.displayAvatarURL({ size: 256, format: 'png', dynamic: true }))
.setTimestamp()
await message.reply({ embeds: [off], allowedMentions: { repliedUser: false } })
antibots[message.guild.id] = {
onoff: "Off"
};
fs.writeFile("./All_Files/antibots.json", JSON.stringify(antibots), err => {
if (err)
console.error(err);
});
} else
if (message.content.startsWith(SerPrefix + "blacklist")) {
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ content: `only adminstator can use this command`, allowedMentions: { repliedUser: false } })
let user = message.mentions.users.first()
if (!user) return message.reply({ content: `❌ Error | You need to mention a member`, allowedMentions: { repliedUser: false } })
let data = db.get(`black_${user.id}`)
if (data) return message.reply({ content: `❌ Error | This member already in blacklist`, allowedMentions: { repliedUser: false } })
await db.set(`black_${user.id}`, user.id)
await message.reply({ content: `✅ Success | ${user} Has Been added to blacklist`, allowedMentions: { repliedUser: false } })
} else
if (message.content.startsWith(SerPrefix + "unblacklist")) {
if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply({ content: `only adminstator can use this command`, allowedMentions: { repliedUser: false } })
let user = message.mentions.users.first()
if (!user) return message.reply({ content: `❌ Error | You need to mention a member`, allowedMentions: { repliedUser: false } })
let data = db.get(`black_${user.id}`)
if (!data) return message.reply({ content: `❌ Error | This member is not in blacklist`, allowedMentions: { repliedUser: false } })
db.delete(`black_${user.id}`)
message.reply({ content: `✅ Success | ${user} Has Been removed from blacklist`, allowedMentions: { repliedUser: false } })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + "server")) {
  if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
const bst = message.guild.premiumSubscriptionCount;
let ServerLogo = message.guild.iconURL() ? `[Download Server Logo](${message.guild.iconURL()})` : "No Server Icon"
let logo = message.guild.iconURL() ? message.guild.iconURL() : ""
let server = new MessageEmbed()
.setColor("RANDOM")
.setImage(logo)
.setThumbnail(message.author.avatarURL({ dynamic: false, size: 512 }))
.addField("**Owner :**", `** <@!${message.guild.ownerId}> **`, false)
.addField("**CreateAt :**", `** <t:${parseInt(message.guild.createdAt / 1000)}:R> **`, false)
.addField(`**Channels :**`, `**${message.guild.channels.cache.size}**`, false)
.addField(`**Members :**`, `**${message.guild.memberCount}**`, false)
.addField(`**Bots :**`, `**${message.guild.members.cache.filter(member => member.user.bot).size}**`, false)
.addField("**Emoji Count:**", `**${message.guild.emojis.cache.size}** Emoji(s)`, false)
.addField("**Roles Count :**", `**${message.guild.roles.cache.size}** Role(s)`, false)
.addField("**Boost Count :**", `**${bst}** Boosts `, false)
.addField(`**Server ID :**`, `**${message.guild.id}**`, false)
.addField(`_ _`, `${ServerLogo}`, false)
.setFooter({
text: `${client.user.username} • Asked by ${message.author.tag}`,
iconURL: client.user.displayAvatarURL()
})
.setTimestamp()
await message.reply({ embeds: [server], allowedMentions: { repliedUser: false } })

} else
if (message.content.toLowerCase().startsWith(SerPrefix + "profile")) {
  let user = message.mentions.users.first() || client.users.cache.get(message.content.split(' ')[1]) || message.author
  if (user.bot) return message.reply({ content: `You can't use this command with bot.` });
  
  let money = db.fetch(`money_${user.id}`) || 0;
  let bank = db.fetch(`bank_${user.id}`) || 0;
  let bio = db.get(`info_${user.id}`) || "No bio set.";

  if (bio instanceof Promise) {
    bio = await bio;
    if (bio === null) bio = "No bio set.";
  }

  const embed = new MessageEmbed()
  .setColor(`GREEN`)
  .setAuthor({ name: `${user.username}'s Profile`, iconURL: user.displayAvatarURL({ dynamic: true }) })
  .setDescription(`> 👤 User: ${user}\n> 🖐🏻 Pocket: \`${money}\`\n> 🏛️ Bank: \`${bank}\` \n\n **Bio:**\n\`\`\`\n${bio}\n\`\`\``)
  .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });

  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + "avatar")) {
  if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
  let uus = message.mentions.users.first() || client.users.cache.get(message.content.split(' ')[1]) || message.author
const avatar = new MessageEmbed()
.setAuthor(`${uus.tag}`, uus.avatarURL())
.setTitle('Avatar Link')
.setURL(uus.displayAvatarURL({ size: 2048, dynamic: true }))
.setImage(uus.avatarURL({ size: 1024, dynamic: true }))
.setFooter({
text: `${client.user.username} • Asked by ${message.author.tag}`,
iconURL: client.user.displayAvatarURL()
})
await message.reply({ embeds: [avatar], allowedMentions: { repliedUser: false } })

} else
if (message.content.toLowerCase().startsWith(SerPrefix + "user")) {
  if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
let args = message.content.split(" ");
let user = await message.mentions.members.first() || await message.guild.members.cache.get(args[1]);
let member = message.member;
if (!member) return;
const MemLogo = message.author.displayAvatarURL({ size: 4096, dynamic: true });
const row1 = new MessageActionRow().addComponents(
new MessageButton()
.setStyle('LINK')
.setURL(`https://discord.com/users/${message.author.id}`)
.setEmoji('957805856244789268')
.setLabel('Profile Link'))
let embed1 = new MessageEmbed()
.setAuthor(`${message.author.tag}`, message.author.avatarURL())
.setImage(MemLogo)
.addField("**𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 :**", `**${message.author.username}**`, true)
.addField("**𝐔𝐬𝐞𝐫 𝐓𝐚𝐠:**", `**#${message.author.discriminator}**`, true)
.addField("**𝐔𝐬𝐞𝐫 ID:**", `**${message.author.id}**`, true)
.addField("**Joined Discord :**", `** <t:${parseInt(message.author.createdAt / 1000)}:R> **`, true)
.addField("**Joined Server :**", `** <t:${parseInt(member.joinedAt / 1000)}:R> **`, true)
.addField(`_ _`, `[Download Avatar](${MemLogo})`, false)
.setFooter({
text: `${client.user.username} • Asked by ${message.author.tag}`,
iconURL: client.user.displayAvatarURL()
})
.setTimestamp()
if (!user) return await message.channel.send({ embeds: [embed1], components: [row1] })
const men = user.user.displayAvatarURL({ size: 4096, dynamic: true });
const row2 = new MessageActionRow().addComponents(
new MessageButton()
.setStyle('LINK')
.setURL(`https://discord.com/users/${user.user.id}`)
.setEmoji('957805856244789268')
.setLabel('Profile Link'))
let embed2 = new MessageEmbed()
.setAuthor(`${user.user.tag}`, user.user.avatarURL())
.setImage(men)
.addField("**𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞 :**", `**${user.user.username}**`, true)
.addField("**𝐔𝐬𝐞𝐫 𝐓𝐚𝐠:**", `**#${user.user.discriminator}**`, true)
.addField("**𝐔𝐬𝐞𝐫 ID:**", `**${user.user.id}**`, true)
.addField("**Joined Discord :**", `** <t:${parseInt(user.user.createdAt / 1000)}:R> **`, true)
.addField("**Joined Server :**", `** <t:${parseInt(user.joinedAt / 1000)}:R> **`, true)
.addField(`_ _`, `[Download Avatar](${men})`, false)
.setFooter({
text: `${client.user.username} • Asked by ${message.author.tag}`,
iconURL: client.user.displayAvatarURL()
})
.setTimestamp()
if (user) return await message.channel.send({ embeds: [embed2], components: [row2] })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + "banner")) {
  if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
  let user = message.mentions.users.first() || client.users.cache.get(message.content.split(' ')[1]) || message.author
if (user.bot) return message.reply({ content: `Bots Does not have a banner`, allowedMentions: { repliedUser: false } })
const fetchUser = await client.users.fetch(user);
await fetchUser.fetch();
if(fetchUser.bannerURL() !== null) {
const embed = new MessageEmbed()
  .setAuthor(fetchUser.tag, fetchUser.displayAvatarURL({ dynamic: true }))
  .setTitle(`Banner Link`)
  .setURL(fetchUser.bannerURL({ dynamic: true, size: 2048 }))
  .setImage(fetchUser.bannerURL({ dynamic: true, size: 4096, format: 'png' }))
  .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
} else {
  const nobanner = new MessageEmbed()
  .setAuthor(fetchUser.tag, fetchUser.displayAvatarURL({ dynamic: true }))
  .setTitle(`No banner found`)
  .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
  await message.reply({ embeds: [nobanner], allowedMentions: { repliedUser: false } })
}
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'bot')) {
if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
let background = await resolveImage(path.resolve(__dirname, './All_Files/bot.png'));
let avatar = await resolveImage(client.user.displayAvatarURL({ format: 'png', size: 512 }));
let ctx = new Canvas(background.width, background.height)
  .printImage(background, 0, 0, background.width, background.height)
  .printCircularImage(avatar, 129, 137, 112)
  .setTextFont('bold 20px monospace')
  .setTextSize(35)
  .setColor('#ffffff')
  .printText(client.user.tag, 20, 300)
  .printText(client.ws.ping, 350, 300)
  .printText(client.guilds.cache.size , 670, 200)
  .printText(SerPrefix, 380, 115)
  .toBuffer();

let buf = new MessageAttachment(ctx, 'bot.png');
await message.reply({ files: [buf] , allowedMentions: { repliedUser: false } })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'members')) {
if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
let embed = new MessageEmbed()
.setTitle(`**${message.guild.name}' Member Count**`)
.setDescription(`
**> 💻 Total Members : ${message.guild.memberCount}**
**> 👦 Humans : ${message.guild.members.cache.filter(m => !m.user.bot).size}**
**> 🤖 Bots : ${message.guild.members.cache.filter(m => m.user.bot).size}**`)
.setFooter({
text: `${client.user.username} • Asked by ${message.author.tag}`,
iconURL: client.user.displayAvatarURL()
})

message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'ping')) {
if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
let embed = new MessageEmbed()
. addFields(
  {
    name:"**API Latency**",
    value:`🟢 | ${client.ws.ping}ms`
  },
  {
    name:"**Message Latency**",
    value:`🔴 | ${Date.now() - message.createdTimestamp}ms`
  },
  {
    name:"**Uptime**",
    value:`⏲️ | ${pretty(client.uptime)}`
  }
)
.setColor("#4453F5")
.setTitle("**:ping_pong: | Pong!**")
.setFooter({
  text:`Requested by ${message.author.username}`,
  iconURL: message.author.displayAvatarURL({dynamic:true})
})
message.reply({embeds:[new MessageEmbed().setDescription("🚨 Loading...").setColor("#4453F5")], allowedMentions: { repliedUser: false } }).then(() =>
  setTimeout(() => {
    message.reply({embeds:[embed], allowedMentions: { repliedUser: false } })
  }, 2*1000))
} else
if (message.content.startsWith(SerPrefix + 'tax')) {
if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
let num = message.content.split(" ").slice(1).join(" ");
var numerr = Math.floor(num);
var tax = 5.3;
if (1 >= num) {
return message.reply(`\n>>> **:rolling_eyes: ${SerPrefix}tax 2**`)
} else
if (num > 99999999999999999999) {
return message.reply({ content: `**يجب ان يكون الرقم صحيح**` })
}
if (!num) return message.reply(`**Usage** : ${SerPrefix}tax 5000**`)
var taxval = Math.floor(numerr * (tax / 100));
var amount = Math.floor(numerr - taxval);
var amountfinal = Math.floor(numerr + taxval);
let embed = new MessageEmbed()
.setColor('#a31010')
.addField(`المبلغ:`, ` ${numerr} `)
.addField(`النسبه الي يسحبها البوت:`, ` ${tax}% `)
.addField(`المبلغ الي يسحبه البوت:`, ` ${taxval}`)
.addField(`المبلغ منغير الضريبة:`, `  ${amount} `)
.addField(`كم لازم تحول عشان يوصل المبلغ بالضبط:`, `  ${amountfinal} `)
.setTimestamp()
.setThumbnail(message.guild.iconURL({ dynamic: true }))
.setImage('https://cdn.discordapp.com/attachments/930146097115054141/972576857713156096/line.png')
.setFooter({ text: `Requested by: ${message.author.username}`, iconURL: message.author.avatarURL({ dynamic: true }) })
message.channel.send({ embeds: [embed] })

} else
if (message.content.startsWith(SerPrefix + "timeout")) {
  if (message.member.permissions.has("ADMINISTRATOR")) {
    let args = message.content.split(" ")
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
    if (!member) return message.reply({ content: `**Mention the user or him ID to shut him up !**`, allowedMentions: { repliedUser: false } })
    if (member.user.bot) return message.reply({ content: `****You can't mute a bot 🙄**!**`, allowedMentions: { repliedUser: false } })
    if (member.user == message.author) return message.reply({ content: `****You can't mute a bot 🙄**!**`, allowedMentions: { repliedUser: false } })
    const notime = new MessageEmbed()
    .setAuthor(`${message.author.tag}` , message.author.avatarURL({dynamic : true}))
    .setTitle(`Command: ban`)
    .setDescription(`Timeout a member.

    **Usage:**
    ${SerPrefix}timeout [user] (time m/h/d/mo/y)

    **Examples:**
    ${SerPrefix}timeout <@${member.user.id}> 60s
    ${SerPrefix}timeout <@${member.user.id}> 5m
    ${SerPrefix}timeout <@${member.user.id}> 10m
    ${SerPrefix}timeout <@${member.user.id}> 1h
    ${SerPrefix}timeout <@${member.user.id}> 1d
    ${SerPrefix}timeout <@${member.user.id}> 1w
    `)
    if (!args[2]) return message.reply({ embeds : [notime], allowedMentions: { repliedUser: false } })
    if (!args[2].endsWith("s") && !args[2].endsWith("m") && !args[2].endsWith("h") && !args[2].endsWith("d") && !args[2].endsWith("w")) {
      return message.reply({ content: `**Please Provide me a valid timer \`s / m / h / d / w\` ❌**`, allowedMentions: { repliedUser: false } })
    }
    if (isNaN(args[2][0])) return message.reply({ content: `**That is not a number ❌ !**`, allowedMentions: { repliedUser: false } })
    let embed = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`> **You are muted in** \`${message.guild.name}\` **for a ${args[2]}**\n> **Muted By : **${message.author}`)
      .setThumbnail(message.guild.iconURL())
      .setFooter(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
    await member.timeout(ms(args[2]))
    await message.reply(`**${message.author.tag}** Timeouted **${member.user.username}** for **${args[2]}**`)
    await member.user.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
  }
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'untimeout')) {
if (!message.member.permissions.has("ADMINISTRATOR")) return;
let args = message.content.split(" ")
let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
if (!member) return message.reply("**Mention the user or him ID !**")
if (member.user.bot) return message.reply("**You can't mute a bot 🙄**");
if (member.user == message.author) return message.reply("**You can't mute yourself 🙄**")
if (!message.member.permissions.has("MUTE_MEMBERS")) return message.reply({ content: `**You do not have permissions to use this command**`, allowedMentions: { repliedUser: false } })
if (!member.isCommunicationDisabled()) {
return message.reply({ content: `**❌ This user is not in timeout.**`, allowedMentions: { repliedUser: false } })
}
await member.disableCommunicationUntil(null, `By: ${message.author.tag}`);
message.reply({ content: `Timeout has been removed from ${member}`, allowedMentions: { repliedUser: false } })

} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'roleinfo')) {
if (!message.member.permissions.has("MANAGE_ROLES")) return message.reply({ content: `You Need \`MANAGE_ROLES\` permission to use this command `, allowedMentions: { repliedUser: false } })
let args = message.content.split(" ")
let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLocaleLowerCase());
if (!role) return message.reply({ content: `**Please Mention The Role ! ❌**`, allowedMentions: { repliedUser: false } })
let embed = new MessageEmbed()
.setTitle(`**Role Info**`)
.addField(`**Role Name :**`, `**${role.name}**`, true)
.addField(`**Role ID :**`, `**${role.id}**`, true)
.addField(`**Role Color :**`, `**${role.hexColor}**`, true)
.addField(`**Role Position :**`, `**${role.position}**`, true)
.addField(`**Role Members :**`, `**${role.members.size}**`, true)
.addField(`**Role Mentionable :**`, `**${role.mentionable}**`, true)
.addField(`**Role Managed :**`, `**${role.managed}**`, true)
.addField(`**Role CreatedAt :**`, `** <t:${parseInt(role.createdAt / 1000)}:R> **`, true)
.setFooter({
text: `${client.user.username} • Asked by ${message.author.tag}`,
iconURL: client.user.displayAvatarURL()
})
.setColor(role.hexColor)
message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'roles')) {
if (!message.member.permissions.has("MANAGE_ROLES")) return message.reply({ content: `You Need \`MANAGE_ROLES\` permission to use this command `, allowedMentions: { repliedUser: false } })
let args = message.content.split(" ")
let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
if (!member) return message.reply({ content: `**Please Mention The User ! ❌**`, allowedMentions: { repliedUser: false } })
const noroles = new MessageEmbed()
.setDescription(`<@${member.user.id}> **Have No Roles**`)
if (!member.roles.cache.size) return message.reply({ embeds: [noroles] });
let roles1 = member.roles.cache.filter((roles) => roles.id !== message.guild.id).map((role) => role.toString()).join(`\n`);
let haveroles = new MessageEmbed()
.setTitle(`This is all roles for ${member.user.username} :`)
.setDescription(`${roles1 || "No Roles"}`)
.setColor("333333")

message.reply({ embeds: [haveroles], allowedMentions: { repliedUser: false } })
} else
if (message.content.startsWith(SerPrefix + 'lock') || message.content.startsWith(SerPrefix + 'قفل')) {
if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send(`** You don't have permission 🙄 **`);
const role = message.guild.roles.cache.find(role => role.name === '@everyone')
await message.channel.permissionOverwrites.edit(role, { SEND_MESSAGES: false, VIEW_CHANNEL: true });
message.reply({ content: `🔒 <#${message.channel.id}> **has been locked.**`, allowedMentions: { repliedUser: false } })
} else
if (message.content.startsWith(SerPrefix + 'unlock') || message.content.startsWith(SerPrefix + 'فتح')) {
if (db.has(`black_${message.author.id}`)) return message.reply({ content: `❌ ERROR  | YOU HAVE BEEN BLACKLISTED FROM USING THE BOT`, allowedMentions: { repliedUser: false } })
if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send(`** ليس لديك صلاحية لإستعمال الأمر ! 🙄 **`);
const role = message.guild.roles.cache.find(role => role.name === '@everyone')
await message.channel.permissionOverwrites.edit(role, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
message.reply({ content: `🔓 <#${message.channel.id}> **has been unlocked.**`, allowedMentions: { repliedUser: false } })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'hide')) {
if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply({ content: `** Missing Permission(s) : \`MANAGE_CHANNELS\` 🙄 **`, allowedMentions: { repliedUser: false } })
let men = message.guild.roles.cache.find(role => role.name === '@everyone');
if (!men) return;
await message.channel.permissionOverwrites.edit(men, { VIEW_CHANNEL: false });
await message.reply({ content: `Now , NoBody can See <#${message.channel.id}> !! `, allowedMentions: { repliedUser: false } })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'show')) {
if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.reply({ content: `** Missing Permission(s) : \`MANAGE_CHANNELS\` 🙄 **`, allowedMentions: { repliedUser: false } })
let men = message.guild.roles.cache.find(role => role.name === '@everyone');
if (!men) return;
await message.channel.permissionOverwrites.edit(men, { VIEW_CHANNEL: true });
await message.reply({ content: `Now , everyone can See <#${message.channel.id}> !! `, allowedMentions: { repliedUser: false } })
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'ban') && !message.content.toLowerCase().endsWith("ner")) {
  let args = message.content.split(" ");
if (!message.member.permissions.has('ADMINISTRATOR')) return;
let user = await message.mentions.members.first() || await message.guild.members.cache.get(args[1]);
if (!user) return message.reply(`❌ Please specify a user to banned.`);
if (!user.bannable) return message.channel.send(`${user} Is unbannedable`);
if (message.guild.ownerId === user.id) return message.channel.send(`${user} Is unbannedable`);
if (user.roles.highest.position >= message.member.roles.highest.position) return message.reply(`${user}'s Roles are higher than or equal to yours`)

try {
await user.ban({ reason: `Has been banned by ${message.member.username}` });
message.channel.send(`✅ ${user.user.username} banned from the server!.`);
} catch (error) {
console.error(error);
}
} else
if (message.content.startsWith(SerPrefix + "unban")) {
  if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('❌ You Dont Have Premission \`Ban\`');
let user = message.content.split(" ").slice(1).join(" ");
if (!user) return message.channel.send({ content: `❌ Wrong Usage !!  \n Usage : \`${SerPrefix}unban user_id\`` })
message.guild.members.unban(user).then(m => {
message.channel.send(`☑️ ${m.username} Unbanned ! `);
}).catch(err => {
message.channel.send(`> ❌ Err Can't Found \`${user}\` In The List`);
});
} else
if (message.content.startsWith(SerPrefix + "kick")) {
if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('❌ You Dont Have Premission \`KICK\`');
let args = message.content.split(" ");
let user = await message.mentions.members.first() || await message.guild.members.cache.get(args[1]);
if (!user) return message.channel.send({ content: `❌ Wrong Usage !!  \n Usage : \`${SerPrefix}kick @user / user_id\`` })
try {
await user.kick()
await message.channel.send(`✅ @${user.user.username} has been kicked !`);
} catch (er) {
await message.channel.send('Error');
}
} else
if (message.content.startsWith(SerPrefix + 'daily')) {
let user = message.member;
let timeout = 86400000;
var amount = Math.floor(Math.random() * 5000)
let daily = await db.fetch(`daily_${user.user.id}`);
if (daily !== null && timeout - (Date.now() - daily) > 0) {
let time = ms(timeout - (Date.now() - daily));
let timeEmbed = new MessageEmbed().setColor("RANDOM").setDescription(`You can collect your daily again in ${time}.`);
message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
} else {
let moneyEmbed = new MessageEmbed().setColor("RANDOM").setDescription(`You've collected your ${amount} from daily.`);
message.reply({ embeds: [moneyEmbed], allowedMentions: { repliedUser: false } })
db.add(`money_${user.user.id}`, amount)
db.set(`daily_${user.user.id}`, Date.now())
}
} else
if (message.content.startsWith(SerPrefix + 'balance')) {
let args = message.content.split(" ")
let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
if (user.user.bot) return message.channel.send({ content: `You can't use this command with bot.` });
let bal = db.fetch(`money_${user.id}`) || 0;
let bank = await db.fetch(`bank_${user.id}`) || 0;
let embed = new MessageEmbed().setColor("RANDOM").setDescription(`${user.user.username}'s Balance\n\nPocket: \`${bal}\`\nBank: \`${bank}\``)
message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
} else
if (message.content.startsWith(SerPrefix + 'deposit')) {
let args = message.content.split(" ").slice(1)
let user = message.member;
let pocket = db.fetch(`money_${user.id}`) || 0;
if (args[0] == 'all') {
if (pocket <= 0) return message.reply("❌ You don't have money to deposit.");
db.subtract(`money_${user.id}`, pocket)
db.add(`bank_${user.id}`, pocket)
message.reply("✅ You have deposited all your coins.");
} else {
let amount = parseInt(args[0]);
if (isNaN(amount) || amount <= 0) return message.reply("❌ Invalid amount.");
if (pocket < amount) return message.reply("❌ You don't have enough money.");
db.subtract(`money_${user.id}`, amount)
db.add(`bank_${user.id}`, amount)
message.reply(`✅ You have deposited ${amount} into bank.`);
}
} else
if (message.content.startsWith(SerPrefix + 'top')) {
let money = db.all().filter(data => data.ID.startsWith(`money_`)).sort((a, b) => b.data - a.data);
money.length = 10;
var finalLb = "";
for (var i in money) {
  let userId = money[i].ID.split('_')[1];
  let user = client.users.cache.get(userId);
  finalLb += `**${parseInt(i) + 1}. ${user ? user.tag : userId}** - ${money[i].data} :dollar:\n`;
}
const embed = new MessageEmbed().setTitle(`Leaderboard Of ${message.guild.name}`).setColor("RANDOM").setDescription(finalLb || "No one yet.");
message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
} else
if (message.content.toLowerCase().startsWith(SerPrefix + 'pbank')) {
    let args = message.content.split(" ")
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
  if (user.user.bot) return message.reply({ content: `You can't use this command with bot.` });

  let money = db.fetch(`money_${user.id}`) || 0;
  let bank = db.fetch(`bank_${user.id}`) || 0;
  let bio = db.fetch(`info_${user.id}`) || `${SerPrefix}setbio`;

  if (bio instanceof Promise) {
    bio = await bio;
    if (bio === null) bio = `${SerPrefix}setbio`;
  }

  const embed = new MessageEmbed().setColor(`RANDOM`).setDescription(`> User: ${user} | ${user.user.tag} | ${user.id}\n> Money: ${money}\n> Bank: ${bank}\n __Bio__: ${bio}`)
  message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
} else
if (message.content.startsWith(SerPrefix + 'setbio')) {
    let args = message.content.split(" ").slice(1);
    let user = message.author;
    if (!args[0]) {
        let fetchInfo = await db.fetch(`info_${user.id}`);
        if (fetchInfo) {
            let viewEmbed = new MessageEmbed().setColor("BLUE").setAuthor({ name: `${user.username}'s Current Bio`, iconURL: user.displayAvatarURL({ dynamic: true }) }).setDescription(`\`\`\`\n${fetchInfo}\n\`\`\``);
            return message.reply({ embeds: [viewEmbed] });
        } else {
            return message.reply("❌ You don't have a bio set.");
        }
    }
    let newInfo = args.join(' ');
    if (newInfo.length > 165) return message.reply(`❌ Bio is too long!`);
    db.set(`info_${user.id}`, newInfo);
    message.reply("✅ Bio Updated!");
} else
if (message.content.startsWith(SerPrefix + 'withdraw')) {
let args = message.content.split(" ").slice(1)
let user = message.member;
let bank = db.fetch(`bank_${user.id}`) || 0;
if (args[0] == 'all') {
if (bank <= 0) return message.reply("❌ No money in bank.");
db.subtract(`bank_${user.id}`, bank)
db.add(`money_${user.id}`, bank)
message.reply("✅ Withdrawn all.");
} else {
let amount = parseInt(args[0]);
if (isNaN(amount) || amount <= 0) return message.reply("❌ Invalid amount.");
if (bank < amount) return message.reply("❌ Not enough in bank.");
db.subtract(`bank_${user.id}`, amount)
db.add(`money_${user.id}`, amount)
message.reply(`✅ Withdrawn ${amount} coins.`);
}
}
});

client.on("guildMemberAdd", user => {
if (!antibots[user.guild.id]) antibots[user.guild.id] = { onoff: "Off" };
if (antibots[user.guild.id].onoff === "Off") return;
if (user.user.bot) user.kick();
});

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();
require("./handlers")(client);
client.login(process.env.token);

client.on("guildMemberAdd", member => {
  member.createDM().then(channel => channel.send(`**Welcome to Server.**`)).catch(console.error);
});
