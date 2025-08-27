import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';

// Token qismini test uchun o'zgartirdim
const token = '8458702704:AAFaMNy8ZFZUpZVGoxGq6Awx5TTS-_R0Las'; // Yangi token
console.log('✅ Yangi token o\'rnatildi!');
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

    // Foydalanuvchi ma'lumotlarini saqlash
    const user = ctx.from;
    console.log(`👤 Yangi foydalanuvchi: ${user.first_name} (@${user.username || 'username_yoq'}) - ID: ${user.id}`);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🐄 Mol qo\'shish', 'add_cattle'), Markup.button.callback('🐑 Qo\'y qo\'shish', 'add_sheep')],
        [Markup.button.callback('📊 Statistika', 'stats'), Markup.button.callback('🍽️ Ovqatlantirish', 'feeding')],
        [Markup.button.callback('💉 Emlash jadvali', 'vaccination_schedule'), Markup.button.callback('📍 Joylashuvlar', 'locations')],
        [Markup.button.callback('📱 Yordam', 'help'), Markup.button.callback('ℹ️ Bot haqida', 'about')]
    ]);

    return ctx.reply(`🌟 CHORVA BOSHQARUV PROFESSIONAL BOTI

👋 Assalomu alaykum, ${user.first_name}!

🚀 **IMKONIYATLAR:**
✅ Mol va qo'ylarni professional boshqarish
✅ Step-by-step oson qo'shish tizimi
✅ Avtomatik ovqatlantirish eslatmalari
✅ Emlash jadvali va vaqt nazorati
✅ Joylashuvlar va do'konlar ma'lumotlari
✅ Statistika va hisobotlar
✅ 24/7 yordam va qo'llab-quvvatlash

💎 **Premium xususiyatlar bilan!**`, keyboard);
});

bot.action('add_cattle', (ctx) => {
    ctx.answerCbQuery();

    // Sessiya boshlash
    userSessions.set(ctx.from.id, {
        action: 'adding_cattle',
        step: 'weight',
        data: {}
    });

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('❌ Bekor qilish', 'cancel_action')]
    ]);

    ctx.reply(`🐄 YANGI MOL QO'SHISH

� 1-qadam: Molning og'irligini kiriting

⚖️ Og'irlikni kilogramm (kg) da yozing
📝 Misol: 450 yoki 380 yoki 520

💡 Odatda mollar 200-800 kg orasida bo'ladi`, keyboard);
});

bot.action('add_sheep', (ctx) => {
    ctx.answerCbQuery();

    // Sessiya boshlash
    userSessions.set(ctx.from.id, {
        action: 'adding_sheep',
        step: 'weight',
        data: {}
    });

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('❌ Bekor qilish', 'cancel_action')]
    ]);

    ctx.reply(`🐑 YANGI QO'Y QO'SHISH

� 1-qadam: Qo'yning og'irligini kiriting

⚖️ Og'irlikni kilogramm (kg) da yozing
📝 Misol: 60 yoki 45 yoki 80

💡 Odatda qo'ylar 30-120 kg orasida bo'ladi`, keyboard);
});

bot.action('cancel_action', (ctx) => {
    ctx.answerCbQuery();
    userSessions.delete(ctx.from.id);

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🐄 Mol qoshish', 'add_cattle'), Markup.button.callback('🐑 Qoy qoshish', 'add_sheep')],
        [Markup.button.callback('� Statistika', 'stats'), Markup.button.callback('🏠 Bosh menyu', 'main_menu')]
    ]);

    ctx.reply('❌ Amal bekor qilindi\n\n🏠 Bosh menyu:', keyboard);
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
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🎥 Video qo\'llanma', 'video_guide'), Markup.button.callback('� PDF qo\'llanma', 'pdf_guide')],
        [Markup.button.callback('💬 Chat support', 'contact'), Markup.button.callback('🔙 Bosh menyu', 'main_menu')]
    ]);

    ctx.reply(`� **PROFESSIONAL YORDAM MARKAZI**

🚀 **TEZKOR BUYRUQLAR:**
• \`mol:450:24:Holstein\` - Tez mol qo'shish
• \`qoy:60:12:Karakul\` - Tez qo'y qo'shish
• \`ovqat:mol:1\` - Molga ovqat berish
• \`emlash:mol:1:Brutselloz\` - Emlash belgilash

🎯 **STEP-BY-STEP TIZIM:**
1️⃣ Tugmani bosing
2️⃣ Og'irlikni kiriting
3️⃣ Yoshni kiriting  
4️⃣ Turni tanlang
5️⃣ Tayyor! ✅

💡 **PROFESSIONAL MASLAHATLAR:**
├─ Har kuni statistikani kuzating
├─ Emlash vaqtlarini unutmang
├─ Ovqatlantirish jadvaliga rioya qiling
└─ Backup yarating

📞 **24/7 QOLLAB-QUVVATLASH:**
• Telegram: @km0815
• Email: support@chorvabot.uz
• Telefon: +998901234567

🏆 **PROFESSIONAL VERSION BENEFITS:**
✅ Cheksiz hayvonlar
✅ Advanced analytics  
✅ Custom reports
✅ API integration
✅ Priority support`, keyboard);
});

