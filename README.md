# ApexPlan

**Video Demo:** https://youtu.be/9itrhDdOP1o

**Application production link:** https://apex-plan.vercel.app/

## Description

ApexPlan is a full-stack web application designed to help users transform long-term ambitions into actionable daily tasks. The main idea behind the project is that many people know what they want to accomplish but struggle to organize the journey between the starting point and the final objective. Instead of simply creating a to-do list, ApexPlan introduces a hierarchical planning system where large objectives are divided into smaller goals that can be scheduled, monitored, and completed over time.

The project was developed as the final project for Harvard's CS50 course. It combines a decoupled architecture using Django REST Framework as the backend and Next.js (React) as the frontend. This separation allows each application to evolve independently while communicating through a REST API.

Users begin by creating an account and authenticating through JSON Web Tokens (JWT). Once authenticated, they can create objectives representing long-term achievements. Each objective can contain multiple goals, which represent smaller milestones required to accomplish the objective. Finally, these goals can be scheduled on an interactive calendar, allowing users to visualize and organize their work over time.

Unlike traditional task management applications, ApexPlan focuses on sequential planning instead of isolated tasks. Every goal belongs to a larger objective, creating a clear relationship between daily activities and long-term achievements. This approach encourages better organization and helps users understand how small actions contribute to larger accomplishments.

---

# Project Motivation

Many productivity applications allow users to create independent tasks. However, they rarely encourage planning from a strategic perspective.

The motivation behind ApexPlan was to build a system that naturally guides users through a planning process where every daily action contributes to a larger objective. Rather than asking "What should I do today?", ApexPlan helps answer "What should I do today to reach my long-term goal?"

This concept influenced every architectural and design decision made during development.

---

# Distinctiveness and Complexity

One of the most distinctive characteristics of ApexPlan is its completely decoupled architecture. Instead of building a monolithic Django application, the backend and frontend are entirely independent.

The backend was implemented using Django REST Framework and exposes a REST API responsible for authentication, business rules, validation, scheduling logic, password recovery, and database persistence. The frontend was developed using Next.js and communicates exclusively through HTTP requests.

This separation required implementing authentication using JWT tokens, configuring CORS, handling CSRF settings, creating serializers, services, API views, and defining a clear contract between frontend and backend.

Another aspect that significantly increases the complexity of the project is the business logic responsible for planning objectives and goals.

Objectives represent long-term achievements, while goals represent individual steps required to reach those objectives. The backend ensures that each goal remains associated with its objective while maintaining proper ownership and permissions. Users cannot access resources belonging to other accounts, requiring custom query filtering and validation throughout the application.

The calendar module also adds significant complexity. Instead of displaying static information, ApexPlan integrates FullCalendar, allowing users to create, edit, drag, resize, and delete events visually. Every interaction performed in the browser must be synchronized with the backend through REST endpoints while maintaining consistency between the interface and the database.

Another important feature is the password recovery workflow. The backend generates secure password reset tokens using Django's PasswordResetTokenGenerator, creates unique reset URLs, sends email notifications, validates expiration, and safely updates user passwords after confirmation. During local development this feature works through Gmail SMTP, while a production email provider such as Resend is planned for future deployment.

The application also includes comprehensive automated testing. Unit and integration tests were written for serializers, services, and API views covering authentication, objectives, goals, calendar events, and password recovery. This resulted in a test suite containing more than seventy automated tests, helping guarantee correctness while new features were added.

---

# Backend Architecture

The backend was developed using:

- Python
- Django
- Django REST Framework
- PostgreSQL
- Supabase
- JWT Authentication
- Factory Boy
- Pytest

The backend follows a layered architecture.

Models define the database structure.

Serializers validate incoming requests and transform model instances into JSON responses.

Services contain business logic separated from views.

Views expose REST endpoints.

This separation improves readability, testing, and future maintenance.

---

# Frontend Architecture

The frontend was developed using:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- FullCalendar
- React Hook Form + Zod (form handling and validation)
- Sonner (toast notifications)
- Lucide React (icons)
- date-fns (date formatting)

The frontend communicates exclusively with the REST API.

Authentication is handled through JWT access tokens stored by the application. Protected routes request authenticated user information through the `/api/auth/me/` endpoint.

The interface was designed to remain responsive while providing an intuitive planning experience.

---

# Main Features

The application currently includes:

- User registration
- User authentication using JWT
- Login
- Logout
- Protected routes
- User profile endpoint
- Objective CRUD
- Goal CRUD
- Calendar event CRUD
- Interactive calendar
- Drag and drop scheduling
- Event resizing
- Password recovery
- Password reset confirmation
- Automated API documentation using Swagger
- Automated testing

---

# Project Structure

```
backend/
    config/
    users/
    objectives/
    goals/
    calendare/
    common/

frontend/
    app/
        components/
        constants/
        context/
        lib/
            api/
            auth/
            validations/
            utils/
        services/
        types/
```

