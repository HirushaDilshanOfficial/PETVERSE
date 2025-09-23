# Analytics Page Implementation

## Overview

This document explains the implementation of the Analytics Dashboard page for the admin panel using Chart.js with real data from the backend.

## Features Implemented

### 1. User Growth Chart (Bar Chart)

- Shows new user registrations over time
- Data fetched from `/api/auth/users` endpoint
- Groups users by registration month

### 2. Product Categories Chart (Pie Chart)

- Shows distribution of products by category
- Data fetched from `/api/products` endpoint
- Displays top 5 categories

### 3. Summary Statistics

- Total Users: Count of all registered users (fixed to show actual database count)
- Total Products: Count of all products in inventory
- Total Services: Count of all services in the system
- Active Users: Count of users with active accounts

### 4. Recent Activity

- Shows latest actions in the system
- Simulates recent user registrations and product additions
- Displays time ago for each activity

### 5. Export Data Functionality

- Exports analytics data to PDF using jsPDF
- Includes PETVERSE branding header with site details
- Includes summary statistics, user growth data, and product categories
- Professional formatting with tables

## Technical Implementation

### Dependencies

- `chart.js`: Charting library
- `react-chartjs-2`: React wrapper for Chart.js
- `jspdf`: Library for generating PDFs
- `jspdf-autotable`: Plugin for adding tables to PDFs
- `makeAuthenticatedRequest`: Utility function for API calls

### Data Processing

1. User Growth Data:

   - Fetches all users from `/api/auth/users` (with high limit to get all)
   - Groups by creation month
   - Formats for Bar chart display

2. Product Category Data:

   - Fetches all products from `/api/products`
   - Counts products by category
   - Takes top 5 categories for display

3. Summary Statistics:

   - Uses total count from pagination data to show actual database count
   - Calculates counts from fetched data

4. Recent Activity:

   - Sorts users and products by creation date
   - Takes most recent items
   - Formats time ago strings

5. PDF Export:
   - Creates formatted PDF document with PETVERSE branding
   - Includes all key metrics in tables
   - Downloads as "petverse-analytics-report.pdf"

### Error Handling

- Loading states with spinner
- Error messages with retry option
- Graceful fallbacks for empty data
- Error handling for PDF generation

## Usage

1. Navigate to Admin Dashboard
2. Click on Analytics in the sidebar
3. View real-time data visualizations
4. Use date range filter (UI only, data filtering not implemented)
5. Click "Export Data" to download PDF report

## Future Improvements

1. Implement actual date range filtering
2. Add more chart types (line charts for revenue, etc.)
3. Add more detailed analytics (revenue, conversion rates, etc.)
4. Add real-time data updates with WebSockets
5. Improve PDF styling and formatting
