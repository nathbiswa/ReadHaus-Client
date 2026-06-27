# 📚 ReadHubs - Modern Library Management & Admin Dashboard

A comprehensive, full-stack Library Management System designed to streamline book distribution, inventory tracking, real-time platform analytics, and user purchase management. Built with a robust backend and a highly responsive dashboard frontend.

## 🔗 Live Application
* Live URL: https://read-haus-client.vercel.app
* Live URL Server: https://readhaus-server.vercel.app
* Live GitHub Repo Client: https://github.com/nathbiswa/ReadHaus-Client
* Live GitHub Repl server: https://github.com/nathbiswa/ReadHaus-Server

---

## 🎯 Project Purpose
The primary goal of **ReadHubs** is to bridge the gap between avid readers, librarians, and system administrators. It automates the process of book discovery, ordering/delivery logs, and track monthly earnings seamlessly. Instead of manual ledger management, ReadHubs offers real-time visualization of platform revenue and book distribution metrics directly from live database instances.

---

## ✨ Key Features

### 👨‍💻 Admin & Librarian Dashboard
* **Live Financial Analytics:** Interactive day-by-day revenue streaming (`AreaChart`) mapped directly from MongoDB `delivered` or `complete` order logs.
* **Inventory Overview:** A visually stunning half-pie distribution chart (`PieChart`) dividing available books dynamically by their respective genres/categories.
* **Platform Metrics:** Quick-glance metrics cards showcasing accurate figures for *Total Users*, *Total Books*, *Total Deliveries*, and *Total Lifetime Revenue*.
* **Responsive Architecture:** Fully optimized grid system that flows flawlessly across ultra-wide monitors, tablets, and mobile breakpoints.

### 📖 Reader Platform
* **Secure Checkout Session:** Seamless integration with payment triggers, logging exact session states (`sessionId`) back into the system database.
* **Real-time Status Tracking:** Track book acquisition status instantly from *Pending* to *Delivered* or *Complete*.

---

## 🛠️ Core Tech Stack & Dependencies

Here are the key npm packages and libraries that drive this application:

### Frontend
* **Framework:** `Next.js` (React 19 / App Router ready)
* **UI Component Library:** `@heroui/react` (formerly NextUI)
* **Styling engine:** `tailwindcss`
* **Icons:** `lucide-react`
* **Data Visualization / Charts:** `recharts`

### Backend & Database
* **Server Framework:** `Express.js` (Node.js environment)
* **Database Object Modeling:** `mongoose`
* **Database Store:** `MongoDB Atlas`
* **Authentication:** `better-auth` (JWT)
* **Emails:** `nodemailer`

### Deployment
* **Hosting:** `Vercel`
* **Continuous Integration:** `GitHub Actions`

---

## 📝 Project Documentation

The project documentation is organized into the following sections:

* [**Installation**](#installation)
* [**Usage**](#usage)
* [**Deployment**](#deployment)
* [**Contributing**](#contributing)

---