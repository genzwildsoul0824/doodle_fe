# Chat Application - Frontend

A modern, responsive chat interface built with Next.js and TypeScript for the Doodle Frontend Challenge.

![Chat Application](https://img.shields.io/badge/Next.js-14.2.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-18-61dafb)

## Features

- 💬 Real-time message display with automatic polling
- 📱 Fully responsive design (mobile, tablet, desktop)
- ♿ Accessible UI with ARIA labels and keyboard navigation
- 🎨 Modern, clean interface with smooth animations
- 👤 Persistent user identity (stored in localStorage)
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- 🔄 Auto-scroll to latest messages
- ✅ Form validation with character limits
- 🎯 Visual feedback for user interactions
- 🌈 Beautiful gradient design

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher

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

> **Note**: The backend API must be running on port 3000. See the backend README for setup instructions.

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001)

> **Port Note**: If port 3001 is already in use, Next.js will automatically select the next available port (3002, 3003, etc.)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm start` - Run production build
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
fe/
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ChatContainer.tsx    # Main chat container with state management
│   ├── ChatContainer.module.css
│   ├── Message.tsx          # Individual message component
│   ├── Message.module.css
│   ├── MessageInput.tsx     # Message input form
│   └── MessageInput.module.css
├── lib/                     # Utility libraries
│   └── api.ts              # API client for backend communication
├── types/                   # TypeScript type definitions
│   └── index.ts
├── .env.local              # Environment variables (create this)
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture & Design Decisions

### Technology Stack

- **Next.js 14**: Modern React framework with App Router for optimal performance
- **TypeScript**: Type safety and better developer experience
- **CSS Modules**: Scoped styling to prevent conflicts
- **date-fns**: Lightweight date formatting library

### Key Features Implementation

#### 1. Real-time Updates
- Polls the backend API every 3 seconds for new messages
- Only fetches messages created after the last known timestamp
- Efficient pagination to minimize data transfer

#### 2. Responsive Design
- Mobile-first approach
- Fluid layouts that adapt to screen size
- Touch-friendly UI elements (minimum 44px touch targets)
- Responsive typography and spacing

#### 3. Accessibility
- Semantic HTML elements
- ARIA labels and roles for screen readers
- Keyboard navigation support
- Focus indicators for interactive elements
- High contrast colors for readability
- Error messages with `role="alert"`

#### 4. Performance
- Component-level code splitting
- Optimized re-renders with React hooks
- Lazy loading of messages
- Efficient state management

#### 5. User Experience
- Auto-scroll to latest messages (with smart detection)
- Visual feedback for loading states
- Error handling with retry options
- Character count indicators
- Persistent user identity
- Smooth animations and transitions

## API Integration

The frontend integrates with the backend API using the following endpoints:

### Get Messages
```typescript
GET /api/v1/messages?limit=100&after=2023-01-01T00:00:00.000Z
Authorization: Bearer super-secret-doodle-token
```

### Send Message
```typescript
POST /api/v1/messages
Authorization: Bearer super-secret-doodle-token
Content-Type: application/json

{
  "message": "Hello world",
  "author": "John Doe"
}
```

## Browser Compatibility

Tested and working on:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android)

## Known Limitations

- Messages are polled every 3 seconds (not true real-time WebSocket connection)
- Authentication uses a hardcoded token (for demo purposes)
- No message editing or deletion functionality
- No user avatar support
- No message read receipts

## Future Enhancements

- WebSocket integration for true real-time updates
- User authentication with proper OAuth
- Message reactions and emojis
- File attachment support
- Message search functionality
- User typing indicators
- Dark mode toggle
- Message threading

## Troubleshooting

### Port Already in Use

If you see an error about port 3001 being in use:

```bash
# Kill the process using the port (macOS/Linux)
lsof -ti:3001 | xargs kill

# Or manually specify a different port
PORT=3002 npm run dev
```

### Backend Connection Issues

If the app can't connect to the backend:

1. Ensure the backend is running on port 3000
2. Check that `.env.local` has the correct `NEXT_PUBLIC_API_URL`
3. Verify CORS is properly configured in the backend
4. Check browser console for specific error messages

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## Development Notes

### Code Quality

- All components use TypeScript for type safety
- CSS Modules for scoped styling
- ESLint configuration for code quality
- Consistent code formatting
- Comprehensive error handling

### Performance Considerations

- Messages are fetched in batches with pagination
- Auto-scroll only when user is near the bottom
- Efficient state updates to minimize re-renders
- Optimized CSS with hardware-accelerated animations

### Accessibility Checklist

- ✅ Semantic HTML
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Color contrast compliance
- ✅ Screen reader friendly
- ✅ Touch target sizes (mobile)

## Contributing

When contributing to this project:

1. Follow the existing code style
2. Add TypeScript types for new code
3. Test on multiple browsers and devices
4. Ensure accessibility standards are met
5. Write clear commit messages

## License

This project is created for the Doodle Frontend Challenge.

## Author

Created as part of the Doodle Frontend Engineering Challenge.

---

For backend API documentation, see the [backend README](../be/README.md).
