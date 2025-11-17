# ⭐ **MiniCord — Frontend (Vite + React + TypeScript)**

A lightweight Discord-style chat application frontend powered by **React**, **TypeScript**, **TailwindCSS**, and **REST API + WebSockets**.

This is the UI for the MiniCord backend.

---

## 🚀 Features

* 🔐 **JWT authentication** (login/signup)
* 👤 **User profile** (avatar, logout dropdown)
* 💬 **Conversations system**

  * Direct Messages (DM)
  * Group chats
* 👥 **Friends system**

  * Send friend requests
  * Accept / Reject
  * Unfriend
* 🌫️ **Blurred modals** for DM creation, group creation, and friend requests
* 🔄 **Dynamic sidebar**

  * Conversations list
  * Friend request panel
  * Create Chat (“+”) button
* 🖼️ **Auto-generated avatars** using UI-Avatars
* ⚡ **Fast UI** with Tailwind transitions
* 📡 **WebSocket-ready chat window** (polling for now)
* 📱 **Responsive layout**

---

## 🧱 Tech Stack

| Layer              | Tech                          |
| ------------------ | ----------------------------- |
| Frontend Framework | React 18 (Vite)               |
| Language           | TypeScript                    |
| Styling            | TailwindCSS (Dark/Light mode) |
| Routing            | React Router DOM              |
| API Client         | Axios                         |
| Auth               | JWT (localStorage)            |
| Avatars            | UI-Avatars                    |
| State Management   | React Context (Auth)          |
| Real-time          | WebSockets (coming soon)      |

---

## 📂 Folder Structure

```
src/
 ├── Api/               # All REST API wrappers (auth, users, friends, conversations, messages)
 ├── components/        # All components
 ├── context/
 │    └── User.tsx      # Auth context (user + token)
 ├── pages/
 │    ├── Dashboard/    # Main dashboard layout
 │    └── Auth/         # Login / Signup pages
 ├── hooks/             # (soon) websocket, caching hooks
 ├── styles/
 │    └── index.css     # Tailwind styles
 ├── App.tsx
 ├── main.tsx
```

---

## ⚙️ Setup & Installation

### 1. Clone Repo

```sh
git clone https://github.com/your-username/minicord-frontend.git
cd minicord-frontend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3000
```

These values are accessed via:

```ts
import.meta.env.VITE_API_URL
```

---

## ▶️ Running Dev Server

```sh
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔌 API Integration

All API calls use dedicated wrappers inside `src/Api/`.

Example:

```ts
import { loginAPI } from "@/Api/Auth";

const res = await loginAPI(username, password);
console.log(res.data);
```

### Authentication

Token and user data stored in:

```
localStorage.token
localStorage.user
```

and accessed via:

```ts
const { user, token, login, logout } = useAuth();
```

---

## 💬 Conversations

Each conversation fetches:

* Members
* Avatars (via `ui-avatars`)
* Username resolution via `/users/:id`

Clicking a conversation navigates to:

```
/convo/:conversationId
```

Where the **ChatWindow** loads that conversation’s messages.

---

## 👥 Friend Requests

Opening the friend request panel shows:

### Pending Requests

* Accept
* Reject

### Friends

* Unfriend

Requests are **polled every 1.5 seconds** while the modal is open.

---

## ➕ Create Chat Modal

Clicking the **+** icon opens a blur modal with two options:

* Direct Message
* Create Group

Each option opens a simple form for entering username(s) and group title.

---

## 📡 WebSocket Support (Coming Soon)

The project is structured so ChatWindow can easily switch from polling to WebSockets.

Planned features:

* Real-time typing indicators
* Live message updates
* Online/offline badges

---

## 🎨 Theming

The entire UI uses a **purple theme**, with:

* `bg-purple-600`, `bg-purple-500`, `text-purple-300`, etc.
* smooth dark mode support via Tailwind’s `dark:` class
* blurred glass UI using `backdrop-blur-xl`

---

## 🧪 Linting & Formatting

ESLint + Prettier recommended:

```sh
npm install -D eslint prettier
```

---

## 📦 Build for Production

```sh
npm run build
```

Output goes to:

```
dist/
```

Deployable to Netlify / Vercel / Cloudflare Pages.

---

## 🙌 Credits

* UI-Avatars for auto-generated avatars
* TailwindCSS for design
* Vite for blazing-fast dev experience
* MiniCord Backend

---

## 📌 Status

This frontend is **actively in development**. WebSockets and full real-time features coming next.

---
