# Movie Tracking API

Backend server for a movie tracking application built with Node.js, Express, TypeScript, MongoDB, and Firebase
Authentication.

Live Demo: https://six003cem-cw2-be.onrender.com/

## Features

- User authentication and profile management
- Movie information retrieval and search
- Genre categorization and filtering
- Track watched movies
- User visit tracking
- Watchlist management
- Integration with external movie API

## Tech Stack

- **TypeScript**: Type-safe JavaScript
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Firebase Auth**: Authentication service
- **External Movie API**: Movie data source (e.g., TMDB, OMDB)

## Project Structure

```
server/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Entry point
│   ├── config/                # Configuration files
│   │   └── config.ts          # App configuration
│   ├── controllers/           # Request handlers
│   │   ├── authController.ts  # Authentication logic
│   │   ├── genreController.ts # Genre-related operations
│   │   ├── movieController.ts # Movie-related operations
│   │   ├── userController.ts  # User profile operations
│   │   └── watchedController.ts # Watched movies logic
│   ├── middlewares/           # Express middlewares
│   │   ├── authMiddleware.ts  # Authentication checks
│   │   ├── errorHandlerMiddleware.ts # Error handling
│   │   └── loggerMiddleware.ts # Request logging
│   ├── models/                # Mongoose schemas
│   │   ├── User.ts            # User model
│   │   ├── Visit.ts           # Visit tracking model
│   │   └── Watched.ts         # Watched movies model
│   ├── routes/                # API routes
│   │   ├── authRoutes.ts      # Auth endpoints
│   │   ├── genreRoutes.ts     # Genre endpoints
│   │   ├── movieRoutes.ts     # Movie endpoints
│   │   ├── userRoutes.ts      # User endpoints
│   │   └── watchedRoutes.ts   # Watched movie endpoints
│   ├── services/              # External services integration
│   │   ├── firebase_auth.ts   # Firebase authentication
│   │   ├── mongodb.ts         # Database connection
│   │   └── movie_api.ts       # Movie API integration
│   └── utils/                 # Utility functions
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- Firebase project
- Movie API access (TMDB, OMDB)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=4000
MONGODB_USER=your_mongodb_user
MONGODB_PASSWORD=your_mongodb_password
MONGODB_CLUSTER=your_mongodb_cluster
MONGODB_APP_NAME=your_app_name
MONGODB_DB=your_database_name
OMDB_API_KEY=your_omdb_api_key
TMDB_API_KEY=your_tmdb_api_key
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
```
