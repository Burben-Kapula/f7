import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import '../components/styles/UsersView.css'

const UserView = () => {
  // всі юзери з Redux
  const users = useSelector(state => state.users)
  // всі блоги з Redux
  const blogs = useSelector(state => state.blogs)

  if (!users || users.length === 0) return null

  // сортуємо юзерів по імені
  const sortedUsers = [...users].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  // функція: скільки блогів належить цьому юзеру
  const countBlogsForUser = (user) => {
    // у блогів може бути різна структура автора, тупо використовуємо таку саму логіку як в isOwner
    return blogs.filter(blog => {
      let authorId = null

      if (typeof blog.author === 'string') {
        authorId = blog.author              // author як id
      } else if (blog.author && blog.author.id) {
        authorId = blog.author.id           // author як обʼєкт з id
      } else if (blog.userId) {
        authorId = blog.userId              // fallback поле userId
      }

      return authorId === (user.id || user._id)
    }).length
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user.id || user._id}>
              <td>
                <Link to={`/users/${user.id || user._id}`}>
                  {user.name}
                </Link>
              </td>
              <td>{countBlogsForUser(user)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserView
