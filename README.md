# Crowd Management System – Frontend

This is the frontend application for the Crowd Management System built using Angular.

## Setup Instructions

1. Install Node.js (v16 or above)
2. Install Angular CLI
   npm install -g @angular/cli
3. Install dependencies
   npm install
4. Run the application
   ng serve

Application runs at:
http://localhost:4200

## Features
- Login page
- Dashboard overview
- Crowd entries table
- Demographics & occupancy charts
- Responsive layout

## Alerts – Issue
Alerts are implemented using socket connection.
The socket endpoint was tested using browser URL and Postman.
However, the socket connection could not be established.
Due to backend unavailability, real-time alerts are not functional.

## Deployment
Deployed frontend link:
https://crowdmanagements.netlify.app/

