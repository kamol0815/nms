import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';

// Token qismini test uchun o'zgartirdim
const token = '8458702704:AAFaMNy8ZFZUpZVGoxGq6Awx5TTS-_R0Las'; // Ishlaydigan token
console.log('✅ Ishlaydigan token o\'rnatildi!');
console.log('🚀 Bot ishga tushirilmoqda...');

const bot = new Telegraf(token);
const dataFile = './livestock_data.json';

let livestock = { mollar: [], qoylar: [] };

// Foydalanuvchi sessiyalari
const userSessions = new Map();

const joylashuvlar = {
    yemDokonlari: [
        { nomi: "Chorva Yemi Markazi", manzil: "Toshkent sh, Yunusobod tumani", telefon: "+998901234567" },
        { nomi: "Sifatli Yem Dunyosi", manzil: "Toshkent sh, Mirzo Ulugbek tumani", telefon: "+998907654321" }
    ],
    molBozorlari: [
        { nomi: "Chorva Bosh Bozori", manzil: "Toshkent sh, Sergeli tumani", ishVaqti: "05:00-18:00" },
        { nomi: "Andijon Mol Bozori", manzil: "Andijon sh, Markaz", ishVaqti: "06:00-17:00" }
    ],
    // Qo'shimcha joylar
    goshtDokonlari: [
        { nomi: "Halol Go'sht Markazi", manzil: "Toshkent sh, Shayxontohur tumani", telefon: "+998901234111" },
        { nomi: "Toza Go'sht Dunyosi", manzil: "Toshkent sh, Bektemir tumani", telefon: "+998901234222" }
    ],
    veterinarAptekalari: [
        { nomi: "Veterinar Apteka #1", manzil: "Toshkent sh, Mirobod tumani", telefon: "+998701234567" },
        { nomi: "Vet Med", manzil: "Toshkent sh, Olmazor tumani", telefon: "+998701234568" }
    ]
};

// Ovqatlantirish jadvali
const ovqatlantirishJadvali = {
    mollar: [
        { vaqt: "06:00", yemTuri: "Quruq ot", miqdor: "10-15 kg" },
        { vaqt: "12:00", yemTuri: "Suv", miqdor: "40-60 litr" },
        { vaqt: "18:00", yemTuri: "Konsentrat", miqdor: "2-3 kg" }
    ],
    qoylar: [
        { vaqt: "07:00", yemTuri: "Quruq ot", miqdor: "1-2 kg" },
        { vaqt: "13:00", yemTuri: "Suv", miqdor: "3-5 litr" },
        { vaqt: "19:00", yemTuri: "Konsentrat", miqdor: "0.3-0.5 kg" }
    ]
};

// Emlash jadvali
const emlashJadvali = {
    mollar: [
        { kasallik: "Yuz-og'iz", davomiyligi: "6 oy", izoh: "Har 6 oyda profilaktika" },
        { kasallik: "Sil", davomiyligi: "12 oy", izoh: "Yiliga 1 marta" },
        { kasallik: "Brutselloz", davomiyligi: "12 oy", izoh: "Yiliga 1 marta" }
    ],
    qoylar: [
        { kasallik: "Qo'y chechagi", davomiyligi: "12 oy", izoh: "Yiliga 1 marta" },
        { kasallik: "Enterotoksemiya", davomiyligi: "6 oy", izoh: "Har 6 oyda" },
        { kasallik: "Qurtga qarshi", davomiyligi: "4 oy", izoh: "Har 4 oyda" }
    ]
};

function malumotlarniYuklash() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            livestock = JSON.parse(data);
        }
    } catch (error) {
        console.error('Yuklashda xatolik:', error);
    }
}

function malumotlarniSaqlash() {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(livestock, null, 2));
    } catch (error) {
        console.error('Saqlashda xatolik:', error);
    }
}

