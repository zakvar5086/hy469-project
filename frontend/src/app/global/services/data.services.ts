import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

export interface User {
  id: string;
  name: string;
  age: number;
  username: string;
  avatar: string;
}

export interface Pill {
  id: string;
  name: string;
  dosage: string;
  time: string;
  image?: string;
  shortInstructions?: string[];
  longDescription?: string;
}

export interface UserPills {
  userId: string;
  items: Pill[];
}

@Injectable({ providedIn: 'root' })
export class DataService {

  private usersSubject = new BehaviorSubject<User[]>([]);
  private pillsSubject = new BehaviorSubject<UserPills[]>([]);

  users$ = this.usersSubject.asObservable();
  pills$ = this.pillsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData() {
    // Load users
    this.http.get<{ users: User[] }>('assets/data/users.json').subscribe({
      next: (data) => this.usersSubject.next(data.users),
      error: (err) => console.error('Error loading users:', err)
    });

    // Load pills
    this.http.get<{ pills: UserPills[] }>('assets/data/pills.json').subscribe({
      next: (data) => this.pillsSubject.next(data.pills),
      error: (err) => console.error('Error loading pills:', err)
    });
  }

  getUserById(userId: string): Observable<User | undefined> {
    return this.users$.pipe(
      map(users => users.find(u => u.id === userId))
    );
  }

  getPillsForUser(userId: string): Observable<Pill[]> {
    return this.pills$.pipe(
      map(pillData => {
        const userPills = pillData.find(p => p.userId === userId);
        return userPills ? userPills.items : [];
      })
    );
  }

  getPillById(userId: string, pillId: string): Observable<Pill | undefined> {
    return this.getPillsForUser(userId).pipe(
      map(pills => pills.find(p => p.id === pillId))
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.users$;
  }

  // Get pills for a specific date and time
  getPillsForUserByTime(userId: string, time: string): Observable<Pill[]> {
    return this.getPillsForUser(userId).pipe(
      map(pills => pills.filter(p => p.time === time))
    );
  }

  // Get pills grouped by time
  getPillsGroupedByTime(userId: string): Observable<{ time: string; pills: Pill[] }[]> {
    return this.getPillsForUser(userId).pipe(
      map(pills => {
        const grouped = new Map<string, Pill[]>();
        
        pills.forEach(pill => {
          if (!grouped.has(pill.time)) {
            grouped.set(pill.time, []);
          }
          grouped.get(pill.time)!.push(pill);
        });

        const result = Array.from(grouped.entries()).map(([time, pills]) => ({
          time,
          pills
        }));

        // Sort by time
        result.sort((a, b) => a.time.localeCompare(b.time));

        return result;
      })
    );
  }
}