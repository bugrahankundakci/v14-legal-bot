const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription('Bot ile alakalı işlemler')
    .addStringOption(option =>
      option.setName('log_kurulum')
        .setDescription('Botun loglarını atması için log odalarını kurar.')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('log_temizle')
        .setDescription('Temizlemek istediğiniz log kategorisinin ismini belirtin.')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('uyarirolleriinikur')
        .setDescription('Belirtilen burçlarda roller oluşturur.')
        .setRequired(false)),

  async execute(interaction) {
    if (interaction.user.id !== minik.reklam.minikdcid) {
      return interaction.reply({
        content: ":x: Bu komutu kullanmaya izniniz yok.",
        ephemeral: true,
      });
    }

    const logChannels = [
      'invite_log',
      'otorol_log',
      'minik_log',
      'nick_log',
      'strike_log'
    ];

    if (interaction.options.getString('log_kurulum')) {
      await interaction.deferReply({ content: `Log odaları kuruluyor...`, ephemeral: true });
      try {
        const category = await interaction.guild.channels.create({
          name: 'minik',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [{
            id: interaction.guild.roles.everyone.id,
            deny: [
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.MuteMembers,
              PermissionFlagsBits.DeafenMembers,
              PermissionFlagsBits.Stream,
              PermissionFlagsBits.Speak,
            ]
          }]
        });

        for (const channelName of logChannels) {
          await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category.id,
          });
        }

        return interaction.followUp({ content: 'Log odaları başarıyla oluşturuldu.', ephemeral: true });
      } catch (error) {
        console.error('Log odaları oluşturulurken bir hata oluştu:', error);
        return interaction.followUp({ content: 'Log odaları oluşturulurken bir hata oluştu.', ephemeral: true });
      }
    }

    if (interaction.options.getString('log_temizle')) {
      const categoryName = interaction.options.getString('log_temizle');

      try {
        const category = interaction.guild.channels.cache.find(channel => channel.name === categoryName && channel.type === ChannelType.GuildCategory);
        if (category) {
          const childrenChannels = category.children.cache.filter(channel => logChannels.includes(channel.name));
          for (const channel of childrenChannels.values()) {
            await channel.delete();
          }
          await category.delete();
          return interaction.followUp({ content: 'Log odaları başarıyla temizlendi.', ephemeral: true });
        } else {
          return interaction.followUp({ content: 'Belirtilen kategori bulunamadı.', ephemeral: true });
        }
      } catch (error) {
        console.error('Log odaları temizlenirken bir hata oluştu:', error);
        return interaction.followUp({ content: 'Log odaları temizlenirken bir hata oluştu.', ephemeral: true });
      }
    }

if (interaction.options.getString('uyarirolleriinikur')) {
  const minikinuyarirolleri = [
    '1x',
    '2x',
    '3x',
    '4x',
    '5x',
    '1 gün wl',
    '2 gün wl',
    '3 gün wl',
    '5 gün wl',
    '7 gün wl'
  ];

  try {
    for (const burc of minikinuyarirolleri) {
      await interaction.guild.roles.create({
        name: burc,
      });
    }
    return interaction.channel.send({ content: 'Uyarı rolleri başarıyla oluşturuldu.', ephemeral: true });
  } catch (error) {
    console.error('Uyarı rolleri oluşturulurken bir hata oluştu:', error);
    return interaction.channel.send({ content: 'Uyarı rolleri oluşturulurken bir hata oluştu.', ephemeral: true });
  }
}



    return interaction.channel.send({ content: 'Bir seçenek belirtmediniz.', ephemeral: true });
  },
};