export const INDEX_JS = `
const { Client, GatewayIntentBits, Partials, AttachmentBuilder } = require('discord.js');
const https = require('https');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
});

const tts = new MsEdgeTTS();
let msgCounter = 0;
// Calculate range based on ENV
const min = parseInt(process.env.NATURAL_MIN) || 5;
const max = parseInt(process.env.NATURAL_MAX) || 20;
let nextTrigger = Math.floor(Math.random() * (max - min + 1)) + min;

async function callPollinations(messages, model, isImage = false) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: model,
            messages: messages,
            seed: Math.floor(Math.random() * 1000000),
            temperature: parseFloat(process.env.CREATIVITY_LEVEL) || 0.7
        });

        const options = {
            hostname: 'gen.pollinations.ai',
            path: isImage ? \`/image/\${encodeURIComponent(messages)}\` : '/v1/chat/completions',
            method: isImage ? 'GET' : 'POST',
            headers: {
                'Authorization': \`Bearer \${process.env.POLLINATIONS_KEY}\`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = [];
            res.on('data', (chunk) => body.push(chunk));
            res.on('end', () => {
                try {
                    if (isImage) return resolve(Buffer.concat(body));
                    const json = JSON.parse(Buffer.concat(body).toString());
                    resolve(json.choices[0].message.content);
                } catch (e) { reject('system error, try again'); }
            });
        });
        if (!isImage) req.write(data);
        req.on('error', (e) => reject(e));
        req.end();
    });
}

client.on('messageCreate', async (message) => {
    if (message.author.bot || (process.env.SERVER_ID && message.guildId !== process.env.SERVER_ID)) return;

    // Owner only bot check
    if (message.content === '!botcheck' && message.author.id === process.env.OWNER_ID) {
        const options = { hostname: 'gen.pollinations.ai', path: '/account/balance', headers: { 'Authorization': \`Bearer \${process.env.POLLINATIONS_KEY}\` } };
        https.get(options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                const bal = JSON.parse(data);
                message.reply(\`pollen balance: \${bal.balance || 0}\`);
            });
        }).on('error', () => message.reply('error fetching balance'));
        return;
    }

    const isMentioned = message.mentions.has(client.user);
    msgCounter++;

    if (!isMentioned && msgCounter < nextTrigger) return;
    
    // Reset counter
    msgCounter = 0;
    nextTrigger = Math.floor(Math.random() * (max - min + 1)) + min;

    try {
        await message.channel.sendTyping();
        const rawLogs = await message.channel.messages.fetch({ limit: 30 });
        const history = rawLogs.reverse().map(m => ({
            role: m.author.id === client.user.id ? 'assistant' : 'user',
            content: m.content
        }));

        let selectedModel = 'nova-fast';
        let prompt = message.content;
        const tokens = prompt.length / 4;

        // Model Routing
        if (message.attachments.size > 0 && process.env.ENABLE_VISION === 'true') {
            selectedModel = 'gemini-fast';
            history[history.length - 1].content = [
                { type: "text", text: prompt || "analyze this" },
                { type: "image_url", image_url: { url: message.attachments.first().url } }
            ];
        } else if (prompt.toLowerCase().startsWith('draw:') && process.env.ENABLE_IMAGE_GEN === 'true') {
            const imgBuffer = await callPollinations(prompt.split('draw:')[1], 'flux', true);
            return message.reply({ files: [new AttachmentBuilder(imgBuffer, { name: 'gen.png' })] });
        } else if (tokens < 30) {
            selectedModel = 'qwen-character';
        } else if (tokens > 100 || /analyze|complex|logic|research/i.test(prompt)) {
            selectedModel = 'openai';
        } else if (/code|script|function|python|js/i.test(prompt)) {
            selectedModel = 'qwen-coder';
        }

        const sysPersona = \`\${process.env.SYSTEM_PROMPT} Backstory: \${process.env.BACKSTORY}. Hobbies: \${process.env.HOBBIES}. Dislikes: \${process.env.DISLIKES}. Your favorite users: \${process.env.LIKED_USERS}.\`;
        history.unshift({ role: 'system', content: sysPersona });

        let response = await callPollinations(history, selectedModel);

        if (selectedModel === 'qwen-character') {
            // Regex to filter non-latin characters roughly and keep it one line
            response = response.split('\\n')[0].replace(/[^\\x00-\\x7F]/g, "");
        }

        if (selectedModel !== 'openai' && process.env.CASUAL_MODE === 'true') {
            response = response.toLowerCase();
        }

        if (process.env.ENABLE_TTS === 'true' && (prompt.includes('speak') || prompt.includes('voice'))) {
            await tts.setMetadata("en-US-AriaNeural", OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS);
            const { audioFilePath } = await tts.toFile("./tmp_voice.mp3", response);
            return message.reply({ content: response, files: [audioFilePath] });
        }

        await message.reply(response);
    } catch (err) { console.error('error handled'); }
});

client.login(process.env.BOT_TOKEN);
`;

