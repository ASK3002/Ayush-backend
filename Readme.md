# 🎬 Video Platform Backend — by Ayush Singh Kaushik

A robust backend system for a full-stack video streaming platform. This app handles user authentication, video uploads, tweet-style posts, comments, subscriptions, and more — built with scalability and security in mind.

---

## 🛠 Tech Stack

- **Node.js**, **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** & **Refresh Tokens**
- **bcrypt** for password hashing
- **Cloudinary** for media storage
- **Multer** for file handling
- **dotenv**, **cookie-parser**

---

## 📦 Features

- Signup & Login with access/refresh tokens  
- Upload & manage videos  
- Post short text messages (Tweet-like posts)  
- Like/Dislike videos and tweets  
- Comment & reply system  
- Channel subscribe/unsubscribe  
- MVC structure with clean routing

---

## 🔧 Project Structure

```
BackendProject_1/
├── public/                # Root-level
│   └── temp/              # transient storage (temporarily stores avatar & coverImage before uploading on cloudinary)
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/       # All controllers you listed
│   │   ├── comment.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/            # All models you listed
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   ├── tweet.model.js
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── routes/
│   │   └── user.routes.js # Consolidated routes
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
|   ├── .prettierignore  # Prettier config
|   ├── .prettierrc      # Prettier rules
│   ├── constants.js     # Project constants
│   ├── index.js         # Main entry point (replaces server.js)
│   └── app.js           # Express app config
├── .env
├── .gitignore
├── package.json
└── package-lock.json

---

## 📂 Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/ASK3002/BackendProject_1.git
cd BackendProject_1
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Start the server**
```bash
npm run dev
```

---

## 🧑‍💻 Author

**Ayush Singh Kaushik**  
Backend Developer | Clean code enthusiast  
[GitHub Profile](https://github.com/ASK3002)

---

## 🙌 Contribute

Feel free to fork, clone, and contribute — just make sure:

* Your PR is complete  
* Code is tested  
* Changes are clearly explained

---

**Thanks for checking it out! 🚀**
