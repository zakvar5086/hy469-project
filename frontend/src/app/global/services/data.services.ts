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
}

export interface UserPills {
  userId: string;
  items: Pill[];
}

export interface DeviceMapping {
  devices: {
    [key: string]: string;
  };
}

@Injectable({ providedIn: 'root' })
export class DataService {

  private usersSubject = new BehaviorSubject<User[]>([]);
  private pillsSubject = new BehaviorSubject<UserPills[]>([]);
  private devicesSubject = new BehaviorSubject<DeviceMapping | null>(null);

  users$ = this.usersSubject.asObservable();
  pills$ = this.pillsSubject.asObservable();
  devices$ = this.devicesSubject.asObservable();

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

    // Load device mappings
    this.http.get<DeviceMapping>('assets/data/device.json').subscribe({
      next: (data) => this.devicesSubject.next(data),
      error: (err) => console.error('Error loading devices:', err)
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

  getDeviceForPersona(personaId: string): Observable<string | undefined> {
    return this.devices$.pipe(
      map(devices => devices ? devices.devices[personaId] : undefined)
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