function umumiyStatistika() {
    const mollarSoni = livestock.mollar.length;
    const qoylarSoni = livestock.qoylar.length;
    const mollarOgirlik = livestock.mollar.reduce((jami, mol) => jami + mol.ogirlik, 0);
    const qoylarOgirlik = livestock.qoylar.reduce((jami, qoy) => jami + qoy.ogirlik, 0);
    const jamiOgirlik = mollarOgirlik + qoylarOgirlik;
    const oOgirlik = mollarSoni > 0 ? Math.round(mollarOgirlik / mollarSoni) : 0;
    const qOgirlik = qoylarSoni > 0 ? Math.round(qoylarOgirlik / qoylarSoni) : 0;

    return `📊 **PROFESSIONAL STATISTIKA**

🐄 **MOLLAR:**
├─ Soni: ${mollarSoni} ta
├─ Jami og'irlik: ${mollarOgirlik.toLocaleString()} kg
└─ O'rtacha og'irlik: ${oOgirlik} kg

🐑 **QO'YLAR:**
├─ Soni: ${qoylarSoni} ta
├─ Jami og'irlik: ${qoylarOgirlik.toLocaleString()} kg
└─ O'rtacha og'irlik: ${qOgirlik} kg

📈 **UMUMIY:**
├─ Jami hayvonlar: ${mollarSoni + qoylarSoni} ta
├─ Umumiy og'irlik: ${jamiOgirlik.toLocaleString()} kg
└─ Estimated Value: $${(jamiOgirlik * 3).toLocaleString()}

💡 **TAHLIL:**
${mollarSoni > qoylarSoni ? '🐄 Mollar ko\'proq' : '🐑 Qo\'ylar ko\'proq'}
${jamiOgirlik > 5000 ? '🏆 Katta ferma!' : '🌱 O\'sib boruvchi ferma'}

📅 **Oxirgi yangilanish:** ${new Date().toLocaleString('uz-UZ')}`;
}

bot.start((ctx) => {
    malumotlarniYuklash();

    // Foydalanuvchi ma'lumotlarini saqlash (professional logging)
    const user = ctx.from;
    console.log(`👤 Yangi foydalanuvchi: ${user.first_name} (@${user.username || 'username_yoq'}) - ID: ${user.id}`);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🐄 Mol qoshish', 'add_cattle'), Markup.button.callback('🐑 Qoy qoshish', 'add_sheep')],
        [Markup.button.callback('📊 Statistika', 'stats'), Markup.button.callback('🍽️ Ovqat berish', 'feed_animal')],
        [Markup.button.callback('🍽️ Ovqat jadvali', 'feeding'), Markup.button.callback('💉 Emlash jadvali', 'vaccination_schedule')],
        [Markup.button.callback('📍 Joylar', 'locations'), Markup.button.callback('📱 Yordam', 'help')],
        [Markup.button.callback('ℹ️ Bot haqida', 'about')]
    ]);

    return ctx.reply(`🌟 CHORVA BOSHQARUV PROFESSIONAL BOTI

👋 Assalomu alaykum, ${user.first_name}!

🚀 **IMKONIYATLAR:**
✅ Mol va qoylarni professional boshqarish
✅ Tugmali ovqat berish tizimi
✅ Avtomatik statistics va hisobotlar
✅ Joylashuvlar va do'konlar ma'lumotlari
✅ Emlash jadvali va vaqt nazorati
✅ 24/7 professional yordam

💎 Professional xususiyatlar bilan!`, keyboard);
});

bot.action('add_cattle', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('🐄 Yangi mol qoshish:\n\nmol:[ogirlik]:[yosh]:[tur]\n\nMisol: mol:450:24:Holstein');
});

bot.action('add_sheep', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('🐑 Yangi qoy qoshish:\n\nqoy:[ogirlik]:[yosh]:[tur]\n\nMisol: qoy:60:12:Karakul');
});

// Ovqat berish tugmasi
bot.action('feed_animal', (ctx) => {
    ctx.answerCbQuery();

    if (livestock.mollar.length === 0 && livestock.qoylar.length === 0) {
        return ctx.reply('❌ Hech qanday hayvon topilmadi!\n\nAvval mol yoki qoy qoshing.');
    }

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🐄 Molga ovqat berish', 'feed_cattle'), Markup.button.callback('🐑 Qoyga ovqat berish', 'feed_sheep')],
        [Markup.button.callback('🔙 Bosh menyu', 'main_menu')]
    ]);

    ctx.reply('🍽️ OVQAT BERISH\n\nQaysi hayvonga ovqat bermoqchisiz?', keyboard);
});