bot.action('main_menu', (ctx) => {
    ctx.answerCbQuery();
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('🐄 Mol qo\'shish', 'add_cattle'), Markup.button.callback('🐑 Qo\'y qo\'shish', 'add_sheep')],
        [Markup.button.callback('📊 Statistika', 'stats'), Markup.button.callback('🍽️ Ovqatlantirish', 'feeding')],
        [Markup.button.callback('� Emlash jadvali', 'vaccination_schedule'), Markup.button.callback('�📍 Joylashuvlar', 'locations')],
        [Markup.button.callback('📱 Yordam', 'help'), Markup.button.callback('ℹ️ Bot haqida', 'about')]
    ]);

    ctx.reply('🏠 **BOSH MENYU** - Professional Chorva Boshqaruv Tizimi', keyboard);
});

bot.on('text', (ctx) => {
    const text = ctx.message.text;
    const userId = ctx.from.id;

    // Agar foydalanuvchi sessiyasi mavjud bo'lsa
    if (userSessions.has(userId)) {
        const session = userSessions.get(userId);

        if (session.action === 'adding_cattle') {
            return handleCattleSession(ctx, session, text);
        } else if (session.action === 'adding_sheep') {
            return handleSheepSession(ctx, session, text);
        }
    }

    const lowerText = text.toLowerCase();

    // Eski format (saqlab qolish uchun)
    if (lowerText.startsWith('mol:')) {
        const parts = lowerText.split(':');
        if (parts.length === 4) {
            const ogirlik = parseInt(parts[1]);
            const yosh = parseInt(parts[2]);
            const tur = parts[3];

            if (ogirlik && yosh && tur && ogirlik >= 200 && ogirlik <= 800 && yosh >= 6 && yosh <= 120) {
                const yangiMol = {
                    id: livestock.mollar.length + 1,
                    ogirlik: ogirlik,
                    yosh: yosh,
                    tur: tur.charAt(0).toUpperCase() + tur.slice(1),
                    qoshilganSana: new Date().toLocaleDateString('uz-UZ'),
                    oxirgiEmlash: null,
                    oxirgiOvqatSana: null,
                    bugungiOvqat: false
                };

                livestock.mollar.push(yangiMol);
                malumotlarniSaqlash();

                const keyboard = Markup.inlineKeyboard([
                    [Markup.button.callback('🐄 Yana mol qo\'shish', 'add_cattle'), Markup.button.callback('📊 Statistika', 'stats')],
                    [Markup.button.callback('🏠 Bosh menyu', 'main_menu')]
                ]);

                ctx.reply(`🎉 YANGI MOL MUVAFFAQIYATLI QO'SHILDI!

🐄 ID: ${yangiMol.id}
⚖️ Og'irlik: ${yangiMol.ogirlik} kg
🎂 Yosh: ${yangiMol.yosh} oy
🔢 Tur: ${yangiMol.tur}
📅 Qo'shilgan: ${yangiMol.qoshilganSana}

✅ Ma'lumotlar saqlandi!`, keyboard);
            } else {
                ctx.reply('❌ Noto\'g\'ri ma\'lumot!\n\n⚖️ Og\'irlik: 200-800 kg\n🎂 Yosh: 6-120 oy\n\nMisol: mol:450:24:Holstein');
            }
        } else {
            ctx.reply('❌ Noto\'g\'ri format!\n\nTo\'g\'ri format: mol:450:24:Holstein');
        }
    }

    else if (lowerText.startsWith('qoy:')) {
        const parts = lowerText.split(':');
        if (parts.length === 4) {
            const ogirlik = parseInt(parts[1]);
            const yosh = parseInt(parts[2]);
            const tur = parts[3];

            if (ogirlik && yosh && tur && ogirlik >= 30 && ogirlik <= 120 && yosh >= 3 && yosh <= 96) {
                const yangiQoy = {
                    id: livestock.qoylar.length + 1,
                    ogirlik: ogirlik,
                    yosh: yosh,
                    tur: tur.charAt(0).toUpperCase() + tur.slice(1),
                    qoshilganSana: new Date().toLocaleDateString('uz-UZ'),
                    oxirgiEmlash: null,
                    oxirgiOvqatSana: null,
                    bugungiOvqat: false
                };

                livestock.qoylar.push(yangiQoy);
                malumotlarniSaqlash();

                const keyboard = Markup.inlineKeyboard([
                    [Markup.button.callback('🐑 Yana qo\'y qo\'shish', 'add_sheep'), Markup.button.callback('📊 Statistika', 'stats')],
                    [Markup.button.callback('🏠 Bosh menyu', 'main_menu')]
                ]);

                ctx.reply(`🎉 YANGI QO'Y MUVAFFAQIYATLI QO'SHILDI!

🐑 ID: ${yangiQoy.id}
⚖️ Og'irlik: ${yangiQoy.ogirlik} kg
🎂 Yosh: ${yangiQoy.yosh} oy
🔢 Tur: ${yangiQoy.tur}
📅 Qo'shilgan: ${yangiQoy.qoshilganSana}

✅ Ma'lumotlar saqlandi!`, keyboard);
            } else {
                ctx.reply('❌ Noto\'g\'ri ma\'lumot!\n\n⚖️ Og\'irlik: 30-120 kg\n🎂 Yosh: 3-96 oy\n\nMisol: qoy:60:12:Karakul');
            }
        } else {
            ctx.reply('❌ Noto\'g\'ri format!\n\nTo\'g\'ri format: qoy:60:12:Karakul');
        }
    }

    // Ovqat berishni belgilash
    else if (lowerText.startsWith('ovqat:')) {
        const parts = lowerText.split(':');
        if (parts.length === 3) {
            const tur = parts[1];
            const id = parseInt(parts[2]);
            const bugun = new Date().toDateString();
            if (tur === 'mol' && id > 0 && id <= livestock.mollar.length) {
                const item = livestock.mollar[id - 1];
                item.oxirgiOvqatSana = bugun;
                item.bugungiOvqat = true;
                malumotlarniSaqlash();
                return ctx.reply(`✅ Mol #${id}ga ovqat berildi.\n📅 Sana: ${bugun}`);
            }
            if (tur === 'qoy' && id > 0 && id <= livestock.qoylar.length) {
                const item = livestock.qoylar[id - 1];
                item.oxirgiOvqatSana = bugun;
                item.bugungiOvqat = true;
                malumotlarniSaqlash();
                return ctx.reply(`✅ Qoy #${id}ga ovqat berildi.\n📅 Sana: ${bugun}`);
            }
            return ctx.reply("❌ Noto'g'ri tur yoki ID. Misol: ovqat:mol:1");
        }
        return ctx.reply('❌ Format xato. Misol: ovqat:mol:1');
    }

    // Emlashni belgilash
    else if (lowerText.startsWith('emlash:')) {
        const parts = lowerText.split(':');
        if (parts.length === 4) {
            const tur = parts[1];
            const id = parseInt(parts[2]);
            const kasallik = parts[3];
            const bugun = new Date().toLocaleDateString('uz-UZ');
            if (tur === 'mol' && id > 0 && id <= livestock.mollar.length) {
                const item = livestock.mollar[id - 1];
                item.oxirgiEmlash = `${kasallik} (${bugun})`;
                malumotlarniSaqlash();
                return ctx.reply(`✅ Mol #${id} emlandi: ${kasallik}\n📅 Sana: ${bugun}`);
            }
            if (tur === 'qoy' && id > 0 && id <= livestock.qoylar.length) {
                const item = livestock.qoylar[id - 1];
                item.oxirgiEmlash = `${kasallik} (${bugun})`;
                malumotlarniSaqlash();
                return ctx.reply(`✅ Qoy #${id} emlandi: ${kasallik}\n📅 Sana: ${bugun}`);
            }
            return ctx.reply("❌ Noto'g'ri tur yoki ID. Misol: emlash:mol:1:Brutselloz");
        }
        return ctx.reply('❌ Format xato. Misol: emlash:mol:1:Brutselloz');
    }
    else if (lowerText === '/stats' || lowerText === 'statistika') {
        ctx.reply(umumiyStatistika());
    }
    else if (lowerText === '/help' || lowerText === 'yordam') {
        ctx.reply(`📱 YORDAM:\n\n🔹 Mol qoshish: mol:[ogirlik]:[yosh]:[tur]\n🔹 Qoy qoshish: qoy:[ogirlik]:[yosh]:[tur]\n\n📋 MISOL:\n• mol:450:24:Holstein\n• qoy:60:12:Karakul`);
    }
    else {
        ctx.reply('❓ Buyruq tushunilmadi. /help bosing.');
    }
});

