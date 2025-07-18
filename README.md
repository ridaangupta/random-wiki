# Random Wiki

A full-stack web application that fetches random Wikipedia articles and uses AI to create digestible summaries for users to discover and save interesting content.

🌐 **Live Website:** [random-wiki.com](https://random-wiki.com)

## What This Project Does

As a junior developer exploring full-stack development, I built this tool to solve a simple problem: Wikipedia articles can be overwhelming and long. Random Wiki fetches random Wikipedia articles, summarizes them using AI, and presents them in a scrollable, user-friendly format. Users can save articles they find interesting for later reading.

This project helped me understand how different parts of a web application work together - from user authentication to API integration to database management.

## Features

- **Random Article Discovery**: Fetches random Wikipedia articles using the Wikipedia API
- **AI-Powered Summaries**: Automatically generates concise summaries of articles for quick reading
- **User Authentication**: Secure login system allowing users to create accounts and manage their saved content
- **Save Functionality**: Users can save articles they find interesting to their personal collection
- **Smooth Scrolling Experience**: Implemented advanced caching techniques to ensure seamless browsing
- **Responsive Design**: Works across different devices and screen sizes

## Technologies Used

This project gave me hands-on experience with modern web development technologies:

### Frontend
- **HTML**: Structure and semantic markup
- **CSS**: Styling and responsive design
- **JavaScript**: Interactive functionality and API communication

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework (likely used with Node.js)

### Database
- **Supabase**: PostgreSQL database with built-in authentication and real-time features

### APIs & External Services
- **Wikipedia API**: For fetching random articles and content
- **AI Service**: For generating article summaries (integrated into the backend)

### Hosting & Deployment
- **IONOS**: Web hosting platform

## What I Learned

Building this project taught me several important full-stack development concepts:

1. **API Integration**: How to work with external APIs (Wikipedia) and handle async requests
2. **User Authentication**: Implementing secure login/signup functionality with Supabase
3. **Database Design**: Structuring data for user accounts and saved articles
4. **Caching Strategies**: Implementing advanced caching to improve performance and user experience
5. **Frontend-Backend Communication**: How the client and server communicate effectively
6. **Deployment**: Taking a project from local development to a live, hosted website

## Architecture Overview

The application follows a traditional client-server architecture:

1. **Frontend** makes requests to the backend API
2. **Backend** handles authentication, fetches data from Wikipedia API, processes it through AI for summaries
3. **Database** stores user information and saved articles
4. **Caching layer** improves performance by storing frequently accessed data

## Key Challenges Solved

- **Performance**: Implemented caching to handle multiple API calls efficiently
- **User Experience**: Created smooth scrolling and loading states
- **Data Management**: Structured the database to handle user relationships with saved articles
- **Authentication Flow**: Integrated Supabase auth with the custom Node.js backend

## Getting Started

[Include installation and setup instructions here]

## Future Improvements

- Add article categories and filtering
- Implement social features like sharing
- Add more customization options for summaries
- Mobile app version

---

This project represents my journey in learning full-stack development, from understanding how APIs work to implementing user authentication and optimizing performance. Each challenge taught me something new about building real-world web applications.
