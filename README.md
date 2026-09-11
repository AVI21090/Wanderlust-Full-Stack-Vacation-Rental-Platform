# 🏡 Wanderlust — Full-Stack Vacation Rental Platform

> A production-style vacation rental web application inspired by modern property-booking platforms, built with **Node.js, Express, MongoDB, EJS, JavaScript, Cloudinary, Mapbox, Razorpay and Google Gemini AI**.

Wanderlust brings property discovery, hosting, booking, payments, reviews, wishlists, location visualization and AI-powered travel assistance together in a single full-stack application.

---

## 🔗 Project Links

### 🌐 Live Demo

**[Launch Wanderlust →](https://wanderlust-j7vo.onrender.com/listings)**

Explore the deployed application and experience the platform directly in the browser.

### 💻 Source Code

**[View GitHub Repository →](https://github.com/AVI21090/Wanderlust-Full-Stack-Vacation-Rental-Platform)**

> **Note:** The live application is deployed on Render. Some features that depend on external services require the corresponding environment variables to be configured in the deployment environment.

---

## 📌 Project Overview

Wanderlust is a full-stack vacation rental platform designed to simulate the complete journey of a traveler:

**Discover → Search → View Property → Save → Check Availability → Book → Pay → Receive Invoice**

It also supports the host/admin side of the platform through listing management, reviews, bookings and administrative analytics.

The project follows a modular MVC-style structure with separate **models, controllers, routes, middleware and server-rendered views**, making the application easier to maintain and extend.

---

## ✨ Key Features

### 👤 Authentication & User Management

- User registration and login
- Secure session-based authentication using Passport.js
- Persistent sessions with MongoDB
- Protected routes for authenticated users
- User profile page
- Login redirection to the originally requested page
- Logout functionality

### 🏠 Property Listings

- Browse vacation rental listings
- Detailed property pages
- Create new listings
- Edit listings
- Delete owned listings
- Owner-based authorization
- Property categories such as:
  - Trending
  - Rooms
  - Cities
  - Mountains
  - Boats
- Property location and country information
- Responsive listing interface

### 🔎 Search & Filtering

- Property search across title, description, location and country
- AI-assisted search using Google Gemini
- Category-based property filtering
- Fallback keyword search when AI search is unavailable

### ❤️ Wishlist

- Add properties to a personal wishlist
- Remove properties from wishlist
- View saved properties from a dedicated wishlist page
- Wishlist data stored against the authenticated user

### ⭐ Reviews & Ratings

- Add reviews to property listings
- Store reviews using MongoDB relationships
- Display review authors
- Delete reviews
- Automatically remove associated reviews when a listing is deleted

### 📅 Booking System

- Select check-in and check-out dates
- Guest information
- Availability validation
- Prevent overlapping bookings
- Automatic calculation of booking duration
- Automatic total-price calculation
- View personal bookings
- Cancel bookings
- Generate downloadable PDF invoices

### 💳 Online Payments

- Razorpay payment gateway integration
- Server-side Razorpay order creation
- Payment ID and order ID storage
- HMAC-SHA256 signature verification
- Payment status tracking

### 🗺️ Interactive Maps

- Mapbox integration
- Display property location on an interactive map
- Listing marker with property information
- GeoJSON-style Point coordinates stored in MongoDB
- Location information can be displayed without exposing exact post-booking details

### 🤖 AI Travel Assistant

Powered by **Google Gemini**.

Users can ask travel-related questions and receive AI-generated responses through the application's Travel Assistant.

### 🧳 AI Trip Planner

Users can provide:

- Budget
- Number of days
- Travel preference

The AI generates:

- Suggested destination
- Budget breakdown
- Day-wise itinerary
- Places to visit
- Travel tips

### 🛡️ Admin Dashboard

Admin functionality includes:

- Dashboard statistics
- Total users
- Total listings
- Total bookings
- Total reviews
- Revenue aggregation
- User management
- Listing management
- Booking management
- Review management

### ☁️ Image & Media Management

- Cloudinary integration for image storage
- Multer-based upload handling
- Cloud-hosted property images
- Environment-variable based Cloudinary configuration

### 📄 PDF Invoice Generation

- Booking invoice generation using PDFKit
- Downloadable invoice for a booking
- Booking, listing and user information can be included in the generated invoice

---

## 🧠 AI Features at a Glance

| AI Feature | Purpose |
|---|---|
| AI Property Search | Converts natural-language search into searchable keywords |
| Travel Assistant | Answers travel-related questions |
| AI Trip Planner | Generates destination and itinerary suggestions |

**AI Model:** Google Gemini `gemini-2.5-flash`

The AI integrations are implemented on the server side so API credentials can remain in environment variables instead of being exposed in frontend source code.

---

## 🏗️ Application Architecture

```text
                         ┌───────────────────────┐
                         │       Browser         │
                         │    EJS + CSS + JS     │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    Express Server     │
                         │       app.js          │
                         └───────────┬───────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 ▼                   ▼                   ▼
          ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
          │    Routes    │    │  Middleware  │    │ Controllers  │
          │ User/Listings│    │ Auth/Owner/  │    │  Business    │
          │ Booking/AI   │    │ Validation   │    │    Logic     │
          └──────┬───────┘    └──────────────┘    └──────┬───────┘
                 │                                       │
                 └──────────────────┬────────────────────┘
                                    ▼
                         ┌───────────────────────┐
                         │  Mongoose Models      │
                         │ User / Listing /      │
                         │ Booking / Review      │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │       MongoDB         │
                         └───────────────────────┘

External Services

┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│ Cloudinary │  │  Mapbox    │  │  Razorpay  │  │   Gemini   │
│   Images   │  │   Maps     │  │  Payments  │  │     AI     │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
