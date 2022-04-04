# Beef Backend
Beef backend for interacting with the database.

## Routes
**GET**: `/admin/users/`  
  - Get all users from the database. Would return an array of **partial** user info.
  - Requires admin_key authorization.

**GET**: `/admin/user/:id`  
  - Get a specific user from the database. Would return a **partial** user info.
  - Requires admin_key authorization.

**POST**: `/token/[discord|github|google]/:code`
  - Exchange an authorization code for an access token.
  - Would return a jwt token containing the access token data from the site used.


#### Oauth specific routes
**GET**: `/oauth/@me`  
  - Gets the current userinfo of the user via oauth.
  - Would require to add the JWT token provided by the **server** in the headers as `authorization`.