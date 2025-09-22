# Auth-App 🔐

A comprehensive authentication and authorization system built with SvelteKit, TypeScript, PostgreSQL, and Drizzle ORM. This application provides secure user management with role-based access control, email verification, and OAuth integration for both regular users and administrators.

## 🚀 Features

### Authentication & Authorization
- **User Registration & Login** - Secure signup and signin with email/password
- **Email Verification** - Required email verification for all new accounts
- **OAuth Integration** - Google and GitHub OAuth with email verification
- **Password Security** - Bcrypt hashing for password protection
- **Password Reset** - Secure password reset via email with 1-hour token expiration
- **Session Management** - HTTP-only cookie-based sessions with secure tokens
- **Role-Based Access Control** - Separate dashboards for users and administrators
- **Account Status Management** - Active/inactive user account control with automatic session termination

### User Management
- **User Dashboard** - Profile viewing and editing capabilities
- **Admin Dashboard** - Complete user oversight and management
- **Profile Updates** - Users can update their name, email, and password
- **Account Status Control** - Admins can activate/deactivate user accounts

### Admin Features
- **Admin Dashboard** - Overview of admin profile and system statistics
- **User Management** - View all registered users with detailed information
- **Settings Panel** - Manage user statuses with real-time updates
- **User Statistics** - Track active/inactive user counts
- **Secure Admin Access** - Separate admin table and authentication flow

### Email System
- **Verification Emails** - Beautiful HTML email templates with provider branding
- **Welcome Emails** - Sent after successful email verification
- **Password Reset Emails** - Secure password reset links with professional design
- **Email Resend** - Users can request new verification emails
- **Security** - 24-hour verification token expiration, 1-hour password reset token expiration

### AI Chat Features
- **Floating Chat Widget** - Always-accessible AI assistant in bottom-right corner
- **Real-time Streaming** - Live AI responses powered by Google Gemini API
- **Modern Chat UI** - Beautiful message bubbles with user messages in dark blue and AI responses in light grey
- **Scrollable Chat** - Smooth scrolling through conversation history
- **Auto-scroll** - Automatically scrolls to new messages
- **Chat Controls** - Clear chat history and close chat functionality
- **Responsive Design** - Works perfectly on desktop and mobile devices

### UI/UX Features
- **Modern Design** - Clean, responsive interface with custom styling
- **Consistent Color Scheme** - Unified design across all pages
- **Loading States** - Visual feedback during form submissions
- **Error Handling** - Comprehensive error messages and validation
- **Success Messages** - Auto-hiding success notifications
- **Email Verification Flow** - User-friendly verification process with clear instructions
- **Scrollable Tables** - Fixed headers with smooth scrolling containers
- **Accessibility** - Proper button elements and ARIA compliance

## 🛠️ Tech Stack

