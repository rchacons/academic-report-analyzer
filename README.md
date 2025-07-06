# Academic Report Analyzer

A platform for analyzing, comparing, and extracting insights from academic reports with a focus on CAPES reports (French academic evaluation reports). This project offers powerful tools for researchers, evaluators, and educational institutions to process and visualize academic data.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![NGINX](https://img.shields.io/badge/Server-NGINX-009639?style=flat&logo=nginx)](https://nginx.org/)

## 🚀 Features

- **Report Comparison**: Compare CAPES reports across different years to identify changes and trends
- **Bibliography Analysis**: Extract and analyze bibliographic references from academic documents
- **Related Concepts Mapping**: Visualize relationships between academic concepts using RDF processing
- **Secure Authentication**: JWT-based authentication system for secure access to the platform
- **Export Functionality**: Export analysis results in various formats for further processing
- **Responsive UI**: Modern Material UI design that works across desktop and mobile devices

## 🏗️ Architecture

The project follows a modern microservices architecture with clear separation of concerns:

### Backend

- Built with **FastAPI**, a modern, high-performance Python web framework
- Modular architecture with dedicated services for comparison, authentication, RDF processing, and exports
- JWT-based authentication with configurable security settings
- Advanced PDF and XLSX processing capabilities
- REST API with comprehensive documentation (via Swagger UI)

### Frontend

- Developed with **React** and **Vite** for fast rendering and development experience
- **Material UI** components for a consistent and professional user interface
- Multi-page application with dedicated views for different analysis types
- File upload capabilities with preview and validation
- Responsive design that works on both desktop and mobile devices

### Infrastructure

- **Docker** containerization for consistent deployment across environments
- **NGINX** reverse proxy with SSL termination for secure communication
- Production-ready configuration with proper error handling and logging
- Environment-based configuration for development and production setups

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Web framework
- **Poetry**: Dependency management
- **Uvicorn/Gunicorn**: ASGI servers
- **Python libraries**: For PDF processing, NLP, and data analysis

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **Material UI**: Component library
- **React Router**: Navigation

### Infrastructure
- **Docker & Docker Compose**: Containerization
- **NGINX**: Reverse proxy and static file serving
- **Let's Encrypt**: SSL certificates for production

## 🧑‍💻 Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.8+ (for local backend development)
- Poetry (for Python dependency management)

### Local Development with Docker

1. Clone the repository
```bash
git clone https://github.com/yourusername/academic-report-analyzer.git
cd academic-report-analyzer
```

2. Generate self-signed certificates for local HTTPS:
```bash
cd nginx/certs
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
cd ../..
```

3. Configure environment variables:
```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Frontend configuration
cp frontend/.env.example frontend/.env
# Edit frontend/.env with VITE_API_BASE_URL=https://localhost/api/v1
```

4. Start the application:
```bash
docker compose up
```

5. Access the application at https://localhost

### Manual Development Setup

#### Backend
```bash
cd backend
poetry install
poetry shell
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment

### Production Setup

1. Obtain SSL certificates for your domain:
```bash
sudo certbot certonly --standalone -d your-domain.com
```

2. Configure production environment variables

3. Deploy with Docker Compose:
```bash
sudo docker compose -f docker-compose-prod.yml up --build
```

## 👥 Contributors

- **Roberto Chacon** ([rchacons](https://github.com/rchacons)) - Backend architecture (FastAPI migration, Poetry dependency management), Infrastructure (Deployment setup, SSL encryption), Project management (Agile workflow, Kanban boards)
- **Manh-Huan Nguyen** ([manh-huan](https://github.com/manh-huan)) - Report comparison functionalities
- **Hugo Thomas** ([HugoThoma](https://github.com/HugoThoma)) - RDF processing, Concept mapping
- **Julien Perrier** - Frontend development, UI design
- **Tristan LE SAUX** - Report comparison functionalities, Result Export

## 📖 Documentation

The original documentation (in French) is available in [README.md.fr](README.md.fr).

API documentation is available at `/api/v1/docs` when the backend is running.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
