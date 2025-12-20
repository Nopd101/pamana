# PAMANA – Gamified Educational Website

**PAMANA** is a web-based digital storytelling and gamified learning platform for Grade 8 Araling Panlipunan. It combines animated lessons, mini-games, quizzes, and automated progress tracking.

---

## Tech Stack

- **Frontend:** ReactJS (Vite)  
- **Backend:** Django + Django REST Framework  
- **Database:** PostgreSQL (via pgAdmin)  
- **Version Control:** Git & GitHub  

---

## Project Structure

pamana/
│
├── frontend/ # React frontend
├── backend/ # Django backend
│ ├── core/ # Django project settings
│ ├── api/ # Single backend app
│ ├── manage.py
│ ├── requirements.txt
├── README.md
└── .gitignore

yaml
Copy code

---

## Core System Rules

- **Frontend:** Handles all static content (videos, quizzes, mini-games).  
- **Backend:** Stores only dynamic data:
  - Users & roles (Student, Teacher, Admin)  
  - Sections and mappings  
  - Student progress  
  - Quiz/game scores  

**Notes:**
- 1 Student = 1 Section  
- 1 Teacher = 1 or more Sections  
- No CMS or content-editing features  

---

## Prerequisites

Make sure the following are installed:

- Node.js (v18+)  
- Python (v3.10+)  
- PostgreSQL  
- Git  
- VS Code (recommended)  

---

## 1️⃣ Clone the Repository

git clone https://github.com/your-username/pamana.git
cd pamana

yaml
Copy code

---

## 2️⃣ Frontend Setup (React)

cd frontend
npm install
npm run dev

yaml
Copy code

**Frontend runs at:** [http://localhost:5173](http://localhost:5173)

---

## 3️⃣ Backend Setup (Django)

### Create & Activate Virtual Environment

cd ../backend
python -m venv venv

Windows
venv\Scripts\activate

macOS / Linux
source venv/bin/activate

shell
Copy code

### Install Dependencies

pip install -r requirements.txt

markdown
Copy code

---

## 4️⃣ PostgreSQL Database Setup (Using pgAdmin)

1. Install PostgreSQL & pgAdmin: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)  
2. Set a password for the `postgres` user during installation.  
3. Create Database:
   - Open pgAdmin and connect to your local PostgreSQL server.  
   - Right-click **Databases → Create → Database…**  
   - **Name:** `pamana_db`  
   - **Owner:** `postgres` (or your user)  
   - Save ✅  

### Configure Django to Use PostgreSQL

Edit `backend/core/settings.py`:

DATABASES = {
'default': {
'ENGINE': 'django.db.backends.postgresql',
'NAME': 'pamana_db',
'USER': 'postgres',
'PASSWORD': 'yourpassword',
'HOST': 'localhost',
'PORT': '5432',
}
}

yaml
Copy code

---

## 5️⃣ Run Migrations

python manage.py makemigrations
python manage.py migrate

yaml
Copy code

---

## 6️⃣ Create Superuser (Admin)

python manage.py createsuperuser

yaml
Copy code

Follow the prompts to set username/email/password.

---

## 7️⃣ Run Backend Server

python manage.py runserver

markdown
Copy code

**Backend runs at:** [http://localhost:8000](http://localhost:8000)

---

## Database Overview

- **User:** Students, Teachers, Admins  
- **Section:** Class groupings  
- **TeacherSection:** Teacher-to-section mapping  
- **Civilization:** Static list of kabihasnan  
- **Progress:** Student progress per civilization  
- **Score:** Quiz/game attempt records  

> No quiz, game, or video content is stored in the database.

---

## User Roles

- **Student:** view civilizations, watch videos, play mini-games, take quizzes, track personal progress  
- **Teacher:** view assigned sections, monitor progress, view results, class overview  
- **Admin:** manage accounts, assign students/teachers to sections, activate/deactivate users

## Developers

- **SAS Solutions**
