# BNI Category Confirmation System

A web-based application developed for the BNI Lakshya Chapter to manage and streamline the Category Confirmation Exercise. The system allows members to confirm their business category, define inclusions and exclusions, and enables administrators to manage submissions, pending members, and name requests.

## Features

### Member Portal

* Select name from chapter member list
* Submit category confirmation details
* Define:

  * Category Allotted
  * Includes
  * Excludes
  * Specific Ask (Optional)
* Generate submission receipt
* Prevent duplicate submissions

### Name Request System

* Submit request if member name is missing
* Provide contact information
* Suggest category
* Send message to administrator

### Admin Dashboard

* Secure Firebase Authentication
* View Confirmed Submissions
* View Pending Members
* View Name Requests
* Approve Member Requests
* Delete Requests
* Edit Category Confirmations
* Delete Category Confirmations
* Export Data to CSV
* Dashboard Statistics

### Dashboard Statistics

* Total Members
* Confirmed Categories
* Pending Confirmations
* Pending Name Requests

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6 Modules)

### Backend

* Node.js
* Express.js

### Database

* Firebase Firestore

### Authentication

* Firebase Authentication

---

## Project Structure

```text
BNI-Category-Confirmation/
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── firebase.js
│   │   ├── firebase-auth.js
│   │   └── utils.js
│   │
│   └── index.html
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/OmMamtora/BNI-Category-Confirmation-system.git
cd BNI-Category-Confirmation-system
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
PORT=5001
```

Add your Firebase configuration in:

```text
public/js/firebase.js
```

and

```text
firebase.js
```

---

## Run Application

### Development Mode

```bash
npm start
```

or

```bash
node server.js
```

Application will run at:

```text
http://localhost:5001
```

---

## Firestore Collections

### members

```json
{
  "name": "Member Name",
  "businessName": "Business Name",
  "mobile": "9876543210",
  "email": "member@email.com",
  "chapter": "BNI Lakshya",
  "isSubmitted": false
}
```

### submissions

```json
{
  "memberId": "member_id",
  "memberName": "Member Name",
  "businessName": "Business Name",
  "category": "Category Name",
  "includes": "Included Services",
  "excludes": "Excluded Services",
  "specificAsk": "Referral Request",
  "submittedAt": "timestamp"
}
```

### missingNameRequests

```json
{
  "fullName": "Member Name",
  "businessName": "Business Name",
  "mobile": "9876543210",
  "email": "member@email.com",
  "suggestedCategory": "Category",
  "message": "Request Message",
  "status": "pending"
}
```
