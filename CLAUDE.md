# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Matrix-themed terminal landing page that serves as a frontend interface for an n8n chatbot. It's a static HTML/CSS/JavaScript application with no build process or dependencies.

## Running the Application

Start a local HTTP server:
```bash
python -m http.server 8000
```

Access at: `http://localhost:8000`

## Architecture

**Three-file structure:**
- `index.html` - Terminal UI structure with boot sequence, message container, and input field
- `styles.css` - Matrix visual theme (green on black, CRT effects, scanlines, glow)
- `script.js` - All application logic including Matrix rain animation, chat functionality, and n8n integration

**Key Components:**

1. **Matrix Rain Background** (script.js:10-46)
   - Canvas-based animation using Japanese katakana + alphanumeric characters
   - Runs continuously at 35ms intervals
   - Auto-adjusts on window resize

2. **Chat System** (script.js:88-130)
   - `sendMessage()` - POSTs to n8n webhook with message, timestamp, sessionId
   - Response handling supports multiple field names: `response`, `message`, `output`, `text`
   - Session persistence via `sessionStorage`

3. **UI Elements**
   - Boot sequence: 5-second animated intro (fades out automatically)
   - Message display: Timestamped user/bot/system messages with auto-scroll
   - Input area: Terminal-style prompt with Enter-to-send

## n8n Integration

**Webhook Configuration:**
- URL set in `script.js` line 2: `N8N_WEBHOOK_URL`
- Currently uses ngrok tunnel for CORS bypass
- Request format:
  ```json
  {
    "message": "user input",
    "timestamp": "ISO 8601 string",
    "sessionId": "session-{timestamp}-{random}"
  }
  ```

**n8n Webhook Requirements:**
- Must return JSON with chatbot response in one of: `response`, `message`, `output`, or `text` field
- Must include CORS headers in "Respond to Webhook" node:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: POST, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type`

## Styling Notes

- Primary color: `#00ff00` (Matrix green)
- All borders/outlines use green (`#00ff00`) for consistency
- Text glow effects via `text-shadow`
- CRT scanline animation via `::before` pseudo-element
- Responsive breakpoint at 768px
