# EduCRM Frontend

Web interface for the Educational Center Management System. Built with Next.js (React) to interact with the EduCRM Go backend.

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- EduCRM Backend running on port `8080`

## Configuration

Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Ensure the API URL points to your running backend instance:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Running the Application

### Option A: Local Development (Recommended for coding)
Install dependencies and run the Next.js development server with Hot Module Replacement:
```bash
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

### Option B: Docker Deployment (Production build)
To run the fully compiled standalone Next.js application in a container:
```bash
docker compose up -d --build
```
To stop the container:
```bash
docker compose down
```

## Next.js Configuration Note
This project uses the Next.js `standalone` output feature to drastically reduce the Docker image size. Ensure `output: 'standalone'` remains in `next.config.js`.

## Cross-Origin Resource Sharing (CORS)
Ensure that the backend is configured to accept requests from `http://localhost:3000` (or your specific production domain) to prevent CORS policy errors during client-side fetching.

---

© 2026 Danil Xlussov

