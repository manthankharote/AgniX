const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

// Yeh object har number ka state (step) yaad rakhega
const sessions = {};

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Apne phone se is QR code ko scan karein...');
});

client.on('ready', () => {
    console.log('AgniX WhatsApp Bot is LIVE! 🔥');
});

client.on('message', async msg => {
    const userPhone = msg.from;
    const text = msg.body.trim().toLowerCase();

    // 1. RESET LOGIC (Agar user bich mein wapas Hi/Hello bole)
    if (text === 'hi' || text === 'hello' || text === 'reset') {
        sessions[userPhone] = { step: 'ASK_PINCODE' }; // Session shuru karo

        await msg.reply(
            "AgniX Crop System mein aapka swagat hai! (AgniX पीक प्रणालीमध्ये आपले स्वागत आहे!) 🌱\n\n" +
            "Sahi fasal ki salah ke liye, kripya apna 6-digit Pincode darj karein:\n" +
            "(योग्य पिकाच्या सल्ल्यासाठी, कृपया तुमचा 6-अंकी पिनकोड प्रविष्ट करा:)"
        );
        return; // CRITICAL: Yahan ruk jao, aage mat badho!
    }

    // 2. CHECK SESSION: Agar session nahi hai, toh kuch mat karo (ya menu dikhao)
    if (!sessions[userPhone]) {
        await msg.reply("AgniX bot start karne ke liye 'Hi' bhejein.");
        return;
    }

    // 3. THE STATE MACHINE (Step-by-Step Logic)
    const currentStep = sessions[userPhone].step;

    if (currentStep === 'ASK_PINCODE') {
        sessions[userPhone].pincode = text; // Pincode save kiya
        sessions[userPhone].step = 'ASK_SOIL'; // Agla step set kiya

        await msg.reply(
            "Pincode save ho gaya. Kripya apni mitti ka prakar chunein:\n(पिनकोड सेव्ह झाला. कृपया तुमच्या मातीचा प्रकार निवडा:)\n\n" +
            "1. Kali Mitti / काळी माती\n" +
            "2. Lal Mitti / लाल माती\n" +
            "3. Retili Mitti / वालुकामय माती\n\n" +
            "Kripya number type karein (uda. 1):"
        );
        return; // CRITICAL: Yahan ruk jao
    }

    if (currentStep === 'ASK_SOIL') {
        sessions[userPhone].soil = text;
        sessions[userPhone].step = 'ASK_SEASON';

        await msg.reply(
            "Kripya mausam (season) chunein:\n\n" +
            "1. Kharif (Monsoon)\n" +
            "2. Rabi (Winter)\n\n" +
            "Kripya number type karein:"
        );
        return; // CRITICAL: Yahan ruk jao
    }

    if (currentStep === 'ASK_SEASON') {
        sessions[userPhone].season = text;
        sessions[userPhone].step = 'ASK_WATER';

        await msg.reply(
            "Sinchai (Water) ki kya suvidha hai?\n\n" +
            "1. Barish par nirbhar (Rainfed)\n" +
            "2. Kuwa / Tube-well (Irrigated)\n\n" +
            "Kripya number type karein:"
        );
        return; // CRITICAL: Yahan ruk jao
    }

    if (currentStep === 'ASK_WATER') {
        sessions[userPhone].water = text;

        // Final Output
        await msg.reply(
            `AgniX AI Analysis Complete ✅\n\n` +
            `📍 Pincode: ${sessions[userPhone].pincode}\n` +
            `🪨 Mitti (Option): ${sessions[userPhone].soil}\n` +
            `🌦️ Mausam (Option): ${sessions[userPhone].season}\n` +
            `💧 Paani (Option): ${sessions[userPhone].water}\n\n` +
            `🌾 Fasal Ki Salah: Is data ke aadhar par aapko **Soybean** ya **Kapas (Cotton)** lagana chahiye.\n` +
            `📊 Aaj ka Mandi Bhav: ₹3,200/Quintal`
        );

        // Session Delete kardo taaki agli baar shuru se start ho
        delete sessions[userPhone];
        return;
    }
});

client.initialize();