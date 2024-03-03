import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees
    .filter(employee =>
      employee.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(
    employees
      .filter(employee =>
        employee.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .length / employeesPerPage
  );

  const sortData = (key) => {
    if (sortBy === key) {
      setEmployees([...employees].reverse());
      setSortBy('');
    } else {
      const sortedEmployees = [...employees].sort((a, b) => {
        if (key === 'date') {
          return new Date(a.created_at) - new Date(b.created_at);
        } else if (key === 'time') {
          const timeA = new Date(a.created_at).toLocaleTimeString();
          const timeB = new Date(b.created_at).toLocaleTimeString();
          return timeA.localeCompare(timeB);
        }
        return 0;
      });
      setEmployees(sortedEmployees);
      setSortBy(key);
    }
  };

  return (
    <div>
      <h1>Employee Records</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={() => sortData('date')}>Sort by Date</button>
        <button onClick={() => sortData('time')}>Sort by Time</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.sno}</td>
              <td>{employee.customer_name}</td>
              <td>{employee.age}</td>
              <td>{employee.phone}</td>
              <td>{employee.location}</td>
              <td>{new Date(employee.created_at).toLocaleDateString()}</td>
              <td>{new Date(employee.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={currentPage === i + 1 ? 'active' : ''}>
              <button onClick={() => paginate(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
