# 🚀 Demo: Inspección Continua con SonarQube Cloud

**Trabajo Práctico Integrador - Administración de Sistemas de Información**  
**Universidad Tecnológica Nacional - Facultad Regional La Plata (UTN FRLP)**  
**Autores:** 
- Egüen Agustina
- Pascucci Agostina
- Perez Nicolas
- Smith Justina
- Talavera Santiago


---

## 📋 Descripción del Proyecto

Este repositorio contiene una prueba de concepto (PoC) diseñada para demostrar la implementación práctica de **SonarQube Cloud** en un entorno de Integración Continua (CI). El objetivo es ilustrar el paradigma de **Shift-Left Testing** y la filosofía **Clean as You Code**, automatizando la detección de deuda técnica, vulnerabilidades y *code smells* antes de que el código llegue a producción.

La aplicación base es una API simulada construida en **Node.js y TypeScript** (Express) que expone un endpoint de procesamiento de pagos.

## 🛠️ Stack Tecnológico y Arquitectura

*   **Lenguaje:** TypeScript / Node.js
*   **Framework:** Express
*   **Análisis Estático (SAST):** SonarQube Cloud
*   **Pipeline CI/CD:** GitHub Actions
*   **Control de Versiones:** Git / GitHub

## 🎯 Conceptos Evaluados en la Demostración

El repositorio está preparado para ejecutar un caso de estudio en vivo durante la exposición de la cátedra, demostrando cómo SonarQube intercepta malas prácticas:

1.  **Vulnerabilidades Críticas (OWASP):** Detección de Inyección SQL (CWE-89).
2.  **Security Hotspots:** Identificación de credenciales en texto plano (*hardcoded secrets*).
3.  **Mantenibilidad (Método SQALE):** Medición de la Complejidad Cognitiva mediante la evaluación de estructuras de control excesivamente anidadas.
4.  **Quality Gates:** Bloqueo automático de *Pull Requests* que no cumplen con los estándares corporativos.

## ⚙️ Configuración y Ejecución Local

Si deseas correr la API base en tu entorno local para pruebas:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/demo-asi-sonarqube.git](https://github.com/TU_USUARIO/demo-asi-sonarqube.git)
    cd demo-asi-sonarqube
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Compilar TypeScript a JavaScript:**
    ```bash
    npm run build
    ```
4.  **Iniciar el servidor:**
    ```bash
    npm start
    ```

## 🔄 Flujo de la Demostración (CI/CD)

El pipeline automatizado en `.github/workflows/sonar.yml` se dispara bajo las siguientes condiciones:
*   Cada vez que se abre, sincroniza o reabre un **Pull Request** hacia la rama `main`.
*   Cada vez que se realiza un **Push** directo a la rama `main`.

**Pasos de la demostración en vivo:**
1.  Se crea una nueva rama (ejemplo: `feature/modulo-pagos`).
2.  Se introduce código con fallas de seguridad y alta complejidad algorítmica.
3.  Se abre un Pull Request hacia `main`.
4.  **GitHub Actions** ejecuta el `SonarCloud Scan`.
5.  El **Quality Gate falla (❌)**, bloqueando la integración.
6.  Se refactoriza el código aplicando buenas prácticas (eliminando secretos, parametrizando consultas y aplicando *early returns*).
7.  El nuevo análisis aprueba el **Quality Gate (✅)**, permitiendo el despliegue seguro.