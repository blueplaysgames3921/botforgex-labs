export const INDEX_JS = `
const { Client, GatewayIntentBits, Partials, AttachmentBuilder } = require('discord.js');
const https = require('https');
const fs = require('fs');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
});

const tts = new MsEdgeTTS();
let msgCounter = 0;

// Env Configuration
const min = parseInt(process.env.NATURAL_MIN) || 5;
const max = parseInt(process.env.NATURAL_MAX) || 20;
let nextTrigger = Math.floor(Math.random() * (max - min + 1)) + min;

async function callPollinations(messages, model, isImage = false) {
    return new Promise((resolve, reject) => {
        const payload = isImage ? null : JSON.stringify({
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
            if (res.statusCode !== 200) return reject(\`API_ERR: \${res.statusCode}\`);
            
            let body = [];
            res.on('data', (chunk) => body.push(chunk));
            res.on('end', () => {
                try {
                    const buffer = Buffer.concat(body);
                    if (isImage) return resolve(buffer);
                    
                    const json = JSON.parse(buffer.toString());
                    if (json.choices && json.choices[0]) {
                        resolve(json.choices[0].message.content);
                    } else {
                        reject('Malformed response');
                    }
                } catch (e) { reject('Parsing error'); }
            });
        });

        if (!isImage && payload) req.write(payload);
        req.on('error', (e) => reject(e));
        req.end();
    });
}

client.on('messageCreate', async (message) => {
    // 1. Basic Safety Filters
    if (message.author.bot) return;
    if (process.env.SERVER_ID && message.guildId !== process.env.SERVER_ID) return;

    // 2. Owner Debug Command
    if (message.content === '!botcheck' && message.author.id === process.env.OWNER_ID) {
        const options = { 
            hostname: 'gen.pollinations.ai', 
            path: '/account/balance', 
            headers: { 'Authorization': \`Bearer \${process.env.POLLINATIONS_KEY}\` } 
        };
        https.get(options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try {
                    const bal = JSON.parse(data);
                    message.reply(\`📡 **System Check:** Pollen Balance: \\\`\${bal.balance || 0}\\\`\`);
                } catch (e) { message.reply('❌ Error parsing balance.'); }
            });
        }).on('error', () => message.reply('❌ Network error during check.'));
        return;
    }

    // 3. Trigger Logic
    const isMentioned = message.mentions.has(client.user);
    msgCounter++;

    if (!isMentioned && msgCounter < nextTrigger) return;
    
    // Reset counter for next cycle
    msgCounter = 0;
    nextTrigger = Math.floor(Math.random() * (max - min + 1)) + min;

    try {
        await message.channel.sendTyping();
        
        // Fetch History
        const rawLogs = await message.channel.messages.fetch({ limit: 15 });
        const history = rawLogs.reverse()
            .filter(m => !m.content.startsWith('!') && m.content.length > 0)
            .map(m => ({
                role: m.author.id === client.user.id ? 'assistant' : 'user',
                content: m.content
            }));

        let selectedModel = 'nova-fast';
        let prompt = message.content || "";
        const tokens = prompt.length / 4;

        // 4. Advanced Model Routing logic
        if (message.attachments.size > 0 && process.env.ENABLE_VISION === 'true') {
            selectedModel = 'gemini-fast';
            const lastMsg = history[history.length - 1];
            if (lastMsg) {
                lastMsg.content = [
                    { type: "text", text: prompt || "Analyze this image." },
                    { type: "image_url", image_url: { url: message.attachments.first().url } }
                ];
            }
        } else if (prompt.toLowerCase().startsWith('draw:') && process.env.ENABLE_IMAGE_GEN === 'true') {
            const query = prompt.split('draw:')[1];
            const imgBuffer = await callPollinations(query, 'flux', true);
            return message.reply({ files: [new AttachmentBuilder(imgBuffer, { name: 'generated.png' })] });
        } else if (tokens < 30) {
            selectedModel = 'qwen-character';
        } else if (tokens > 100 || /analyze|complex|logic|research|think/i.test(prompt)) {
            selectedModel = 'openai';
        } else if (/code|script|function|python|js/i.test(prompt)) {
            selectedModel = 'qwen-coder';
        }

        // Persona Injection
        const sysPersona = \`\${process.env.SYSTEM_PROMPT} Backstory: \${process.env.BACKSTORY}. Hobbies: \${process.env.HOBBIES}. Dislikes: \${process.env.DISLIKES}. Your favorite users: \${process.env.LIKED_USERS}.\`;
        history.unshift({ role: 'system', content: sysPersona });

        let response = await callPollinations(history, selectedModel);

        // 5. Post-Processing
        if (selectedModel === 'qwen-character') {
            response = response.split('\\n')[0].replace(/[^\\x00-\\x7F]/g, "");
        }

        if (selectedModel !== 'openai' && process.env.CASUAL_MODE === 'true') {
            response = response.toLowerCase();
        }

        // 6. Voice Output Logic
        if (process.env.ENABLE_TTS === 'true' && (prompt.includes('speak') || prompt.includes('voice'))) {
            const voicePath = \`./voice_\${Date.now()}.mp3\`;
            await tts.setMetadata("en-US-AriaNeural", OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS);
            await tts.toFile(voicePath, response);
            
            await message.reply({ content: response, files: [new AttachmentBuilder(voicePath)] });
            
            return fs.unlink(voicePath, (err) => { if(err) console.error("Cleanup failed"); });
        }

        await message.reply(response);
    } catch (err) { 
        console.error('Handled Exception:', err);
    }
});

client.login(process.env.BOT_TOKEN);
`;