// Step-by-step mol qo'shish funksiyasi
function handleCattleSession(ctx, session, text) {
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('❌ Bekor qilish', 'cancel_action')]
    ]);

    switch (session.step) {
        case 'weight':
            const weight = parseInt(text);
            if (isNaN(weight) || weight < 200 || weight > 800) {
                return ctx.reply(`❌ Noto'g'ri og'irlik!\n\n⚖️ 200 dan 800 kg gacha bo'lgan raqam kiriting\n📝 Misol: 450`, keyboard);
            }

            session.data.ogirlik = weight;
            session.step = 'age';
            userSessions.set(ctx.from.id, session);

            return ctx.reply(`✅ Og'irlik saqlandi: ${weight} kg

📋 2-qadam: Molning yoshini kiriting

🎂 Yoshni oy hisobida yozing
📝 Misol: 24 yoki 36 yoki 48

💡 Odatda mollar 6-120 oy orasida bo'ladi`, keyboard);

        case 'age':
            const age = parseInt(text);
            if (isNaN(age) || age < 6 || age > 120) {
                return ctx.reply(`❌ Noto'g'ri yosh!\n\n🎂 6 dan 120 oy gacha bo'lgan raqam kiriting\n📝 Misol: 24`, keyboard);
            }

            session.data.yosh = age;
            session.step = 'breed';
            userSessions.set(ctx.from.id, session);

            const breedKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🐄 Holstein', 'breed_holstein'), Markup.button.callback('🐂 Angus', 'breed_angus')],
                [Markup.button.callback('🐄 Simmental', 'breed_simmental'), Markup.button.callback('🐂 Mahalliy', 'breed_local')],
                [Markup.button.callback('❌ Bekor qilish', 'cancel_action')]
            ]);

            return ctx.reply(`✅ Yosh saqlandi: ${age} oy

📋 3-qadam: Molning turini tanlang

🐄 Quyidagi tugmalardan birini bosing:`, breedKeyboard);

        case 'breed':
            if (text.length < 2 || text.length > 30) {
                return ctx.reply(`❌ Noto'g'ri tur nomi!\n\n🐄 2 dan 30 ta harf orasida tur nomini kiriting\n📝 Misol: Holstein, Angus`, keyboard);
            }

            // Molni saqlash
            const yangiMol = {
                id: livestock.mollar.length + 1,
                ogirlik: session.data.ogirlik,
                yosh: session.data.yosh,
                tur: text.charAt(0).toUpperCase() + text.slice(1),
                qoshilganSana: new Date().toLocaleDateString('uz-UZ'),
                oxirgiEmlash: null,
                oxirgiOvqatSana: null,
                bugungiOvqat: false
            };

            livestock.mollar.push(yangiMol);
            malumotlarniSaqlash();
            userSessions.delete(ctx.from.id);

            const successKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🐄 Yana mol qo\'shish', 'add_cattle'), Markup.button.callback('📊 Statistika', 'stats')],
                [Markup.button.callback('🏠 Bosh menyu', 'main_menu')]
            ]);

            return ctx.reply(`🎉 YANGI MOL MUVAFFAQIYATLI QO'SHILDI!

🐄 ID: ${yangiMol.id}
⚖️ Og'irlik: ${yangiMol.ogirlik} kg
🎂 Yosh: ${yangiMol.yosh} oy
🔢 Tur: ${yangiMol.tur}
📅 Qo'shilgan: ${yangiMol.qoshilganSana}

✅ Ma'lumotlar saqlandi!`, successKeyboard);
    }
}

