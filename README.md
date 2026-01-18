# Tero - AI-Powered ATS Resume Analyzer

> **Tero analyzes your resume and highlights what matters — making optimization easier, faster, and more effective.**

Tero is an intelligent resume scoring system that helps job seekers understand how their resumes perform against Applicant Tracking Systems (ATS). By comparing your resume with specific job descriptions, Tero provides detailed insights, actionable recommendations, and a clear path to improvement.

## 🎯 What is Tero?

Tero is an AI-powered ATS resume scoring system that goes beyond simple score calculations. Instead of just giving you a number, Tero provides:

- **Detailed analysis** of what's working and what needs improvement
- **Job-specific insights** by comparing your resume against actual job descriptions
- **Actionable recommendations** with before/after examples
- **ATS compatibility checks** to ensure your resume gets past automated filters

## ✨ Key Features

### 🔍 Live Content Analysis

- Identifies missing skills, certifications, and employer-preferred phrases
- Compares resume language against industry standards
- Paste any job description to evaluate fit precisely

### ⚙️ ATS Compatibility Checks

- Detects formatting problems (unsupported fonts, tables, headers)
- Identifies issues that affect ATS parsing
- Provides automated fixes for common problems

### 💡 Simple, Practical Tips

- Guidance on section order, bullet style, and resume length
- Explains what recruiters look for
- Instant, applicable fixes

### 📊 Comprehensive Analysis Dashboard

**Three-Tab Interface:**

#### 1. Strengths Tab

- Highlights what's strong in your resume
- Explains why each strength matters
- Shows the advantage you have over other candidates

#### 2. Weaknesses Tab

- Identifies issues in your resume
- Explains typical mistakes
- Provides better approaches
- Shows ATS impact and difficulty level for each fix

#### 3. Action Plan Tab

- Prioritized list of fixes
- Before/after examples for each recommendation
- Expected outcomes
- Impact level indicators (High/Medium/Low)

## 🛠️ Tech Stack

### Frontend

- **React** with **TypeScript** - Component-based UI with type safety
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

### Backend

- **Node.js** with **Express** - RESTful API server
- **JavaScript** - Backend scripting language
- Rule-based scoring system with JSON configuration files

### AI Integration

- External LLM API for resume analysis and scoring
- Natural language processing for keyword matching
- Content analysis and recommendation generation

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/iamayushkarma/Tero
cd tero
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd ../Backend
npm install
```

3. **Environment Setup**

Create `.env` files in both Frontend and Backend directories:

**Backend `.env`:**

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://192.168.x.x:5173
GROQ_API_KEY=your_llm_api_key
```

**Frontend `.env`:**

```env
VITE_BACKEND_API_PORT=5000
```

4. **Run the application**

