
# 📝 Equipment Change Request Form

This project is a web application for requesting equipment changes within a company. It includes an approval workflow that can be handled through the website or via email using the **Taximail API**.

---

## ✨ Features

- **Request Form:** Employees can submit equipment change requests online.
- **Approval Workflow:** Managers can approve or reject requests via the website or by responding through email.
- **Email Integration:** Uses **Taximail API** to send and receive approval emails.

---

## 🚀 Tech Stack

- **Frontend:** ReactJS
- **Backend:** Node.js
- **Email API:** Taximail

---

## 📂 Getting Started

1. **Clone this repository**

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   node server.js
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   npm start
   ```

---

## ⚙️ How It Works

- The **ReactJS** frontend provides an easy-to-use form for submitting requests.
- The **Node.js** backend handles form submissions, stores request data, and manages the approval flow.
- The **Taximail API** is used to send approval emails to managers and process their responses automatically.

---
