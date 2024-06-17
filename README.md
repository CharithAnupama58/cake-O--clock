# Cake O'Clock

Cake O'Clock is a web application designed to simplify the process of ordering cakes online. This README provides an overview of the project, including the technologies used, setup instructions, and guidelines for contributing.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Browse a variety of cakes with detailed descriptions and images.
- User-friendly interface for placing orders.
- Secure user authentication and authorization.
- Admin panel for managing orders and inventory.
- Responsive design for optimal viewing on different devices.

## Technologies Used

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: MySQL

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v14 or higher)
- MySQL
- Git

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/cake-oclock.git
   cd cake-oclock
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Set up the MySQL database:**

   - Create a MySQL database named `cake_oclock`.
   - Import the initial database schema from `backend/database/schema.sql`.

4. **Configure the backend:**

   - Create a `.env` file in the `backend` directory and add your MySQL database credentials:

     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=cake_oclock
     ```

5. **Start the backend server:**

   ```bash
   npm start
   ```

6. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

7. **Configure the frontend:**

   - Create a `.env` file in the `frontend` directory and add your API endpoint (if different from the default):

     ```env
     VITE_API_URL=http://localhost:5000
     ```

8. **Start the frontend development server:**

   ```bash
   npm run dev
   ```

## Usage

Once the setup is complete, you can access the application by navigating to `http://localhost:3000` in your web browser. The backend API will be running on `http://localhost:5000`.

### User Workflow

1. **Browse Cakes**: Users can browse the available cakes, view details, and add them to the cart.
2. **Place Orders**: Users can place orders by providing necessary details and making payments.
3. **Admin Panel**: Admin users can log in to manage orders and inventory.

## Contributing

We welcome contributions to Cake O'Clock! To contribute:

1. **Fork the repository.**
2. **Create a new branch**: `git checkout -b feature/your-feature-name`
3. **Commit your changes**: `git commit -m 'Add some feature'`
4. **Push to the branch**: `git push origin feature/your-feature-name`
5. **Create a pull request**.

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using Cake O'Clock! If you have any questions or feedback, please feel free to open an issue or contact us.