```bash
# Run both frontend and backend concurrently (from root)
npm run dev

# Or run separately:

# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

The application will be available at:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## 📁 Project Structure

```
Tero/
├── Backend/                    # Backend Node.js application
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── healthcheck.controller.js
│   │   │   └── resume.controller.js
│   │   ├── db/                 # Database configuration
│   │   ├── middlewares/        # Custom middleware
│   │   │   ├── multer.middleware.js
│   │   │   └── tokenValidation.middleware.js
│   │   ├── routes/             # API routes
│   │   │   ├── healthcheck.route.js
│   │   │   └── resume.route.js
│   │   ├── rules/              # Scoring and analysis rules
│   │   │   ├── formatting.rules.json
│   │   │   ├── keyword.rules.json
│   │   │   ├── scoring.weights.json
│   │   │   └── section.rules.json
│   │   ├── services/           # Business logic
│   │   │   ├── aiEvaluation.js
│   │   │   ├── atsScoring.js
│   │   │   ├── formattingAnalyzer.js
│   │   │   ├── keywordMatcher.js
│   │   │   ├── resumeParser.js
│   │   │   └── sectionDetector.js
│   │   ├── utils/              # Helper functions
│   │   │   ├── api-error.js
│   │   │   ├── api-response.js
│   │   │   ├── async-handler.js
│   │   │   ├── docxToPdf.js
│   │   │   └── tokenManager.js
│   │   ├── app.js              # Express app setup
│   │   └── index.js            # Entry point
│   ├── .env
│   ├── package-lock.json
│   └── package.json
│
├── Frontend/                   # Frontend React application
│   ├── public/
│   │   ├── assets/             # Images, SVGs, static files
│   │   │   ├── ATSScore.svg
│   │   │   ├── ExperienceScoring.svg
│   │   │   ├── FormattingCheck.svg
│   │   │   ├── KeywordMatching.svg
│   │   │   ├── SectionAnalysis.svg
│   │   │   ├── ats-summary-icon.svg
│   │   │   ├── mr-stark-resume.svg
│   │   │   ├── resume-mistakes.svg
│   │   │   ├── resume-number.svg
│   │   │   ├── resume-score-improvement.svg
│   │   │   ├── resume-score.svg
│   │   │   ├── resume-suggestion.svg
│   │   │   ├── stark-plain-resume.svg
│   │   │   └── undraw_files-uploading_qf8u.svg
│   │   └── icons/
│   │       └── tero-fav-icon.png
│   ├── src/
│   │   ├── assets/
│   │   │   └── logos/
│   │   │       ├── Tero-dark.png
│   │   │       └── Tero-icon.png
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   ├── Footer/
│   │   │   │   └── Navbar/
│   │   │   ├── modules/        # Major section components
│   │   │   │   ├── AIScoringExplanation.tsx
│   │   │   │   ├── FAQSection.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── Modules.css
│   │   │   │   ├── ResumeAnalysisResult.tsx
│   │   │   │   ├── StartResumeScan.tsx
│   │   │   │   └── WhyTeroStandsOut.tsx
│   │   │   └── ui/              # Reusable UI components
│   │   │       ├── DocxPreview.tsx
│   │   │       ├── FileUploder.tsx
│   │   │       ├── HeroBadge.tsx
│   │   │       ├── PdfPreview.tsx
│   │   │       ├── ProgressBar.tsx
│   │   │       ├── ResumeAnalysisDisplay.tsx
│   │   │       ├── ResumeLoading.tsx
│   │   │       ├── SearchBox.tsx
│   │   │       └── common.css
│   │   ├── context/            # React Context
│   │   │   ├── ResumeAnalysisContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useResumeAnalysis.tsx
│   │   │   └── useThemeContext.tsx
│   │   ├── layout/
│   │   │   └── MainLayout.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home/
│   │   │   │   └── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Guide.tsx
│   │   │   ├── PrivacyPolicyPage.tsx
│   │   │   ├── ResumeOptimization.tsx
│   │   │   ├── ResumeTips.tsx
│   │   │   ├── Support.tsx
│   │   │   └── TermsOfService.tsx
│   │   ├── utils/              # Helper functions
│   │   │   ├── contants.ts
│   │   │   ├── jobRoles.ts
│   │   │   └── resumeFileStore.ts
│   │   ├── App.css
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── .env
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── .gitignore
├── .prettierignore
├── .prettierrc
├── generate-tree.js
├── package-lock.json
└── package.json
```

## 🎨 UI/UX Features

### Animations (Framer Motion)

- **Scroll-reveal animations** - Sections fade in as you scroll
- **Tab transitions** - Smooth content switching with AnimatePresence
- **Card hover effects** - Interactive feedback on cards
- **Staggered children** - Sequential animations for lists
- **Smooth scrolling** - Hash-based navigation with smooth scroll

### Design System

- **Responsive design** - Mobile-first approach
- **Dark mode support** - Complete dark/light theme
- **Accessible** - ARIA labels, semantic HTML, keyboard navigation
- **Consistent spacing** - Tailwind's spacing scale
- **Professional typography** - Clear hierarchy and readability

## 📄 Pages

### Main Application

- **Home** - Hero section with file upload
- **Analysis Dashboard** - Detailed resume analysis with tabs
- **Resume Guide** - Complete guide to writing resumes
- **Resume Tips** - Expert tips and best practices
- **Optimization Guide** - ATS optimization strategies
- **About** - Information about Tero

### Legal

- **Privacy Policy** - Data handling and privacy practices
- **Terms of Service** - Terms and conditions

## 🔑 Key Components

### HeroSection

- File upload for resume
- AI/ATS messaging
- Animated resume preview with floating cards

### WhyTeroStandsOut

- Three feature cards with hover animations
- Live content analysis showcase
- ATS compatibility demonstration

### ResumeAnalysisResult

- Three-tab interface (Strengths, Weaknesses, Action Plan)
- Animated tab transitions
- Detailed breakdown cards

### FileUploader

- Drag-and-drop support
- File validation (PDF, DOCX)
- Upload progress indicator

## 🔧 Development

### Available Scripts

**Frontend (Frontend/):**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend (Backend/):**

```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
```

### Code Quality

- **TypeScript** for type safety (Frontend)
- **ESLint** for code linting
- **Prettier** for code formatting
- **Git hooks** (optional) for pre-commit checks

## 🚢 Deployment

### Frontend (Vercel/Netlify)

```bash
cd Frontend
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway/Heroku)

```bash
cd Backend
# Deploy with start command: npm start
```

### Environment Variables

Ensure all environment variables are set in your deployment platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ayush Karma**

- GitHub: [@iamayushkarma](https://github.com/iamayushkarma)
- LinkedIn: [Ayush Karma](https://www.linkedin.com/in/iamayushkarma/)

## 🙏 Acknowledgments

- Inspired by the challenges of modern job searching
- Built to help job seekers navigate ATS systems
- Thanks to all contributors and users for feedback

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact via email: ayushkarma.dev@gmail.com

## 🗺️ Roadmap

- [ ] Resume templates library
- [ ] Cover letter analysis
- [ ] LinkedIn profile optimization
- [ ] Job description library
- [ ] Resume version history
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

---

**Made with ❤️ by Ayush Karma**
