# Movie Explorer Frontend

A modern React application for discovering, tracking, and reviewing movies. This frontend provides a seamless experience
for browsing movie information, creating watchlists, marking favorites, and sharing reviews.

Live Demo: https://6003cem.vercel.app/

## Features

- **User Authentication**: Secure login, registration, and password reset
- **Personal Profile**: Customizable user profiles with display names
- **Movie Discovery**: Browse and search for movies
- **Watchlist Management**: Add movies to your watchlist
- **Favorites Collection**: Mark and organize favorite movies
- **Reviews & Ratings**: Rate movies and write detailed reviews
- **Responsive Design**: Optimized for all devices from mobile to desktop

## Technologies Used

- **React**: UI library for building the interface
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server
- **React Router**: For client-side routing
- **Firebase**: Authentication and backend services
- **shadcn/ui**: Reusable UI components
- **Lucide Icons**: Beautiful SVG icons
- **Zod**: Schema validation
- **React Hook Form**: Form handling
- **Axios**: HTTP client for API requests
- **Sonner**: Toast notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Project Structure

```
client/
├── public/
├── src/
│   ├── api/               # API client configuration
│   ├── components/        # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── custom/        # Custom components
│   │   ├── providers/     # Context providers
│   │   ├── themes/        # Theme configuration
│   │   └── ui/            # UI components (shadcn)
│   ├── firebase/          # Firebase configuration
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Page layouts
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Application entry point
│   └── router.tsx         # Router configuration
├── .eslintrc.js           # ESLint configuration
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie data API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide Icons](https://lucide.dev/) for the icon set