# Print Tracker

Print Tracker is a full-stack application for tracking print jobs in architecture studios. It includes:

- **Server** – Express API and React client served from the same Node process
- **Client** – React frontend built with Vite
- **Print Monitor** – Windows utility that validates print jobs and logs them to the API

## Requirements
- Node.js 18+
- PostgreSQL database
- .NET Framework for building the Windows utility

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL` – connection string for your Postgres database
   - `PORT` – port for the API and client (defaults to `5000`)
3. Push the database schema with Drizzle:
   ```bash
   npm run db:push
   ```
4. Start the application in development mode:
   ```bash
   npm run dev
   ```
   The server and client will be available at `http://localhost:PORT`.

For production, build and start:
```bash
npm run build
npm start
```

## Windows Print Monitor
The `print-monitor` folder contains a Windows application that validates print jobs and sends log data to the server. Configure the API URL via the `PRINTTRACK_API_URL` environment variable (defaults to `http://localhost:5000`).

Build the utility with Visual Studio or the `csc` command:
```bash
csc PrintMonitor.cs
```

## Running Tests
A basic test suite is included using Vitest. Run all tests with:
```bash
npm test
```