export const PACKAGE_JSON = `
{
  "name": "pollinations-universal-bot",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.1",
    "dotenv": "^16.4.5",
    "msedge-tts": "^2.0.4"
  }
}
`;

export const README_MD = `
# Multimodal Discord Chatbot 🤖

## ⚡ Quick Start
1. **Rename Config**: You will see a file named \`env.txt\`. Rename it to \`.env\`.
2. **Add Keys**: Open \`.env\` and paste your Bot Token, Pollinations Key, and IDs.
3. **Run**:
   - If local: \`npm install\` then \`npm start\ Or add the variables as listed below to the env.txt file and run LAUNCHER command file for direct setup(bot comes online if successful). Requires Administrator Permisskons. if you feel uncertain, follow the guide below.
   - If hosting: Follow the guide below.

## 🛠 Variables Explained
- **BOT_TOKEN**: The login key for your bot.
- **POLLINATIONS_KEY**: Allows the bot to use AI models freely.
- **SERVER_ID**: Locks the bot to one server (security).
- **OWNER_ID**: Allows YOU to use debug commands like \`!botcheck\`.
`;

export const LAUNCHER_CMD = `@echo off
:: Set terminal size and encoding
mode con: cols=80 lines=30
chcp 65001 >nul
cd /d "%~dp0"
title BotForgeX - Universal Bot Launcher
color 0b
cls

echo ================================================================================
echo      BotForgeX Discord Bot Launcher
echo      Created by: blueplaysgames3921
echo      Powered by Pollinations.AI
echo ================================================================================
echo.
echo  WHAT THIS DOES:
echo  - Validates Node.js Environment (v18+)
echo  - Verifies Network Connectivity
echo  - Auto-configures Identity Files
echo  - Installs Dependencies and Launches Bot
echo.
echo  PREREQUISITES:
echo  1. Fill in your keys in 'env.txt'
echo  2. Ensure your Bot Token is valid
echo.
echo ================================================================================
echo.
pause

:: 1. Check for Node.js Existence & Version (v18+)
echo [SYSTEM] Verifying Node.js environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: Node.js is NOT installed.
    echo Opening https://nodejs.org/ ...
    start https://nodejs.org/
    echo Please install the LTS version and RESTART your PC.
    pause
    exit
)

:: Robust Version Check
for /f "tokens=1,2,3 delims=.v" %%a in ('node -v') do set node_major=%%a
if %node_major% lss 18 (
    echo [!] ERROR: Outdated Node.js version detected (v%node_major%).
    echo BotForgeX requires Node.js v18 or higher to handle modern discord.js.
    echo Opening https://nodejs.org/ to update...
    start https://nodejs.org/
    pause
    exit
)
echo [OK] Node.js v%node_major% verified.

:: 2. Check Internet/npm Registry
echo [SYSTEM] Testing neural uplink (npm registry)...
call npm ping >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] ERROR: No internet connection or npm registry unreachable.
    echo Please check your connection and try again.
    pause
    exit
)
echo [OK] Uplink established.

:: 3. File Extension Check (.env logic)
if not exist ".env" (
    if exist "env.txt" (
        echo [!] ALERT: Identity file 'env.txt' detected.
        echo [SYSTEM] Auto-converting env.txt to .env...
        rename env.txt .env
        echo [OK] Configuration mapped successfully.
    ) else (
        echo [!] CRITICAL ERROR: Identity file (.env) is missing!
        echo Please ensure 'env.txt' is in this folder.
        pause
        exit
    )
)

:: 4. Dependency Management
echo.
echo [1/2] Syncing dependencies...
echo (This might take a minute on the first run)
call npm install --no-audit --no-fund
if %errorlevel% neq 0 (
    echo [!] npm install failed. Check folder permissions.
    pause
    exit
)

:: 5. Execution Logic
echo.
echo [2/2] Igniting Bot Core...
echo ================================================================================
echo      BOT IS NOW RUNNING ONLINE
echo      Press [Ctrl+C] to shutdown the process
echo ================================================================================
echo.

:: Check for Start Script in package.json
findstr /C:"\\"start\\":" package.json >nul
if %errorlevel% neq 0 (
    echo [!] No 'start' script found. Falling back to direct execution.
    node index.js
) else (
    call npm start
)

echo.
echo [SYSTEM] Core shutdown. Connection lost.
pause`;
