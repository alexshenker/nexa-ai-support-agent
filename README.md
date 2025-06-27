# AI Support Agent

Welcome to the AI Support Agent.
The agent will assist you in opening a ticket for any problem you may have!

## Demo

Try the live application: <u>[AI Support Agent](https://nexa-ai-support-agent.vercel.app/)</u>

## Local Development

1. Create a `.env` file in the project root directory

2. Add your OpenAI API key:

    ```
    OPENAI_API_KEY=your_api_key_here
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

## Usage

When you visit the home page ('/'), you will find:

-   Theme Toggle: Switch between light and dark mode
-   Portal Navigation: Access User portal, Admin portal, or return to Home

User Portal

-   Interact with the support AI which will help you open a ticket.

Admin Portal

-   Search tickets by typing anything in the search box.
-   Click on any of the column headers to sort by that column in either direction.
-   Click on any row to view and manage the ticket.

Usage Workflow

-   Navigate to the User portal
-   Interact with the AI to create a support ticket
-   awitch to the Admin portal to view and manage tickets
-   Use search and sort features to organize tickets
-   Click on specific tickets to handle them individually
