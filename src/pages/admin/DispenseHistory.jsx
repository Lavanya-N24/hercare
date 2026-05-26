import './DispenseHistory.css'

// Mock dispense history
const dispenses = [
  { id: 'D001', machineId: 'M001', machine: 'Main Block', time: '2025-02-08 10:30', userId: 'user_1' },
  { id: 'D002', machineId: 'M003', machine: 'Library', time: '2025-02-08 09:15', userId: 'user_2' },
  { id: 'D003', machineId: 'M002', machine: 'Girls Hostel', time: '2025-02-07 16:45', userId: 'user_3' },
  { id: 'D004', machineId: 'M005', machine: 'City Hospital', time: '2025-02-07 14:20', userId: 'user_4' },
]

export default function DispenseHistory() {
  return (
    <div className="dispense-history">
      <header>
        <h1>Dispense History</h1>
        <p>All dispensed napkins across machines</p>
      </header>

      <div className="dispense-table-wrap">
        <table className="dispense-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Machine</th>
              <th>Time</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {dispenses.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.machine}</td>
                <td>{d.time}</td>
                <td>{d.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
