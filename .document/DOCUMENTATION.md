# Documentación del Frontend (Cliente) - Crecer Academic Support

## 🎯 ¿Para qué sirve?
Este proyecto es la **Cara Visible e Interactiva (Frontend)** de la plataforma "Apoyo Escolar Crecer". Está diseñado para brindar una experiencia de usuario (UX) rica, rápida y muy visual. Sirve para:
- Ofrecer a los estudiantes un Aula Virtual y un Dashboard atractivo donde pueden ver sus trofeos, lecciones y progreso.
- Consumir el contenido creado por los profesores (videos, iframes de juegos y exámenes interactivos).
- Brindar una interfaz de administración donde los docentes pueden subir clases y gestionar a sus alumnos.

## ⚙️ ¿Qué hace?
- Se conecta en tiempo real a la API (Backend en Ruby on Rails) utilizando **Axios** para descargar los datos reales de la base de datos.
- Genera interfaces responsivas (adaptables a teléfonos, tablets y computadoras de escritorio).
- Maneja un sistema de rutas protegidas (solo puedes ver el Aula Virtual si estás autenticado) a través de `React Router DOM`.
- Renderiza componentes modulares reutilizables como Modales, Sidebars (barras laterales), y Áreas de Juegos.

## 🛠️ Tecnologías Utilizadas
La interfaz de usuario está construida sobre un stack ágil y orientado a componentes:
- **Librería Core:** React (v19+) utilizando Functional Components y Custom Hooks.
- **Empaquetador/Servidor:** Vite (para un arranque en milisegundos y hot-reloading).
- **Estilos:** Tailwind CSS (sistema de utilidades CSS altamente escalable, soporte nativo de modo oscuro/claro y animaciones).
- **Enrutamiento:** React Router DOM v7+.
- **Peticiones HTTP:** Axios (con interceptores para refresco automático del Token de Sesión).
- **Íconos:** Lucide React.

---

## 🚀 ¿Cómo se debe hacer para correr el proyecto?

Sigue estos pasos para arrancar el frontend en tu computadora:

### 1. Pre-requisitos
Asegúrate de tener instalados:
- Node.js (v18 o superior)
- NPM o Yarn

### 2. Configuración de Entorno
Asegúrate de que la aplicación sabe dónde está el backend. Normalmente en un archivo `.env` o configurado directamente en `api.js` para apuntar a `http://localhost:3000/api/v1`.

### 3. Instalación
Abre la terminal en la carpeta raíz del frontend (`client_crecer_academic_support`) y ejecuta:
```bash
# Instalar todas las dependencias (librerías y herramientas)
npm install
```

### 4. Ejecución
Para levantar el servidor de desarrollo, ejecuta:
```bash
npm run dev
```
> **Nota:** La terminal te mostrará una dirección local (por ejemplo `http://localhost:5173`). Ábrela en tu navegador (Google Chrome preferiblemente) y podrás ver la aplicación funcionando. Recuerda que el **Backend (Rails)** también debe estar corriendo al mismo tiempo para poder iniciar sesión.
