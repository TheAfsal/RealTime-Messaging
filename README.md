# RealTime-Messaging 

Hey Welcome, This application implements a bidirectional communication system using a NestJS backend with RabbitMQ for message queuing, enabling real-time communication between two clients (Client A and Client B). The frontend can be built with React or Vue, and the entire stack is designed to be hosted on Render.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Deployment on Render](#deployment-on-render)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- Real-time bidirectional messaging between Client A and Client B.
- RabbitMQ integration for durable message queuing.
- WebSocket support for live updates.
- Environment variable configuration for flexibility.
- Hosted on Render with private networking for RabbitMQ.

## Prerequisites
- **Node.js** (v18.x or later recommended)
- **npm** or **yarn**
- **Docker** (for local RabbitMQ)
- **Git**
- A Render account (for deployment)
- GitHub account (for hosting code)

## Project Structure
```
project/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── client-a/     # Client A module
│   │   ├── client-b/     # Client B module
│   │   ├── gateway/      # WebSocket gateway
│   │   ├── main.ts       # Application entry point
│   │   └── app.module.ts # Root module
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/             # React or Vue frontend
│   ├── src/
│   │   ├── components/   # ClientPanel component
│   │   └── services/     # API service (e.g., api.ts)
│   ├── .env              # Environment variables
│   └── vite.config.js    # Vite configuration (if using Vue)
└── docker-compose.yml    # Local RabbitMQ setup
```

## Installation

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd GwayTech/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` to `.env` and configure the environment variables (see [Configuration](#configuration)).

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd GwayTech/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` to `.env` and configure the environment variables (see [Configuration](#configuration)).

## Configuration
Create a `.env` file in both `backend` and `frontend` directories based on the example `.env.example` (create one if not present). Example configurations:

### Backend .env
```
RABBITMQ_URL=amqp://admin:your_secure_password@rabbitmq-4-management-n4hj:5672
RABBITMQ_QUEUE_A=to-clientA
RABBITMQ_QUEUE_B=to-clientB
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### Frontend .env (React)
```
REACT_APP_WEBSOCKET_URL=http://localhost:3001
REACT_APP_API_URL=http://localhost:3001
```

### Frontend .env (Vue with Vite)
```
VITE_WEBSOCKET_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001
```

- Replace `your_secure_password` with the password set for the RabbitMQ admin user.
- Update URLs for Render hosting after deployment (e.g., `wss://your-backend.onrender.com`).

## Running Locally
1. **Start RabbitMQ Locally**:
   Use Docker Compose to run RabbitMQ:
   ```bash
   cd GwayTech
   docker-compose up -d
   ```
   Access the management UI at `http://localhost:15672` (default credentials: `guest:guest`).

2. **Run Backend**:
   ```bash
   cd GwayTech/backend
   npm run start:dev
   ```

3. **Run Frontend**:
   For React:
   ```bash
   cd GwayTech/frontend
   npm start
   ```
   For Vue:
   ```bash
   cd GwayTech/frontend
   npm run dev
   ```

4. Open `http://localhost:5173` (or the port specified in `.env`) in your browser to see the frontend.

## Deployment on Render

### Prerequisites
- Fork this repository to your GitHub account.
- Create a Render account and link it to GitHub.

### Deploy RabbitMQ
1. Create a new Web Service on Render.
2. Connect your repository and select the branch.
3. Configure:
   - **Instance Type**: Web Service
   - **Runtime**: Docker
   - **Build Command**: `docker build -t rabbitmq-app .`
   - **Start Command**: `docker run -d --name rabbitmq rabbitmq:4-management`
   - **Environment**:
     ```
     RABBITMQ_DEFAULT_USER=admin
     RABBITMQ_DEFAULT_PASS=your_secure_password
     ```
   - **Disk**: Attach a 1GB persistent disk.
4. Deploy and note the internal hostname.

## Usage
- Access the frontend at the Render URL (e.g., `http://localhost:5173`).
- Send messages from Client A or Client B panels to see real-time updates via WebSocket and RabbitMQ queues.

## Troubleshooting
- **RabbitMQ Connection Issues**: Ensure the `RABBITMQ_URL` is correct and the service is running. Check Render logs for errors.
- **WebSocket Connection Fails**: Verify the `CORS_ORIGIN` in the backend `.env` matches the frontend URL.
- **Frontend Not Loading**: Confirm the build output is in the `dist` directory and the Render publish directory is set correctly.

## Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

## License
This project is licensed under the MIT License.
