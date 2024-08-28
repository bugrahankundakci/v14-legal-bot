const { Events, PermissionsBitField, StringSelectMenuBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const minik = require('../../minik.json');
const ticketChannels = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket-olustur') {
            const selectedValue = interaction.values[0];

            const militaninmenusu = new StringSelectMenuBuilder()
                .setCustomId('ticket-actions')
                .setPlaceholder('Ticketi yönetmek İçin Kategori Seçiniz.')
                .addOptions([
                    {
                        label: 'Kayıt et ve kapat.',
                        emoji: '1264482870249000981',
                        description: 'Deneme',
                        value: 'kaydetkapat',
                    },
                    {
                        label: 'Sorunumu ben çözdüm.',
                        description: 'Deneme',
                        emoji: '1264482781069574185',
                        value: 'bencozdum',
                    },
                ]);

            const actionRowMenu = new ActionRowBuilder().addComponents(militaninmenusu);

            switch (selectedValue) {
                case 'destekbug':
                    await interaction.reply({ content: `<@${interaction.user.id}> Ticketin açılıyor...`, ephemeral: true });
                    const destekticketi = await interaction.guild.channels.create({
                        type: ChannelType.GuildText,
                        parent: minik.ticket.kategori.ticketkategori,
                        name: `${interaction.user.username}-ticket`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: minik.ticket.yetkili.ticket,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });
                    ticketChannels.set(interaction.user.id, destekticketi.id);

                    const destekbugmesaj = `Ticket açtı.`;
                    const militaninticketegonderdigimesaj = new EmbedBuilder()
                        .setColor('#000000')
                        .setTitle(`${interaction.user.username} - ${destekbugmesaj}`)
                        .setDescription(minik.ticket.menuayarlari.icmesaj);
                    await destekticketi.send({
                        content: `<@${interaction.user.id}> - <@&${minik.ticket.yetkili.ticket}>`,
                        embeds: [militaninticketegonderdigimesaj],
                        components: [actionRowMenu]
                    });
                    break;

                case 'baskaproblems':
                    const baskaproblemticketi = await interaction.guild.channels.create({
                        type: ChannelType.GuildText,
                        parent: minik.ticket.kategori.ticketkategori,
                        name: `${interaction.user.username}-ticket`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: minik.ticket.yetkili.ticket,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });
                    ticketChannels.set(interaction.user.id, baskaproblemticketi.id);

                    const baskaproblemsModal = new ModalBuilder()
                        .setCustomId('baskaproblemsModal')
                        .setTitle('Sorununu belirt.');

                    const changeNameInput = new TextInputBuilder()
                        .setCustomId('acikcasorun')
                        .setLabel('Problem ne?')
                        .setPlaceholder('Sorununu açık ve net bir şekilde belirt.')
                        .setStyle(TextInputStyle.Paragraph);

                    const changeActionRow = new ActionRowBuilder()
                        .addComponents(changeNameInput);

                    baskaproblemsModal.addComponents(changeActionRow);
                    await interaction.showModal(baskaproblemsModal);
                    break;

                case 'sifirla':
                    await interaction.reply({ content: `<@${interaction.user.id}> Başarılı bir şekilde seçenek sıfırlandı.`, ephemeral: true });
                    break;

                default:
                    await interaction.reply({ content: 'Geçersiz seçenek!', ephemeral: true });
                    break;
            }
        } else if (interaction.isModalSubmit() && interaction.customId === 'baskaproblemsModal') {
            const acikcasorun = interaction.fields.getTextInputValue('acikcasorun');
            const ticketId = ticketChannels.get(interaction.user.id);
            const ticketChannel = interaction.guild.channels.cache.get(ticketId);

            if (ticketChannel) {
                const militaninembedmessagesii = new EmbedBuilder()
                    .setColor('#000000')
                    .setTitle(`${interaction.user.username}`)
                    .setDescription(`${acikcasorun}.`);

                await interaction.reply({ content: `${acikcasorun}.`, ephemeral: true });

                const militaninmenusu = new StringSelectMenuBuilder()
                .setCustomId('ticket-actions')
                .setPlaceholder('Ticket Açmak İçin Kategori Seçiniz.')
                .addOptions([
                    {
                        label: 'Kayıt et ve kapat.',
                        emoji: '1264482870249000981',
                        description: 'Deneme',
                        value: 'kaydetkapat',
                    },
                    {
                        label: 'Sorunumu ben çözdüm.',
                        description: 'Deneme',
                        emoji: '1264482781069574185',
                        value: 'bencozdum',
                    },
                ]);

            const actionRowMenu = new ActionRowBuilder().addComponents(militaninmenusu);



                await ticketChannel.send({
                    content: `<@${interaction.user.id}> - <@&${minik.ticket.yetkili.ticket}>`,
                    embeds: [militaninembedmessagesii],
                    components: [actionRowMenu]
                });
            }
        }
    },
};
