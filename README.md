# ChatGPT Clone

A modern ChatGPT clone built with Next.js, TypeScript, and the AI SDK, powered by OpenRouter for access to multiple AI models.

## Features

- 🤖 **Multiple AI Models**: Access GPT-4, Claude, Gemini, Llama, and more through OpenRouter
- 💬 **Real-time Chat**: Streaming responses with typing indicators
- 🎨 **Modern UI**: Clean, responsive interface inspired by ChatGPT
- 🔄 **Model Switching**: Switch between different AI models mid-conversation
- 📱 **Mobile Friendly**: Fully responsive design
- 🌙 **Dark Mode**: Built-in dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- An OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd chatgpt-clone
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Add your OpenRouter API key to `.env.local`:
\`\`\`env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=ChatGPT Clone
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Models

The app supports various AI models through OpenRouter:

- **OpenAI**: GPT-4o, GPT-4o Mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku  
- **Google**: Gemini Pro 1.5
- **Meta**: Llama 3.1 70B
- **Mistral AI**: Mixtral 8x7B
- **Perplexity**: Sonar Large Online (with web search)

## Usage

1. Select your preferred AI model from the dropdown
2. Type your message in the input field
3. Press Enter or click Send to start the conversation
4. Switch models anytime to compare responses
5. Click "New Chat" to start fresh

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `OPENROUTER_SITE_URL` | Your site URL for OpenRouter analytics | No |
| `OPENROUTER_SITE_NAME` | Your site name for OpenRouter analytics | No |
| `DEFAULT_MODEL` | Default model to use on load | No |

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AI Integration**: Vercel AI SDK
- **API Provider**: OpenRouter
- **Icons**: Lucide React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