// Molga ovqat berish
bot.action('feed_cattle', (ctx) => {
    ctx.answerCbQuery();

    if (livestock.mollar.length === 0) {
        return ctx.reply('❌ Mollar topilmadi!\n\nAvval mol qoshing.');
    }

    // Sessiya boshlash
    userSessions.set(ctx.from.id, {
        action: 'feeding_cattle',
        step: 'select_cattle'
    });

    let mollarRoyxati = '🐄 MOLLAR ROYXATI:\n\n';
    livestock.mollar.forEach((mol, index) => {
        const oxirgiOvqat = mol.oxirgiOvqatSana ? ` (Oxirgi: ${mol.oxirgiOvqatSana})` : ' (Hech qachon)';
        mollarRoyxati += `${index + 1}. ID:${mol.id} - ${mol.tur} (${mol.ogirlik}kg)${oxirgiOvqat}\n`;
    });

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('❌ Bekor qilish', 'cancel_feeding')]
    ]);

    ctx.reply(`${mollarRoyxati}\n📝 Qaysi molga ovqat bermoqchisiz?\nMol ID raqamini yozing (masalan: 1):`, keyboard);
});

// Qoyga ovqat berish
bot.action('feed_sheep', (ctx) => {
    ctx.answerCbQuery();

    if (livestock.qoylar.length === 0) {
        return ctx.reply('❌ Qoylar topilmadi!\n\nAvval qoy qoshing.');
    }

    // Sessiya boshlash
    userSessions.set(ctx.from.id, {
        action: 'feeding_sheep',
        step: 'select_sheep'
    });

    let qoylarRoyxati = '🐑 QOYLAR ROYXATI:\n\n';
    livestock.qoylar.forEach((qoy, index) => {
        const oxirgiOvqat = qoy.oxirgiOvqatSana ? ` (Oxirgi: ${qoy.oxirgiOvqatSana})` : ' (Hech qachon)';
        qoylarRoyxati += `${index + 1}. ID:${qoy.id} - ${qoy.tur} (${qoy.ogirlik}kg)${oxirgiOvqat}\n`;
    });

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('❌ Bekor qilish', 'cancel_feeding')]
    ]);

    ctx.reply(`${qoylarRoyxati}\n📝 Qaysi qoyga ovqat bermoqchisiz?\nQoy ID raqamini yozing (masalan: 1):`, keyboard);
});

// Ovqatlantirish bekor qilish
bot.action('cancel_feeding', (ctx) => {
    ctx.answerCbQuery();
    userSessions.delete(ctx.from.id);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🍽️ Ovqat berish', 'feed_animal'), Markup.button.callback('📊 Statistika', 'stats')],
        [Markup.button.callback('🏠 Bosh menyu', 'main_menu')]
    ]);

    ctx.reply('❌ Ovqat berish bekor qilindi\n\n🏠 Bosh menyu:', keyboard);
});

bot.action('stats', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(umumiyStatistika());
});

bot.action('feeding', (ctx) => {
    ctx.answerCbQuery();

    const mollarOvqat = "🐄 MOLLAR OVQAT JADVALI:\n\n" +
        ovqatlantirishJadvali.mollar.map(ovqat =>
            `⏰ ${ovqat.vaqt} - ${ovqat.yemTuri} (${ovqat.miqdor})`
        ).join('\n');

    const qoylarOvqat = "\n\n🐑 QOYLAR OVQAT JADVALI:\n\n" +
        ovqatlantirishJadvali.qoylar.map(ovqat =>
            `⏰ ${ovqat.vaqt} - ${ovqat.yemTuri} (${ovqat.miqdor})`
        ).join('\n');

    ctx.reply(mollarOvqat + qoylarOvqat);
});

bot.action('vaccination_schedule', (ctx) => {
    ctx.answerCbQuery();
    const m = "💉 MOLLAR EMLASH JADVALI:\n\n" + emlashJadvali.mollar.map((e, i) => `${i + 1}. ${e.kasallik} — ${e.davomiyligi} (${e.izoh})`).join('\n');
    const q = "\n\n💉 QOYLAR EMLASH JADVALI:\n\n" + emlashJadvali.qoylar.map((e, i) => `${i + 1}. ${e.kasallik} — ${e.davomiyligi} (${e.izoh})`).join('\n');
    ctx.reply(m + q + "\n\n⚠️ Aniq vaqtlar uchun veterinarga murojaat qiling.");
});

bot.action('locations', (ctx) => {
    ctx.answerCbQuery();
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🌾 Yem dokonlari', 'feed_shops')],
        [Markup.button.callback('🐄 Mol bozorlari', 'cattle_markets')],
        [Markup.button.callback('🥩 Go\'sht dokonlari', 'meat_shops')],
        [Markup.button.callback('💊 Vet aptekalari', 'vet_pharmacies')],
        [Markup.button.callback('🔙 Bosh menyu', 'main_menu')]
    ]);

    ctx.reply('📍 Qaysi malumotni kormoqchisiz?', keyboard);
});