- **Frontend**: SvelteKit, TypeScript, CSS3
- **Backend**: SvelteKit Server-Side Rendering (SSR)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: bcryptjs for password hashing
- **OAuth**: Google and GitHub OAuth integration
- **Email Service**: Nodemailer with SMTP support
- **Session Management**: Secure HTTP-only cookies
- **AI Integration**: Google Gemini API with Vercel AI SDK
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
Auth-App/
├── src/
│   ├── db/
│   │   └── schema.ts              # Database schema definitions
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Footer.svelte      # Footer component
│   │   │   ├── Navbar.svelte      # Navigation bar
│   │   │   ├── FloatingChatWidget.svelte # AI chat floating widget
│   │   │   ├── ChatContainer.svelte      # Chat messages container
│   │   │   ├── ChatMessage.svelte        # Individual chat message component
│   │   │   └── ChatInput.svelte          # Chat input field component
│   │   ├── auth.ts                # OAuth utility functions
│   │   ├── db.ts                  # Database connection utility
│   │   ├── email.ts               # Email service and templates
│   │   └── session.ts             # Session management utilities
│   ├── routes/
│   │   ├── api/
│   │   │   └── chat/              # AI chat API endpoint
│   │   ├── auth/
│   │   │   ├── callback/          # OAuth callback handlers
│   │   │   │   ├── google/        # Google OAuth callback
│   │   │   │   └── github/        # GitHub OAuth callback
│   │   │   ├── verify-email/      # Email verification handler
│   │   │   ├── verification-pending/ # Verification pending page
│   │   │   ├── resend-verification/  # Resend verification email
│   │   │   ├── forgot-password/   # Password reset request page
│   │   │   └── reset-password/    # Password reset form page
│   │   ├── dashboard/
│   │   │   ├── admin/             # Admin dashboard routes
│   │   │   │   ├── users/         # User management page
│   │   │   │   ├── settings/      # User status management
│   │   │   │   └── insights/      # Admin insights (placeholder)
│   │   │   └── user/              # User dashboard
│   │   ├── signup/
│   │   │   ├── login/             # Login page
│   │   │   └── +page.svelte       # Signup page
│   │   ├── logout/                # Logout functionality
│   │   ├── +layout.svelte         # Main layout
│   │   └── +page.svelte           # Homepage
│   └── app.html                   # HTML template
├── static/                        # Static assets (images, icons)
├── drizzle/                       # Database migrations
├── docker-compose.yml             # PostgreSQL container setup
├── drizzle.config.ts              # Drizzle ORM configuration
├── env.example                    # Environment variables template
└── package.json                   # Dependencies and scripts
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key (auto-increment, starts from 1000)
- `name` - User's full name
- `email` - Unique email address
- `password` - Bcrypt hashed password (or OAuth provider marker)
- `status` - Account status (active/inactive)
- `emailVerified` - Email verification status (boolean)
- `verificationToken` - Email verification token
- `verificationExpires` - Email verification token expiration timestamp
- `passwordResetToken` - Password reset token
- `passwordResetExpires` - Password reset token expiration timestamp
- `createdAt` - Registration timestamp
- `updatedAt` - Last modification timestamp

### Admin Table
- `id` - Primary key (auto-increment, starts from 1)
- `name` - Admin's full name
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `createdAt` - Registration timestamp
- `updatedAt` - Last modification timestamp

### Sessions Table
- `id` - Primary key (auto-increment)
- `userId` - Foreign key to users/admin
- `token` - Secure session token
- `createdAt` - Session creation timestamp

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Auth-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example file and configure your settings:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   # Database
   DATABASE_URL=postgresql://postgres:23Wahaj34@localhost:5433/authdb
   
   # Application
   ORIGIN=http://localhost:5173
   
   # OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # Email (required for verification)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # AI Chat (optional)
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   # Generate migration files
   npx drizzle-kit generate
   
   # Apply migrations to database
   npx drizzle-kit migrate
   ```

6. **Add an admin user (optional)**
   Connect to your database and insert an admin(password=admin123):
   ```sql
   INSERT INTO admin (name, email, password) 
   VALUES ('Admin Name', 'admin@example.com', '$2a$12$hashedPasswordHere');
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks
- `npx drizzle-kit push` - Push schema changes to database
- `npx drizzle-kit generate` - Generate migration files

## 🔐 Authentication Flow

### User Registration
1. User fills signup form with name, email, password
2. System checks if email already exists
3. Password is hashed using bcrypt
4. User is inserted into database with 'active' but unverified status
5. Verification email is sent with secure token
6. User is redirected to verification pending page
7. User clicks verification link in email
8. Email is verified and user is logged in automatically

### OAuth Registration (Google/GitHub)
1. User clicks OAuth provider button
2. OAuth flow completes and user data is retrieved
3. User is inserted into database with unverified status
4. Verification email is sent to OAuth email address
5. User must verify email before accessing dashboard

### User Login
1. User enters email and password (or uses OAuth)
2. System first checks admin table for credentials
3. If not admin, checks users table
4. Password is verified against stored hash
5. **Email verification is checked** - unverified users cannot log in
6. Session is created based on user type (admin/user)
7. User is redirected to appropriate dashboard

### Password Reset Flow
1. User clicks "Forgot your password?" on login page
2. User enters email address on forgot password page
3. System validates email exists and is verified
4. Password reset token is generated (1-hour expiration)
5. Secure reset email is sent with professional HTML template
6. User clicks reset link in email
7. User enters new password with confirmation
8. Password is hashed and updated, token is cleared
9. User is redirected to login page with success message

### Session Management
- Sessions use secure, HTTP-only cookies
- Tokens are randomly generated 64-character hex strings
- Sessions expire after 30 days
- Invalid sessions redirect to login page
- **Inactive users are automatically logged out** when admin deactivates them
- **Unverified users cannot create sessions**

