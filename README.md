# Backend-ProyectoFinal
## Nuevas funcionalidades

El proyecto ahora incluye las siguientes funcionalidades:

- Los usuarios ahora tienen un carrito vinculado a su cuenta al registrarse.
- Endpoint `/api/sessions/current` devuelve el usuario autenticado.

## Corrección de errores

Se realizaron los siguientes cambios:

- Ahora la validación para el usuario administrador se realiza a partir del email y no del _id.

## Uso

1. Descarga o clona este repositorio a tu máquina local:
   ```bash
   git clone -b practica_integradora_2 https://github.com/santiago-sanguinetti/Backend-ProyectoFinal.git
   ```
2. Abre una terminal en la ubicación del repositorio clonado.
   
3. Instala las dependencias utilizando npm:
   ```bash
   npm install
   ```
4. Inicia el servidor con 
   ```bash
   npm start
   ```
