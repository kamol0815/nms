import express from 'express';
import fs from 'fs';

const app = express();
const port = 3000;
const dataFile = './livestock_data.json';

// Ma'lumotlar
let livestock = { mollar: [], qoylar: [] };

// Ma'lumotlarni yuklash
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

// Ma'lumotlarni saqlash
function malumotlarniSaqlash() {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(livestock, null, 2));
    } catch (error) {
        console.error('Saqlashda xatolik:', error);
    }
}

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    malumotlarniYuklash();

    const mollarSoni = livestock.mollar.length;
    const qoylarSoni = livestock.qoylar.length;
    const mollarOgirlik = livestock.mollar.reduce((jami, mol) => jami + mol.ogirlik, 0);
    const qoylarOgirlik = livestock.qoylar.reduce((jami, qoy) => jami + qoy.ogirlik, 0);

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🐄🐑 Chorva Boshqaruv Boti</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
            .card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .stats { background: #f0f8ff; }
            .animals { background: #f9f9f9; }
            button { padding: 10px 15px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
            input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>🐄🐑 CHORVA BOSHQARUV BOTI</h1>
        
        <div class="card stats">
            <h2>📊 STATISTIKA</h2>
            <p>🐄 Mollar: ${mollarSoni} ta (${mollarOgirlik} kg)</p>
            <p>🐑 Qo'ylar: ${qoylarSoni} ta (${qoylarOgirlik} kg)</p>
            <p>📈 Jami: ${mollarSoni + qoylarSoni} ta hayvon</p>
        </div>
        
        <div class="card">
            <h3>🐄 Yangi mol qo'shish</h3>
            <input type="number" id="molOgirlik" placeholder="Og'irlik (kg)">
            <input type="number" id="molYosh" placeholder="Yosh (oy)">
            <input type="text" id="molTur" placeholder="Tur (Holstein)">
            <button onclick="molQoshish()">Mol qo'shish</button>
        </div>
        
        <div class="card">
            <h3>🐑 Yangi qo'y qo'shish</h3>
            <input type="number" id="qoyOgirlik" placeholder="Og'irlik (kg)">
            <input type="number" id="qoyYosh" placeholder="Yosh (oy)">
            <input type="text" id="qoyTur" placeholder="Tur (Karakul)">
            <button onclick="qoyQoshish()">Qo'y qo'shish</button>
        </div>
        
        <div class="card animals">
            <h3>🐄 MOLLAR RO'YXATI</h3>
            ${livestock.mollar.map(mol =>
        `<p>ID: ${mol.id} | ${mol.ogirlik}kg | ${mol.yosh}oy | ${mol.tur}</p>`
    ).join('')}
            
            <h3>🐑 QO'YLAR RO'YXATI</h3>
            ${livestock.qoylar.map(qoy =>
        `<p>ID: ${qoy.id} | ${qoy.ogirlik}kg | ${qoy.yosh}oy | ${qoy.tur}</p>`
    ).join('')}
        </div>
        
        <div class="card">
            <h3>🍽️ OVQATLANTIRISH JADVALI</h3>
            <h4>🐄 Mollar:</h4>
            <p>⏰ 06:00 - Quruq o't (10-15 kg)</p>
            <p>⏰ 12:00 - Suv (40-60 litr)</p>
            <p>⏰ 18:00 - Konsentrat (2-3 kg)</p>
            
            <h4>🐑 Qo'ylar:</h4>
            <p>⏰ 07:00 - Quruq o't (1-2 kg)</p>
            <p>⏰ 13:00 - Suv (3-5 litr)</p>
            <p>⏰ 19:00 - Konsentrat (0.3-0.5 kg)</p>
        </div>
        
        <div class="card">
            <h3>📍 JOYLASHUVLAR</h3>
            <h4>🌾 Yem do'konlari:</h4>
            <p>• Chorva Yemi Markazi - Yunusobod tumani - +998901234567</p>
            <p>• Sifatli Yem Dunyosi - Mirzo Ulugbek tumani - +998907654321</p>
            
            <h4>🐄 Mol bozorlari:</h4>
            <p>• Chorva Bosh Bozori - Sergeli tumani - 05:00-18:00</p>
            <p>• Andijon Mol Bozori - Andijon sh - 06:00-17:00</p>
        </div>
        
        <script>
            function molQoshish() {
                const ogirlik = document.getElementById('molOgirlik').value;
                const yosh = document.getElementById('molYosh').value;
                const tur = document.getElementById('molTur').value;
                
                if (ogirlik && yosh && tur) {
                    fetch('/add-mol', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ogirlik: parseInt(ogirlik), yosh: parseInt(yosh), tur})
                    }).then(() => location.reload());
                } else {
                    alert('Barcha maydonlarni to\\'ldiring!');
                }
            }
            
            function qoyQoshish() {
                const ogirlik = document.getElementById('qoyOgirlik').value;
                const yosh = document.getElementById('qoyYosh').value;
                const tur = document.getElementById('qoyTur').value;
                
                if (ogirlik && yosh && tur) {
                    fetch('/add-qoy', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ogirlik: parseInt(ogirlik), yosh: parseInt(yosh), tur})
                    }).then(() => location.reload());
                } else {
                    alert('Barcha maydonlarni to\\'ldiring!');
                }
            }
        </script>
    </body>
    </html>
    `);
});

app.post('/add-mol', (req, res) => {
    const { ogirlik, yosh, tur } = req.body;

    const yangiMol = {
        id: livestock.mollar.length + 1,
        ogirlik,
        yosh,
        tur,
        qoshilganSana: new Date().toLocaleDateString('uz-UZ'),
        oxirgiEmlash: null,
        oxirgiOvqatSana: null,
        bugungiOvqat: false
    };

    livestock.mollar.push(yangiMol);
    malumotlarniSaqlash();
    res.json({ success: true });
});

app.post('/add-qoy', (req, res) => {
    const { ogirlik, yosh, tur } = req.body;

    const yangiQoy = {
        id: livestock.qoylar.length + 1,
        ogirlik,
        yosh,
        tur,
        qoshilganSana: new Date().toLocaleDateString('uz-UZ'),
        oxirgiEmlash: null,
        oxirgiOvqatSana: null,
        bugungiOvqat: false
    };

    livestock.qoylar.push(yangiQoy);
    malumotlarniSaqlash();
    res.json({ success: true });
});

malumotlarniYuklash();

app.listen(port, () => {
    console.log('🚀 Chorva Boshqaruv Web Boti ishga tushdi!');
    console.log(`🌐 Browser'da oching: http://localhost:${port}`);
    console.log(`📊 Mollar: ${livestock.mollar.length} ta`);
    console.log(`📊 Qo'ylar: ${livestock.qoylar.length} ta`);
    console.log('');
    console.log('✅ Internet muammosi bolganda ham ishlaydi!');
    console.log('💡 Telegram bot ham parallel ishlaydi');
});
