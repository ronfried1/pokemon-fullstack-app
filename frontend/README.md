# Pokémon Manager Frontend

A React application for managing Pokémon data, built with Vite, TypeScript, Redux Toolkit, and TailwindCSS.

## Features

- Browse the first 150 Pokémon
- View detailed information about each Pokémon
- Add/remove Pokémon from favorites
- Search Pokémon by name or type
- Filter to show only favorites
- Responsive design for all device sizes

## Technologies Used

- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **React Router** for navigation
- **TailwindCSS** for styling
- **Axios** for API requests
- **Zod** for schema validation
- **shadcn/ui** inspired components

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

### Running in Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## API Configuration

The application is configured to connect to a backend API running at `http://localhost:4000`. You can change this in the `.env.development` or `.env.production` files.

## Project Structure

- `/src/components` - React components
- `/src/components/ui` - shadcn/ui inspired UI components
- `/src/pages` - Page components for routes
- `/src/store` - Redux store setup and slices
- `/src/lib` - Utility functions and services
- `/src/types` - TypeScript type definitions
