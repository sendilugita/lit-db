### lit-db
penyimpanan local sederhana berbasis file json

### run via CLI
```
lit -p <port> <filename>
```

### method
get data by id
```
GET http://localhost:port/{path}/:id
```
post data / add data
```
POST http://localhost:port/{path}
body: JSON
```
delete data by id
```
DELETE http://localhost:port/{path}/:id
```