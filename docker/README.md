# 🐳 Docker Configuration

This directory contains Docker configuration files for the Eco Shop E-commerce Microservice platform.

## 📋 Overview

The Docker setup provides containerized deployment for all microservices, ensuring consistent environments across development, staging, and production.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                       │
├─────────────────┬─────────────────┬─────────────────────┤
│   API Gateway   │  User Service   │    PostgreSQL       │
│   Container     │   Container     │     Container       │
│   (Port 3000)   │   (Port 3001)   │    (Port 5432)      │
└─────────────────┴─────────────────┴─────────────────────┘
```

## 📁 Files

- `docker-compose.yml` - Main Docker Compose configuration
- `Dockerfile.gateway` - API Gateway container definition
- `Dockerfile.user-service` - User Service container definition
- `.env.docker` - Environment variables for Docker setup

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

### Running the Application

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd eco-shop-ecommerce-microservice
   ```

2. **Set up environment variables**
   ```bash
   cp .env.docker.example .env.docker
   # Edit .env.docker with your configuration
   ```

3. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the services**
   - API Gateway: http://localhost:3000
   - User Service: http://localhost:3001
   - PostgreSQL: localhost:5432

### Development Mode

For development with hot reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Service port | `3000` (gateway), `3001` (user-service) |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@db:5432/ecoshop` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `CLOUDINARY_URL` | Cloudinary configuration | Required for image uploads |

### Port Mapping

- **3000**: API Gateway
- **3001**: User Service
- **5432**: PostgreSQL Database
- **6379**: Redis (if enabled)

## 🛠️ Available Commands

### Basic Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f gateway
docker-compose logs -f user-service
```

### Database Commands

```bash
# Run database migrations
docker-compose exec user-service npx prisma migrate dev

# Generate Prisma client
docker-compose exec user-service npx prisma generate

# Access database shell
docker-compose exec db psql -U user -d ecoshop

# Reset database
docker-compose exec user-service npx prisma migrate reset
```

### Development Commands

```bash
# Install dependencies in running container
docker-compose exec gateway npm install
docker-compose exec user-service npm install

# Run tests
docker-compose exec user-service npm test

# Run linting
docker-compose exec user-service npm run lint
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database connection issues**
   ```bash
   # Check if database is running
   docker-compose ps
   # Check database logs
   docker-compose logs db
   ```

3. **Permission issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Debugging

```bash
# Access container shell
docker-compose exec gateway sh
docker-compose exec user-service sh

# Check container status
docker-compose ps

# View resource usage
docker stats
```

## 📊 Monitoring

### Health Checks

- API Gateway: `GET http://localhost:3000/health`
- User Service: `GET http://localhost:3001/health`

### Logs

```bash
# Follow all logs
docker-compose logs -f

# Follow specific service logs
docker-compose logs -f gateway
docker-compose logs -f user-service
docker-compose logs -f db
```

## 🚀 Production Deployment

### Production Configuration

1. **Use production environment variables**
   ```bash
   cp .env.production.example .env.production
   ```

2. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **Deploy with production settings**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Security Considerations

- Use secrets management for sensitive data
- Enable HTTPS in production
- Configure proper firewall rules
- Regular security updates
- Monitor container logs

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/docker)

## 🤝 Contributing

When contributing to Docker configuration:

1. Test your changes locally
2. Update documentation if needed
3. Ensure backward compatibility
4. Follow Docker best practices

---

**Contributed by BugBot AI** 🤖