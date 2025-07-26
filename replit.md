# ResumeMatch AI - Resume Analysis and Job Matching System

## Overview

ResumeMatch AI is a full-stack web application that automatically analyzes resumes and matches them with job postings using NLP processing. The system extracts skills from uploaded resumes, compares them against job requirements, and provides detailed matching scores and insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **File Upload**: Native HTML5 file upload with drag-and-drop support
- **UI Components**: Comprehensive set of accessible components from Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **File Processing**: PDF parsing (pdf-parse) and DOCX parsing (mammoth)
- **NLP Processing**: Custom rule-based skill extraction system
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware

### Database Strategy
- **Current**: In-memory storage implementation for development
- **Planned**: PostgreSQL with Drizzle ORM (configured but not yet implemented)
- **Schema**: Three main entities - resumes, job postings, and matches with foreign key relationships

## Key Components

### File Processing Pipeline
1. **Upload Handler**: Multer middleware for file upload with type validation (PDF, DOCX)
2. **File Parser**: Extracts raw text from uploaded documents
3. **NLP Processor**: Analyzes text to extract technical skills, soft skills, and tools
4. **Job Matcher**: Compares extracted skills against job requirements and calculates compatibility scores

### Matching Algorithm
- **Technical Score** (50% weight): Direct skill matching between resume and job requirements
- **Experience Score** (30% weight): Analysis of experience level indicators
- **Cultural Fit Score** (20% weight): Soft skills and communication indicators
- **Output**: Overall score, matched skills, missing skills, strengths, and concerns

### User Interface Components
- **Dashboard**: Overview with statistics and recent activity
- **Resume Upload**: Drag-and-drop interface with progress indicators
- **Skill Extraction Display**: Visual representation of extracted skills by category
- **Job Input Form**: Create new job postings with requirements
- **Match Results**: Detailed analysis with scores and recommendations
- **Candidate Table**: Sortable table of all matches with status management

## Data Flow

1. **Resume Upload**: User uploads PDF/DOCX → File parsing → Text extraction → NLP analysis → Skill categorization → Database storage
2. **Job Creation**: User inputs job details → Validation → Database storage
3. **Matching Process**: Resume + Job → Skill comparison → Score calculation → Match record creation
4. **Status Management**: Users can update candidate status (qualified/under_review/not_qualified)

## External Dependencies

### Core Libraries
- **Database**: Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- **File Processing**: pdf-parse, mammoth for document parsing
- **UI Framework**: Extensive Radix UI component ecosystem
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with class-variance-authority for component variants

### Development Tools
- **Build System**: Vite for frontend bundling, esbuild for backend
- **Type Safety**: TypeScript with strict configuration
- **Development**: tsx for TypeScript execution, hot module replacement

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Unified Output**: Single dist directory for deployment

### Environment Requirements
- **Database**: PostgreSQL instance (configured for Neon Database)
- **File Storage**: Server memory (current) or cloud storage (future)
- **Runtime**: Node.js environment with ES module support

### Scaling Considerations
- **Database Migration**: Ready to switch from in-memory to PostgreSQL
- **File Processing**: Async processing pipeline ready for queue system
- **Caching**: TanStack Query provides client-side caching
- **API Rate Limiting**: Ready for implementation with Express middleware

The application is designed as a monorepo with clear separation between client and server code, shared type definitions, and a scalable architecture that can grow from prototype to production.