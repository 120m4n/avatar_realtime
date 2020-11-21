# avatar_realtime
Muestra la localizacion de personal en tiempo real, mediante la geolocalizacion. 

Inicia el servidor mediante: Node server.js

El servidor crea un endpoint tipo POST en la ruta /api/pushLocation que recibe mensajes de la forma: {user_id: 'Demo', location :[lon, lat], name: 'pepito'}
