# API Gateway - Microservicios de Usuarios

Este proyecto es un **API Gateway** desarrollado con **Node.js** y **Express**, encargado de actuar como punto de entrada único para las peticiones del frontend hacia los microservicios del sistema, en este caso, el **ServicioUsuarios**.

El API Gateway facilita la comunicación entre los servicios, centraliza las rutas, maneja errores y permite una arquitectura más escalable y mantenible.

## Características principales

- Redirige solicitudes al microservicio correspondiente (ServicioUsuarios).
- Unifica las respuestas y el manejo de errores.
- Simplifica la comunicación entre el frontend y los microservicios.
- Permite el uso de autenticación mediante tokens (Bearer JWT).
- Configurable mediante variables de entorno.

## Tecnologías utilizadas

- **Node.js**
- **Express**
- **Axios**
- **Dotenv**
- **CORS**

## Configuración y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/JesusGCastro/APIGatewaySorteos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear archivo .env
```bash
PORT=8080
USER_SERVICE_URL=https://serviciousuarios.onrender.com/api/users
```

### 4. Ejecutar el servidor
```bash
npm start
```
