# MovieHub - Full Stack Movie Application

A modern, responsive full-stack application for discovering, searching, and tracking movies. Users can create accounts, browse trending and popular movies, search for specific titles, and maintain a personal watchlist.

## Features

- **User Authentication**: Register, login, and password recovery
- **Movie Discovery**: Browse trending, popular, and top-rated movies
- **Search Functionality**: Find movies by title, genres, or keywords
- **Movie Details**: View comprehensive information about each movie
- **User Profiles**: Personalized user experience with watchlist tracking
- **Responsive Design**: Optimized for both desktop and mobile devices

## Technology Stack

### Frontend
- React.js with TypeScript
- React Router for navigation
- Shadcn UI components
- Context API for state management
- Axios for API requests
- Firebase Authentication
- Vite as build tool

### Backend
- Node.js with TypeScript
- Express.js framework
- MongoDB for database
- Firebase Authentication integration
- RESTful API architecture
- TMDB and OMDB API integration for movie data

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- MongoDB instance
- Firebase project
- TMDB API key

### Installation

#### Clone the repository
```bash
git clone https://github.com/Xytrix1103/6003CEM_CW2.git
cd 6003CEM_CW2
```

#### Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the client directory with:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=http://localhost:5000/api
```

#### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
TMDB_API_KEY=your_tmdb_api_key
FIREBASE_SERVICE_ACCOUNT_KEY=path_to_firebase_service_account_key_json
```

### Running the Application

#### Start the backend server
```bash
cd server
npm run dev
```

#### Start the frontend development server
```bash
cd client
npm run dev
```

The application should now be running at [http://localhost:5173](http://localhost:5173)

## Project Structure

### Frontend (client/)
- `src/components/`: UI components and contexts
- `src/pages/`: Application pages
- `src/api/`: API service calls
- `src/firebase/`: Firebase configuration
- `src/hooks/`: Custom React hooks
- `src/layouts/`: Layout components
- `src/types/`: TypeScript interfaces and types

### Backend (server/)
- `src/controllers/`: Request handlers
- `src/models/`: Database schemas
- `src/routes/`: API endpoints
- `src/middlewares/`: Custom middleware functions
- `src/services/`: External service integrations
- `src/utils/`: Utility functions

## Deployment

The application is configured for deployment on Vercel (frontend) and can be deployed to any Node.js hosting service for the backend.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [TMDB API](https://www.themoviedb.org/documentation/api) for providing movie data
- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Firebase](https://firebase.google.com/) for authentication services