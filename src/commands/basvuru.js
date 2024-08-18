const { EmbedBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('basvuru')
    .setDescription('Başvuru mesajı gönderirsiniz.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


    async execute(interaction) {

        const minikinembedi = new EmbedBuilder()
        .setTitle(`Merhaba ${interaction.guild.name} halkı!`)
        .setColor(`#b2ff88`)
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription(`Merhaba, ${interaction.guild.name} personel alımlarımız aktif! \n Kafana takılan bir yer olursa sormaktan çekinme. \n başvuru yapmak için altta bulunan butonu kullanabilirsin! \n\n\n __Başvuru yaptığınız için yetkilileri darlamayınız lütfen.__ `)
        .setImage(minik.mesai.ekip.photograph);

        const minikinbasvurbutonu = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`minikinmodali`)
            .setEmoji(minik.mesai.menuayarlari.birsecenekemoji)
            .setLabel(`Başvuru yapmak için tıkla!`)
            .setStyle(ButtonStyle.Success)

        )

        interaction.channel.send({ content: `||@everyone|| & ||@here||`, embeds: [minikinembedi], components: [minikinbasvurbutonu], ephemeral: false})

        interaction.reply({content: `Mesajınız başarıyla gönderildi.`, ephemeral: true})
    }
}
