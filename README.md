# 🌱 Eco Shop E-commerce Microservice

A modern, scalable e-commerce platform built with microservices architecture using Node.js, TypeScript, and Prisma.

## 🚀 Features

- **Microservices Architecture**: Modular, scalable design with independent services
- **User Management**: Complete user authentication and profile management
- **API Gateway**: Centralized routing and request handling
- **Database Integration**: Prisma ORM with PostgreSQL support
- **Cloud Storage**: Cloudinary integration for image management
- **Email Services**: Password reset and notification system
- **TypeScript**: Full type safety and better developer experience

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│  User Service   │────│   Database      │
│   (Express)     │    │   (Node.js)     │    │   (Prisma)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
    ┌─────────┐            ┌─────────────┐
    │ Client  │            │ Cloudinary  │
    │ (Web)   │            │ (Images)    │
    └─────────┘            └─────────────┘
```

## 📁 Project Structure

```
eco-shop-ecommerce-microservice/
├── gateway/                 # API Gateway service
├── services/
│   └── user-service/       # User management microservice
├── shared/                 # Shared utilities and configurations
├── docker/                 # Docker configuration
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Containerization**: Docker

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eco-shop-ecommerce-microservice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   cd services/user-service
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the services**
   ```bash
   # Start API Gateway
   npm run start:gateway
   
   # Start User Service (in another terminal)
   cd services/user-service
   npm run dev
   ```

## 📚 API Documentation

### User Service Endpoints

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

## 🐳 Docker Support

See [docker/README.md](docker/README.md) for Docker setup instructions.

## 📖 Documentation

Comprehensive documentation is available in the [docs/](docs/) directory.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributors

- **BugBot AI** - Documentation improvements and code optimization
- [Add your name here]

## 🔧 Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset
```

## 📞 Support

If you have any questions or need help, please open an issue or contact the development team.

---

**Made with ❤️ for sustainable e-commerce**