# Beef Backend
Beef backend for interacting with the database.

## Routes
 
| Method | Path |
| :---: | :---: |
| GET | `/users` |
| GET | `/users/id/:id` |

## Queries & Params
- `/users`  
  **Params**: N/A  
  **Queries**:
  | Query | Value | Description |
  | :---: | :---: | :---: |
  | `?limit` | `number` | The limit of users to fetch from the database. |

- `/users/id/:id`  
  **Params**: 
  | Param | Value | Description |
  | :---: | :---: | :---: |
  | `:id` | `number` | The UserId of the user to fetch from the database. |  

  **Queries**: N/A