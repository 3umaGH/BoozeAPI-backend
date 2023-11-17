# BoozeAPI - Cocktail Browser Website (SERVER)

## Overview
The BoozeAPI website is a dynamic cocktail browser application where users can explore popular cocktail recipes. This project, developed using React, Material-UI (MUI), Express.js, Node.js, and MongoDB, provides a delightful user experience for discovering, saving favorites, and sharing cocktail recipes. Both the backend and frontend were independently coded, and the application is deployed on the Railway platform.

## Technologies Used
- React: JavaScript library for building dynamic user interfaces.
- Material-UI (MUI): React UI framework implementing Google's Material Design principles.
- Express.js: A minimal and flexible Node.js web application framework.
- Node.js: JavaScript runtime for server-side development.
- MongoDB: NoSQL database for efficient data storage and retrieval.
- Railway: Platform for deploying and managing web applications.

## Features
1. **Cocktail Browsing:**
   - Explore a diverse collection of popular cocktail recipes.

2. **Search Functionality:**
   - Search for cocktails based on parameters such as name, category, ingredients, alcoholic content, and glass type.

3. **Favorites:**
   - Save your favorite cocktails for quick access.

4. **Link Sharing:**
   - Easily share links to specific cocktails with others.

5. **Detailed Recipe View:**
   - View detailed cocktail recipes, including instructions, ingredient images, and descriptions.

## Live Demo
Explore the live deployment [here](https://www.boozeapi.com/api/).


# Usage

http://url/api/cocktail/<id> - Search by id (returns 1 cocktail)

https://url/api/cocktail/img/<id>.jpg - Get cocktails image

http://url/api/cocktails/<ids (1,2,3)> - Get multiple cocktails by ID.


# Search

http://url/api/cocktail/?name=<name>&glass=<glass>&category=<category>&ingredients=<ingredients>&alcoholic=<alcoholic> - Search by parameters (Can pass multiple ingredients separated by comma).


# Look up

http://url/api/lookup/random - Get 10 random cocktails. Use ?amount=<amount> to set amount.

http://url/api/lookup/popular - Display popular cocktails from a predefined list.


# Lists

http://url/api/list - Display all categories, alcoholic, glass types and ingredients names.


# Ingredients

http://url/api/ingredient/<id> - Search ingredient by ID.

http://url/api/ingredient/img/<id>.png - Search ingredient by ID.

http://url/api/ingredient/?name=<name> - Search ingredient by name.



If SECRET_KEY is defined in .env file, then add ?key=<key> to your url/api.
