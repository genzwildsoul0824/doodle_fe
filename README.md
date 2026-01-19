# Chat Application - Frontend

A chat interface built with Next.js and TypeScript.

## Quick Start

### 1. Install Dependencies

```bash
cd fe
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `fe` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_TOKEN=super-secret-doodle-token
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint

## Project Structure

```
fe/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility libraries
└── types/           # TypeScript types
```

## Requirements

- Node.js 18 or higher
- Backend API running on port 3000
