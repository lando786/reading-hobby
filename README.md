# Read Quest 📚✨

**Read Quest** is a gamified reading habit builder designed to turn your reading sessions into an epic adventure. Track your progress, earn XP, level up your "Page Warrior" rank, and unlock achievements as you conquer your library.

## Features

- **🏠 Interactive Dashboard**: Track your current read, view your level progress, and daily streaks.
- **🔍 Book Search**: Find books by title or author using the Open Library API.
- **🏴‍☠️ Gamification**: Earn XP for every page logged. Progress through ranks from *Novice Scrawler* to *Literary Legend*.
- **📜 Daily Quests**: Complete daily reading challenges to earn bonus XP.
- **🔖 Library Management**: Organize your books into *Reading*, *To Read*, and *Completed* lists.
- **🔐 User Accounts**: Securely save progress across devices with Google Authentication.
- **🐳 Dockerized**: Easy local setup and deployment using Docker and Docker Compose.
- **📱 Mobile First**: Responsive design optimized for mobile use as a PWA.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Google Provider)
- **Styling**: Vanilla CSS + Tailwind CSS (Custom "Hand-Drawn" Theme)
- **Containerization**: Docker & Docker Compose
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Canvas Confetti

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Google Cloud Console credentials (for OAuth)

### Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/lando786/reading-hobby.git
   cd reading-hobby
   ```

2. **Configure Environment Variables**:
   A `.env` file is included with default configuration for local development. You can modify it or create your own based on `.env.example`.

   *Note: You must provide a valid `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env` for Google Authentication to work.*

3. **Start the application**:

   ```bash
   sudo docker-compose down && sudo docker-compose up --build
   ```

   *Note: The `down` command ensures any old containers/volumes are cleared if needed, but standard `up --build` is sufficient for updates.*

4. **Initialize the database** (Run once the containers are up):

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Access the app**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Persistence

This app uses a **PostgreSQL** database for authenticated users to ensure your data is safe and synced across devices. For guests, we utilize **LocalStorage** as a fallback, which can be synced to your account upon signing in.
