// Імпортуємо React hook для роботи з локальним станом компонента
import { useState } from 'react';
// Імпортуємо Link для навігації між сторінками та useNavigate для програмного перенаправлення
import { Link, useNavigate } from 'react-router-dom';
// Імпортуємо сервіс для роботи з API користувачів
import userService from '../service/users';

function Create() {
  // Хук для програмного перенаправлення користувача на іншу сторінку
  const navigate = useNavigate();
  
  // Стан для зберігання даних форми (ім'я, username, пароль)
  // Початкові значення - порожні рядки
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });
  
  // Стан для зберігання помилки (якщо backend поверне error)
  // null означає що помилки немає
  const [error, setError] = useState(null);
  
  // Стан для індикації завантаження (показує що йде запит до backend)
  // false - не завантажується, true - завантажується
  const [loading, setLoading] = useState(false);

  // Функція викликається при зміні будь-якого input поля
  const handleChange = (e) => {
    // e.target.name - ім'я поля (name/username/password)
    // e.target.value - введене користувачем значення
    setFormData({
      ...formData, // Spread operator - копіюємо всі існуючі значення
      [e.target.name]: e.target.value // Оновлюємо тільки те поле, яке змінилось
    });
  };

  // Функція викликається при submit форми (натискання кнопки Create Account)
  const handleSubmit = async (e) => {
    // Забороняємо перезавантаження сторінки (стандартна поведінка HTML форми)
    e.preventDefault();
    
    // Очищаємо попередню помилку перед новою спробою
    setError(null);
    // Встановлюємо loading в true (показуємо індикатор завантаження)
    setLoading(true);

    try {
      // Викликаємо функцію з userService - відправляємо POST запит на backend
      // formData = { name: "...", username: "...", password: "..." }
      const newUser = await userService.createUser(formData);
      
      // Якщо успішно - виводимо дані створеного користувача в консоль
      console.log('User created:', newUser);
      
      // Очищаємо форму після успішного створення користувача
      setFormData({ name: '', username: '', password: '' });
      
      // Показуємо повідомлення користувачу
      alert('User created successfully! Please login.');
      
      // Перенаправляємо користувача на сторінку логіну
      navigate('/login');
      
    } catch (err) {
      // Якщо сталася помилка - обробляємо її
      
      // Перевіряємо чи є response від сервера з детальною помилкою
      if (err.response && err.response.data) {
        // Якщо є - показуємо повідомлення від backend або загальну помилку
        setError(err.response.data.error || 'Failed to create user');
      } else {
        // Якщо немає відповіді від сервера - мережева помилка
        setError('Network error. Please try again.');
      }
      
      // Виводимо помилку в консоль для debugging
      console.error('Error creating user:', err);
      
    } finally {
      // Блок finally виконується завжди (і при успіху, і при помилці)
      // Вимикаємо індикатор завантаження
      setLoading(false);
    }
  };

  return (
    // Контейнер форми з центруванням та обмеженням ширини
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      {/* Заголовок сторінки */}
      <h1>Create Account</h1>
      
      {/* Форма реєстрації. onSubmit викликає handleSubmit при натисканні кнопки */}
      <form onSubmit={handleSubmit}>
        
        {/* Поле для введення імені */}
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text"  // Тип поля - звичайний текст
            placeholder="Enter name"  // Текст-підказка в полі
            name="name"  // Ім'я поля (використовується в handleChange)
            value={formData.name}  // Значення контролюється React станом
            onChange={handleChange}  // Викликається при кожній зміні
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            required  // HTML5 валідація - поле обов'язкове
          />
        </div>

        {/* Поле для введення username */}
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text" 
            placeholder="Enter username" 
            name="username"  // Ім'я поля змінилось з email на username
            value={formData.username}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            required
          />
        </div>

        {/* Поле для введення пароля */}
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="password"  // Тип password - символи приховані
            placeholder="Enter password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            minLength="3"  // Мінімальна довжина пароля - 3 символи
            required
          />
        </div>

        {/* Умовний рендеринг: показуємо блок помилки тільки якщо error не null */}
        {error && (
          <div style={{
            color: 'red',  // Червоний текст для помилки
            marginBottom: '15px', 
            padding: '10px', 
            backgroundColor: '#ffebee',  // Світло-червоний фон
            borderRadius: '4px'  // Заокруглені кути
          }}>
            {error}  {/* Виводимо текст помилки */}
          </div>
        )}
        
        {/* Кнопка submit */}
        <button 
          type="submit"  // Тип submit - викликає onSubmit форми
          disabled={loading}  // Вимикаємо кнопку під час завантаження
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            // Колір змінюється в залежності від стану loading
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            // Курсор змінюється в залежності від стану
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {/* Умовний рендеринг: текст кнопки змінюється при завантаженні */}
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        
        {/* Посилання для переходу на сторінку логіну */}
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

// Експортуємо компонент для використання в інших файлах
export default Create;
