# Vercel Clone - Microservices

A microservices-based platform for deploying web applications, similar to Vercel.

## Environment Setup

This project uses environment variables to manage sensitive configuration data. Follow these steps to set up your environment:

### 1. Install Dependencies

For each service, install the required dependencies:

```bash
# Build Service
cd build-service
npm install

# Deployment Gateway
cd ../deployment-gateway
npm install

# S3 Proxy Service
cd ../s3_proxy-service
npm install
```

### 2. Environment Variables

Create `.env` files in each service directory based on the `.env.example` templates:

#### Required Environment Variables:

**AWS Configuration:**
- `AWS_ACCESS_KEY_ID` - Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret access key
- `AWS_REGION` - AWS region (default: us-east-1)

**Redis Configuration:**
- `REDIS_URL` - Redis connection string (Upstash Redis URL)

**ECS Configuration (for deployment-gateway):**
- `ECS_CLUSTER_ARN` - Amazon ECS cluster ARN
- `ECS_TASK_DEFINITION_ARN` - ECS task definition ARN
- `ECS_SUBNET_1` - First subnet ID for ECS tasks
- `ECS_SUBNET_2` - Second subnet ID for ECS tasks
- `ECS_SECURITY_GROUP` - Security group ID for ECS tasks

**Other Configuration:**
- `PROJECT_ID` - Project identifier (for build-service)
- `PORT` - Server port (default: 9000 for deployment-gateway)

### 3. Copy Example Files

```bash
# Root level (optional, contains all variables)
cp .env.example .env

# Build Service
cd build-service
cp .env.example .env
# Edit the .env file and add your actual values

# Deployment Gateway
cd ../deployment-gateway
cp .env.example .env
# Edit the .env file and add your actual values
```

### 4. Security Notes

- **Never commit `.env` files to version control**
- The `.env.example` files contain placeholder values and are safe to commit
- All `.env*` files are automatically ignored by git
- Make sure to set up proper IAM permissions for your AWS credentials

### 5. Running the Services

```bash
# Build Service
cd build-service
node script.js

# Deployment Gateway
cd deployment-gateway
npm run dev

# S3 Proxy Service
cd s3_proxy-service
npm start
```

## Architecture

- **build-service**: Handles building and deploying projects using AWS S3 and ECS
- **deployment-gateway**: Manages deployment requests and ECS task orchestration
- **s3_proxy-service**: Serves deployed applications from S3
- **client**: Frontend application

## Security Improvements

This codebase has been updated to remove hardcoded credentials and use environment variables instead. All sensitive data should now be provided through environment variables rather than being embedded in the source code. 