### Email Verification System
- **Secure Tokens**: 32-byte cryptographically secure random tokens
- **Token Expiration**: Verification links expire after 24 hours
- **Resend Capability**: Users can request new verification emails
- **Beautiful Templates**: HTML emails with provider-specific branding
- **Welcome Emails**: Sent automatically after successful verification

### Password Reset System
- **Secure Tokens**: 32-byte cryptographically secure random tokens
- **Token Expiration**: Reset links expire after 1 hour for security
- **Single-Use Tokens**: Tokens are cleared after successful password reset
- **Email Verification Required**: Only verified accounts can request password reset
- **Professional Templates**: Beautiful HTML email templates with security warnings
- **Account Status Check**: Only active accounts can reset passwords

## 👥 User Roles

### Regular Users
- **Access**: User dashboard only (after email verification)
- **Capabilities**: 
  - View and edit personal profile
  - Update name, email, and password
  - View account status, email verification status, and join date
  - Request new verification emails if needed
  - Reset password via secure email link
  - Logout functionality

### Administrators
- **Access**: Admin dashboard and all admin pages
- **Capabilities**:
  - View and edit admin profile
  - Access user management page with all user data
  - Control user account statuses (activate/deactivate)
  - **Automatic session termination** when deactivating users
  - View system statistics and user counts
  - View email verification status for all users
  - All regular user capabilities

## 🎨 UI Components

### Responsive Design
- Mobile-first responsive layout
- Flexible grid systems for user cards
- Scrollable tables with fixed headers
- Modern color scheme with consistent branding

### Interactive Elements
- Loading spinners for form submissions
- Auto-hiding success messages (3-second timeout)
- Real-time status updates
- Smooth transitions and hover effects

### Accessibility Features
- Proper semantic HTML structure
- ARIA labels and roles where needed
- Keyboard navigation support
- High contrast color schemes

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds of 12
- **Email Verification**: Required for all new accounts (including OAuth)
- **Password Reset Security**: Secure token-based password reset with 1-hour expiration
- **Secure Tokens**: Cryptographically secure verification and reset tokens
- **Token Expiration**: 24-hour expiration for verification tokens, 1-hour for reset tokens
- **Session Security**: HTTP-only cookies with secure flags
- **Automatic Logout**: Inactive users are immediately logged out
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **Input Validation**: Server-side validation for all forms
- **CSRF Protection**: Built-in SvelteKit CSRF protection
- **Role-Based Access**: Strict route protection based on user roles
- **OAuth Security**: Email verification required even for OAuth users
- **Single-Use Tokens**: Password reset tokens are cleared after successful use

## 📝 API Endpoints

### Authentication
- `POST /signup` - User registration (with email verification)
- `POST /signup/login` - User login (requires verified email)
- `POST /logout` - User logout

### OAuth
- `GET /auth/callback/google` - Google OAuth callback
- `GET /auth/callback/github` - GitHub OAuth callback

### Email Verification
- `GET /auth/verify-email` - Verify email address
- `GET /auth/verification-pending` - Verification pending page
- `POST /auth/resend-verification` - Resend verification email

### Password Reset
- `GET /auth/forgot-password` - Password reset request page
- `POST /auth/forgot-password` - Request password reset email
- `GET /auth/reset-password` - Password reset form page
- `POST /auth/reset-password` - Reset password with token

### User Management
- `GET /dashboard/user` - Get user profile
- `POST /dashboard/user` - Update user profile

### Admin Functions
- `GET /dashboard/admin` - Get admin profile
- `POST /dashboard/admin` - Update admin profile
- `GET /dashboard/admin/users` - Get all users data
- `GET /dashboard/admin/settings` - Get users for status management
- `POST /dashboard/admin/settings` - Update user status

### AI Chat
- `POST /api/chat` - AI chat endpoint with streaming responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 AI Chat Setup

To enable the AI chat functionality:

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Add to Environment**:
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. **Restart the Server**:
   ```bash
   npm run dev
   ```

The AI chat widget will appear as a floating button in the bottom-right corner of your application. Click it to start chatting with the AI assistant!

## 🙏 Acknowledgments

- SvelteKit team for the amazing framework
- Drizzle team for the excellent ORM
- PostgreSQL community for the robust database system
- Google AI team for the Gemini API
- Vercel team for the AI SDK

---

**Made with ❤️ using SvelteKit, TypeScript, and AI**