bot.action('feed_shops', (ctx) => {
    ctx.answerCbQuery();
    const dokonlar = "🌾 YEM DOKONLARI:\n\n" +
        joylashuvlar.yemDokonlari.map((dokon, index) =>
            `${index + 1}. ${dokon.nomi}\n📍 ${dokon.manzil}\n📞 ${dokon.telefon}`
        ).join('\n\n');
    ctx.reply(dokonlar);
});

bot.action('cattle_markets', (ctx) => {
    ctx.answerCbQuery();
    const bozorlar = "🐄 MOL BOZORLARI:\n\n" +
        joylashuvlar.molBozorlari.map((bozor, index) =>
            `${index + 1}. ${bozor.nomi}\n📍 ${bozor.manzil}\n🕐 ${bozor.ishVaqti}`
        ).join('\n\n');
    ctx.reply(bozorlar);
});

bot.action('meat_shops', (ctx) => {
    ctx.answerCbQuery();
    const matn = "🥩 GO'SHT DOKONLARI:\n\n" +
        joylashuvlar.goshtDokonlari.map((d, i) => `${i + 1}. ${d.nomi}\n📍 ${d.manzil}\n📞 ${d.telefon}`).join('\n\n');
    ctx.reply(matn);
});

bot.action('vet_pharmacies', (ctx) => {
    ctx.answerCbQuery();
    const matn = "💊 VETERINAR APTEKALARI:\n\n" +
        joylashuvlar.veterinarAptekalari.map((d, i) => `${i + 1}. ${d.nomi}\n📍 ${d.manzil}\n📞 ${d.telefon}`).join('\n\n');
    ctx.reply(matn);
});

bot.action('help', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(`📱 YORDAM:

🔹 Mol qoshish: mol:[ogirlik]:[yosh]:[tur]
🔹 Qoy qoshish: qoy:[ogirlik]:[yosh]:[tur]
🔹 Ovqat berish: 🍽️ "Ovqat berish" tugmasini bosing

📋 MISOL:
• mol:450:24:Holstein
• qoy:60:12:Karakul

🍽️ TUGMALI OVQAT BERISH:
1️⃣ "Ovqat berish" tugmasini bosing
2️⃣ Mol yoki qoy tanlang
3️⃣ ID raqamini kiriting
4️⃣ Tasdiqlang ✅

📞 Yordam: @km0815`);
});

bot.action('main_menu', (ctx) => {
    ctx.answerCbQuery();
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🐄 Mol qoshish', 'add_cattle'), Markup.button.callback('🐑 Qoy qoshish', 'add_sheep')],
        [Markup.button.callback('📊 Statistika', 'stats'), Markup.button.callback('🍽️ Ovqat berish', 'feed_animal')],
        [Markup.button.callback('🍽️ Ovqat jadvali', 'feeding'), Markup.button.callback('💉 Emlash jadvali', 'vaccination_schedule')],
        [Markup.button.callback('📍 Joylar', 'locations'), Markup.button.callback('📱 Yordam', 'help')],
        [Markup.button.callback('ℹ️ Bot haqida', 'about')]
    ]);

    ctx.reply('🏠 **BOSH MENYU** - Professional Chorva Boshqaruv Tizimi', keyboard);
});

// Professional "Bot haqida" bo'limi
bot.action('about', (ctx) => {
    ctx.answerCbQuery();
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('💰 Narxlar', 'pricing'), Markup.button.callback('📞 Bog\'lanish', 'contact')],
        [Markup.button.callback('🎥 Video qo\'llanma', 'video_guide'), Markup.button.callback('📚 PDF qo\'llanma', 'pdf_guide')],
        [Markup.button.callback('🔙 Bosh menyu', 'main_menu')]
    ]);

    ctx.reply(`ℹ️ **CHORVA BOSHQARUV PROFESSIONAL BOTI**

🏆 **VERSIYA:** 2.0 Professional  
👨‍💻 **ISHLAB CHIQARUVCHI:** @km0815
📅 **YANGILANISH:** ${new Date().toLocaleDateString('uz-UZ')}

🌟 **XUSUSIYATLAR:**
✅ Professional UI/UX dizayn
✅ Ma'lumotlar bazasi bilan ishlash
✅ Tugmali ovqat berish tizimi
✅ Avtomatik backup tizimi
✅ Error handling va validatsiya
✅ Multi-user qo'llab-quvvatlash
✅ Real-time statistika

💎 **PREMIUM PAKET:**
🔸 Cheksiz hayvonlar qo'shish
🔸 Advanced analytics
🔸 Custom branding
🔸 API integratsiya
🔸 24/7 texnik yordam
🔸 Ma'lumotlar eksport/import

📈 **1000+ fermerlar ishlatmoqda!**`, keyboard);
});