The backend contains all business rules, authentication, database models, and REST endpoints.

The frontend contains the user interface, routing, API communication, authentication context, and reusable components.

---

# File-by-File Breakdown

## Backend

### config/

Contains the Django project configuration, application settings, URL routing, middleware configuration, and deployment settings.

### users/

Responsible for user management.

Important files include:

- `models.py` defines the custom User model.
- `serializers.py` validates authentication and password recovery requests.
- `views.py` exposes authentication endpoints.
- `services.py` contains business logic.
- `emails.py` builds and sends password recovery emails.
- `tokens.py` generates and validates password reset tokens.

### objectives/

Responsible for long-term objectives.

- `models.py` defines Objective.
- `serializers.py` validates API requests.
- `services.py` contains business rules.
- `views.py` implements CRUD endpoints.

### goals/

Responsible for individual goals associated with objectives.

Contains models, serializers, services, and CRUD endpoints responsible for managing user goals.

### calendare/

Handles calendar events.

Provides endpoints used by the FullCalendar interface to create, update, resize, move, and delete events.

### common/

Contains shared models and utilities used throughout the backend.

---

## Frontend

### app/

Contains application pages and routing, following the Next.js App Router convention. Route groups such as `(dashboard)` share layout and authentication logic across protected pages (home, objective detail, calendar) without affecting the URL structure.

### components/

Contains reusable UI components, organized by domain (`auth/`, `dashboard/`, `landing/`) and generic building blocks (`ui/`), such as buttons, inputs, modals, and confirmation dialogs.

### constants/

Centralizes static data and copy used across the interface, such as navigation links, landing page content, and calendar color palettes, keeping components focused on rendering rather than data definition.

### context/

Stores authentication state and user session through `AuthContext`, which centralizes login, logout, and current-user retrieval so that every part of the application reads session state from a single source of truth.

### lib/

Contains supporting logic that is not tied to any specific page or component:

- `api/` configures the central Axios instance, including request and response interceptors responsible for attaching the JWT access token and handling automatic token refresh.
- `auth/` manages token storage (kept in memory rather than in browser storage) and the token refresh flow.
- `validations/` defines Zod schemas used to validate forms such as login, registration, objectives, goals, calendar events, and password reset.
- `utils/` contains small helper functions, such as date formatting.

### services/

Centralizes communication with the backend through Axios, with one file per resource (authentication, objectives, goals, and calendar events).

### types/

Contains TypeScript type definitions that mirror the backend serializers, ensuring the frontend and backend share a consistent data contract.

---

# Testing

The project includes automated tests written with Pytest.

Tests cover:

- Authentication
- Registration
- Login
- Password recovery
- Password reset
- Objectives
- Goals
- Calendar events
- Serializers
- Services
- API Views

This testing strategy helped maintain reliability while implementing new features.

---

# Future Improvements

Although the application is fully functional, several improvements are planned for future versions.

Some planned features include:

- Email delivery using Resend in production
- Migrate refresh token storage to httpOnly, Secure cookies
- Server-side token/session invalidation on logout
- Notifications
- Goal progress analytics
- Dashboard with productivity metrics
- Objective sharing
- Team collaboration
- Mobile application
- AI-assisted planning suggestions
- Calendar synchronization with Google Calendar

---

# Known Limitations

The password recovery feature currently works correctly during local development using Gmail SMTP.

For production deployment, a dedicated transactional email provider such as Resend should be configured with a verified custom domain. This limitation affects only production email delivery and does not impact the remaining application features.

Additionally, the frontend intentionally keeps JWT tokens in memory rather than in `localStorage` or `sessionStorage`, as a mitigation against XSS-based token theft. As a consequence, refreshing the page currently ends the user's session, requiring a new login. Migrating the refresh token to an httpOnly cookie (already listed in Future Improvements) will resolve this while preserving the same security posture.

---

# How to Run the Project

## Backend

Clone the repository.

Create a virtual environment.

```bash
python -m venv venv
```

Activate the environment.

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file containing the required environment variables.

Run database migrations.

```bash
python manage.py migrate
```

Start the backend server.

```bash
python manage.py runserver
```

---

## Frontend

Navigate to the frontend directory.

Install dependencies.

```bash
npm install
```

Create a `.env.local` file containing the required environment variables, including `NEXT_PUBLIC_API_URL` pointing to the backend API URL.

Run the development server.

```bash
npm run dev
```

The frontend will be available locally and communicate with the Django REST API.

---

# Final Considerations

ApexPlan represents the combination of concepts learned throughout CS50, including algorithms, software engineering, databases, web development, authentication, REST APIs, testing, and deployment.

Rather than implementing isolated programming exercises, this project demonstrates the complete development lifecycle of a modern web application, from architecture and database design to frontend integration, automated testing, and production deployment.

Developing ApexPlan provided valuable experience with real-world software engineering practices, emphasizing clean architecture, modularity, maintainability, and automated validation while solving a practical productivity problem.

