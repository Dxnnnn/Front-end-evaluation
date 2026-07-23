

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Run the development server:

```bash
npm run dev
```

pull request 
- git pull origin main

push
- git status 
- git add . 
- git commit -m "Update login"
- git push origin frontend-branch (kong sa lain nga branch i push)
- git push origin main

Open [http://localhost:3000](http://localhost:3000) with your browser. The app redirects to the login page.

### Demo accounts

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |
| User  | `user`   | `user123`  |

## Learn More

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

pull request:
git init
git checkout -b frontend-branch
git add .
git  commit -m "update page"
git status
git push -u origin frontend-branch

Added a new page for coordinator only: 

COORDINATOR Page
|
|--> LOGIN PAGE
|
|--> DASHBOARD
|
|
|--> EVALUATION
|         |
|         *--> CREATE OR EDITING OF EVALUATION QUESTIONS
|
|--> FACULTY
|         |
|         *--> ADD OR EDITING OF FACULTY LIST
|
|--> REPORTS
|         |
|          *--> CREATE OR EDITING OF EVALUATION QUESTIONS
|
|--> EVALUATION
|         |
|         *--> CREATE OR EDITING OF EVALUATION QUESTIONS
|
|
|
|--> LOGOUT
