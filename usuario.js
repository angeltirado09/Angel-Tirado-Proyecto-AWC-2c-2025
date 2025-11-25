document.addEventListener("DOMContentLoaded", () => {
            const loginForm = document.getElementById("login-form");
            const registerForm = document.getElementById("register-form");
            const loginMessage = document.getElementById("login-message");
            const registerMessage = document.getElementById("register-message");

            // --- Lógica de Registro ---
            registerForm.addEventListener("submit", (e) => {
                e.preventDefault(); // Prevenir envío de formulario
                
                // Obtener valores
                const name = document.getElementById("register-name").value;
                const email = document.getElementById("register-email").value;
                const password = document.getElementById("register-password").value;

                // Obtener usuarios existentes de localStorage o crear array vacío
                let users = JSON.parse(localStorage.getItem('laEsenciaUsers')) || [];

                // Verificar si el email ya existe
                const userExists = users.find(user => user.email === email);

                if (userExists) {
                    showMessage(registerMessage, "Este email ya está registrado.", "error");
                } else {
                    // Agregar nuevo usuario
                    const newUser = { name, email, password }; 
                    users.push(newUser);
                    localStorage.setItem('laEsenciaUsers', JSON.stringify(users));
                    
                    showMessage(registerMessage, "¡Registro exitoso! Ya puedes iniciar sesión.", "success");
                    registerForm.reset(); // Limpiar formulario
                }
            });

            // --- Lógica de Inicio de Sesión ---
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();

                // Obtener valores
                const email = document.getElementById("login-email").value;
                const password = document.getElementById("login-password").value;

                // Obtener usuarios
                let users = JSON.parse(localStorage.getItem('laEsenciaUsers')) || [];

                // Buscar usuario
                const user = users.find(user => user.email === email && user.password === password);

                if (user) {
                    // Usuario encontrado
                    showMessage(loginMessage, `¡Bienvenido, ${user.name}! Redirigiendo...`, "success");
                    
                    // Guardar sesión (sessionStorage se borra al cerrar el navegador)
                    sessionStorage.setItem('loggedInUser', JSON.stringify(user));

                    // Redirigir al inicio después de 2 segundos
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);

                } else {
                    // Usuario no encontrado
                    showMessage(loginMessage, "Email o contraseña incorrectos.", "error");
                }
            });

            // --- Función para mostrar mensajes ---
            function showMessage(element, text, type) {
                element.textContent = text;
                element.className = `message ${type}`; // 'message success' o 'message error'
            }
        });