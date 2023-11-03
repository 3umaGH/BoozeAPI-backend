# CocktailDB-API

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