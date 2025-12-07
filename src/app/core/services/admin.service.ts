import { Injectable, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy,
  Timestamp,
  onSnapshot
} from '@angular/fire/firestore';

export interface Report {
  id?: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  userId: string;
}

export interface AppUser {
  id?: string;
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  registeredAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private reportsSignal = signal<Report[]>([]);
  private usersSignal = signal<AppUser[]>([]);

  reports = this.reportsSignal.asReadonly();
  users = this.usersSignal.asReadonly();

  constructor(private firestore: Firestore) {
    this.subscribeToReports();
    this.subscribeToUsers();
  }

  private subscribeToReports(): void {
    const reportsRef = collection(this.firestore, 'reports');
    const q = query(reportsRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
      const reports: Report[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          title: data['title'],
          description: data['description'],
          status: data['status'],
          createdAt: (data['createdAt'] as Timestamp).toDate(),
          userId: data['userId']
        });
      });
      this.reportsSignal.set(reports);
    });
  }

  private subscribeToUsers(): void {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, orderBy('registeredAt', 'desc'));

    onSnapshot(q, (snapshot) => {
      const users: AppUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          uid: data['uid'],
          name: data['displayName'] || data['email'].split('@')[0],
          email: data['email'],
          role: data['role'],
          status: data['status'] || 'active',
          registeredAt: (data['createdAt'] as Timestamp).toDate()
        });
      });
      this.usersSignal.set(users);
    });
  }

  async addReport(report: Omit<Report, 'id'>): Promise<void> {
    try {
      const reportsRef = collection(this.firestore, 'reports');
      await addDoc(reportsRef, {
        ...report,
        createdAt: Timestamp.fromDate(report.createdAt)
      });
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  }

  async updateReport(id: string, updates: Partial<Report>): Promise<void> {
    try {
      const reportRef = doc(this.firestore, 'reports', id);
      const updateData: any = { ...updates };
      if (updates.createdAt) {
        updateData.createdAt = Timestamp.fromDate(updates.createdAt);
      }
      await updateDoc(reportRef, updateData);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      const reportRef = doc(this.firestore, 'reports', id);
      await deleteDoc(reportRef);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<AppUser>): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', id);
      const updateData: any = { ...updates };
      if (updates.registeredAt) {
        updateData.createdAt = Timestamp.fromDate(updates.registeredAt);
      }
      if (updates.name) {
        updateData.displayName = updates.name;
      }
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}