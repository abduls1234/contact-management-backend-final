# Contact Management Backend

## Description
A comprehensive backend for managing contacts, featuring user authentication, advanced contact features, file handling capabilities, and deployment on Vercel.

## Live URL
- [Live Deployment on Vercel](https://contact-management-backend-final.vercel.app/)


## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/abduls1234/contact-management-backend-final.git


2.Navigate to the project directory:
    cd contact-management-backend

3.Install dependencies:
    npm install

4.Run the development server:
    npm run dev

    
#### Running the Backend Server
```markdown
## Running the Backend Server
1. **Start the server**:
   ```bash
   npm run dev


Access the API:

The API will be accessible at http://localhost:3000.


#### Database Schema as ER Diagram
```markdown
## Database Schema
1. **ER Diagram**:
   - Include or link to an ER Diagram created with [dbdiagram.io](https://dbdiagram.io) or [draw.io](https://draw.io).

2. **Schema Details**:
   - Users Table:
     ```sql
     CREATE TABLE users (
       id INTEGER PRIMARY KEY, 
       email TEXT UNIQUE, 
       password TEXT, 
       emailVerified INTEGER DEFAULT 0, 
       emailVerificationCode INTEGER, 
       resetCode INTEGER
     );
     ```

   - Contacts Table:
     ```sql
     CREATE TABLE contacts (
       id INTEGER PRIMARY KEY, 
       user_id INTEGER, 
       name TEXT, 
       email TEXT UNIQUE, 
       phone TEXT, 
       address TEXT, 
       timezone TEXT, 
       created_at TEXT, 
       updated_at TEXT, 
       deleted INTEGER DEFAULT 0, 
       FOREIGN KEY(user_id) REFERENCES users(id)
     );
     ```
## API Documentation
Documented using Postman/Swagger:

1. **Authentication Endpoints**:
   - **/api/auth/register**: `POST` - Register a new user.
   - **/api/auth/login**: `POST` - Authenticate a user.
   - **/api/auth/verify-email**: `POST` - Verify email.
   - **/api/auth/request-reset**: `POST` - Request password reset.
   - **/api/auth/reset-password**: `POST` - Reset password.

2. **Contact Management Endpoints**:
   - **/api/contacts**: `GET`, `POST`, `PUT`, `DELETE` - Manage contacts.
   - **/api/upload**: `POST` - Upload CSV for contacts.
   - **/api/upload-json**: `POST` - Upload JSON for contacts.
   - **/api/download**: `GET` - Download contacts as CSV.

3. **Example Requests and Responses**:
   - Include example requests and responses for key endpoints.

4. **Authentication**:
   - Explain how to use JWT tokens for authenticated requests.

5. **Error Handling**:
   - Detail the error responses and status codes.

## Database Setup
1. **Development Environment**:
   - SQLite is used for local development.

2. **Reset and Seed Database**:
   - To reset and seed the database, run:
     ```bash
     node resetDatabase.js
     ```

3. **Detailed Schema Setup**:
   - Detailed schema setup is located in `db.js` and `resetDatabase.js`.

4. **Migrations**:
   - If applicable, mention any database migrations and how to run them.

## Additional Information
1. **Environment Variables**:
   - `NODE_ENV`: Set to `production` for deployment.
   - **Any other required environment variables** (e.g., database URLs, API keys).

2. **Security Measures**:
   - Rate limiting configuration in `server.js`.
   - Password hashing details.

3. **Testing**:
   - Instructions on how to run tests (if any).

4. **Deployment Steps**:
   - Detailed steps on deploying the app on Vercel or any other platform.



<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-rout
es) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
=======
# contact-management-backend-final
>>>>>>> fc20ee4e2047f8f86e127aa48428666ef427d5d7
