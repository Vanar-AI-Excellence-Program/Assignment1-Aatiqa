# Auth-App 🔐

A comprehensive authentication and authorization system built with SvelteKit, TypeScript, PostgreSQL, and Drizzle ORM. This application provides secure user management with role-based access control for both regular users and administrators.

## 🚀 Features

### Authentication & Authorization
- **User Registration & Login** - Secure signup and signin with email/password
- **Password Security** - Bcrypt hashing for password protection
- **Session Management** - HTTP-only cookie-based sessions with secure tokens
- **Role-Based Access Control** - Separate dashboards for users and administrators
- **Account Status Management** - Active/inactive user account control

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

### UI/UX Features
- **Modern Design** - Clean, responsive interface with custom styling
- **Loading States** - Visual feedback during form submissions
- **Error Handling** - Comprehensive error messages and validation
- **Success Messages** - Auto-hiding success notifications
- **Scrollable Tables** - Fixed headers with smooth scrolling containers
- **Accessibility** - Proper button elements and ARIA compliance

## 🛠️ Tech Stack

- **Frontend**: SvelteKit, TypeScript, CSS3
- **Backend**: SvelteKit Server-Side Rendering (SSR)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: bcryptjs for password hashing
- **Session Management**: Secure HTTP-only cookies
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
│   │   │   └── Navbar.svelte      # Navigation bar
│   │   ├── db.ts                  # Database connection utility
│   │   └── session.ts             # Session management utilities
│   ├── routes/
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
└── package.json                   # Dependencies and scripts
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key (auto-increment)
- `name` - User's full name
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `status` - Account status (active/inactive)
- `createdAt` - Registration timestamp
- `updatedAt` - Last modification timestamp

### Admin Table
- `id` - Primary key (auto-increment)
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
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://postgres:23Wahaj34@localhost:5432/authdb
   ```

4. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npx drizzle-kit push
   ```

6. **Add an admin user (optional)**
   Connect to your database and insert an admin:
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
4. User is inserted into database with 'active' status
5. Session is created and user is redirected to dashboard

### User Login
1. User enters email and password
2. System first checks admin table for credentials
3. If not admin, checks users table
4. Password is verified against stored hash
5. Session is created based on user type (admin/user)
6. User is redirected to appropriate dashboard

### Session Management
- Sessions use secure, HTTP-only cookies
- Tokens are randomly generated 64-character hex strings
- Sessions expire after 30 days
- Invalid sessions redirect to login page

## 👥 User Roles

### Regular Users
- **Access**: User dashboard only
- **Capabilities**: 
  - View and edit personal profile
  - Update name, email, and password
  - View account status and join date
  - Logout functionality

### Administrators
- **Access**: Admin dashboard and all admin pages
- **Capabilities**:
  - View and edit admin profile
  - Access user management page with all user data
  - Control user account statuses (activate/deactivate)
  - View system statistics and user counts
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
- **Session Security**: HTTP-only cookies with secure flags
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **Input Validation**: Server-side validation for all forms
- **CSRF Protection**: Built-in SvelteKit CSRF protection
- **Role-Based Access**: Strict route protection based on user roles

## 📝 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /signup/login` - User login
- `POST /logout` - User logout

### User Management
- `GET /dashboard/user` - Get user profile
- `POST /dashboard/user` - Update user profile

### Admin Functions
- `GET /dashboard/admin` - Get admin profile
- `POST /dashboard/admin` - Update admin profile
- `GET /dashboard/admin/users` - Get all users data
- `GET /dashboard/admin/settings` - Get users for status management
- `POST /dashboard/admin/settings` - Update user status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SvelteKit team for the amazing framework
- Drizzle team for the excellent ORM
- PostgreSQL community for the robust database system

---

**Made with ❤️ using SvelteKit and TypeScript**