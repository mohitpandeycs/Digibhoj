# DigiBhoj - Mess & Tiffin Management System

DigiBhoj is a comprehensive web platform designed to digitize the tiffin and mess service ecosystem. It provides dedicated interfaces for three key user roles. Customers, Mess Providers, and Delivery Partners - to create a seamless food ordering and delivery experience.

## 🚀 Live Demo
**Frontend:** [DigiBhoj Live](https://mohitpandeycs.github.io/Digibhoj/)  

## Key Features

The platform is structured into three distinct modules, each tailored to its user role:

### 🍲 For Customers
- **Provider Discovery**: Browse, search, and filter local mess providers based on cuisine, price, and ratings.
- **Dynamic Menus & Plans**: View detailed menus, daily specials, and subscribe to flexible daily, weekly, or monthly meal plans.
- **Seamless Ordering**: A complete cart and checkout system with address management and multiple payment options.
- **Order Tracking**: A confirmation page with a simulated timeline to track order status from preparation to delivery.
- **Profile Management**: Manage personal information, view order history, and handle saved addresses and subscriptions.

### 👨‍🍳 For Mess Providers
- **Provider Dashboard**: An overview of key metrics, including daily orders, earnings, and recent activity.
- **Order Management**: View and manage incoming orders with status updates (e.g., Pending, Preparing, Ready).
- **Menu Management**: Easily add, edit, and manage menu items and meal plans.
- **Delivery Coordination**: Assign unassigned orders to available delivery partners.
- **Analytics**: Visualize sales, demand, and customer preferences to gain insights and grow the business.

### 🛵 For Delivery Partners
- **Modern Dashboard**: A glassmorphism-style dashboard with gamification features like levels, XP, and achievements to motivate partners.
- **Real-time Order Queue**: View and accept or reject available delivery assignments.
- **Interactive Earnings**: Track daily and historical earnings with interactive charts powered by Chart.js.
- **Live GPS Tracking**: An integrated Google Maps interface for real-time location tracking, route optimization, and turn-by-turn navigation.
- **Performance Stats**: Monitor key performance metrics like average delivery time, distance covered, and customer ratings.

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **APIs & Libraries**:
  - **Google Maps Platform**: Maps JavaScript API, Directions API, Places API, Geolocation API
  - **Chart.js**: For data visualization in the delivery and provider dashboards.
  - **Font Awesome**: For modern, consistent icons.

## Project Structure

The repository is organized into modules for each user role, along with shared assets.

```
├── /assets              # Shared CSS, JS, images, and mock data (JSON)
├── /customer            # Frontend pages for Customers
├── /delivery            # Frontend pages for Delivery Partners
├── /provider            # Frontend pages for Mess Providers
├── auth.html            # Authentication page for all roles
├── index.html           # Main landing page
├── DELIVERY_SETUP.md    # Setup guide for the Delivery module
├── server.js            # Express.js server for serving files
└── package.json         # Project dependencies
```

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mohitpandeycs/Digibhoj.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Digibhoj
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up Google Maps API Key:**

    The delivery map functionality requires a Google Maps API key.

    - Get an API key from the [Google Cloud Console](https://console.cloud.google.com/).
    - Enable the **Maps JavaScript API**, **Directions API**, and **Geolocation API**.
    - Open `delivery/map.html` and replace `YOUR_API_KEY` on line 10 with your actual key:

      ```html
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=geometry,places"></script>
      ```

5.  **Start the server:**
    ```bash
    npm start
    ```

6.  **Access the application:**
    Open your browser and go to `http://localhost:3000`.

## How to Use

1.  Navigate to `http://localhost:3000` to view the landing page.
2.  Click **Sign Up** or **Login** to go to the authentication page.
3.  On the `auth.html` page, choose your desired role: **Customer**, **Provider**, or **Delivery Boy**.
4.  The login/registration form will adapt to the selected role.
5.  After logging in, you will be redirected to the corresponding dashboard:
    - **Customer**: `customer/home.html`
    - **Provider**: `provider/dashboard.html`
    - **Delivery Partner**: `delivery/dashboard.html`

### **Connect With Me**
- **GitHub**: [@mohitpandeycs](https://github.com/mohitpandeycs)
- **LinkedIn**: [@mohitpandeycs](https://linkedin.com/in/mohitpandeycs)
- **Twitter / X**: [@mohitpandeycs](https://x.com/mohitpandeycs)


---
<div align="center">

### *Bringing the food on right table*

[![GitHub Repo](https://img.shields.io/badge/GitHub-Digibhoj-blue?style=for-the-badge&logo=github)](https://github.com/mohitpandeycs/Digibhoj) 

**[⭐ Star this repo](https://github.com/mohitpandeycs/Digibhoj) • [🐛 Report Bug](https://github.com/mohitpandeycs/Digibhoj/issues) • [💡 Request Feature](https://github.com/mohitpandeycs/Digibhoj/issues/new)**
