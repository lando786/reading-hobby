# Read Quest 📚✨

**Read Quest** is a gamified reading habit builder designed to turn your reading sessions into an epic adventure. Track your progress, earn XP, level up your "Page Warrior" rank, and unlock achievements as you conquer your library.

## Features

- **🏠 Interactive Dashboard**: Track your current read, view your level progress, and daily streaks.
- **🔍 Book Search**: Find books by title or author using the Open Library API.
- **🏴‍☠️ Gamification**: Earn XP for every page logged. Progress through ranks from *Novice Scrawler* to *Literary Legend*.
- **📜 Daily Quests**: Complete daily reading challenges to earn bonus XP.
- **🔖 Library Management**: Organize your books into *Reading*, *To Read*, and *Completed* lists.
- **📱 Mobile First**: responsive design optimized for mobile use as a PWA.
- **✨ Visual Polish**: Custom "hand-drawn" aesthetic with interactive confetti celebrations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Styling**: Vanilla CSS + Tailwind CSS (Custom "Hand-Drawn" Theme)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State**: React Context API
- **Fonts**: Patrick Hand (Google Fonts)
- **Animations**: Canvas Confetti

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lando786/reading-hobby.git
   cd reading-hobby
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Persistence

This app uses **LocalStorage** to save your reading progress and library. Your data remains in your browser, keeping your reading list private and accessible even without a backend.
