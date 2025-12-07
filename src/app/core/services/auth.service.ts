import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  getDoc, 
  setDoc 
} from '@angular/fire/firestore';

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(null);
  currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getUserData(firebaseUser.uid);
        if (userData) {
          this.currentUserSignal.set(userData);
        }
      } else {
        this.currentUserSignal.set(null);
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log('Attempting login with email:', email);
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Firebase auth successful, UID:', credential.user.uid);
      
      let userData = await this.getUserData(credential.user.uid);
      console.log('User data fetched:', userData);
      
      // If user document doesn't exist, create it
      if (!userData) {
        console.log('User document not found. Creating new document...');
        
        const newUserData = {
          uid: credential.user.uid,
          email: email,
          role: 'admin' as const,
          displayName: email.split('@')[0],
          status: 'active',
          createdAt: new Date()
        };
        
        try {
          const userDocRef = doc(this.firestore, 'users', credential.user.uid);
          await setDoc(userDocRef, newUserData);
          console.log('User document created successfully');
          
          userData = {
            uid: newUserData.uid,
            email: newUserData.email,
            role: newUserData.role,
            displayName: newUserData.displayName,
            createdAt: newUserData.createdAt
          };
        } catch (createError) {
          console.error('Error creating user document:', createError);
          await this.logout();
          throw new Error('Failed to create user profile. Please check Firestore permissions.');
        }
      }
      
      if (userData.role !== 'admin') {
        console.error('User is not an admin:', userData.role);
        await this.logout();
        throw new Error('Access denied. Admin role required.');
      }
      
      this.currentUserSignal.set(userData);
      console.log('Login successful, user set:', userData);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, displayName: string): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      const userData: User = {
        uid: credential.user.uid,
        email: email,
        role: 'user',
        displayName: displayName,
        createdAt: new Date()
      };

      await setDoc(doc(this.firestore, 'users', credential.user.uid), userData);
      this.currentUserSignal.set(userData);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSignal.set(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getUserData(uid: string): Promise<User | null> {
    try {
      console.log('Fetching user document for UID:', uid);
      const userDocRef = doc(this.firestore, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      console.log('Document exists:', userDoc.exists());
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('Document data:', data);
        
        return {
          uid: data['uid'] || uid,
          email: data['email'],
          role: data['role'],
          displayName: data['displayName'],
          createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : new Date()
        };
      }
      
      console.error('User document does not exist');
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  isAdmin(): boolean {
    return this.currentUserSignal()?.role === 'admin';
  }
}