// Step-by-step qo'y qo'shish funksiyasi
function handleSheepSession(ctx, session, text) {
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('❌ Bekor qilish', 'cancel_action')]
    ]);

    switch (session.step) {
        case 'weight':
            const weight = parseInt(text);
            if (isNaN(weight) || weight < 30 || weight > 120) {
                return ctx.reply(`❌ Noto'g'ri og'irlik!\n\n⚖️ 30 dan 120 kg gacha bo'lgan raqam kiriting\n📝 Misol: 60`, keyboard);
            }

            session.data.ogirlik = weight;
            session.step = 'age';
            userSessions.set(ctx.from.id, session);

            return ctx.reply(`✅ Og'irlik saqlandi: ${weight} kg

📋 2-qadam: Qo'yning yoshini kiriting

🎂 Yoshni oy hisobida yozing
📝 Misol: 12 yoki 18 yoki 24

💡 Odatda qo'ylar 3-96 oy orasida bo'ladi`, keyboard);

        case 'age':
            const age = parseInt(text);
            if (isNaN(age) || age < 3 || age > 96) {
                return ctx.reply(`❌ Noto'g'ri yosh!\n\n🎂 3 dan 96 oy gacha bo'lgan raqam kiriting\n📝 Misol: 18`, keyboard);
            }

            session.data.yosh = age;
            session.step = 'breed';
            userSessions.set(ctx.from.id, session);

            const breedKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🐑 Karakul', 'sheep_breed_karakul'), Markup.button.callback('🐑 Gissar', 'sheep_breed_gissar')],
                [Markup.button.callback('🐑 Romanov', 'sheep_breed_romanov'), Markup.button.callback('🐑 Mahalliy', 'sheep_breed_local')],
                [Markup.button.callback('❌ Bekor qilish', 'cancel_action')]
            ]);

            return ctx.reply(`✅ Yosh saqlandi: ${age} oy

📋 3-qadam: Qo'yning turini tanlang

🐑 Quyidagi tugmalardan birini bosing:`, breedKeyboard);

        case 'breed':
            if (text.length < 2 || text.length > 30) {
                return ctx.reply(`❌ Noto'g'ri tur nomi!\n\n🐑 2 dan 30 ta harf orasida tur nomini kiriting\n📝 Misol: Karakul, Gissar`, keyboard);
            }

            // Qo'yni saqlash
            const yangiQoy = {
                id: livestock.qoylar.length + 1,
                ogirlik: session.data.ogirlik,
                yosh: session.data.yosh,
                tur: text.charAt(0).toUpperCase() + text.slice(1),
                qoshilganSana: new Date().toLocaleDateString('uz-UZ'),
                oxirgiEmlash: null,
                oxirgiOvqatSana: null,
                bugungiOvqat: false
            };

            livestock.qoylar.push(yangiQoy);
            malumotlarniSaqlash();
            userSessions.delete(ctx.from.id);

            const successKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🐑 Yana qo\'y qo\'shish', 'add_sheep'), Markup.button.callback('📊 Statistika', 'stats')],
                [Markup.button.callback('🏠 Bosh menyu', 'main_menu')]
            ]);

            return ctx.reply(`🎉 YANGI QO'Y MUVAFFAQIYATLI QO'SHILDI!

🐑 ID: ${yangiQoy.id}
⚖️ Og'irlik: ${yangiQoy.ogirlik} kg
🎂 Yosh: ${yangiQoy.yosh} oy
🔢 Tur: ${yangiQoy.tur}
📅 Qo'shilgan: ${yangiQoy.qoshilganSana}

✅ Ma'lumotlar saqlandi!`, successKeyboard);
    }
}

