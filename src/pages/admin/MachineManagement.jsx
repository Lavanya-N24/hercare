import { machines } from '../../data/machines'
import './MachineManagement.css'

export default function MachineManagement() {
  return (
    <div className="machine-management">
      <header>
        <h1>Machine Management</h1>
        <p>All napkin vending machines — colleges, offices, hospitals, public spaces</p>
      </header>

      <div className="machine-table-wrap">
        <table className="machine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Sector</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.id} className={m.stock < 10 ? 'low-stock' : ''}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>{m.location}</td>
                <td>{m.sector}</td>
                <td>{m.stock}</td>
                <td>
                  <span className={`status-badge ${m.stock === 0 ? 'empty' : m.stock < 10 ? 'low' : 'ok'}`}>
                    {m.stock === 0 ? 'Empty' : m.stock < 10 ? 'Low' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
