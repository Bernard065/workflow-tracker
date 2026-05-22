# Mini Application Workflow Tracker

**Name:** Benard Omboga  
**Email:** benardombogah@gmail.com

A full-stack application workflow tracker built with **Django**, **Django Ninja**, **PostgreSQL**, **React 19+**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Docker**.

The application tracks company-related applications through this workflow:

```text
Draft → Submitted → Under Review → Need More Information / Approved / Rejected
```

This project was developed for a Junior–Mid Django/React Full-Stack Developer take-home assignment. It focuses on practical full-stack implementation, clean structure, workflow business rules, API design, responsive UI, Docker-based setup, testing, request logging, rate limiting, and clear documentation.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Workflow Rules](#workflow-rules)
- [Environment Variables](#environment-variables)
- [How to Run the Full Application with Docker](#how-to-run-the-full-application-with-docker)
- [How to Run the Backend](#how-to-run-the-backend)
- [How to Run the Frontend](#how-to-run-the-frontend)
- [How to Run Migrations](#how-to-run-migrations)
- [API Documentation](#api-documentation)
- [Backend API Endpoints](#backend-api-endpoints)
- [How to Use the Application](#how-to-use-the-application)
- [Running Tests](#running-tests)
- [Linting and Formatting](#linting-and-formatting)
- [Common Docker Commands](#common-docker-commands)
- [Assumptions Made](#assumptions-made)
- [What I Would Improve With More Time](#what-i-would-improve-with-more-time)

---

## Features

### Backend

- Django backend using Django Ninja.
- PostgreSQL database.
- Dockerized backend and database.
- Application model with all required fields:
  - `tracking_number`
  - `applicant_name`
  - `applicant_email`
  - `company_name`
  - `application_type`
  - `description`
  - `status`
  - `reviewer_comment`
  - `created_at`
  - `updated_at`
  - `submitted_at`
  - `reviewed_at`
- Automatic tracking number generation.
- Clear service layer for workflow business logic.
- API endpoints for:
  - Creating application drafts.
  - Listing applications.
  - Viewing application details.
  - Updating editable applications.
  - Submitting applications.
  - Starting review.
  - Recording reviewer decisions.
- Pagination, search, and filtering for the application list.
- Backend enforcement of workflow rules.
- Reviewer comment validation for rejection and information requests.
- API request logging for method, path, status code, duration, and client IP.
- Basic IP-based API rate limiting using Django cache.
- Backend tests using pytest.
- Code formatting and linting using Ruff.

### Frontend

- React 19+ frontend with TypeScript and Vite.
- Tailwind CSS and shadcn/ui for modern UI.
- Responsive application list screen.
- Search and filters by:
  - Tracking number
  - Applicant name
  - Applicant email
  - Company name
  - Status
  - Application type
- Paginated application list.
- Desktop table view and mobile-friendly card view.
- Create application draft form.
- Edit application form.
- Application detail screen.
- Reviewer decision form.
- Status-based workflow actions.
- Polished UI.
- Frontend validation for required fields.
- API error handling.
- Frontend tests using Vitest and React Testing Library.

---

## Tech Stack

### Backend

- Python 3.12
- Django
- Django Ninja
- PostgreSQL
- psycopg
- python-decouple
- django-cors-headers
- pytest
- pytest-django
- Ruff

### Frontend

- React 19+
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- Radix UI
- Vitest
- React Testing Library

### Infrastructure

- Docker
- Docker Compose
- PostgreSQL Docker container

---

## Workflow Rules

The backend is the source of truth for workflow rules. The frontend shows or hides actions based on the current status, but the backend still enforces all workflow transitions.

| Current Status | Allowed Action | Next Status |
|---|---|---|
| Draft | Edit | Draft |
| Draft | Submit | Submitted |
| Submitted | Start Review | Under Review |
| Under Review | Approve | Approved |
| Under Review | Need More Information | Need More Information |
| Under Review | Reject | Rejected |
| Need More Information | Edit | Need More Information |
| Need More Information | Resubmit | Submitted |
| Approved | No edit actions | Approved |
| Rejected | No edit actions | Rejected |

Reviewer comments are required for:

- Need More Information
- Rejected

Approved and Rejected applications are final and cannot be edited.

---

## Environment Variables

### Backend Environment

Create the backend environment file:

```bash
touch backend/.env
```

Add this:

```env
SECRET_KEY=django-insecure-dev-secret-key-change-me
DEBUG=True

ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,backend

POSTGRES_DB=workflow_tracker
POSTGRES_USER=workflow_user
POSTGRES_PASSWORD=workflow_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

API_RATE_LIMIT_REQUESTS=100
API_RATE_LIMIT_WINDOW_SECONDS=60
```

### Frontend Environment

Create the frontend environment file:

```bash
touch frontend/.env
```

Add this:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

# How to Run the Full Application with Docker

This is the recommended way to run the project.

## 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd workflow-tracker
```

## 2. Create environment files

Create these two environment files:

```bash
touch backend/.env
touch frontend/.env
```

Paste the backend and frontend environment variables shown above into the correct files.

## 3. Build and start all services

```bash
docker compose up --build
```

This starts:

- PostgreSQL database.
- Django backend.
- React frontend.

## 4. Open the application

Frontend:

```text
http://localhost:5173
```

Application list page:

```text
http://localhost:5173/applications
```

Backend API:

```text
http://localhost:8000/api
```

API documentation:

```text
http://localhost:8000/api/docs
```

## 5. Stop the application

```bash
docker compose down
```

---

# How to Run the Backend

## Option 1: Run Backend with Docker

From the project root:

```bash
docker compose up --build backend db
```

Backend will run at:

```text
http://localhost:8000
```

API docs:

```text
http://localhost:8000/api/docs
```

## Option 2: Run Backend Manually

Start the database:

```bash
docker compose up -d db
```

Enter the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements-dev.txt
```

Create the backend environment file:

```bash
touch .env
```

Paste the backend environment variables shown above.

When running Django locally while PostgreSQL is running in Docker, update this value in `backend/.env`:

```env
POSTGRES_HOST=localhost
```

Run migrations:

```bash
python manage.py migrate
```

Start the backend server:

```bash
python manage.py runserver 0.0.0.0:8000
```

Backend will run at:

```text
http://localhost:8000
```

---

# How to Run the Frontend

## Option 1: Run Frontend with Docker

From the project root:

```bash
docker compose up --build frontend
```

Frontend will run at:

```text
http://localhost:5173
```

Make sure the backend is also running at:

```text
http://localhost:8000
```

## Option 2: Run Frontend Manually

Enter the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend environment file:

```bash
touch .env
```

Add:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

# How to Run Migrations

Create migrations:

```bash
docker compose run --rm backend python manage.py makemigrations
```

Apply migrations:

```bash
docker compose run --rm backend python manage.py migrate
```

Check migration status:

```bash
docker compose run --rm backend python manage.py showmigrations
```

The backend service also applies migrations automatically when started through Docker Compose.

---

## API Documentation

Django Ninja provides interactive API documentation.

After starting the backend, open:

```text
http://localhost:8000/api/docs
```

You can test all backend endpoints from this Swagger-style interface.

---

## Backend API Endpoints

Base URL:

```text
http://localhost:8000/api
```

### Create application draft

```http
POST /applications
```

Example request:

```json
{
  "applicant_name": "John Doe",
  "applicant_email": "john@example.com",
  "company_name": "Doe Holdings Ltd",
  "application_type": "recordation",
  "description": "Application for recordation of company product."
}
```

### List applications

```http
GET /applications
```

Supports pagination, search, and filters:

```http
GET /applications?page=1&page_size=10
GET /applications?search=john
GET /applications?status=submitted
GET /applications?application_type=recordation
GET /applications?search=john&status=submitted&application_type=recordation
```

Example response:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "page_size": 10,
  "total_pages": 1
}
```

### View application details

```http
GET /applications/{application_id}
```

### Update editable application

```http
PATCH /applications/{application_id}
```

Allowed only when status is:

- Draft
- Need More Information

### Submit application

```http
POST /applications/{application_id}/submit
```

Allowed only when status is:

- Draft
- Need More Information

### Start review

```http
POST /applications/{application_id}/start-review
```

Allowed only when status is:

- Submitted

### Record reviewer decision

```http
POST /applications/{application_id}/decision
```

Example approve request:

```json
{
  "decision": "approved",
  "reviewer_comment": "Application meets all requirements."
}
```

Example need more information request:

```json
{
  "decision": "need_more_information",
  "reviewer_comment": "Please provide additional company ownership documents."
}
```

Example reject request:

```json
{
  "decision": "rejected",
  "reviewer_comment": "Application does not meet the required criteria."
}
```

Allowed only when status is:

- Under Review

---

## API Request Logging and Rate Limiting

The backend logs API requests for observability.

Each API request log includes:

- HTTP method.
- Request path.
- Response status code.
- Request duration in milliseconds.
- Client IP address.

Example log:

```text
INFO applications.api API request method=GET path=/api/applications status=200 duration_ms=4.33 ip=127.0.0.1
```

The API also includes basic IP-based rate limiting.

Default values:

```env
API_RATE_LIMIT_REQUESTS=100
API_RATE_LIMIT_WINDOW_SECONDS=60
```

This means each client IP can make up to 100 API requests per 60 seconds.

When the limit is exceeded, the API returns:

```json
{
  "detail": "Rate limit exceeded. Please try again later."
}
```

with HTTP status:

```text
429 Too Many Requests
```

For this assignment, rate limiting uses Django’s local-memory cache. In production, Redis or another shared cache would be preferred.

---

## How to Use the Application

### 1. Create a draft

Open:

```text
http://localhost:5173/applications
```

Click:

```text
Create Application
```

Fill in:

- Applicant name.
- Applicant email.
- Company name.
- Application type.
- Description.

Submit the form. The application is saved as `Draft`.

### 2. Edit a draft

From the application detail page, click:

```text
Edit
```

Make changes and save. Editing is only available for:

- Draft
- Need More Information

### 3. Submit the application

From the application detail page, click:

```text
Submit
```

The status changes to:

```text
Submitted
```

### 4. Start review

Click:

```text
Start Review
```

The status changes to:

```text
Under Review
```

### 5. Record reviewer decision

When the application is under review, use the reviewer decision form to choose:

- Approve.
- Need More Information.
- Reject.

A comment is required for:

- Need More Information.
- Reject.

### 6. Edit and resubmit

If the decision is `Need More Information`, the application can be edited and resubmitted.

### 7. Final states

Once an application is:

- Approved.
- Rejected.

It can no longer be edited.

---

## Running Tests

### Backend tests

```bash
docker compose run --rm backend pytest
```

The backend tests cover:

- Application creation.
- Application listing.
- Pagination.
- Search.
- Status filtering.
- Application type filtering.
- Draft submission.
- Review start.
- Reviewer decisions.
- Required reviewer comments.
- Invalid workflow transitions.
- API request logging.
- API rate limiting.
- API endpoint behavior.

### Frontend tests

```bash
cd frontend
npm run test:run
```

The frontend tests cover:

- Status utility functions.
- Application status badge rendering.
- Pagination component behavior.
- Filter component behavior.
- Application form validation.

---

## Linting and Formatting

Backend linting:

```bash
docker compose run --rm backend ruff check .
```

Backend formatting:

```bash
docker compose run --rm backend ruff format .
```

Frontend formatting:

```bash
cd frontend
npm run format
```

Frontend linting:

```bash
cd frontend
npm run lint
```

Frontend production build:

```bash
cd frontend
npm run build
```

Before committing, run:

```bash
cd frontend
npm run format
npm run lint
npm run build
npm run test:run
```

Then from the root:

```bash
docker compose run --rm backend ruff check .
docker compose run --rm backend pytest
```

---

## Common Docker Commands

Start everything:

```bash
docker compose up --build
```

Start in detached mode:

```bash
docker compose up --build -d
```

Stop containers:

```bash
docker compose down
```

Rebuild only frontend:

```bash
docker compose build --no-cache frontend
```

Rebuild only backend:

```bash
docker compose build --no-cache backend
```

View logs:

```bash
docker compose logs frontend
docker compose logs backend
docker compose logs db
```

Open backend shell:

```bash
docker compose run --rm backend sh
```

Open frontend shell:

```bash
docker compose run --rm frontend sh
```

---

## Assumptions Made

- Authentication is not included because it was not required in the assignment.
- Any user can act as applicant or reviewer.
- Reviewer assignment is out of scope; the app supports review actions, but it does not assign applications to specific reviewer accounts.
- Applications start as Draft by default.
- Docker is the primary way to run the project.
- The backend is the source of truth for workflow rules.
- Search is implemented across tracking number, applicant name, applicant email, and company name.
- Pagination defaults to 10 records per page.
- Approved and Rejected applications are treated as final states.
- API rate limiting uses Django cache for this assignment. In production, Redis or another shared cache would be preferred.

---

## What I Would Improve With More Time

- Add authentication and role-based authorization.
- Separate applicant and reviewer dashboards.
- Add reviewer assignment and review history.
- Add audit logs for status transitions.
- Add file uploads for supporting documents.
- Add toast notifications for successful actions.
- Add confirmation dialogs for important workflow actions.
- Add advanced sorting on the application list.
- Add more extensive frontend integration tests.
- Add production Docker setup with Gunicorn and Nginx.
- Add CI/CD pipeline for linting, testing, and building.
- Add route-level code splitting to reduce frontend bundle size.
- Add deployment documentation for cloud hosting.

---