# Hostify - Microservices

A production-ready microservices-based platform for deploying web applications, built with modern cloud infrastructure and container orchestration.

## Project Overview

Hostify is a **full-stack cloud deployment platform** that automates the entire CI/CD pipeline for web applications. Similar to Vercel, it allows developers to deploy their projects by simply providing a Git repository URL, with automatic building, containerization, and hosting.

### Key Features

- **🚀 One-click Deployment**: Deploy any web application from a Git repository URL
- **📦 Automated Build Pipeline**: Containerized builds using AWS ECS Fargate
- **⚡ Real-time Monitoring**: Live build logs via WebSocket connections
- **🌐 Global CDN**: Static file serving through AWS S3 with custom domains
- **🔄 Microservices Architecture**: Scalable, distributed system design
- **🔒 Security-First**: Environment-based configuration with no hardcoded credentials

### AWS Technology Stack

**Core AWS Services:**
- **Amazon ECS (Fargate)**: Serverless container orchestration for build tasks
- **Amazon S3**: Static website hosting and asset storage
- **Amazon VPC**: Custom networking with subnets and security groups
- **AWS IAM**: Fine-grained access control and permissions

**Infrastructure Components:**
- **ECS Cluster**: Manages containerized build environments
- **Task Definitions**: Defines build container specifications
- **Fargate Launch Type**: Serverless container execution
- **Application Load Balancer**: Traffic distribution and health checks
- **CloudWatch**: Logging and monitoring (integrated)

**Additional Technologies:**
- **Redis (Upstash)**: Real-time messaging and caching
- **Docker**: Containerization of build environments
- **Node.js**: Backend microservices
- **TypeScript**: Type-safe development
- **Next.js**: Modern React framework for frontend
- **Socket.io**: Real-time communication

### Architecture Highlights

**Microservices Design:**
- **Build Service**: Handles Git cloning, dependency installation, and project compilation
- **Deployment Gateway**: Orchestrates ECS tasks and manages deployment lifecycle  
- **S3 Proxy Service**: Serves deployed applications with custom routing
- **Client Interface**: React-based dashboard for project management

**DevOps & Cloud Engineering:**
- **Container Orchestration**: ECS Fargate for scalable, serverless builds
- **Infrastructure as Code**: Reproducible AWS resource provisioning
- **Environment Management**: Multi-environment support (dev/test/prod)
- **Security Best Practices**: Credential management via environment variables
- **Monitoring & Logging**: Real-time build status and error tracking

### Technical Achievements

- **Scalable Architecture**: Handles multiple concurrent deployments
- **Zero-Downtime Deployments**: Blue-green deployment strategies
- **Cost Optimization**: Serverless Fargate reduces infrastructure costs
- **Developer Experience**: Simple Git-to-production workflow
- **Real-time Updates**: Live build progress via WebSocket connections
- **Security Compliance**: No hardcoded secrets, proper IAM roles

This project demonstrates proficiency in **cloud architecture, containerization, microservices, and full-stack development** using industry-standard AWS services.

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