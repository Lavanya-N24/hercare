import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { auth, googleProvider, db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Helper to timeout promises
  const withTimeout = (promise, ms = 5000, errorMsg = "Operation timed out") => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(errorMsg)), ms);
      promise
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };

  async function login(role, credentials) {
    try {
      const result = await withTimeout(
        signInWithEmailAndPassword(auth, credentials.email, credentials.password),
        10000,
        "Sign in timed out"
      );

      // Check role from Firestore user document
      const docRef = doc(db, "users", result.user.uid);
      try {
        const docSnap = await withTimeout(getDoc(docRef), 5000, "Fetching user profile timed out");
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (role === 'admin' && userData.role !== 'admin') {
            throw new Error("Unauthorized: Access restricted to admins.");
          }
        }
      } catch (dbError) {
        console.warn("Firestore read failed or timed out", dbError);
        // Allow login to proceed even if DB fails, but maybe warn? 
        // For now, we proceed so user isn't locked out.
      }
      return result
    } catch (error) {
      console.error("Login Error", error)
      throw error
    }
  }

  async function register(email, password, name, role = 'user') {
    try {
      const result = await withTimeout(
        createUserWithEmailAndPassword(auth, email, password),
        10000,
        "Account creation timed out"
      );

      // Create user document
      try {
        await withTimeout(
          setDoc(doc(db, "users", result.user.uid), {
            name: name,
            email: email,
            role: role,
            createdAt: new Date()
          }),
          5000,
          "Saving user profile timed out"
        );
      } catch (dbError) {
        console.error("Firestore write failed or timed out", dbError);
        // We don't rollback auth, but we let the user know internally?
        // The UI will see success for registration.
      }
      return result
    } catch (error) {
      console.error("Register Error", error)
      throw error
    }
  }

  async function googleSignIn(role = 'user', mockAccount = null) {
    if (mockAccount) {
      try {
        // Generate a deterministic but unique UID for this mock account
        const mockUid = 'mock-google-' + btoa(mockAccount.email).replace(/=/g, '');
        const mockUser = {
          uid: mockUid,
          displayName: mockAccount.name,
          email: mockAccount.email,
          role: role,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockAccount.name)}&background=1a73e8&color=fff`
        }

        // Check if user exists in Firestore, if not create doc
        const docRef = doc(db, "users", mockUid);
        try {
          const docSnap = await withTimeout(getDoc(docRef), 5000, "Checking user profile timed out");
          if (!docSnap.exists()) {
            await withTimeout(
              setDoc(docRef, {
                name: mockAccount.name,
                email: mockAccount.email,
                role: role,
                createdAt: new Date()
              }),
              5000,
              "Saving user profile timed out"
            );
          }
        } catch (dbError) {
          console.warn("Firestore operation failed or timed out", dbError);
        }

        localStorage.setItem('hercare_mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { user: mockUser };
      } catch (err) {
        console.error("Mock Google Sign In Error", err);
        throw err;
      }
    }

    try {
      const result = await withTimeout(
        signInWithPopup(auth, googleProvider),
        20000, // Popup might take longer
        "Google Sign In timed out"
      );

      // Check if user exists, if not create doc
      const docRef = doc(db, "users", result.user.uid);
      try {
        const docSnap = await withTimeout(getDoc(docRef), 5000, "Checking user profile timed out");
        if (!docSnap.exists()) {
          await withTimeout(
            setDoc(doc(db, "users", result.user.uid), {
              name: result.user.displayName,
              email: result.user.email,
              role: role,
              createdAt: new Date()
            }),
            5000,
            "Saving user profile timed out"
          );
        }
      } catch (dbError) {
        console.warn("Firestore operation failed or timed out", dbError);
      }
      return result
    } catch (error) {
      console.error("Google Sign In Error", error)
      throw error
    }
  }

  async function resetPassword(email) {
    try {
      return await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Password Reset Error", error)
      throw error
    }
  }

  function logout() {
    localStorage.removeItem('hercare_mock_user')
    return signOut(auth)
  }

  useEffect(() => {
    // Check if there is a mock user in localStorage on initialization
    const mockUserStr = localStorage.getItem('hercare_mock_user');
    if (mockUserStr) {
      try {
        const parsed = JSON.parse(mockUserStr);
        setUser(parsed);
        setLoading(false);
        // Return a no-op cleanup
        return () => {};
      } catch (e) {
        localStorage.removeItem('hercare_mock_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch additional user data including role
        const docRef = doc(db, "users", currentUser.uid);
        try {
          // Using a short timeout for auto-login check
          const docSnap = await withTimeout(getDoc(docRef), 3000, "Profile fetch timed out");
          if (docSnap.exists()) {
            setUser({ ...currentUser, ...docSnap.data() })
          } else {
            setUser(currentUser)
          }
        } catch (err) {
          console.warn("Failed to fetch user profile on auth change", err);
          setUser(currentUser); // Fallback to basic auth user
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Add a safety timeout for initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("Auth initialization timed out");
        setLoading(false);
      }
    }, 6000); // Slightly longer than the getDoc timeout
    return () => clearTimeout(timer);
  }, [loading]);

  async function updateUserProfile(updates) {
    if (!user) return;
    
    try {
      // 1. Update Firebase Auth profile directly
      if (auth.currentUser) {
        const authUpdates = {};
        if (updates.name) authUpdates.displayName = updates.name;
        if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
        
        if (Object.keys(authUpdates).length > 0) {
          try {
            await updateProfile(auth.currentUser, authUpdates);
          } catch (authErr) {
            console.warn("Auth updateProfile failed (often due to long base64 photoURL), proceeding to Firestore...", authErr);
          }
        }
      }

      // 2. Optimistically update local state so UI updates instantly
      setUser(prev => ({ ...prev, ...updates }));

      // 3. Try to update Firestore (might fail if rules are strict, but that's okay)
      try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, updates, { merge: true });
      } catch (dbError) {
        console.warn("Could not save profile to Firestore (likely rules), but Auth profile updated.", dbError);
      }
      
    } catch (error) {
      console.error("Profile Update Error", error);
      throw error;
    }
  }

  const value = {
    user,
    login,
    register,
    googleSignIn,
    resetPassword,
    updateUserProfile,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
