## Installation

```bash
$ npm install
```


## Database

Environment variables for database connection are described in ```.env.example```

```bash
# requires MS SQL Server on your machine
$ npm run db-init
```

## Running the app

```bash

# run built app
$ npm run start

# build
$ npm run build

# development
$ npm run dev

```

# API Documentation
## Base URL
http://localhost:80

## Endpoints
1. ### GET /dogs
    Returns list of dogs and you can use additional query params (limit = amount of items to grab):
        - to order: ?attribute=weight&order=desc
        - paginate: ?pageNumber=1&limit=1&pageSize=2

2. ### GET /ping
    Returns "Dogshouseservice.Version1.0.1"

3. ### POST /dog
    Creates dog in database. Requires following params in JSON body:
        - name:string
        - color:string
        - tail_length:number
        - weight:number