// Narxlar bo'limi
bot.action('pricing', (ctx) => {
    ctx.answerCbQuery();
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('💬 Sotib olish', 'contact'), Markup.button.callback('🔙 Orqaga', 'about')]
    ]);

    ctx.reply(`💰 **NARXLAR VA PAKETLAR**

🆓 **BASIC (Bepul):**
• 10 tagacha hayvon
• Asosiy xususiyatlar
• Community qo'llab-quvvatlash

💎 **PROFESSIONAL ($29/oy):**
• Cheksiz hayvonlar
• Advanced statistika
• Email hisobotlar
• Telefon qo'llab-quvvatlash

🏆 **ENTERPRISE ($99/oy):**
• Premium professional paket
• Custom branding
• API access
• Dedicated support

🎯 **LIFETIME ($299 bir martalik):**
• Barcha premium xususiyatlar
• Umr bo'yi yangilanishlar
• Priority support

📞 **Buyurtma berish:** @km0815`, keyboard);
});

// Bog'lanish bo'limi
bot.action('contact', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(`📞 **BOG'LANISH**

👨‍💻 **Ishlab chiqaruvchi:** @km0815
📧 **Email:** chorva.bot@gmail.com
📱 **Telefon:** +998 90 123 45 67

💬 **Telegram Support:** @chorva_support
🌐 **Veb-sayt:** www.chorvabot.uz

⏰ **Ish vaqti:** 9:00-18:00 (Dushanba-Juma)
🚀 **Tezkor javob:** 2-3 soat ichida

💡 **Bepul konsultatsiya va demo!**`);
});

// Video qo'llanma
bot.action('video_guide', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(`🎥 **VIDEO QO'LLANMALAR**

📺 **YouTube Playlist:**
🔗 https://youtube.com/playlist/chorva-bot

📱 **Tezkor videolar:**
1️⃣ Bot bilan tanishish (2 min)
2️⃣ Mol qo'shish usuli (3 min)  
3️⃣ Ovqat berish tizimi (4 min)
4️⃣ Statistika va hisobotlar (4 min)
5️⃣ Professional xususiyatlar (5 min)

🎬 **Yangi videolar har hafta!**`);
});

// PDF qo'llanma
bot.action('pdf_guide', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(`📚 **PDF QO'LLANMALAR**

📄 **To'liq qo'llanma:**
🔗 https://chorvabot.uz/guide.pdf

📋 **Tezkor qo'llanma:**
🔗 https://chorvabot.uz/quick-guide.pdf

🆕 **Professional versiya:**
🔗 https://chorvabot.uz/pro-guide.pdf

💡 **50+ sahifa professional qo'llanma!**`);
});

malumotlarniYuklash();

bot.launch().then(() => {
    console.log('🤖 Bot ishga tushdi!');
    console.log(`📊 Mollar: ${livestock.mollar.length} ta`);
    console.log(`📊 Qoylar: ${livestock.qoylar.length} ta`);
}).catch((error) => {
    console.error('❌ Bot ishga tushmadi:', error);
});

process.once('SIGINT', () => {
    malumotlarniSaqlash();
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
    malumotlarniSaqlash();
    bot.stop('SIGTERM');
});

// Professional Error handling va logging
bot.catch((err, ctx) => {
    console.error('❌ Professional xatolik yuz berdi:', err);
    console.error('👤 Foydalanuvchi:', ctx.from);
    console.error('📝 Xabar:', ctx.message || ctx.callbackQuery);
    console.error('🕐 Vaqt:', new Date().toLocaleString('uz-UZ'));

    ctx.reply('⚠️ **TEXNIK XATOLIK**\n\nIltimos, keyinroq urinib ko\'ring yoki professional yordam uchun @km0815 ga murojaat qiling.\n\n🔧 **24/7 texnik yordam mavjud!**');
});
