import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, CheckCircle } from 'lucide-react'
import './QRScanner.css'

export default function QRScanner() {
  const [scanResult, setScanResult] = useState(null)
  const [dispensing, setDispensing] = useState(false)
  const [success, setSuccess] = useState(false)
  const videoRef = useRef(null)
  const navigate = useNavigate()

  // Simulate QR scan - in real app would use html5-qrcode or similar
  const simulateScan = () => {
    setScanResult({ machineId: 'M001', machineName: 'Main Block - Ground Floor' })
  }

  const handleDispense = async () => {
    if (!scanResult) return
    setDispensing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setDispensing(false)
    setSuccess(true)
  }

  return (
    <div className="qr-scanner">
      <header>
        <h1>Scan QR Code</h1>
        <p>Point your camera at the QR code on the machine</p>
      </header>

      <div className="scanner-area">
        <div className="scanner-placeholder">
          <QrCode className="scanner-icon" />
          <p>Camera view would appear here</p>
          <p className="scanner-hint">For demo: use the button below to simulate a scan</p>
          <button className="simulate-btn" onClick={simulateScan}>
            Simulate QR Scan
          </button>
        </div>
      </div>

      {scanResult && !success && (
        <div className="scan-result">
          <p>Machine: <strong>{scanResult.machineName}</strong></p>
          <button
            className="dispense-btn"
            onClick={handleDispense}
            disabled={dispensing}
          >
            {dispensing ? 'Dispensing...' : 'Dispense Napkin'}
          </button>
        </div>
      )}

      {success && (
        <div className="success-banner">
          <CheckCircle size={40} />
          <div>
            <h3>Success!</h3>
            <p>Napkin dispensed. Please collect from the machine.</p>
          </div>
        </div>
      )}
    </div>
  )
}
