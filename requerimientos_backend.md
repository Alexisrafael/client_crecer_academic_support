# Requerimientos para el Backend (API)

Este documento detalla las rutas, métodos y estructuras de datos (JSON) que el frontend espera recibir del backend para que las vistas actuales (`Dashboard`, `Subjects`, `SubjectDetail`) funcionen correctamente y dejen de depender de datos falsos (mocks).

## 1. Vista: Dashboard (Aula Virtual)

El Dashboard principal muestra un resumen de las actividades, la continuidad del último video visto y el progreso de las materias.

**Endpoint esperado:**
- **Ruta:** `GET /api/v1/dashboard`
- **Autenticación:** Requerida (Cookie HttpOnly)

**Estructura del JSON de Respuesta (200 OK):**

```json
{
  "user": {
    "first_name": "Nombre",
    "last_name": "Apellido",
    "email": "correo@ejemplo.com",
    "role": "student" // o "admin" / "teacher"
  },
  "activities": [
    {
      "id": 1,
      "title": "Ejercicios de Álgebra",
      "subject": "Matemáticas",
      "status": "pending", // "pending" o "completed"
      "deadline": "Mañana", // Fecha o string descriptivo
      "score": null // Puede ser null si está pendiente, ej: "10/10" si está "completed"
    }
  ],
  "last_video": {
    "subject": "Ciencias",
    "title": "El Sistema Solar",
    "duration": "12:30",
    "hasContinuity": true,
    "nextVideo": "Fases de la Luna"
  },
  "subjects_progress": [
    {
      "name": "Matemáticas",
      "progress": 45,
      "classesTaken": true,
      "color": "bg-blue-500"
    }
  ]
}
```

---

## 2. Vista: Materias (Subjects)

### A. Listar Materias
- **Ruta:** `GET /api/v1/subjects`
- **Autenticación:** Requerida

**Estructura del JSON de Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Matemáticas",
    "description": "Números y operaciones",
    "icon_color": "bg-blue-500",
    "is_active": true
  }
]
```

### B. Gestión de Materias (Solo Admins)
- **Crear Materia:** `POST /api/v1/subjects` (Body: `name`, `description`, `icon_color`, `is_active`).
- **Actualizar Materia:** `PUT /api/v1/subjects/:id`.
- **Eliminar Materia:** `DELETE /api/v1/subjects/:id`.

---

## 3. Vista: Detalle de Materia (Subject Detail)
Aquí la lógica se divide entre el Estudiante y el Profesor.
*Nota de Arquitectura:* Una **Materia** (Subject) tiene **Muchos Profesores** (Teachers). Un **Profesor** crea **Clases** (Classes) para esa materia. Las **Clases** tienen **Actividades** y **Dinámicas**. Un **Estudiante** se inscribe al grupo de clases de un profesor.

### A. Vista de Estudiante (Rol `student`)

**Paso 1: Obtener Profesores de una Materia**
- **Ruta:** `GET /api/v1/subjects/:subject_id/teachers`
- **Respuesta Esperada:**
```json
[
  {
    "id": 101,
    "first_name": "Profe Juan",
    "last_name": "Pérez",
    "description": "Experto en Álgebra"
  }
]
```

**Paso 2: Obtener las Clases de un Profesor (Dentro de la Materia)**
- **Ruta:** `GET /api/v1/subjects/:subject_id/teachers/:teacher_id/classes`
- **Respuesta Esperada:**
```json
[
  {
    "id": 501,
    "title": "Ecuaciones Lineales",
    "description": "Introducción a las ecuaciones",
    "is_enrolled": false // Indica si el estudiante actual está inscrito a este grupo
  }
]
```

**Paso 3: Inscribirse al Grupo del Profesor**
- **Ruta:** `POST /api/v1/subjects/:subject_id/teachers/:teacher_id/enroll`
- **Respuesta Esperada:** `200 OK` (Indica que el estudiante ahora tiene acceso a ver los videos, dinámicas y actividades de esas clases).

### B. Vista de Profesor (Rol `teacher` o `admin`)

**Paso 1: Obtener las clases que YO dicto para esta materia**
- **Ruta:** `GET /api/v1/subjects/:subject_id/my_classes`
- **Respuesta Esperada:** Mismo formato que las clases, incluyendo quizás estadísticas básicas.

**Paso 2: Gestión de Clases (CRUD)**
- **Crear Clase:** `POST /api/v1/subjects/:subject_id/classes`
- **Actualizar Clase:** `PUT /api/v1/classes/:id`
- **Eliminar Clase:** `DELETE /api/v1/classes/:id`

**Paso 3: Gestión de Actividades y Dinámicas de una Clase**
- **Crear Actividad:** `POST /api/v1/classes/:class_id/activities`
- **Crear Dinámica:** `POST /api/v1/classes/:class_id/dynamics`
- (Deberán existir sus correspondientes `PUT` y `DELETE`).

---

## 4. Próximas Funcionalidades (Actividades y Perfil)
- **Actividades Globales:** `GET /api/v1/activities` (Para la barra lateral).
- **Perfil:** `GET /api/v1/profile` (Para la vista de usuario).
