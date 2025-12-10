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

export interface PillIntakeRecord {
  pillId: string;
  date: string; // ISO date (YYYY-MM-DD)
  status: 'taken' | 'skipped' | 'postponed' | 'upcoming';
  timestamp?: string; // ISO datetime
  postponedTo?: string;
}

export interface UserPills {
  userId: string;
  items: Pill[];
}

export interface UserPillStats {
  userId: string;
  intakeRecords: PillIntakeRecord[];
}

@Injectable({ providedIn: 'root' })
export class DataService {

  private usersSubject = new BehaviorSubject<User[]>([]);
  private pillsSubject = new BehaviorSubject<UserPills[]>([]);
  private pillStatsSubject = new BehaviorSubject<UserPillStats[]>([]);

  users$ = this.usersSubject.asObservable();
  pills$ = this.pillsSubject.asObservable();
  pillStats$ = this.pillStatsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData() {
    // Load users
    this.http.get<{ users: User[] }>('assets/data/users.json').subscribe({
      next: (data) => this.usersSubject.next(data.users),
      error: (err) => console.error('Error loading users:', err)
    });

    // Load pills and initialize stats
    this.http.get<{ pills: UserPills[] }>('assets/data/pills.json').subscribe({
      next: (data) => {
        this.pillsSubject.next(data.pills);
        this.initializePillStats(data.pills);
      },
      error: (err) => console.error('Error loading pills:', err)
    });
  }

  private initializePillStats(pillsData: UserPills[]) {
    // Initialize pill stats from localStorage or create new ones
    const savedStats = localStorage.getItem('pillStats');
    
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        this.pillStatsSubject.next(parsed);
      } catch (err) {
        this.generateInitialStats(pillsData);
      }
    } else {
      this.generateInitialStats(pillsData);
    }
  }

  private generateInitialStats(pillsData: UserPills[]) {

    const stats: UserPillStats[] = pillsData.map(userPills => {

      const records: PillIntakeRecord[] = [];
      const today = new Date();
      
      // Generate records for the past 30 days
      for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() - dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        
        userPills.items.forEach(pill => {
          // Random status distribution
          const rand = Math.random();
          let status: 'taken' | 'skipped' | 'postponed' | 'upcoming';
          
          if (dayOffset === 0) {
            // Today's pills are upcoming
            status = 'upcoming';
          } else {
            if (rand < 0.8) status = 'taken';
            else if (rand < 0.9) status = 'skipped';
            else status = 'postponed';
          }
          
            records.push({
              pillId: pill.id,
              date: dateStr,
              status: status,
              timestamp: undefined
            });
        });
      }
      
      return {
        userId: userPills.userId,
        intakeRecords: records
      };
    });
    
    this.pillStatsSubject.next(stats);
    this.savePillStats();
  }

  private savePillStats() {
    const stats = this.pillStatsSubject.value;
    localStorage.setItem('pillStats', JSON.stringify(stats));
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
  
  // Record a pill action (taken, skipped, postponed)
  recordPillAction(userId: string, pillId: string, date: string, status: 'taken' | 'skipped' | 'postponed' | 'upcoming', postponedTo?: string) {
    const stats = this.pillStatsSubject.value;
    const userStats = stats.find(s => s.userId === userId);
    
    if (!userStats) return;

    // Find existing record for this pill and date
    const existingIndex = userStats.intakeRecords.findIndex(
      r => r.pillId === pillId && r.date === date
    );

    const newRecord: PillIntakeRecord = {
      pillId,
      date,
      status,
      timestamp: new Date().toISOString(),
      postponedTo
    };

    if (existingIndex >= 0) userStats.intakeRecords[existingIndex] = newRecord;
    else userStats.intakeRecords.push(newRecord);

    // Emit the updated stats to trigger all subscribers
    this.pillStatsSubject.next([...stats]);
    this.savePillStats();
  }

  // Get pill status for a specific date
  getPillStatus(userId: string, pillId: string, date: string): Observable<'taken' | 'skipped' | 'postponed' | 'upcoming'> {
    return this.pillStats$.pipe(
      map(stats => {
        const userStats = stats.find(s => s.userId === userId);
        if (!userStats) return 'upcoming';

        const record = userStats.intakeRecords.find(
          r => r.pillId === pillId && r.date === date
        );

        return record ? record.status : 'upcoming';
      })
    );
  }

  // Get intake records for a specific date range
  getIntakeRecordsForDateRange(userId: string, startDate: string, endDate: string): Observable<PillIntakeRecord[]> {
    return this.pillStats$.pipe(
      map(stats => {
        const userStats = stats.find(s => s.userId === userId);
        if (!userStats) return [];

        return userStats.intakeRecords.filter(r => 
          r.date >= startDate && r.date <= endDate
        );
      })
    );
  }

  // Calculate statistics for a date range
  calculateStats(userId: string, startDate: string, endDate: string): Observable<{ taken: number; missed: number; postponed: number }> {
    return this.getIntakeRecordsForDateRange(userId, startDate, endDate).pipe(
      map(records => {
        const stats = {
          taken: 0,
          missed: 0,
          postponed: 0
        };

        records.forEach(record => {
          if (record.status === 'taken') stats.taken++;
          else if (record.status === 'skipped') stats.missed++;
          else if (record.status === 'postponed') stats.postponed++;
        });

        return stats;
      })
    );
  }

  // Get daily statistics (today)
  getDailyStats(userId: string): Observable<{ taken: number; missed: number; postponed: number }> {
    const today = new Date().toISOString().split('T')[0];
    return this.calculateStats(userId, today, today);
  }

  // Get weekly statistics (last 7 days)
  getWeeklyStats(userId: string): Observable<{ taken: number; missed: number; postponed: number }> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    return this.calculateStats(userId, startDate.toISOString().split('T')[0], endDate);
  }

  // Get monthly statistics (last 30 days)
  getMonthlyStats(userId: string): Observable<{ taken: number; missed: number; postponed: number }> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    return this.calculateStats(userId, startDate.toISOString().split('T')[0], endDate);
  }

  // Get all intake records for a user
  getUserIntakeRecords(userId: string): Observable<PillIntakeRecord[]> {
    return this.pillStats$.pipe(
      map(stats => {
        const userStats = stats.find(s => s.userId === userId);
        return userStats ? userStats.intakeRecords : [];
      })
    );
  }
}
