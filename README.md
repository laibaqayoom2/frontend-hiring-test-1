Absolutely! Here's a polished, well-structured README for your project. I’ve organized it for clarity, added proper formatting, and improved readability while keeping all your details intact:

---

# 📞 TuringTech Frontend Test

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Demo](#demo)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Getting Started](#getting-started)
* [Authentication](#authentication)
* [API Endpoints](#api-endpoints)
* [Usage](#usage)
* [Real-Time Updates](#real-time-updates)
* [Pagination & Filtering](#pagination--filtering)
* [Error Handling](#error-handling)
* [Deployment](#deployment)
* [Future Improvements](#future-improvements)
* [License](#license)

---

## Project Overview

**TuringTech Frontend Test** is a **call management application** built with **Next.js**, **TypeScript**, and **Material UI**.

It allows users to:

* View a **paginated list of calls**
* See **detailed information** for each call
* **Archive / unarchive calls**
* **Add notes** to calls
* **Filter calls** by type
* **Listen to real-time updates**

The app communicates with a **REST API backend** and uses **Pusher** for live updates.

---

## Features

* **JWT Authentication**
* Calls list with **pagination**
* Call details with **notes**
* **Archive / unarchive calls**
* **Add notes** to calls
* **Filter calls** by type: missed, answered, voicemail, archived
* **Group calls by date**
* **Real-time updates** via Pusher
* **Responsive UI** for all devices

---

## Tech Stack

* **Frontend:** Next.js (App Router)
* **Language:** TypeScript
* **UI Library:** Material UI (MUI)
* **State Management:** React Hooks
* **API Requests:** Axios
* **Real-Time:** Pusher JS SDK
* **Deployment:** Netlify / GitHub Pages

---

## Folder Structure

```
/frontend-hiring-test
│
├─ /app
│  ├─ /call/[id]       # Call details page
│  ├─ /login           # Login page
│  └─ /page.tsx        # Calls list
│
├─ /components
│  ├─ CallTable.tsx
│  ├─ TablePagination.tsx
│  └─ NotesList.tsx
│
├─ /hooks
│  └─ useCalls.ts      # Data fetching, filtering, pagination, real-time updates
│
├─ /services
│  ├─ api.ts           # Axios instance
│  ├─ auth.ts          # Login, logout, refresh token
│  └─ calls.ts         # API methods for calls
│
├─ /types
│  └─ call.ts          # TypeScript types (Call, Note, etc.)
│
├─ /utils
│  └─ groupByDate.ts   # Date formatting & grouping
│
├─ /public
│  └─ /images          # Company logo and demo images
│
└─ next.config.ts      # Next.js configuration
```

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/frontend-hiring-test.git
cd frontend-hiring-test
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env.local` file with your API and Pusher credentials:

```
NEXT_PUBLIC_API_URL=<your_api_url>
NEXT_PUBLIC_PUSHER_KEY=<your_pusher_key>
NEXT_PUBLIC_PUSHER_CLUSTER=<your_pusher_cluster>
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "username": "your-username",
  "password": "your-password"
}
```

**Response:**

```json
{
  "access_token": "<JWT_TOKEN>",
  "refresh_token": "<REFRESH_TOKEN>"
}
```

Use the access token in the `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

> ⚠️ Access tokens expire in 10 minutes. Use `POST /auth/refresh-token` to refresh.

---

## API Endpoints

### Calls

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| GET    | /calls?offset=0&limit=10 | Get paginated list of calls |
| GET    | /calls/:id               | Get single call details     |
| PUT    | /calls/:id/archive       | Archive / unarchive a call  |
| POST   | /calls/:id/note          | Add a note to a call        |

### User

| Method | Endpoint | Description                    |
| ------ | -------- | ------------------------------ |
| GET    | /me      | Get current authenticated user |

### Real-Time

* **Pusher private channel:** `private-aircall`
* **Event:** `update-call`

---

## Usage

### Home Page

* Displays a **paginated calls table**
* **Filter by type:** All, Archived, Unarchived, Missed, Answered, Voicemail
* Click on a call to view **details**

### Call Details Page

* Displays call information: `from`, `to`, `duration`, `via`, `call type`, `call time`
* List of **notes with timestamps**
* **Add new notes**
* **Archive / Unarchive call**

---

## Real-Time Updates

* Uses **Pusher** to listen for `update-call` events
* UI updates **automatically** when a call is archived or a note is added
* Private authentication uses `/pusher/auth` endpoint

---

## Pagination & Filtering

* **Handled in `useCalls` hook**
* Filtering supports: `archived`, `unarchived`, `missed`, `answered`, `voicemail`
* Pagination updates **filtered results dynamically**

---

## Error Handling

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| 400         | BAD_REQUEST – Invalid input             |
| 401         | UNAUTHORIZED – Invalid or expired token |
| 404         | NOT_FOUND – Call not found              |

> Errors are displayed using **MUI Alerts** in the UI.

---

## Deployment

* Can be deployed on **Netlify** or **GitHub Pages**
* Example Netlify deploy:

```bash
npm run build
npm run start
```

---

## Future Improvements

* Add **dark mode** support
* Implement **infinite scrolling** for calls
* Enhance **note editing & deletion**
* Add **advanced filtering** (by date range, duration, etc.)
* Improve **unit and integration tests**


