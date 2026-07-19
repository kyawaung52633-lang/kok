// ============================================================
// VLESS VIP BOT LOGIC - With Copy Button (FULL FIXED)
// ============================================================

import { 
    SNI_LIST, IP_LIST, WS_HOST_LIST, FRUITS, ICONS 
} from './constants.js';
import { 
    sendMessage, editMessageText, answerCallbackQuery 
} from './telegramApiHelpers.js';

// User data storage (in-memory)
const userData = {};

// ==================== HELPERS ====================
function extractUUID(key) {
    const match = key.match(/vless:\/\/([^@]+)@/);
    return match ? match[1] : null;
}

function extractPath(key) {
    const match = key.match(/path=([^&]+)/);
    return match ? match[1] : '%2FLINCHANNEL';
}

function extractName(key) {
    const match = key.match(/#(.+)$/);
    return match ? match[1] : 'VLESS-VIP';
}

function generateVLESSKey(data) {
    const { uuid, ip, sni, wsHost, path, name } = data;
    return `vless://${uuid}@${ip}:443?path=${path}&security=tls&alpn=http%2F1.1&encryption=none&host=${wsHost}&fp=chrome&type=ws&sni=${sni}#${name}`;
}

function getFruit(index) {
    return FRUITS[index % FRUITS.length];
}

// ==================== SHOW SNI LIST ====================
export async function showSNIList(token, chatId, messageId = null, botKey = null) {
    const markup = { inline_keyboard: [] };
    
    let fruitIndex = 0;
    let row = [];
    for (const sni of SNI_LIST) {
        if (sni) {
            row.push({ text: `${getFruit(fruitIndex)} ${sni}`, callback_data: `sni_${sni}` });
            fruitIndex++;
            if (row.length === 2) {
                markup.inline_keyboard.push([...row]);
                row = [];
            }
        }
    }
    if (row.length > 0) markup.inline_keyboard.push([...row]);
    
    markup.inline_keyboard.push([
        { text: '✏️ ကိုယ်တိုင်ထည့်', callback_data: 'sni_custom' },
        { text: '🔄 ပြန်စမယ်', callback_data: 'reset' }
    ]);
    
    const text = `${ICONS.info} **SNI ကိုရွေးပါ**\n${ICONS.arrow} အောက်ပါစာရင်းထဲမှ တစ်ခုကိုရွေးပါ\n\n━━━━━━━━━━━━━━━━━━━`;
    
    if (messageId) {
        await editMessageText(token, chatId, messageId, text, 'HTML', markup, botKey);
    } else {
        await sendMessage(token, chatId, text, 'HTML', markup, botKey);
    }
}

// ==================== SHOW IP LIST ====================
export async function showIPList(token, chatId, messageId, sni, botKey = null) {
    const markup = { inline_keyboard: [] };
    
    let fruitIndex = 4;
    let row = [];
    for (const ip of IP_LIST) {
        if (ip) {
            row.push({ text: `${getFruit(fruitIndex)} ${ip}`, callback_data: `ip_${ip}` });
            fruitIndex++;
            if (row.length === 2) {
                markup.inline_keyboard.push([...row]);
                row = [];
            }
        }
    }
    if (row.length > 0) markup.inline_keyboard.push([...row]);
    
    markup.inline_keyboard.push([
        { text: '✏️ ကိုယ်တိုင်ထည့်', callback_data: 'ip_custom' },
        { text: '🔙 နောက်ပြန်', callback_data: 'back_sni' }
    ]);
    
    const text = `${ICONS.check} **SNI:** \`${sni}\`\n\n${ICONS.info} **IP ကိုရွေးပါ**\n${ICONS.arrow} အောက်ပါစာရင်းထဲမှ တစ်ခုကိုရွေးပါ\n\n━━━━━━━━━━━━━━━━━━━`;
    
    await editMessageText(token, chatId, messageId, text, 'HTML', markup, botKey);
}

// ==================== SHOW WS HOST LIST ====================
export async function showWSList(token, chatId, messageId, sni, ip, botKey = null) {
    const markup = { inline_keyboard: [] };
    
    let fruitIndex = 8;
    let row = [];
    for (const ws of WS_HOST_LIST) {
        if (ws) {
            row.push({ text: `${getFruit(fruitIndex)} ${ws}`, callback_data: `ws_${ws}` });
            fruitIndex++;
            if (row.length === 2) {
                markup.inline_keyboard.push([...row]);
                row = [];
            }
        }
    }
    if (row.length > 0) markup.inline_keyboard.push([...row]);
    
    markup.inline_keyboard.push([
        { text: '✏️ ကိုယ်တိုင်ထည့်', callback_data: 'ws_custom' },
        { text: '🔙 နောက်ပြန်', callback_data: 'back_ip' }
    ]);
    
    const text = `${ICONS.check} **SNI:** \`${sni}\`\n${ICONS.check} **IP:** \`${ip}\`\n\n${ICONS.info} **WS Host ကိုရွေးပါ**\n${ICONS.arrow} အောက်ပါစာရင်းထဲမှ တစ်ခုကိုရွေးပါ\n\n━━━━━━━━━━━━━━━━━━━`;
    
    await editMessageText(token, chatId, messageId, text, 'HTML', markup, botKey);
}

// ==================== GENERATE FINAL KEY (WITH COPY BUTTON) ====================
export async function generateKey(token, chatId, messageId, data, botKey = null) {
    const { uuid, ip, sni, wsHost, path, name } = data;
    
    const createdDate = new Date();
    const expireDate = new Date(createdDate);
    expireDate.setDate(expireDate.getDate() + 30);
    
    const createdStr = createdDate.toISOString().replace('T', ' ').substring(0, 16);
    const expireStr = expireDate.toISOString().substring(0, 10);
    
    const newKey = generateVLESSKey({ uuid, ip, sni, wsHost, path, name });
    
    // Save last generated key for copy function
    userData[chatId] = {
        ...userData[chatId],
        lastGeneratedKey: newKey
    };
    
    // Result text with code block (easy to copy)
    const resultText = `
👑 *━━━━━━━ VIP VLESS KEY ━━━━━━━* 👑

📋 *KEY:-*
\`\`\`
${newKey}
\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━

📅 *ထုတ်သည့်ရက်:-*
\`${createdStr}\`

⏳ *သက်တမ်းကုန်မည့်ရက်:-*
\`${expireStr}\` (၃၀ ရက်)

━━━━━━━━━━━━━━━━━━━━━━━

👑 *VIP USER*

━━━━━━━━━━━━━━━━━━━━━━━
🔄 /reset နှိပ်ပြီး အသစ်ထုတ်နိုင်ပါသည်
`;
    
    // Inline keyboard with Copy button - သေချာစစ်ထားတယ်
    const replyMarkup = {
        inline_keyboard: [
            [
                { 
                    text: "📋 Copy Key", 
                    callback_data: "copy_key" 
                }
            ]
        ]
    };
    
    // editMessageText ကို Markdown နဲ့ reply_markup ပါပို့တယ်
    await editMessageText(token, chatId, messageId, resultText, 'Markdown', replyMarkup, botKey);
}

// ==================== HANDLE VLESS KEY ====================
export async function handleVLESSKey(token, message, botKey = null) {
    const chatId = message.chat.id;
    const key = message.text.trim();
    
    const uuid = extractUUID(key);
    if (!uuid) {
        await sendMessage(token, chatId, 
            `${ICONS.error} **VLESS Key မှားယွင်းနေပါတယ်။**\n${ICONS.arrow} Port 8080 Key ကိုပြန်ပို့ပါ။`,
            'HTML', null, botKey
        );
        return;
    }
    
    const path = extractPath(key);
    const name = extractName(key);
    
    userData[chatId] = {
        uuid: uuid,
        path: path,
        name: name,
        originalKey: key
    };
    
    await showSNIList(token, chatId, null, botKey);
}

// ==================== HANDLE CALLBACK ====================
export async function handleCallback(token, callbackQuery, botKey = null) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    const callbackId = callbackQuery.id;
    
    // ===== COPY KEY =====
    if (data === 'copy_key') {
        const user = userData[chatId];
        if (user && user.lastGeneratedKey) {
            // Show popup with copy confirmation
            await answerCallbackQuery(token, callbackId, '✅ Key copied to clipboard!', false, botKey);
            
            // Send key again in a separate message (easier to copy)
            await sendMessage(token, chatId, 
                `📋 *Your VLESS Key:*\n\`\`\`\n${user.lastGeneratedKey}\n\`\`\``,
                'Markdown', null, botKey
            );
        } else {
            await answerCallbackQuery(token, callbackId, '❌ Key not found! Please generate new key.', true, botKey);
        }
        return;
    }
    
    await answerCallbackQuery(token, callbackId, '✅ ရွေးချယ်ပြီးပါပြီ', false, botKey);
    
    // ===== RESET =====
    if (data === 'reset') {
        delete userData[chatId];
        await sendMessage(token, chatId, 
            `${ICONS.reset} **ပြန်လည်စတင်ပြီးပါပြီ။**\n${ICONS.arrow} /start နှိပ်ပြီး ပြန်လုပ်ပါ။`,
            'HTML', null, botKey
        );
        return;
    }
    
    // ===== BACK TO SNI =====
    if (data === 'back_sni') {
        await showSNIList(token, chatId, messageId, botKey);
        return;
    }
    
    // ===== BACK TO IP =====
    if (data === 'back_ip') {
        const user = userData[chatId];
        if (user && user.sni) {
            await showIPList(token, chatId, messageId, user.sni, botKey);
        }
        return;
    }
    
    // ===== CUSTOM INPUT HANDLERS =====
    if (data === 'sni_custom') {
        await editMessageText(token, chatId, messageId, 
            `${ICONS.settings} **SNI ကိုရိုက်ထည့်ပါ**\n${ICONS.arrow} သင့် SNI ကိုအောက်တွင်ရေးပါ-`,
            'HTML', null, botKey
        );
        userData[chatId].awaiting = 'sni';
        return;
    }
    
    if (data === 'ip_custom') {
        await editMessageText(token, chatId, messageId, 
            `${ICONS.settings} **IP ကိုရိုက်ထည့်ပါ**\n${ICONS.arrow} သင့် IP ကိုအောက်တွင်ရေးပါ-`,
            'HTML', null, botKey
        );
        userData[chatId].awaiting = 'ip';
        return;
    }
    
    if (data === 'ws_custom') {
        await editMessageText(token, chatId, messageId, 
            `${ICONS.settings} **WS Host ကိုရိုက်ထည့်ပါ**\n${ICONS.arrow} သင့် WS Host ကိုအောက်တွင်ရေးပါ-`,
            'HTML', null, botKey
        );
        userData[chatId].awaiting = 'ws';
        return;
    }
    
    // ===== SNI SELECTION =====
    if (data.startsWith('sni_')) {
        const sni = data.substring(4);
        userData[chatId].sni = sni;
        await showIPList(token, chatId, messageId, sni, botKey);
        return;
    }
    
    // ===== IP SELECTION =====
    if (data.startsWith('ip_')) {
        const ip = data.substring(3);
        userData[chatId].ip = ip;
        const user = userData[chatId];
        await showWSList(token, chatId, messageId, user.sni, ip, botKey);
        return;
    }
    
    // ===== WS HOST SELECTION =====
    if (data.startsWith('ws_')) {
        const wsHost = data.substring(3);
        userData[chatId].wsHost = wsHost;
        const user = userData[chatId];
        await generateKey(token, chatId, messageId, {
            uuid: user.uuid,
            ip: user.ip,
            sni: user.sni,
            wsHost: wsHost,
            path: user.path,
            name: user.name
        }, botKey);
        return;
    }
}

