const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', () => {
    // Login form handler
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                const messageDiv = document.getElementById('message');
                
                if (data.success) {
                    messageDiv.innerHTML = '<div class="success">Login successful! Redirecting...</div>';
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    messageDiv.innerHTML = '<div class="error">' + data.message + '</div>';
                }
            } catch (error) {
                document.getElementById('message').innerHTML = '<div class="error">Connection error</div>';
            }
        });
    }

    // Signup form handler
    if (document.getElementById('signupForm')) {
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                const messageDiv = document.getElementById('message');
                
                if (data.success) {
                    messageDiv.innerHTML = '<div class="success">Account created! <a href="index.html">Login here</a></div>';
                } else {
                    messageDiv.innerHTML = '<div class="error">' + data.message + '</div>';
                }
            } catch (error) {
                document.getElementById('message').innerHTML = '<div class="error">Connection error</div>';
            }
        });
    }
});