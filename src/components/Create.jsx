
// Імпортуємо React hook для роботи з локальним станом компонента
import { useState } from 'react';
// Імпортуємо функцію для відправки даних на backend
import { createUser } from '../service/api';
import { Link } from 'react-router-dom';  // Імпортуй Link!

function Create() {
  // Стан для зберігання даних форми (ім'я, email, пароль)
  // Початкові значення - порожні рядки
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  // Стан для зберігання помилки (якщо backend поверне error)
  const [error, setError] = useState(null);
  
  // Стан для індикації завантаження (показує що йде запит до backend)
  const [loading, setLoading] = useState(false);

  // Функція викликається при зміні будь-якого input поля
  const handleChange = (e) => {
    // e.target.name - ім'я поля (name/email/password)
    // e.target.value - введене значення
    setFormData({
      ...formData, // Зберігаємо старі значення
      [e.target.name]: e.target.value // Оновлюємо тільки змінене поле
    });
  };

  // Функція викликається при submit форми (натискання кнопки)
  const handleSubmit = async (e) => {
    // Забороняємо перезавантаження сторінки (стандартна поведінка форми)
    e.preventDefault();
    
    // Очищаємо попередню помилку
    setError(null);
    // Встановлюємо loading в true (показуємо індикатор завантаження)
    setLoading(true);

    try {
      // Викликаємо функцію з api.js - відправляємо дані на backend
      // formData = { name: "...", email: "...", password: "..." }
      const newUser = await createUser(formData);
      
      // Якщо успішно - виводимо дані в консоль
      console.log('User created:', newUser);
      
      // Очищаємо форму після успішного створення
      setFormData({ name: '', email: '', password: '' });
      
      // Показуємо повідомлення користувачу
      alert('User created successfully!');
    } catch (err) {
      // Якщо помилка - зберігаємо її в стан для показу користувачу
      setError(err);
      console.error('Error:', err);
    } finally {
      // В будь-якому випадку вимикаємо індикатор завантаження
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Create Page</h1>
      <p>Це Create сторінка</p>
      <div>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter name: " 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required/>
          <input 
            type="email" 
            placeholder="Enter email: " 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required/>
          <input 
            type="password" 
            placeholder="Enter password: " 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            required/>
          {/* Показуємо помилку якщо вона є */}
          {error && <div style={{color: 'red'}}>{error}</div>}
          
          {/* Кнопка submit - disabled коли йде завантаження */}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}  {/* Змінюємо текст при завантаженні */}
          </button>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Create
