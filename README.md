# Matrix Terminal Chatbot 🟢

A Matrix-themed terminal interface for interacting with an n8n chatbot. Features authentic Matrix rain animation, retro CRT effects, and secure webhook integration via Vercel serverless functions.

![Matrix Terminal](https://img.shields.io/badge/Matrix-Terminal-00ff00?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

## 🌐 Live Demo

**Production URL**: [https://claudecodetest-id0p5gug5-bill-markhams-projects.vercel.app](https://claudecodetest-id0p5gug5-bill-markhams-projects.vercel.app)

## ✨ Features

- 🎨 **Matrix Rain Animation** - Canvas-based background with Japanese katakana characters
- 💬 **Real-time Chat** - Interactive terminal interface with n8n chatbot integration
- 🔒 **Secure Architecture** - Webhook URLs hidden server-side via Vercel functions
- ⚡ **Zero Build Process** - Pure HTML/CSS/JavaScript, no dependencies
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🖥️ **CRT Effects** - Authentic terminal aesthetic with scanlines and text glow

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Browser)     │
│   script.js     │
└────────┬────────┘
         │ POST /api/webhook
         ↓
┌─────────────────┐
│ Vercel Function │
│  api/webhook.js │
└────────┬────────┘
         │ Proxies request
         ↓
┌─────────────────┐
│  n8n Webhook    │
│  (Backend)      │
└─────────────────┘
```

### Why This Architecture?

- **Security**: n8n webhook URL stored as environment variable, never exposed to frontend
- **CORS**: Vercel function handles CORS headers properly
- **Flexibility**: Easy to swap backend without changing frontend code

## 📁 Project Structure

```
├── api/
│   └── webhook.js          # Vercel serverless function (proxies to n8n)
├── index.html              # Terminal UI structure
├── script.js               # Matrix animation & chat logic
├── styles.css              # Matrix theme & CRT effects
├── vercel.json             # Vercel configuration & CORS headers
├── .env.example            # Environment variable template
├── .gitignore              # Excludes secrets from git
└── CLAUDE.md               # Development guidance for Claude Code
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/BillMarkham/ClaudeCodeTest.git
   cd ClaudeCodeTest
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your n8n webhook URL:
   ```
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-path
   ```

3. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

4. **Run development server**
   ```bash
   vercel dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Alternative: Simple HTTP Server

For frontend-only testing (without backend integration):

```bash
python -m http.server 8000
# or
npx http-server -p 8000
```

Visit `http://localhost:8000` (note: chatbot won't work without the Vercel function)

## 🌍 Deploying to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variable:
   - **Key**: `N8N_WEBHOOK_URL`
   - **Value**: Your n8n webhook URL
4. Deploy!

### Method 2: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Add environment variable
vercel env add N8N_WEBHOOK_URL production
# (Paste your webhook URL when prompted)

# Redeploy with new env var
vercel --prod
```

## 🔧 Configuration

### n8n Webhook Setup

Your n8n webhook must:

1. **Accept POST requests** with JSON body:
   ```json
   {
     "message": "user input",
     "timestamp": "2025-10-07T12:34:56.789Z",
     "sessionId": "session-1234567890-abc123"
   }
   ```

2. **Return JSON response** with one of these fields:
   - `response`
   - `message`
   - `output`
   - `text`

3. **Include CORS headers** (if testing directly):
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type
   ```

   Note: When using Vercel serverless function, CORS is handled automatically.

### Customization

**Change Matrix colors** (`styles.css`):
```css
--matrix-green: #00ff00;  /* Primary Matrix green */
```

**Adjust animation speed** (`script.js`):
```javascript
setInterval(drawMatrix, 35);  /* Lower = faster animation */
```

**Modify boot sequence** (`script.js`):
```javascript
setTimeout(() => {
  bootSequence.style.display = 'none';
}, 5000);  /* Boot sequence duration in ms */
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5 Canvas, CSS3
- **Backend**: Vercel Serverless Functions (Node.js)
- **Deployment**: Vercel
- **Version Control**: Git, GitHub
- **Chatbot Backend**: n8n

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `N8N_WEBHOOK_URL` | Your n8n webhook endpoint URL | ✅ Yes |

## 🔐 Security Features

- ✅ Webhook URLs stored as environment variables
- ✅ No secrets committed to repository
- ✅ `.gitignore` protects `.env*` files
- ✅ Serverless function proxies requests
- ✅ CORS properly configured

## 🐛 Troubleshooting

**Chatbot not responding?**
- Check Vercel environment variable is set correctly
- Verify n8n webhook is accessible and returning JSON
- Check browser console for errors

**Matrix rain not animating?**
- Ensure JavaScript is enabled
- Check browser console for canvas errors

**CORS errors in development?**
- Use `vercel dev` instead of simple HTTP server
- Ensure Vercel function is running

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/BillMarkham/ClaudeCodeTest/issues).

## 👤 Author

**Bill Markham**
- GitHub: [@BillMarkham](https://github.com/BillMarkham)

---

🤖 *Built with [Claude Code](https://claude.com/claude-code)*
