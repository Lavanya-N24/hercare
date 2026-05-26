import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Shield, Save, Camera } from 'lucide-react'
import './ProfileSettings.css'

export default function ProfileSettings() {
  const { user, resetPassword, updateUserProfile } = useAuth()
  const [name, setName] = useState(user?.name || user?.displayName || '')
  
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [resetMsg, setResetMsg] = useState({ text: '', type: '' })
  
  const fileInputRef = useRef(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateUserProfile({ name })
      setSuccessMsg('Profile updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      console.error(err)
      alert("Failed to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = async () => {
        // Compress image using canvas
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 250
        const MAX_HEIGHT = 250
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to base64 JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        try {
          await updateUserProfile({ photoURL: dataUrl })
        } catch (err) {
          console.error("Failed to update photo", err)
          alert("Failed to upload image. Reason: " + err.message)
        }
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    setIsResetting(true)
    setResetMsg({ text: '', type: '' })
    try {
      await resetPassword(user.email)
      setResetMsg({ text: 'Password reset link sent to ' + user.email, type: 'success' })
    } catch (err) {
      setResetMsg({ text: 'Failed to send reset email. ' + err.message, type: 'error' })
    } finally {
      setIsResetting(false)
      setTimeout(() => setResetMsg({ text: '', type: '' }), 5000)
    }
  }

  const initials = (name || 'U').charAt(0).toUpperCase()
  const roleDisplay = user?.role === 'admin' ? 'Administrator' : 'User'

  return (
    <div className="profile-settings-page">
      <div className="profile-settings-header">
        <h1>Profile Settings</h1>
        <p>Manage your account details and preferences.</p>
      </div>

      <div className="profile-content-grid">
        {/* Left Column - Avatar Card */}
        <div className="profile-card avatar-card">
          <div className="profile-avatar-container" onClick={() => fileInputRef.current?.click()}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="profile-avatar-image" />
            ) : (
              <div className="profile-avatar-large">
                {initials}
              </div>
            )}
            <div className="avatar-upload-overlay">
              <Camera size={24} />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <h2>{name || 'User'}</h2>
          <p className="role-badge">{roleDisplay}</p>
          <p className="member-since">Member since 2024</p>
        </div>

        {/* Right Column - Form */}
        <div className="profile-card form-card">
          <form onSubmit={handleSave} className="profile-form">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label><User size={16} /> Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                disabled
                className="disabled-input"
              />
              <span className="input-hint">Email address cannot be changed.</span>
            </div>

            <div className="form-group">
              <label><Shield size={16} /> Account Role</label>
              <input 
                type="text" 
                value={roleDisplay} 
                disabled
                className="disabled-input"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={isSaving}>
                {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
              {successMsg && <span className="success-msg">{successMsg}</span>}
            </div>
          </form>

          <div className="security-section">
            <h3>Security</h3>
            <p>Need to update your password?</p>
            <button onClick={handlePasswordReset} className="btn-outline" disabled={isResetting}>
              {isResetting ? 'Sending Email...' : 'Send Password Reset Email'}
            </button>
            {resetMsg.text && (
              <p className={`reset-msg ${resetMsg.type === 'error' ? 'msg-error' : 'msg-success'}`}>
                {resetMsg.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
