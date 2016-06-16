# RESTful API

## Products

### get all

Endpoint: `/api/products`

Method: `GET`

Parameters: None

Requirements: None

Response

Status: `200`
```
{
    success: true,
    data: [
        { ... }
    ]
}
```

### suggest

Endpoint: `/api/products/suggest?city=<city>`

Method: `GET`

Requirements: None

Parameters:

| Name | value |
|------|-------|
| city | city to get a suggestion for |

Response

Status: `200`
```
{
    success: true,
    data: [
        { ...Tag Objects... }
    ]
}
```

### new

Endpoint: `/api/products/`

Method: `POST`

Requirements: Logged in as administrator

Parameters:

| Name | value |
|------|-------|
| price | double, greater than zero |
| name | string, length greater than zero |

Response with valid Parameters

Status: `200`
```
{
    success: true,
    data: { ...Product Object... }
}
```

Response with invalid Parameters

Status: `400`
```
{
    success: false,
    error: "..."
}
```

> note: error message decedent on request


### get single

Endpoint: `/api/products/:id`

Method: `GET`

Requirements: None

Parameters:

| Name | value |
|------|-------|
| `:id` | id of products |

Response when getting valid id

Status: `200`
```
{
    success: true,
    data: { ...Product Object... }
}
```

Response when getting invalid id

Status: `404`
```
{
    success: false,
    error: "Product not found"
}
```



### update single

Endpoint: `/api/products/:id`

Method: `PUT`

Requirements: Logged in as administrator

Parameters:

| Name | value |
|------|-------|
| `:id` | id of products |
| name | new name of product |
| price | new price of product |

Response when getting valid id

Status: `200`
```
{
    success: true,
    data: { ...Product Object... }
}
```

Response when getting invalid id

Status: `404`
```
{
    success: false,
    error: "Product not found"
}
```

Response when getting valid id and incorrect parameters

Status: `400`
```
{
    success: false,
    error: "...."
}
```

### delete single

Endpoint: `/api/products/:id`

Method: `DELETE`

Requirements: Logged in as administrator

Parameters:

| Name | value |
|------|-------|
| `:id` | id of products |

Response when getting valid id

Status: `200`
```
{
    success: true,
    data: { ...Product Object... }
}
```

Response when getting invalid id

Status: `404`
```
{
    success: false,
    error: "Product not found"
}
```

## Cart

All cart functions require that the callee is an authenticated user, otherwise
returns:

Status: `403`
```
{
    success: false,
    eror: "Unauthoirzed"
}
```

### Get all

Endpoint: `/api/cart`

Method: `GET`

Requirements: Authenticated user

Parameters: None

Response

Status: `200`
```
{
    success: true,
    data: [
        { ...Cart Objects... }
    ]
}
```

### new

Endpoint: `/api/cart`

Method: `POST`

Requirements: Logged in as administrator

Parameters:

| Name | value |
|------|-------|
| product_id | id of products to add to cart |
| quantity | number of products to add to cart |

Response when getting valid parameters

Status: `200`
```
{
    success: true,
    data: { ...Cart Object... }
}
```

### buy

Endpoint: `/api/cart/buy`

Method: `POST`

Requirements: Logged in as administrator

Parameters: None

Response

Status: `200`
```
{
    success: true,
    data: { ...Cart Object... }
}
```

### get single

Endpoint: `/api/cart/:id`

Method: `GET`

Requirements: None

Parameters:

| Name | value |
|------|-------|
| `:id` | id of cart item |

Response when getting valid id

Status: `200`
```
{
    success: true,
    data: { ...Cart Object... }
}
```

Response when getting invalid id

Status: `404`
```
{
    success: false,
    error: "Cart item not found"
}
```

### update single

Endpoint: `/api/cart/:id`

Method: `POST`

Requirements: None

Parameters:

| Name | value |
|------|-------|
| `:id` | id of cart item |
| quantity | integer, number of products, greater than zero |

Response when getting valid id

Status: `200`
```
{
    success: true,
    data: { ...Cart Object... }
}
```

Response when getting invalid id

Status: `404`
```
{
    success: false,
    error: "Cart item not found"
}
```

### delete single

Endpoint: `/api/cart/:id`

Method: `DELETE`

Requirements: None

Parameters:

| Name | value |
|------|-------|
| `:id` | id of cart item |

Response when getting valid id

Status: `200`
```
{
    success: true,
    data: { ...Cart Object... }
}
```

Response when getting invalid id

Status: `404`
```
{
    success: false,
    error: "Cart item not found"
}
```

## Other

Calling a undefined API will result in

Status: `404`
```
{
    success: false,
    eror: "API endpoint does not exist"
}
```

Calling an authorized endpoint, such as new product, unauthorized will result
in the response of:

Status: `403`
```
{
    success: false,
    eror: "Unauthoirzed"
}
```

