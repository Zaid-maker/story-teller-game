# Adventure Quest

Welcome to Adventure Quest, an interactive text-based adventure game where your choices shape your journey. Track your score, compete with friends on the live leaderboard, and customize your profile.

 
*Note: You can replace the above image link with a real screenshot of your app!*

## Features

-   **Interactive Story:** Navigate a branching narrative where your decisions determine the outcome.
-   **User Authentication:** Secure sign-up and login functionality.
-   **User Profiles:** Customize your profile with a username and a unique avatar.
-   **Scoring System:** Earn points based on the choices you make in your adventure.
-   **Live Leaderboard:** See how your high score ranks against other players in real-time.
-   **Theme Toggle:** Switch between light and dark modes for comfortable viewing.

## Tech Stack

This project is built with a modern, full-stack TypeScript setup:

-   **Frontend:**
    -   [React](https://react.dev/) with [Vite](https://vitejs.dev/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/) for styling
    -   [shadcn/ui](https://ui.shadcn.com/) for UI components
    -   [React Router](https://reactrouter.com/) for client-side routing
-   **Backend (BaaS):**
    -   [Supabase](https://supabase.com/) for Database, Authentication, and Storage.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm (or your package manager of choice)
-   A free [Supabase](https://supabase.com/) account

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your Supabase project:**
    -   Go to [Supabase](https://app.supabase.com) and create a new project.
    -   Navigate to the SQL Editor in the Supabase dashboard.
    -   You will need to run the SQL queries to set up the `profiles` and `game_scores` tables, along with their Row Level Security (RLS) policies and the function to handle new user signups. You can find these in your Dyad chat history or by inspecting the database schema.

4.  **Set up environment variables:**
    -   Create a new file named `.env` in the root of your project.
    -   Copy the contents of `.env.example` into your new `.env` file.
    -   Go to your Supabase project's **Settings > API** page.
    -   Find your **Project URL** and **anon (public) key** and paste them into your `.env` file:
        ```env
        VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
        VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
        ```

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application should now be running on `http://localhost:8080`.

## Deployment

This application is ready to be deployed on platforms like Vercel or Netlify.

When deploying, make sure to add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in your deployment provider's project settings. This ensures your application can securely connect to Supabase in production.