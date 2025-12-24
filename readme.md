# Tech Innovers

A comprehensive platform for exploring technology domains, career paths, and AI-powered tools for developers and tech enthusiasts.

## Features

- **Domain Explorer**: Browse various tech domains like Web Development, Machine Learning, Cloud Computing, and more
- **AI-Powered Tools**: 
  - Resource Summarizer
  - Project Idea Generator
  - Career Path Advisor
  - Tech News Bot
- **Personalized Roadmaps**: Get customized learning paths based on your interests and skills
- **Interactive Career Guidance**: Discover the best tech career path for you

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Pawank67m/tech-innovers.git
cd tech-innovers
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` and add your Google AI API key:
```
GOOGLE_GENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Getting a Google AI API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## Tech Stack

- **Framework**: Next.js 15
- **AI**: Google Gemini AI via Genkit
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod
- **TypeScript**: Full type safety

## Project Structure

```
src/
├── ai/                 # AI flows and configuration
├── app/               # Next.js app router pages
├── components/        # React components
├── hooks/            # Custom React hooks
└── lib/              # Utility functions and data
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