export const PACKAGE_JSON = `
{
  "name": "botforgex-universal-bot",
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
# 🌀 BotForgeX: Multimodal Neural Engine
**Architected by blueplaysgames3921 | Powered by Pollinations.AI**

Congratulations. You have generated a custom instance of the BotForgeX framework. This bot is currently configured with the unique persona, backstory, and behavioral logic you defined in the Forge.

---

## ⚡ Deployment: Quick Start (Windows)
If you are hosting locally on Windows, we have provided an automated bridge to get you online instantly.

1. **Configure Identity**: Open \`env.txt\` and paste your **BOT_TOKEN** and **POLLINATIONS_KEY**.
2. **Execute Setup**: Right-click \`INSTALL_AND_LAUNCH.txt\`, rename it to \`launch.cmd\`, and **Run as Administrator**.
3. **Automated Logic**: The script will verify your Node.js version, install all neural dependencies (discord.js, msedge-tts), and ignite the bot core.

---

## 🛠 Manual Configuration & Variables
If you prefer manual setup or are using Linux/MacOS, map your credentials in the \`.env\` file (formerly \`env.txt\`):

| Variable | Description |
| :--- | :--- |
| **BOT_TOKEN** | Your bot's secret key from the [Discord Developer Portal](https://discord.com/developers/applications). |
| **POLLINATIONS_KEY** | Your API access key from [pollinations.ai](https://pollinations.ai/). |
| **SERVER_ID** | (Optional) Restricts the bot to one specific server. |
| **OWNER_ID** | Your Discord User ID. Enables the \`!botcheck\` debug command. |

*Note: Ensure **Message Content Intent** is toggled ON in your Discord Developer Dashboard.*

---

## 🧠 Core Intelligence & Logic
Your bot doesn't just "chat"—it thinks. The BotForgeX engine uses **Contextual Model Routing** to handle different tasks:

* **Vision (Gemini-Fast)**: Triggered when an image is uploaded. The bot "sees" and analyzes visual data.
* **Creative Imaging (Flux)**: Triggered by the \`draw:\` prefix. Generates high-fidelity AI imagery.
* **Rapid Response (Qwen-Character)**: Optimized for short bursts and casual banter (<30 tokens).
* **Deep Analysis (OpenAI)**: Engages for complex logic, storytelling, or research-heavy prompts (>100 tokens).
* **Neural Voice (Edge-TTS)**: If enabled, the bot can generate high-quality audio responses when you ask it to "speak" or "talk."

### Behavioral Protocols
- **Persona Persistence**: The bot will strictly follow the persona and backstory you injected during the generation process.
- **Natural Triggers**: The bot monitors channel activity and will autonomously join the conversation every 5–20 messages to keep the "vibe" alive.
- **Context Memory**: It maintains a rolling buffer of the last 30 messages to ensure continuity in complex discussions.

---

## 🌐 24/7 Hosting Solutions

### Method A: Railway.app (Recommended)
1. Upload these files to a private GitHub Repository.
2. Connect the repo to [Railway.app](https://railway.app/).
3. Add your \`.env\` variables to the Railway "Variables" tab.
4. **Build Command**: \`npm install\` | **Start Command**: \`node index.js\`

### Method B: VPS / Dedicated Server (Ubuntu/Linux)
1. Transfer files via SFTP/SCP.
2. Install PM2 to keep the process alive: \`npm install pm2 -g\`.
3. Launch: \`pm2 start index.js --name "botforgex-bot"\`.

---

## 🛡 Security & Safety Measures
- **Local Integrity**: This bot uses native Node.js \`https\` logic. No external logging or data-harvesting middlewares are used.
- **Credential Safety**: Never share your \`.env\` or \`env.txt\` file. If your **BOT_TOKEN** is leaked, reset it immediately in the Discord Developer Portal.
- **Process Isolation**: When running the automated launcher, ensure you trust the directory permissions. The launcher is designed to only modify files within its own folder.

---
*Generated via BotForgeX Labs. Stay creative.*
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


export const LICENSE = `MIT License

Copyright (c) 2026 BLUEGAMINGGM

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
