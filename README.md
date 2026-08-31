# RePara-Backend

## **Tecnologías**

- **Spring Boot**
- **React**
- **MySQL**
- **(luego agregamos la herramienta para tener apk)**

---

## **Inciar el backend leugo del flujo diario**

- **npm install (1 vez nomas)**
- **npm start**

---

## **Flujo de Trabajo en Git**

### **GitHub Flow**

Trabajamos con ramas para desarrollar funcionalidades sin afectar la rama `main`.

Cada integrante trabaja en su propia rama y, al terminar una tarea, crea un **Pull Request (PR)** hacia `main`.

La rama `main` debe mantenerse estable.

---

## **Roles**

**Líder del proyecto**
- Administra el repositorio.
- Revisa los Pull Requests.
- Aprueba los cambios.
- Realiza el Merge hacia `main`.

**Integrantes**
- Trabajan en su propia rama.
- Desarrollan las tareas asignadas.
- Realizan commits.
- Suben sus cambios.
- Crean Pull Requests.

---

## **1. Primera vez — Crear el repositorio**

**Solo el creador del repositorio.**

```bash
git init
git remote add origin <url_del_repositorio>

git add .
git commit -m "proyecto base"

git branch -M main
git push -u origin main
```

## **2. Primera vez — Cada integrante**

**Cada integrante, incluido el líder, realiza estos pasos una sola vez.**

```bash
git clone <url_del_repositorio>
cd <nombre_proyecto>

git checkout -b <mi_rama>
git push -u origin <mi_rama>
```

## **3. Flujo diario — Integrantes**

**Cada integrante trabaja únicamente en su propia rama.**

### **a. Actualizar la rama**

```bash
git checkout <mi_rama>
git pull origin main
```

### **b. Desarrollar**

( -- Realizar la tarea asignada y probar los cambios. -- ) <---- IMPORTANTE

### **c. Guardar y subir cambios**

```bash
git add .
git commit -m "agregar funcionalidad de login"
git push origin <mi_rama>
```

## **4. Crear Pull Request — Integrantes

Cuando la tarea esté terminada:

1. Ir al repositorio en GitHub.
2. Seleccionar la rama personal.
3. Crear un **Pull Request** hacia `main`.
4. Describir brevemente los cambios.
5. Asignar al líder para la revisión.

> **Importante:** No realizar cambios directamente en `main`.

## **5. Revisar Pull Request — Líder

El líder debe:

- Revisar los archivos modificados.
- Verificar que la tarea esté correcta.
- Probar la funcionalidad.
- Revisar que no existan cambios innecesarios.

**Si existen errores:** solicitar cambios al integrante.

**Si todo está correcto:** aprobar el Pull Request y realizar el **Merge** hacia `main`.
