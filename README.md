# NWEN304 Group Assignment

## Database

Use `postgres` version 9.5 or above.

### Environment variables

ENV Name         | Default   | Whats it for
-----------------|-----------|--------------
`POSTGRES_USER`  | postgres  | postgres username 
`POSTGRES_PASS`  |           | postgres password 
`POSTGRES_HOST`  | localhost | postgres host 
`POSTGRES_DB  `  | postgres  | postgres database name 
`DATABASE_URL `  |           | overrides other variables and directly passes a url

It is recommended to use `DATABASE_URL` and set it to same url used in setting
up the database.
