# Beef Backend
Beef backend for interacting with the database.

## Routes
**GET**: `/admin/users/`  
  - Get all users from the database. Would return an array of **partial** user info.
  - Requires admin_key authorization.

**GET**: `/admin/user/:id`  
  - Get a specific user from the database. Would return an array of **partial** user info.
  - Requires admin_key authorization.

**POST**: `/token/discord/:code`
  - Exchange a Discord authorization code for an access token.
  - Would return a jwt token containing the access token data from Discord.


#### Oauth specific routes
**GET**: `/discord/@me`  
  - Gets the current userinfo from Discord of the user.
  - Would require to add the JWT token provided by the **server** in the headers as `authorization`.