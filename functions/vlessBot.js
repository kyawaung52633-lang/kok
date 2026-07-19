// ============================================================
// VLESS VIP BOT LOGIC
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

// ==================== GENERATE FINAL KEY ====================
export async function generateKey(token, chatId, messageId, data, botKey = null) {
    const { uuid, ip, sni, wsHost, path, name } = data;
    
    const createdDate = new Date();
    const expireDate = new Date(createdDate);
    expireDate.setDate(expireDate.getDate() + 30);
    
    const createdStr = createdDate.toISOString().replace('T', ' ').substring(0, 16);
    const expireStr = expireDate.toISOString().substring(0, 10);
    
    const newKey = generateVLESSKey({ uuid, ip, sni, wsHost, path, name });
    
    const resultText = `
${ICONS.crown} **━━━━━━━ VIP VLESS KEY ━━━━━━━** ${ICONS.crown}

${ICONS.key} **KEY:-**
\`${newKey}\`

━━━━━━━━━━━━━━━━━━━━━━━

${ICONS.calendar} **📅 ထုတ်သည့်ရက်:-**
\`${createdStr}\`

${ICONS.calendar} **⏳ သက်တမ်းကုန်မည့်ရက်:-**
\`${expireStr}\` (၃၀ ရက်)

━━━━━━━━━━━━━━━━━━━━━━━

${ICONS.diamond} **👑 VIP USER**

━━━━━━━━━━━━━━━━━━━━━━━
${ICONS.reset} /reset နှိပ်ပြီး အသစ်ထုတ်နိုင်ပါသည်
`;
    
    await editMessageText(token, chatId, messageId, resultText, 'HTML', null, botKey);
    delete userData[chatId];
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
    
    await answerCallbackQuery(token, callbackId, '✅ ရွေးချယ်ပြီးပါပြီ', false, botKey);
    
    if (data === 'reset') {
        delete userData[chatId];
        await sendMessage(token, chatId, 
            `${ICONS.reset} **ပြန်လည်စတင်ပြီးပါပြီ။**\n${ICONS.arrow} /start နှိပ်ပြီး ပြန်လုပ်ပါ။`,
            'HTML', null, botKey
        );
        return;
    }
    
    if (data === 'back_sni') {
        await showSNIList(token, chatId, messageId, botKey);
        return;
    }
    
    if (data === 'back_ip') {
        const user = userData[chatId];
        if (user && user.sni) {
            await showIPList(token, chatId, messageId, user.sni, botKey);
        }
        return;
    }
    
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
            `${ICONS.settings} **WS Host ကိုရိုက်ထည့်ပါ**\n${ICONS.arrow}