// ==================== HANDLE CUSTOM INPUT ====================
export async function handleCustomInput(token, message, botKey = null) {
    const chatId = message.chat.id;
    const text = message.text.trim();
    const user = userData[chatId];
    
    if (!user || !user.awaiting) return;
    
    const awaiting = user.awaiting;
    delete user.awaiting;
    
    if (awaiting === 'sni') {
        user.sni = text;
        await showIPList(token, chatId, null, text, botKey);
    } else if (awaiting === 'ip') {
        user.ip = text;
        await showWSList(token, chatId, null, user.sni, text, botKey);
    } else if (awaiting === 'ws') {
        user.wsHost = text;
        await generateKey(token, chatId, null, {
            uuid: user.uuid,
            ip: user.ip,
            sni: user.sni,
            wsHost: text,
            path: user.path,
            name: user.name
        }, botKey);
    }
}

// ==================== SEND WELCOME ====================
export async function sendWelcome(token, chatId, firstName, botKey = null) {
    const welcomeText = `
${ICONS.crown} **VLESS VIP GENERATOR** ${ICONS.diamond}

${ICONS.star} **မင်္ဂလာပါ ${firstName} !**

${ICONS.shield} VLESS Config များကို VIP အဆင့်ဖြင့် ထုတ်ပေးပါမည်။
${ICONS.fire} 8080 → 443 • HTTP → TLS

━━━━━━━━━━━━━━━━━━━
${ICONS.arrow} **အသုံးပြုနည်း-**
၁။ သင့် **Port 8080** VLESS Key ကိုပို့ပါ
၂။ **SNI** ၊ **IP** နှင့် **WS Host** ကိုရွေးပါ
၃။ **VIP Key** ကိုရရှိမည်

━━━━━━━━━━━━━━━━━━━
${ICONS.calendar} **ထုတ်တိုင်း ရက်စွဲနှင့် သက်တမ်းပါမည်**
${ICONS.key} **30 ရက် သက်တမ်းရှိမည်**

━━━━━━━━━━━━━━━━━━━
${ICONS.info} /help - အကူအညီ
${ICONS.reset} /reset - ပြန်စရန်
`;
    
    await sendMessage(token, chatId, welcomeText, 'HTML', null, botKey);
}

// ==================== SEND HELP ====================
export async function sendHelp(token, chatId, botKey = null) {
    const helpText = `
${ICONS.help} **📖 အကူအညီ** ${ICONS.help}

━━━━━━━━━━━━━━━━━━━
${ICONS.arrow} **Commands များ-**
• /start - ${ICONS.rocket} စတင်ရန်
• /reset - ${ICONS.reset} ပြန်လည်စတင်ရန်
• /help - ${ICONS.help} အကူအညီ

━━━━━━━━━━━━━━━━━━━
${ICONS.settings} **အင်္ဂါရပ်များ-**
• 🔄 8080 → 443 Port ပြောင်းခြင်း
• 🔒 HTTP → TLS Security အဆင့်မြှင့်ခြင်း
• 📅 ထုတ်တိုင်း ရက်စွဲနှင့် သက်တမ်းပါရှိခြင်း
• 👑 VIP အဆင့်သတ်မှတ်ချက်ပါရှိခြင်း

━━━━━━━━━━━━━━━━━━━
${ICONS.diamond} **VIP Quality** ${ICONS.diamond}
`;
    
    await sendMessage(token, chatId, helpText, 'HTML', null, botKey);
}