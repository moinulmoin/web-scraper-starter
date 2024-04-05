# Web Scraper Starter

## Introduction
A starter project for web scraping using Node.js and Playwright. This project demonstrates how to scrape data from a website using Playwright and store it in a database.

## Local Setup
1. Clone the repository.
2. Install dependencies with `bun install`.
3. Create a `.env` file from `.env.example` and add your Redis host and port.
3. Start the development server with `bun run dev`.

## Usage
Scraping data from a website using headless browser, queues the data to Redis and then processes it in the background and stores it in a database.