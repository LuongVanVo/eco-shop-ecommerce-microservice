# ⚙️ Shared Configuration

This directory contains shared configuration files, utilities, and core components used across all microservices in the Eco Shop E-commerce platform.

## 📁 Directory Structure

```
shared/
├── config/           # Configuration files and environment setup
├── core/            # Core utilities and base classes
└── utils/           # Shared utility functions and helpers
```

## 🔧 Configuration Files

### Environment Configuration

The shared configuration system provides a centralized way to manage environment variables and application settings across all services.

#### Available Configurations

- **Database Configuration**: Connection strings, pool settings, and migration configs
- **Authentication**: JWT secrets, token expiration, and security settings
- **External Services**: Cloudinary, email service, and third-party API configurations
- **Logging**: Log levels, formats, and output destinations
- **Caching**: Redis configuration and cache policies

### Usage Example

```typescript
import { config } from '../shared/config';

// Access configuration values
const dbUrl = config.database.url;
const jwtSecret = config.auth.jwtSecret;
const cloudinaryUrl = config.cloudinary.url;
```

## 🏗️ Core Components

### Error Handling

Centralized error handling with custom error classes and response formatting:

```typescript
import { ErrorResponse } from '../shared/core/error.response';
import { SuccessResponse } from '../shared/core/success.response';

// Error response
throw new ErrorResponse('User not found', 404);

// Success response
return new SuccessResponse(data, 'User created successfully', 201);
```

### HTTP Status Codes

Standardized HTTP status codes and reason phrases:

```typescript
import { StatusCodes, ReasonPhrases } from '../shared/utils';

// Use predefined status codes
res.status(StatusCodes.OK).json(data);
res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND });
```

## 🛠️ Utility Functions

### Common Utilities

- **Data Transformation**: Object mapping and data formatting
- **Validation**: Input validation and sanitization
- **Formatting**: Date, currency, and text formatting
- **Crypto**: Hashing, encryption, and token generation
- **HTTP**: Request/response helpers and middleware

### Usage Examples

```typescript
import { 
  getInfoData, 
  hashPassword, 
  generateToken,
  validateEmail 
} from '../shared/utils';

// Get specific data fields
const userInfo = getInfoData(user, ['id', 'email', 'name']);

// Hash password
const hashedPassword = await hashPassword('password123');

// Generate JWT token
const token = generateToken({ userId: user.id }, '1h');

// Validate email
const isValidEmail = validateEmail('user@example.com');
```

## 🔐 Security Features

### Authentication & Authorization

- JWT token generation and validation
- Password hashing with bcrypt
- Role-based access control utilities
- Session management helpers

### Data Protection

- Input sanitization and validation
- SQL injection prevention
- XSS protection utilities
- CSRF token handling

## 📊 Logging & Monitoring

### Centralized Logging

```typescript
import { logger } from '../shared/utils/logger';

// Different log levels
logger.info('User logged in successfully');
logger.warn('Rate limit exceeded');
logger.error('Database connection failed');
logger.debug('Processing request data');
```

### Performance Monitoring

- Request timing utilities
- Memory usage tracking
- Database query monitoring
- Error rate tracking

## 🧪 Testing Utilities

### Test Helpers

- Mock data generators
- Test database setup
- API testing utilities
- Assertion helpers

```typescript
import { 
  createTestUser, 
  generateMockData,
  setupTestDatabase 
} from '../shared/utils/test-helpers';

// Create test data
const testUser = await createTestUser();
const mockData = generateMockData('user', 10);
```

## 🔄 Migration & Versioning

### Database Migrations

Shared migration utilities and version management:

```typescript
import { runMigrations, rollbackMigration } from '../shared/config/database';

// Run all pending migrations
await runMigrations();

// Rollback specific migration
await rollbackMigration('20240101000000_add_user_table');
```

### Configuration Versioning

- Environment-specific configurations
- Feature flag management
- Configuration validation
- Hot-reload support

## 📈 Performance Optimization

### Caching Strategy

- Redis integration
- Memory caching utilities
- Cache invalidation helpers
- Performance metrics

### Database Optimization

- Connection pooling
- Query optimization utilities
- Index management
- Transaction helpers

## 🚀 Deployment Support

### Environment Management

- Development, staging, and production configs
- Docker environment variables
- Kubernetes configuration
- CI/CD pipeline support

### Health Checks

```typescript
import { healthCheck } from '../shared/utils/health-check';

// Comprehensive health check
const health = await healthCheck({
  database: true,
  redis: true,
  externalServices: ['cloudinary', 'email']
});
```

## 📚 API Documentation

### Configuration API

- `GET /config/health` - Configuration health status
- `GET /config/version` - Configuration version info
- `POST /config/reload` - Reload configuration (admin only)

### Utility Endpoints

- `POST /utils/validate` - Validate input data
- `POST /utils/format` - Format data according to schema
- `GET /utils/status` - System status and metrics

## 🔧 Development Guidelines

### Adding New Configurations

1. **Define the configuration schema**
2. **Add validation rules**
3. **Update environment variable documentation**
4. **Add tests for the new configuration**
5. **Update this README**

### Best Practices

- Use TypeScript interfaces for configuration types
- Validate all configuration values at startup
- Provide sensible defaults for optional configurations
- Document all configuration options
- Use environment-specific overrides

## 🧪 Testing

### Configuration Tests

```bash
# Run configuration tests
npm test -- --grep "configuration"

# Test specific configuration
npm test -- --grep "database config"
```

### Integration Tests

```bash
# Test shared utilities
npm test -- --grep "shared utils"

# Test core components
npm test -- --grep "core components"
```

## 📞 Support

For questions about shared configuration:

- **Documentation**: Check the inline code documentation
- **Issues**: Create an issue for bugs or feature requests
- **Discussions**: Use GitHub discussions for questions

## 🔄 Changelog

### Version 1.0.0
- Initial shared configuration setup
- Core error handling and response utilities
- Basic logging and monitoring
- Database configuration management

---

**Contributed by BugBot AI** 🤖

*This shared configuration system ensures consistency and maintainability across all microservices.*