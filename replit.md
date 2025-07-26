# ResumeMatch AI - Replit Project Guide

## Overview

ResumeMatch AI is an advanced AI-powered resume management platform that leverages natural language processing for intelligent resume parsing, job matching, and career insights. The application provides a comprehensive candidate management system with drag-and-drop resume uploads, automated skill extraction, and AI-powered job matching algorithms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe development
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with CSS custom properties for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: JWT tokens with bcrypt for password hashing
- **File Processing**: Multer for file upload handling with memory storage
- **API Design**: RESTful API with standardized error handling

### Database Layer
- **Primary Database**: MongoDB Atlas (cloud-hosted)
- **ODM**: Mongoose for schema-based data modeling
- **Connection**: Single connection string with retry logic and proper error handling
- **User Isolation**: All data operations are scoped by user ID for multi-tenant security

## Key Components

### Authentication System
- JWT-based authentication with 7-day token expiration
- Password hashing using bcrypt with salt rounds of 12
- Protected routes with middleware authentication
- User registration and login endpoints

### File Processing Pipeline
- **File Parser**: Handles PDF and DOCX resume parsing
- **NLP Processor**: Custom skill extraction engine with confidence scoring
- **Job Matcher**: AI-powered matching algorithm with multi-factor scoring

### Data Models
- **User**: Profile information, authentication credentials
- **Resume**: File metadata, extracted text, parsed skills, candidate information
- **JobPosting**: Job requirements, descriptions, company information
- **Match**: Relationship between resumes and jobs with scoring metrics

### UI Components
- **ResumeUpload**: Drag-and-drop interface with progress tracking
- **SkillExtraction**: Visual display of parsed technical, soft, and tool skills
- **JobInput**: Form for creating job postings with validation
- **MatchResults**: Comprehensive match analysis with status management
- **CandidateTable**: Interactive table for managing candidate pipeline

## Data Flow

### Resume Upload Flow
1. User uploads PDF/DOCX file via drag-and-drop interface
2. File is validated (type, size) and stored in memory
3. FileParser extracts raw text from document
4. NLPProcessor analyzes text to extract skills with confidence scores
5. Resume record is created in MongoDB with extracted data
6. UI updates with skill visualization and upload confirmation

### Job Matching Flow
1. User creates job posting with title, company, and description
2. System extracts required skills from job description
3. JobMatcher compares job requirements against existing resumes
4. Scoring algorithm calculates:
   - Technical Skills Match (50% weight)
   - Experience Level Match (30% weight)
   - Cultural Fit Score (20% weight)
5. Match records are created with comprehensive scoring data
6. Results displayed in candidate pipeline with status tracking

### Authentication Flow
1. User registers with email, password, and profile information
2. Password is hashed using bcrypt before storage
3. JWT token generated with user claims and 7-day expiration
4. Token stored in localStorage for subsequent requests
5. All API requests include Authorization header with Bearer token
6. Middleware validates tokens and attaches user context to requests

## External Dependencies

### Document Processing
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX document processing
- **multer**: File upload middleware

### UI and Styling
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **recharts**: Chart and data visualization

### Backend Services
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation and validation
- **mongoose**: MongoDB object modeling

## Deployment Strategy

### Development Environment
- Vite dev server with hot module replacement
- Express server with nodemon for auto-restart
- MongoDB Atlas connection for consistent data access
- TypeScript compilation for both client and server

### Production Build
- Vite builds optimized client bundle
- esbuild compiles server TypeScript to JavaScript
- Static assets served from dist/public directory
- Express serves both API routes and static files

### Environment Configuration
- MongoDB Atlas connection string for cloud database
- JWT secret for token signing
- Development vs production environment detection
- CORS configuration for cross-origin requests

### File Structure
```
client/          # React frontend application
server/          # Express backend API
shared/          # Shared TypeScript types and schemas
dist/           # Production build output
components.json  # shadcn/ui configuration
```

The application is designed for deployment on platforms like Replit, Vercel, or traditional cloud providers with proper environment variable configuration and database connectivity.