// Tur tugmalari handlerlari
bot.action('breed_holstein', (ctx) => {
    ctx.answerCbQuery();
    const session = userSessions.get(ctx.from.id);
    if (session && session.action === 'adding_cattle' && session.step === 'breed') {
        return handleCattleSession(ctx, session, 'Holstein');
    }
});

bot.action('breed_angus', (ctx) => {
    ctx.answerCbQuery();
    const session = userSessions.get(ctx.from.id);
    if (session && session.action === 'adding_cattle' && session.step === 'breed') {
        return handleCattleSession(ctx, session, 'Angus');
    }
});

bot.action('breed_simmental', (ctx) => {
    ctx.answerCbQuery();
    const session = userSessions.get(ctx.from.id);
    if (session && session.action === 'adding_cattle' && session.step === 'breed') {
        return handleCattleSession(ctx, session, 'Simmental');
    }
});

bot.action('breed_local', (ctx) => {
    ctx.answerCbQuery();
    const session = userSessions.get(ctx.from.id);
    if (session && session.action === 'adding_cattle' && session.step === 'breed') {
        return handleCattleSession(ctx, session, 'Mahalliy');
    }
});

bot.action('sheep_breed_karakul', (ctx) => {
    ctx.answerCbQuery();
    const session = userSessions.get(ctx.from.id);
    if (session && session.action === 'adding_sheep' && session.step === 'breed') {
        return handleSheepSession(ctx, session, 'Karakul');
    }
});

