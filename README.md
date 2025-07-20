# Compit Pal 🏆

A competitive challenge tracking platform for friends and communities. Create rooms, join challenges, track progress, and compete with others in various activities like coding, fitness, learning, and more.

## Features

- **🏠 Room Management**: Create public or private challenge rooms with unique codes
- **👥 User Authentication**: Secure login/signup with JWT tokens
- **📊 Progress Tracking**: Submit daily progress and build streaks
- **🏅 Leaderboards**: Real-time rankings and competition
- **📈 Analytics**: Detailed insights and performance tracking
- **🎯 Multiple Challenge Types**: Coding, Fitness, Learning, Habits, Creative, Health, and Custom
- **⚙️ Flexible Scoring**: Binary completion or point-based scoring systems
- **🔒 Privacy Options**: Public rooms for discovery or private rooms for friends

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Next.js API Routes with serverless functions
- **Database**: Upstash Redis for data persistence
- **Authentication**: JWT tokens with secure HTTP-only cookies
- **Deployment**: Vercel (recommended) or any Next.js-compatible platform

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Upstash Redis account (free tier available)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Compit
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from env.example
cp env.example .env.local
```

Fill in your Upstash Redis credentials:

```env
KV_REST_API_URL=your_upstash_redis_url_here
KV_REST_API_TOKEN=your_upstash_redis_token_here
JWT_SECRET=your_random_jwt_secret_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `KV_REST_API_URL` | Upstash Redis REST API URL | Yes |
| `KV_REST_API_TOKEN` | Upstash Redis REST API Token | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `NEXTAUTH_URL` | Your app URL (for production) | No |
| `NEXTAUTH_SECRET` | NextAuth secret (for production) | No |

## Project Structure

```
Compit/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── rooms/         # Room management endpoints
│   │   └── progress/      # Progress tracking endpoints
│   ├── components/        # Reusable UI components
│   ├── home/              # Dashboard page
│   ├── rooms/             # Room management pages
│   ├── room/              # Individual room pages
│   └── public-rooms/      # Public room discovery
├── lib/                   # Utility libraries
│   ├── db.ts             # Database operations
│   ├── auth.ts           # Authentication utilities
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
├── styles/                # Global styles
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Rooms
- `POST /api/rooms/create` - Create a new room
- `GET /api/rooms/active` - Get user's active rooms
- `GET /api/rooms/public` - Get public rooms
- `POST /api/rooms/join` - Join a room
- `GET /api/rooms/[code]` - Get room details
- `GET /api/rooms/[code]/leaderboard` - Get room leaderboard

### Progress
- `POST /api/progress/submit` - Submit progress
- `GET /api/progress/[roomCode]` - Get room progress

## Challenge Types

1. **💻 Coding**: DSA problems, algorithm practice, project commits
2. **🏃‍♂️ Fitness**: Daily workouts, steps, gym sessions, sports
3. **📚 Learning**: Pages read, courses completed, videos watched
4. **✨ Habits**: Meditation, water intake, early wake-up, journaling
5. **🎨 Creative**: Daily writing, drawing, music practice, photography
6. **🏥 Health**: Sleep tracking, meal planning, medication adherence
7. **🎯 Custom**: User-defined challenges with flexible parameters

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**: Commit and push your code to GitHub
2. **Connect to Vercel**: Import your repository in Vercel
3. **Set Environment Variables**: Add your environment variables in Vercel dashboard
4. **Deploy**: Vercel will automatically deploy your app

### Environment Variables in Vercel

Add these in your Vercel project settings:

```env
KV_REST_API_URL=your_upstash_redis_url
KV_REST_API_TOKEN=your_upstash_redis_token
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Local Development

### Database Testing

Test your database connection:

```bash
# Visit this URL in your browser
http://localhost:3000/api/test-db
```

### Common Issues

1. **"Create Room" page not found**: Ensure all API routes are created
2. **Database connection errors**: Check your Upstash Redis credentials
3. **Authentication issues**: Verify JWT_SECRET is set
4. **Styling issues**: Ensure Tailwind CSS is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## Roadmap

- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Team challenges
- [ ] Achievement system
- [ ] Social features
- [ ] API documentation
- [ ] Admin dashboard

---

Built with ❤️ using Next.js and Upstash Redis 