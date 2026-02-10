import { useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'

const departments = ['Engineering', 'Human Resources', 'Marketing', 'Finance', 'Sales']

function EmployeeForm({ onAddEmployee }) {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    gender: '',
    department: departments[0],
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formValues.name || !formValues.email || !formValues.gender) {
      return
    }

    onAddEmployee(formValues)

    setFormValues({
      name: '',
      email: '',
      gender: '',
      department: departments[0],
    })
  }

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formValues.name}
          onChange={handleChange}
          placeholder="Enter full name"
        />
      </div>

      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="name@example.com"
        />
      </div>

      <div className="form-row">
        <span>Gender</span>
        <div className="gender-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formValues.gender === 'Male'}
              onChange={handleChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formValues.gender === 'Female'}
              onChange={handleChange}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Other"
              checked={formValues.gender === 'Other'}
              onChange={handleChange}
            />
            Other
          </label>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="department">Department</label>
        <select
          id="department"
          name="department"
          value={formValues.department}
          onChange={handleChange}
        >
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="primary-button">
        Add employee
      </button>
    </form>
  )
}

function EmployeeList({ employees, onDeleteEmployee }) {
  const hasEmployees = employees.length > 0

  return (
    <div className="employee-list">
      <table className="employee-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hasEmployees ? (
            employees.map((employee, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.gender}</td>
                <td>{employee.department}</td>
                <td className="actions-cell">
                  <div className="table-actions">
                    <Link className="secondary-button" to={`/employee/${index}`}>
                      View
                    </Link>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => onDeleteEmployee(index)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="employee-table-empty-row">
              <td colSpan={6}>No employees added yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function EmployeeDetail({ employees }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const index = Number.parseInt(id ?? '', 10)
  const employee = Number.isFinite(index) ? employees[index] : undefined

  return (
    <main className="app">
      <header className="app-header">
        <h1>Employee Details</h1>
        <p>View a single employee record.</p>
      </header>

      <section className="app-layout">
        <section className="panel">
          {employee ? (
            <div className="employee-detail">
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value">{employee.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{employee.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gender</span>
                <span className="detail-value">{employee.gender}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department</span>
                <span className="detail-value">{employee.department}</span>
              </div>
            </div>
          ) : (
            <p className="empty-state">Employee not found.</p>
          )}

          <div className="detail-actions">
            <button type="button" className="secondary-button" onClick={() => navigate('/')}>
              Back to list
            </button>
          </div>
        </section>
      </section>
    </main>
  )
}

function EmployeeManager({ employees, onAddEmployee, onDeleteEmployee }) {
  return (
    <main className="app">
      <header className="app-header">
        <h1>Employee Manager</h1>
        <p>Add employees and view them in the table.</p>
      </header>

      <section className="app-layout">
        <section className="panel">
          <h2>Add a new employee</h2>
          <EmployeeForm onAddEmployee={onAddEmployee} />
        </section>

        <section className="panel">
          <h2>Employees</h2>
          <EmployeeList employees={employees} onDeleteEmployee={onDeleteEmployee} />
        </section>
      </section>
    </main>
  )
}

function App() {
  const [employees, setEmployees] = useState([])

  const handleAddEmployee = (employee) => {
    setEmployees((previous) => [...previous, employee])
  }

  const handleDeleteEmployee = (indexToRemove) => {
    setEmployees((previous) => previous.filter((_, index) => index !== indexToRemove))
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <EmployeeManager
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        }
      />
      <Route path="/employee/:id" element={<EmployeeDetail employees={employees} />} />
    </Routes>
  )
}

export default App
