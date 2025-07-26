# ResumeMatch AI

> **Advanced AI-powered Resume Management Platform** that leverages Natural Language Processing for intelligent resume parsing, job matching, and career insights.

![ResumeMatch AI Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=ResumeMatch+AI+Dashboard)

## 🌟 Features

### 🎯 Intelligent Matching System
- **Smart Resume Parsing**: Automatically extracts skills, experience, and candidate information from PDF and DOCX files
- **Advanced Job Matching**: AI-powered algorithm that compares resume skills against job requirements
- **Multi-factor Scoring**: Comprehensive scoring based on technical skills (50%), experience (30%), and cultural fit (20%)
- **Real-time Analytics**: Dashboard with candidate pipeline statistics and match insights

### 📊 Comprehensive Candidate Management
- **Interactive Pipeline**: Visual candidate table with status tracking (Qualified, Under Review, Not Qualified)
- **Dynamic Filtering**: Filter candidates by job position, status, or match score
- **Candidate Profiles**: Detailed view of extracted skills, experience, and education
- **Export Capabilities**: Generate detailed candidate reports for hiring teams

### 🚀 Modern User Experience
- **Drag & Drop Upload**: Intuitive file upload interface for resumes
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Real-time Updates**: Live data updates without page refreshes
- **Professional UI**: Clean, modern interface built with shadcn/ui components

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** with shadcn/ui for modern, accessible UI components
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing
- **Vite** for fast development and optimized builds

### Backend
- **Node.js** with Express.js for robust API development
- **TypeScript** with ES modules for type safety
- **JWT Authentication** with bcrypt for secure user management
- **Drizzle ORM** with PostgreSQL for reliable data persistence
- **Custom NLP Engine** for skill extraction and text analysis

### Database & Infrastructure
- **PostgreSQL** for production-ready data storage
- **Drizzle ORM** for type-safe database operations
- **Neon Database** integration for scalable cloud deployment
- **Session Management** with secure cookie storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RiyaPatil28/resumematch-ai.git
   cd resumematch-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/resumematch_db?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
resumematch-ai/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend application
│   ├── services/           # Business logic services
│   │   └── nlp-processor.ts # NLP engine for skill extraction
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
└── drizzle.config.ts       # Database configuration
```

## 🎯 Usage Guide

### 1. **Upload Resumes**
   - Drag and drop PDF or DOCX files onto the upload area
   - System automatically extracts candidate information and skills
   - View extracted data in the resume details panel

### 2. **Create Job Postings**
   - Fill out job details including title, description, and requirements
   - System stores job for matching against uploaded resumes
   - Edit or delete job postings as needed

### 3. **Review Matches**
   - View candidate pipeline with match scores and status
   - Click on candidates to see detailed matching analysis
   - Update candidate status throughout the hiring process
   - Export candidate reports for team collaboration

### 4. **Manage Pipeline**
   - Filter candidates by position or status
   - Sort by match score or application date
   - Remove candidates or export detailed reports
   - Track hiring progress with dashboard analytics

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Resume Management
- `POST /api/resumes/upload` - Upload and parse resume
- `GET /api/resumes` - List user's resumes
- `GET /api/resumes/:id` - Get resume details
- `DELETE /api/resumes/:id` - Delete resume

### Job Management
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - List user's jobs
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting

### Matching System
- `POST /api/matches` - Create resume-job match
- `GET /api/matches` - List all matches
- `PATCH /api/matches/:id/status` - Update candidate status
- `DELETE /api/matches/:id` - Remove candidate
- `GET /api/matches/:id/export` - Export candidate report

## 🧠 NLP Engine

Our custom NLP processor extracts:

### Technical Skills
- Programming languages (JavaScript, Python, Java, etc.)
- Frameworks and libraries (React, Vue, Angular, etc.)
- Tools and platforms (Git, Docker, AWS, etc.)
- Databases (PostgreSQL, MongoDB, Redis, etc.)

### Soft Skills
- Leadership and communication abilities
- Problem-solving and analytical thinking
- Teamwork and collaboration skills
- Project management experience

### Experience Analysis
- Years of experience indicators
- Seniority level assessment
- Industry background
- Education and certifications

## 📊 Matching Algorithm

The system uses a sophisticated scoring algorithm:

1. **Technical Skills Match (50%)**: Direct comparison of required vs. possessed technical skills
2. **Experience Level (30%)**: Analysis of experience depth and relevance
3. **Cultural Fit (20%)**: Soft skills and communication indicators

Each factor is weighted and combined to produce an overall compatibility score from 0-100%.

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
Ensure production environment variables are configured:
- `DATABASE_URL`: Production PostgreSQL connection
- `JWT_SECRET`: Strong secret for token signing
- `NODE_ENV=production`

### Database Migration
```bash
npm run db:push
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Maintain consistent code formatting with Prettier
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Node.js](https://nodejs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM powered by [Drizzle](https://orm.drizzle.team/)
- Icons provided by [Lucide React](https://lucide.dev/)

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**ResumeMatch AI** - Revolutionizing the hiring process with intelligent resume analysis and job matching.