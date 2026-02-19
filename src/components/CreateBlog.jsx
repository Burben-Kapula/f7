import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function CreateBlog() {
  const navigate = useNavigate();
  const [user] = useState(() => {   
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'null') {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // const [image, setImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Якщо користувач не залогінений - редірект на логін
  if (!user) {
    navigate('/login');
    return null;
  }

  // Зміна тексту в інпутах
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Обробка вибору файлу
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   
  //   if (!file) return;
  //
  //   // Перевірка типу файлу
  //   if (!file.type.startsWith('image/')) {
  //     setError('Please select an image file');
  //     return;
  //   }
  //
  //   // Перевірка розміру (максимум 5MB)
  //   if (file.size > 5 * 1024 * 1024) {
  //     setError('Image size must be less than 5MB');
  //     return;
  //   }
  //
  //   setImage(file);
  //   setError(null);
  //
  //   // Створюємо preview зображення
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setImagePreview(reader.result);
  //   };
  //   reader.readAsDataURL(file);
  // };

  // Видалення вибраного зображення
  // const handleRemoveImage = () => {
  //   setImage(null);
  //   setImagePreview(null);
  // };

  // Відправка форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

try {
  // Валідація на фронтенді
  if (formData.title.length < 3) {
    setError('Title must be at least 3 characters')
    setLoading(false)
    return
  }

  if (!formData.content) {
    setError('Content is required')
    setLoading(false)
    return
  }

  // Відправляємо звичайний JSON
  const response = await axios.post(`${API_URL}/blogs`, {
    title: formData.title,
    content: formData.content,
    userId: user.id
  })

  console.log('Blog created:', response.data)

  setFormData({ title: '', content: '' })

  alert('Blog created successfully! ✅')

  // 🔄 Перезавантажити сторінку для оновлення всіх даних/Redux
  window.location.reload()

} catch (err) {
  setError(err.response?.data?.error || 'Failed to create blog')
  console.error('Error creating blog:', err)
} finally {
  setLoading(false)
}}
;

  return (
    <div className="create-blog-container">
      <h1>✍️ Create New Blog</h1>

      <form onSubmit={handleSubmit} className="blog-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter blog title..."
            value={formData.title}
            onChange={handleChange}
            required
            minLength={3}
          />
        </div>

        {/* Content */}
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your blog content..."
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
          />
        </div>

        {/* Image Upload - ЗАКОМЕНТОВАНО */}
        {/* <div className="form-group">
          <label htmlFor="image">Image (optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          
          {!imagePreview ? (
            <label htmlFor="image" className="image-upload-btn">
              📷 Choose Image
            </label>
          ) : (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="remove-image-btn"
              >
                ❌ Remove
              </button>
            </div>
          )}
          <p className="image-hint">Max size: 5MB. Supported: JPG, PNG, GIF, WebP</p>
        </div> */}

        {/* Error message */}
        {error && <div className="error-message">{error}</div>}

        {/* Submit button */}
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : '📝 Create Blog'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
