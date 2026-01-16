# TubeBrief AI 🎙️✨

AI-powered YouTube podcast summarization tool with intelligent insights and dark mode support.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)

## ✨ Features

- 🤖 **AI-Powered Summaries** - Generate comprehensive summaries of YouTube podcasts using Google Gemini AI
- 💡 **Smart Q&A** - Get example questions and answers extracted from video content
- 🎨 **Dark/Light Theme** - Beautiful theme toggle with smooth transitions
- 💳 **Stripe Integration** - Secure payment processing for coin purchases
- 🪙 **Coin System** - Flexible pricing with three tiers (Starter, Pro, Pro Plus)
- 📊 **Transaction History** - Track all your purchases and summaries
- 🔐 **Secure Authentication** - Google OAuth integration via NextAuth
- 📱 **Fully Responsive** - Beautiful UI on all devices
- ⚡ **Real-time Updates** - Dynamic content with no caching for instant results
- 🎯 **Modern UI/UX** - Gradient designs, animations, and smooth interactions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **React Markdown** - Render markdown summaries

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Type-safe database queries
- **PostgreSQL** - Robust database (Supabase)

### Authentication & Payments
- **NextAuth.js** - Authentication solution
- **Google OAuth** - Secure user login
- **Stripe** - Payment processing

### AI & APIs
- **Google Gemini AI** - Content summarization
- **YouTube Transcript API** - Extract video transcripts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Google OAuth credentials
- Stripe account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd my-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**


4. **Set up database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🎯 Key Features

### AI Summarization
- Extracts transcripts from YouTube videos
- Processes content through Google Gemini AI
- Generates structured summaries with key points
- Creates relevant Q&A pairs

### Coin System
- **Starter**: 100 coins (₹100) - 10 summaries
- **Pro**: 510 coins (₹500) - 51 summaries + bonus
- **Pro Plus**: 1020 coins (₹1000) - 102 summaries + bonus

### Theme System
- Persistent theme preference (localStorage)
- Smooth transitions between light/dark modes
- Works across all pages

## 📦 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npx prisma studio    # Database GUI
```


## 📝 Environment Variables

- Database (Supabase)
- NextAuth (Google OAuth)
- Stripe (Payments)
- Gemini AI (Summarization)

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Support

For support, open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js 15, Prisma, and Stripe**

🌟 **Star this repo if you find it helpful!**
