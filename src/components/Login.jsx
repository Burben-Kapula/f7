// Імпортуємо React hooks
import { useState } from 'react';
// Імпортуємо axios для HTTP запитів
import axios from 'axios';
// Імпортуємо useNavigate для редіректу
import { useNavigate } from 'react-router-dom';
import {  Link } from 'react-router-dom'
import Create from './Create';

const API_URL = 'http://localhost:3001/api';

function Login() {
  // Hook для програмного редіректу
  const navigate = useNavigate();
  
  // Стан для зберігання даних форми логіну
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Функція для зміни input полів
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Функція для відправки форми логіну
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Відправляємо POST запит на /api/login
      const response = await axios.post(`${API_URL}/login`, formData);
      
      console.log('Login successful:', response.data);
      
      // Зберігаємо дані користувача в localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Очищаємо форму
      setFormData({ email: '', password: '' });
      
      // **РЕДІРЕКТ НА ГОЛОВНУ СТОРІНКУ**
      navigate('/');  // Кидає на root route
      
    } catch (err) {
      // Показуємо помилку
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login to your account</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter email" 
          name="email" 
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input 
          type="password" 
          placeholder="Enter password" 
          name="password" 
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        {/* Показуємо помилку якщо вона є */}
        {error && <div style={{color: 'red'}}>{error}</div>}
        
        {/* Кнопка submit */}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {/* Посилання на реєстрацію */}
      <p>
        Don't have an account? <Link to={"/create"}>Register here</Link>
      </p>
    </div>
  );
}

export default Login;
