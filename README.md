# Task Management Dashboard

A task management dashboard built with Next.js, integrating authentication and a database for managing notes. This project utilizes various modern technologies to create a functional application.

## Table of Contents

- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Folder Structure](#folder-structure)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)

## Technologies

- **Next.js** - React framework for server-side rendering and static site generation.
- **TypeScript** - Static type checking for JavaScript.
- **MongoDB** - NoSQL database for storing user data and notes.
- **NextAuth.js** - Authentication library for Next.js applications.
- **Bcrypt** - Encrypt Passwords with bcrypt.

## Setup Instructions

Follow these steps to get the project up and running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/helsinfranz/notes.git
cd notes
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:

```bash
npm install
```

or, if you use Yarn:

```bash
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/your-database-name

# NextAuth.js Secret
NEXTAUTH_SECRET=your-nextauth-secret
```

### 4. Set Up MongoDB

Make sure you have MongoDB installed and running. You can follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/installation/) for instructions.

Create the necessary collections in your MongoDB database:

- `users` - For storing user credentials.
- `notes` - For storing notes.

### 5. Run the Development Server

Start the development server with:

```bash
npm run dev
```

or, if you use Yarn:

```bash
yarn dev
```

Navigate to `http://localhost:3000` in your browser to see the application in action.

## Folder Structure

- **`/components`** - React components used in the project.
- **`/context`** - Context providers for state management.
- **`/lib`** - Utility functions, such as database connections and authentication helpers.
- **`/pages`** - Next.js pages and API routes.
- **`/styles`** - CSS or Tailwind configuration.
- **`/public`** - Public assets, such as images.

## API Routes

- **`/api/getNotes`** - GET request to fetch notes from the database.
- **`/api/editNotes`** - POST request to edit existing notes.
- **`/api/deleteNotes`** - POST request to delete notes.
- **`/api/signup`** - POST request to create a new user.
- **`/api/addNotes`** - POST request to add a new note.

## Authentication

The project uses NextAuth.js for authentication with credentials provider. Make sure you configure the authentication settings correctly in `[...nextauth].ts`.

## Running the Project

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
npm run start
```

## Contributing

Feel free to open issues or pull requests for improvements. Please make sure to follow the coding standards and write clear commit messages.
