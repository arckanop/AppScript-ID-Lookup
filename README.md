# Google Sheets Data Lookup Website Deployed on Appscript

A simple Google Apps Script web app for looking up IDs from Google Sheets, displaying user details, updating collection status, and adding missing IDs directly from the website.

This project uses **Google Apps Script** as the backend and serves a clean **HTML + TailwindCSS** frontend for fast ID lookup and management.

## Tech Stack
- HTML
- CSS
- Javascript
- TailwindCSS
- Google Script (JS)

## Features

- Search records by **5-digit ID**
- Fetch data directly from **Google Sheets**
- Fast lookup using **Apps Script CacheService**
- Show record details such as:
  - Timestamp
  - Name
  - Row number (In Sheets)
  - Notes
  - Collection status
- Toggle status between collected and not collected
- Add missing IDs directly from the web UI
- Dual mode interface:
  - **Lookup mode**
  - **Insert mode**