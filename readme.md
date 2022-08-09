# Prueba Técnica - Programador (Back-end)


1. npm install
2. npm run dev


rutas :

http://localhost:3000  -  GET   -  
http://localhost:3000  -  POST  -  Recibe del body (plate: varchar 6 digitos)
http://localhost:3000/register_entry/id  -  POST  -  Recibe body(plate: varchar 6 digitos)  -  Recibe parametro (id)
http://localhost:3000/register_output/id  -  POST  -  Recibe body(plate: varchar 6 digitos)  -  Recibe parametro (id)
http://localhost:3000/assign_official_vehicle/id   -  POST  -  Recibe body(plate: varchar 6 digitos)  -  Recibe parametro (id)
http://localhost:3000/assign_resident_vehicle/id   -  POST  -  Recibe body(plate: varchar 6 digitos)  -  Recibe parametro (id)
http://localhost:3000/get_pay   -  POST  -  Recibe body(plate: varchar 6 digitos)
http://localhost:3000/get_pay_det   -  POST  -  Recibe body(plate: varchar 6 digitos)


