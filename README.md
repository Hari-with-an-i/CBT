# CBT: Community Task Manager

CBT (Community Based Task-manager) is a full-stack web application designed for groups, clubs, and communities to manage tasks. It allows community admins to create and assign tasks, while members can join and collaborate in a shared space.

This project uses a modern, decoupled architecture with a **React** frontend and a **Spring Boot** backend.

---

## 🚀 Key Features

* **Group Management:** Users can create new communities (groups).
* **Community Discovery:** Users can join existing communities or view the ones they are part of.
* **Public & Private:** Communities can be set as either **public** (discoverable) or **private** (invite-only).
* **Task Management:** Community admins can create new tasks for the group.
* **Task Assignment:** Admins can assign specific tasks to members of the community.

---

## 💻 Technology Stack

* **Frontend:** **React.js**
* **Backend:** **Spring Boot** (Java)
* **Database:** **MongoDB** (using Spring Data MongoDB)
* **API:** REST API

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

* **Java JDK:** Version 17 or higher
* **Maven** (or **Gradle**): For building the backend
* **Node.js:** Version 18.x or higher
* **npm** (or **yarn**): For managing frontend packages
* **MongoDB:** A running instance (either local or on a cloud service like MongoDB Atlas)

---

## ⚙️ Installation & Setup

To get this project running locally, you will need to run the backend and frontend in two separate terminals.

### 1. Backend (Spring Boot)

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Hari-with-an-i/CBT.git](https://github.com/Hari-with-an-i/CBT.git)
    cd CBT
    ```

2.  **Navigate to the backend directory:**
    *(I could not see the backend folder name in the screenshot, so please replace `[YOUR_BACKEND_FOLDER]` with the correct name.)*
    ```sh
    cd files
    ```

3.  **Configure the Database:**
    * Open the `src/main/resources/application.properties` file.
    * Update the `spring.data.mongodb.uri` property to point to your running MongoDB instance.
    ```properties
    # Example:
    spring.data.mongodb.uri=mongodb://localhost:27017/cbt_database
    ```

4.  **Run the Backend:**
    ```sh
    ./mvnw spring-boot:run
    ```
    The backend server will start on `http://localhost:8080`.

### 2. Frontend (React)

1.  **Open a new terminal.**
2.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Run the Frontend:**
    ```sh
    npm start
    ```
    The React development server will start and automatically open `http://localhost:3000` in your browser.

The application should now be fully functional, with the React frontend communicating with your Spring Boot backend.