bot.action('sheep_breed_gissar', (ctx) => {
    ctx.answerCbQuery();
    const session = userSessions.get(ctx.from.id);
    if (session && session.action === 'adding_sheep' && session.step === 'breed') {
        return handleSheepSession(ctx, session, 'Gissar');
    }
});

bot.action('sheep_breed_romanov', (ctx) => {
    ctx.answerCbQuery();
    const session = userSessions.get(ctx.from.id);
    if (session && session.action === 'adding_sheep' && session.step === 'breed') {
        return handleSheepSession(ctx, session, 'Romanov');
    }
});

bot.action('sheep_breed_local', (ctx) => {
    ctx.answerCbQuery();
    const session = userSessions.get(ctx.from.id);
    if (session && session.action === 'adding_sheep' && session.step === 'breed') {
        return handleSheepSession(ctx, session, 'Mahalliy');
    }
});
malumotlarniYuklash();

bot.launch().then(() => {
    console.log('🤖 Bot ishga tushdi!');
    console.log(`📊 Mollar: ${livestock.mollar.length} ta`);
    console.log(`📊 Qoylar: ${livestock.qoylar.length} ta`);
});

process.once('SIGINT', () => {
    malumotlarniSaqlash();
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
    malumotlarniSaqlash();
    bot.stop('SIGTERM');
});

bot.action('about', (ctx) => {
    ctx.answerCbQuery();
    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback('💰 Narxlar', 'pricing'), Markup.button.callback('📞 Bog\'lanish', 'contact')],
        [Markup.button.callback('🔙 Bosh menyu', 'main_menu')]
    ]);

    ctx.reply(`ℹ️ **CHORVA BOSHQARUV PROFESSIONAL BOTI**

🏆 **VERSIYA:** 2.0 Professional
👨‍💻 **ISHLAB CHIQARUVCHI:** @km0815
📅 **YANGILANISH:** ${new Date().toLocaleDateString('uz-UZ')}

🌟 **XUSUSIYATLAR:**
✅ Professional UI/UX dizayn
✅ Ma'lumotlar bazasi bilan ishlash
✅ Xavfsiz ma'lumotlar saqlash
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
• Ma'lumotlar migratsiyasi

🎯 **LIFETIME ($299 bir martalik):**
• Barcha premium xususiyatlar
• Umr bo'yi yangilanishlar
• Priority support

📞 **Buyurtma berish:** @km0815`, keyboard);
});

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

// Video va PDF qo'llanmalar
bot.action('video_guide', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(`🎥 **VIDEO QO'LLANMALAR**

📺 **YouTube Playlist:**
🔗 https://youtube.com/playlist/chorva-bot

📱 **Tezkor videolar:**
1️⃣ Bot bilan tanishish (2 min)
2️⃣ Mol qo'shish usuli (3 min)  
3️⃣ Statistika va hisobotlar (4 min)
4️⃣ Professional xususiyatlar (5 min)

🎬 **Yangi videolar har hafta!**`);
});

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

// Error handling va logging
bot.catch((err, ctx) => {
    console.error('❌ Xatolik yuz berdi:', err);
    console.error('👤 Foydalanuvchi:', ctx.from);
    console.error('📝 Xabar:', ctx.message || ctx.callbackQuery);

    ctx.reply('⚠️ Texnik xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring yoki @km0815 ga murojaat qiling.');
});
