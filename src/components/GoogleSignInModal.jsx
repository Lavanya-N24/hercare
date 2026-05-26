import React, { useState } from 'react'
import './GoogleSignInModal.css'
import { User, ArrowLeft } from 'lucide-react'

export default function GoogleSignInModal({ isOpen, onClose, onLogin }) {
    const [showCustomForm, setShowCustomForm] = useState(false)
    const [customName, setCustomName] = useState('')
    const [customEmail, setCustomEmail] = useState('')

    if (!isOpen) return null

    // Mock accounts
    const accounts = [
        {
            name: 'Lavanya N',
            email: 'lavanya.n@gmail.com',
            initial: 'L'
        },
        {
            name: 'Demo User',
            email: 'user@hercare.com',
            initial: 'D'
        }
    ]

    const handleCustomSubmit = (e) => {
        e.preventDefault()
        if (customName && customEmail) {
            onLogin({
                name: customName,
                email: customEmail,
                initial: customName.charAt(0).toUpperCase()
            })
            // Reset state
            setCustomName('')
            setCustomEmail('')
            setShowCustomForm(false)
        }
    }

    return (
        <div className="google-modal-overlay" onClick={onClose}>
            <div className="google-modal" onClick={(e) => e.stopPropagation()}>
                <div className="google-header">
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="google-logo"
                        style={{ width: '48px', height: '48px' }}
                    />
                    {showCustomForm ? (
                        <>
                            <button className="back-btn" onClick={() => setShowCustomForm(false)}>
                                <ArrowLeft size={16} /> Back
                            </button>
                            <h2>Sign in</h2>
                            <p>with your Google Account</p>
                        </>
                    ) : (
                        <>
                            <h2>Choose an account</h2>
                            <p>to continue to HerCare</p>
                        </>
                    )}
                </div>

                {showCustomForm ? (
                    <form className="custom-account-form" onSubmit={handleCustomSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email (e.g. name@gmail.com)"
                                value={customEmail}
                                onChange={(e) => setCustomEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="google-submit-btn">
                            Next
                        </button>
                    </form>
                ) : (
                    <ul className="account-list">
                        {accounts.map((account, index) => (
                            <li key={index} className="account-item" onClick={() => onLogin(account)}>
                                <div className="account-avatar">
                                    {account.initial}
                                </div>
                                <div className="account-info">
                                    <span className="account-name">{account.name}</span>
                                    <span className="account-email">{account.email}</span>
                                </div>
                            </li>
                        ))}
                        <li className="account-item" onClick={() => setShowCustomForm(true)}>
                            <div className="account-avatar" style={{ background: 'transparent' }}>
                                <User className="avatar-icon" />
                            </div>
                            <div className="account-info">
                                <span className="account-name">Use another account</span>
                            </div>
                        </li>
                    </ul>
                )}

                <div className="modal-footer">
                    <p style={{ fontSize: '12px', color: '#5f6368', margin: 0 }}>
                        To continue, Google will share your name, email address, and language preference with HerCare.
                    </p>
                </div>
            </div>
        </div>
    )
}
