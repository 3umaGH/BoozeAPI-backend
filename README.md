# CocktailDB-API

# Usage
http://url/cocktail/<id>- Search by id (returns 1 cocktail)

http://url/cocktails/<ids (1,2,3)>- Search by multiple ids (returns all found cocktails)

http://url/search/?name=<name> - Search by name.


If SECRET_KEY is defined in .env file, then add ?key=<key> to your url.