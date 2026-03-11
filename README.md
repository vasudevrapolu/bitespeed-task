# BiteSpeed Identity Reconciliation API

This project implements an API that solves the identity reconciliation problem by linking customer contact information such as email addresses and phone numbers.

## Problem
Users may sign up multiple times using different emails or phone numbers. This API identifies whether the incoming contact belongs to an existing user and links them together.

## Features
- Identity reconciliation using email and phone number
- Maintains primary and secondary contact relationships
- Consolidates multiple contact records into a single identity
- Returns unified contact data including emails, phone numbers, and linked contact IDs

## API Endpoint
POST /identify

Example Request:
{
  "email": "example@test.com",
  "phoneNumber": "1234567890"
}

Example Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["example@test.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": []
  }
}

## Tech Stack
- Node.js
- Express.js
- Database
- REST APIs
- Postman

## Deployment
The API is deployed and can be tested using API tools like Postman.
