# ResumeMatch AI

## Overview

ResumeMatch AI is an advanced AI-powered resume management platform that leverages Natural Language Processing for intelligent resume parsing, job matching, and career insights. The application provides a comprehensive solution for recruiters and hiring managers to efficiently analyze resumes, create job postings, and match candidates using sophisticated scoring algorithms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack TypeScript Application
The application is built as a full-stack TypeScript solution using modern web technologies. The architecture follows a clean separation between client and server with shared type definitions for consistent data modeling across the entire stack.

**Problem Addressed**: Need for type safety and consistency across frontend and backend
**Solution Chosen**: Monorepo structure with shared TypeScript schemas
**Rationale**: Reduces runtime errors, improves developer experience, and ensures data consistency

### Frontend Architecture
- **React 18** with TypeScript for component-based UI development
- **Tailwind CSS** with shadcn/ui components for modern, accessible design system
- **TanStack Query** for efficient server state management and caching
- **Wouter** for lightweight client-side routing
- **Vite** for fast development builds and hot module replacement

**Problem Addressed**: Need for modern, responsive UI with good developer experience
**Solution Chosen**: React ecosystem with modern tooling
**Alternatives Considered**: Vue.js, Angular
**Pros**: Large ecosystem, excellent TypeScript support, fast development
**Cons**: Bundle size can be larger than alternatives

### Backend Architecture
- **Express.js** with TypeScript for RESTful API development
- **Mongoose ODM** for MongoDB schema modeling and validation
- **JWT Authentication** with bcrypt for secure session management
- **Custom NLP Engine** for resume parsing and skill extraction
- **Multer** for file upload handling

**Problem Addressed**: Need for robust API with file processing capabilities
**Solution Chosen**: Express.js with custom NLP processing
**Rationale**: Mature ecosystem, excellent middleware support, flexibility for custom AI processing

## Key Components

### Authentication System
- JWT-based stateless authentication
- bcrypt password hashing for security
- User isolation ensuring data privacy across accounts
- Role-based access patterns (recruiter role)

### Resume Processing Engine
- **File Parser**: Handles PDF and DOCX resume uploads using pdf.js and mammoth
- **NLP Processor**: Custom skill extraction engine that identifies technical, soft, and tool skills
- **Confidence Scoring**: Each extracted skill includes confidence percentage
- **Real-time Processing**: Immediate feedback during upload process

### Job Matching Algorithm
- **Multi-factor Scoring**: Technical skills (50%), experience (30%), cultural fit (20%)
- **Skill Comparison**: Intelligent matching between resume skills and job requirements
- **Status Management**: Qualified, Under Review, Not Qualified candidate states
- **Match Analytics**: Detailed insights into candidate-job compatibility

### File Upload System
- Drag-and-drop interface with progress tracking
- 10MB file size limit with type validation
- Real-time processing feedback
- Secure file handling with multer middleware

## Data Flow

### Resume Upload Flow
1. User uploads PDF/DOCX file via drag-and-drop interface
2. Multer middleware validates file type and size
3. File Parser extracts raw text content
4. NLP Processor analyzes text for skills, experience, education
5. Resume data stored in MongoDB with extracted metadata
6. Real-time feedback provided to user interface

### Job Matching Flow
1. User creates job posting with requirements
2. System compares job requirements against stored resumes
3. Matching algorithm calculates compatibility scores
4. Match records created with detailed scoring breakdown
5. Results displayed in candidate pipeline with filtering options

### Authentication Flow
1. User credentials validated against MongoDB user collection
2. JWT token generated with user information and permissions
3. Token stored in localStorage for session persistence
4. All API requests include Authorization header for validation
5. Middleware verifies token and extracts user context

## External Dependencies

### Database
- **MongoDB Atlas**: Cloud-native document database for scalable data storage
- **Connection**: Direct connection string with retry logic and timeout handling
- **Schema Management**: Mongoose ODM for structured data modeling

### File Processing Libraries
- **pdf.js**: Client-side PDF text extraction
- **mammoth**: DOCX document processing
- **multer**: Express middleware for multipart/form-data handling

### UI Component Libraries
- **Radix UI**: Accessible component primitives for shadcn/ui
- **Lucide React**: Icon library with consistent design
- **Recharts**: Chart library for analytics visualization

### Development Tools
- **Vite**: Fast build tool with HMR support
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Deployment Strategy

### Production Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: ESBuild bundles Node.js server with external dependencies
3. **Type Checking**: TypeScript compiler validates all code before build
4. **Asset Optimization**: Vite optimizes CSS, JavaScript, and static assets

### Environment Configuration
- **Development**: tsx for hot reloading with MongoDB Atlas connection
- **Production**: Node.js server serving static frontend with API routes
- **Database**: MongoDB Atlas cloud database with connection pooling

### File Structure
- `client/` - React frontend application with components and pages
- `server/` - Express.js backend with API routes and services
- `shared/` - Common TypeScript schemas and types
- `dist/` - Production build output directory

The application uses a monorepo structure with clear separation of concerns, making it easy to maintain and scale. The MongoDB integration provides flexible document storage suitable for varying resume formats and job posting structures.