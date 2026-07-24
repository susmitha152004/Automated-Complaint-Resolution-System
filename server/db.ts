import fs from 'fs';
import path from 'path';
import { User, Complaint, ComplaintResponse, NotificationItem, AnalyticsData } from '../src/types.js';
import { hashPassword, comparePassword } from './auth.js';

const DB_FILE = path.join(process.cwd(), 'data_store.json');

interface DatabaseSchema {
  users: User[];
  complaints: Complaint[];
  responses: ComplaintResponse[];
  notifications: NotificationItem[];
}

// Initial seed users with hashed passwords
const defaultAdminPasswordHash = hashPassword('admin123');
const defaultUserPasswordHash = hashPassword('user123');

const initialSeedData: DatabaseSchema = {
  users: [
    {
      id: 'usr_admin_1',
      name: 'Admin Supervisor',
      email: 'admin@gov.org',
      phone: '+1 800 555 0199',
      role: 'admin',
      department: 'Central Grievance Commission',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'usr_citizen_1',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      phone: '+1 555 014 9922',
      role: 'user',
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: 'usr_citizen_2',
      name: 'Michael Scott',
      email: 'michael@example.com',
      phone: '+1 555 018 3341',
      role: 'user',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: 'usr_citizen_sumi',
      name: 'Sumi',
      email: 'sumisumi891988@gmail.com',
      phone: '+1 555 019 8891',
      role: 'user',
      createdAt: new Date().toISOString(),
    },
  ],
  complaints: [
    {
      id: 'cmp_1001',
      ticketNumber: 'CMP-2026-8812',
      userId: 'usr_citizen_1',
      userName: 'Sarah Connor',
      userEmail: 'sarah@example.com',
      userPhone: '+1 555 014 9922',
      location: 'Green Valley Ward 4',
      address: '742 Evergreen Terrace, Sector 12',
      title: 'Water Supply Disrupted for 3 Consecutive Days',
      description: 'There is zero water supply in our entire colony for the past 3 days. Families are forced to buy private water tankers. Please resolve urgently.',
      category: 'Water Supply',
      priority: 'High',
      status: 'Under Review',
      assignedDepartment: 'Water Supply & Sewerage Board',
      assignedStaff: 'Eng. David Miller',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      aiAnalysis: {
        category: 'Water Supply',
        priority: 'High',
        summary: 'Prolonged 3-day water supply outage affecting multiple residents in Green Valley Ward 4.',
        automatedResponse: 'We have received your urgent complaint regarding the water outage. The complaint has been prioritized and dispatched to the Water Supply & Sewerage Board.',
        suggestedDepartment: 'Water Supply & Sewerage Board',
        estimatedResolutionTime: '12-24 Hours',
        possibleSolution: 'Dispatch municipal water tankers immediately to Sector 12 while emergency pipeline repair crews inspect main valve V-4.',
        confidenceScore: 0.96,
        analyzedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      statusTimeline: [
        {
          id: 'tl_1',
          status: 'Pending',
          updatedBy: 'Sarah Connor',
          role: 'user',
          note: 'Complaint submitted by citizen.',
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
          id: 'tl_2',
          status: 'Under Review',
          updatedBy: 'Admin Supervisor',
          role: 'admin',
          note: 'Assigned to Eng. David Miller at Water Board for site inspection.',
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'cmp_1002',
      ticketNumber: 'CMP-2026-8813',
      userId: 'usr_citizen_2',
      userName: 'Michael Scott',
      userEmail: 'michael@example.com',
      userPhone: '+1 555 018 3341',
      location: 'Downtown Business District',
      address: '1725 Slough Avenue, Near Main Post Office',
      title: 'Exposed Live Electrical Wires Sprouting Sparks Near Bus Stop',
      description: 'An open power junction box has exposed loose wires handing down near the school bus stop. High risk of electric shock during monsoon rain!',
      category: 'Electricity',
      priority: 'Emergency',
      status: 'Pending',
      assignedDepartment: 'State Electricity Distribution Co.',
      imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
      aiAnalysis: {
        category: 'Electricity',
        priority: 'Emergency',
        summary: 'Exposed live electrical hazard with sparking near a busy public school bus stop.',
        automatedResponse: 'EMERGENCY ALERT CONFIRMED: Your report of live electrical hazard has been broadcasted immediately to the Emergency Rapid Response Power Grid unit.',
        suggestedDepartment: 'State Electricity Distribution Co.',
        estimatedResolutionTime: '2-4 Hours',
        possibleSolution: 'Isolate grid segment FEED-09 immediately and send emergency lineman crew with insulated junction enclosure.',
        confidenceScore: 0.98,
        analyzedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      },
      statusTimeline: [
        {
          id: 'tl_3',
          status: 'Pending',
          updatedBy: 'Michael Scott',
          role: 'user',
          note: 'Emergency complaint registered.',
          timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
    {
      id: 'cmp_1003',
      ticketNumber: 'CMP-2026-8814',
      userId: 'usr_citizen_1',
      userName: 'Sarah Connor',
      userEmail: 'sarah@example.com',
      userPhone: '+1 555 014 9922',
      location: 'Northside Ring Road',
      address: 'KM 14 Marker, Northside Expressway',
      title: 'Deep Potholes Causing Traffic Jams and Rim Damage',
      description: 'Multiple deep potholes have developed after recent rainfall. Two motorists suffered flat tires this morning.',
      category: 'Roads',
      priority: 'Medium',
      status: 'Resolved',
      assignedDepartment: 'Public Works Department (PWD)',
      assignedStaff: 'Road Maintenance Crew 3',
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      aiAnalysis: {
        category: 'Roads',
        priority: 'Medium',
        summary: 'Severe road surface degradation with multiple deep potholes along Northside Ring Road.',
        automatedResponse: 'Thank you for bringing this road defect to our attention. PWD repair team has been notified.',
        suggestedDepartment: 'Public Works Department (PWD)',
        estimatedResolutionTime: '48 Hours',
        possibleSolution: 'Deploy cold-mix asphalt patching truck to smooth out hazards until full resurfacing.',
        confidenceScore: 0.94,
        analyzedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      statusTimeline: [
        {
          id: 'tl_4',
          status: 'Pending',
          updatedBy: 'Sarah Connor',
          role: 'user',
          note: 'Submitted with photo.',
          timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
          id: 'tl_5',
          status: 'Under Review',
          updatedBy: 'Admin Supervisor',
          role: 'admin',
          note: 'Scheduled for asphalt patch work.',
          timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
        },
        {
          id: 'tl_6',
          status: 'Resolved',
          updatedBy: 'Admin Supervisor',
          role: 'admin',
          note: 'Potholes filled and leveled by PWD Crew 3. Verified clear.',
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'cmp_1004',
      ticketNumber: 'CMP-2026-8815',
      userId: 'usr_citizen_2',
      userName: 'Michael Scott',
      userEmail: 'michael@example.com',
      userPhone: '+1 555 018 3341',
      location: 'Central Market Square',
      address: 'Block B, Commercial Complex Rear Alley',
      title: 'Overflowing Garbage Dumps Creating Foul Odor and Health Hazard',
      description: 'Garbage collection has been skipped for 4 days. Waste is overflowing onto the main sidewalk, attracting stray animals and pests.',
      category: 'Garbage',
      priority: 'High',
      status: 'Under Review',
      assignedDepartment: 'Municipal Solid Waste Management',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      aiAnalysis: {
        category: 'Garbage',
        priority: 'High',
        summary: 'Uncollected unhygienic waste accumulation in commercial central market area.',
        automatedResponse: 'Your sanitation complaint has been registered. Sanitation trucks are scheduled to clear Central Market Block B today.',
        suggestedDepartment: 'Municipal Solid Waste Management',
        estimatedResolutionTime: '12 Hours',
        possibleSolution: 'Reroute Sanitation Tipper Truck #18 and apply disinfectant spray following clearing.',
        confidenceScore: 0.95,
        analyzedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      statusTimeline: [
        {
          id: 'tl_7',
          status: 'Pending',
          updatedBy: 'Michael Scott',
          role: 'user',
          note: 'Submitted.',
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
        {
          id: 'tl_8',
          status: 'Under Review',
          updatedBy: 'Admin Supervisor',
          role: 'admin',
          note: 'Truck #18 dispatched.',
          timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
  ],
  responses: [
    {
      id: 'resp_1',
      complaintId: 'cmp_1001',
      senderId: 'system',
      senderName: 'AI Complaint Assister',
      senderRole: 'system',
      message: 'We have received your urgent complaint regarding the water outage. The complaint has been prioritized and dispatched to the Water Supply & Sewerage Board.',
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      isAutomated: true,
    },
    {
      id: 'resp_2',
      complaintId: 'cmp_1001',
      senderId: 'usr_admin_1',
      senderName: 'Admin Supervisor',
      senderRole: 'admin',
      message: 'Eng. David Miller has inspected main valve V-4. Replacement gaskets are en route. Water supply expected to resume by 8 PM.',
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_citizen_1',
      complaintId: 'cmp_1001',
      title: 'Complaint Status Updated',
      message: 'Your complaint CMP-2026-8812 is now Under Review.',
      read: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
};

// Password lookup store for local auth testing
const passwordStore: Record<string, string> = {
  'admin@gov.org': defaultAdminPasswordHash,
  'sarah@example.com': defaultUserPasswordHash,
  'michael@example.com': defaultUserPasswordHash,
  'sumisumi891988@gmail.com': defaultUserPasswordHash,
};

class DBManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    let loadedData: DatabaseSchema;
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        loadedData = JSON.parse(fileContent);
      } else {
        loadedData = initialSeedData;
      }
    } catch (e) {
      console.error('Failed to read db file, creating new seed:', e);
      loadedData = initialSeedData;
    }

    // Ensure sumisumi891988@gmail.com is present
    const sumiEmail = 'sumisumi891988@gmail.com';
    if (!loadedData.users.some((u) => u.email.trim().toLowerCase() === sumiEmail)) {
      loadedData.users.push({
        id: 'usr_citizen_sumi',
        name: 'Sumi',
        email: sumiEmail,
        phone: '+1 555 019 8891',
        role: 'user',
        createdAt: new Date().toISOString(),
      });
    }

    this.saveData(loadedData);
    return loadedData;
  }

  private saveData(dataToSave: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db file:', e);
    }
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserByEmail(email: string): User | undefined {
    if (!email) return undefined;
    const clean = email.trim().toLowerCase();
    return this.data.users.find((u) => u.email.trim().toLowerCase() === clean);
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: User, passwordRaw: string): User {
    this.data.users.push(user);
    passwordStore[user.email.toLowerCase()] = hashPassword(passwordRaw);
    this.saveData(this.data);
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveData(this.data);
    return this.data.users[idx];
  }

  public verifyPassword(email: string, passwordRaw: string): boolean {
    const hash = passwordStore[email.trim().toLowerCase()];
    if (!hash) {
      // Allow demo shortcut if missing
      return passwordRaw === 'admin123' || passwordRaw === 'user123';
    }
    return comparePassword(passwordRaw, hash);
  }

  public updatePassword(email: string, newPasswordRaw: string): void {
    passwordStore[email.trim().toLowerCase()] = hashPassword(newPasswordRaw);
  }

  public getComplaints(filter?: {
    userId?: string;
    category?: string;
    priority?: string;
    status?: string;
    search?: string;
  }): Complaint[] {
    let result = [...this.data.complaints];

    if (filter) {
      if (filter.userId) {
        result = result.filter((c) => c.userId === filter.userId);
      }
      if (filter.category && filter.category !== 'All') {
        result = result.filter((c) => c.category === filter.category);
      }
      if (filter.priority && filter.priority !== 'All') {
        result = result.filter((c) => c.priority === filter.priority);
      }
      if (filter.status && filter.status !== 'All') {
        result = result.filter((c) => c.status === filter.status);
      }
      if (filter.search) {
        const query = filter.search.toLowerCase();
        result = result.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.ticketNumber.toLowerCase().includes(query) ||
            c.location.toLowerCase().includes(query) ||
            c.userName.toLowerCase().includes(query)
        );
      }
    }

    // Sort newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getComplaintById(idOrTicket: string): Complaint | undefined {
    return this.data.complaints.find(
      (c) => c.id === idOrTicket || c.ticketNumber.toLowerCase() === idOrTicket.toLowerCase()
    );
  }

  public createComplaint(complaint: Complaint): Complaint {
    this.data.complaints.unshift(complaint);
    
    // Add initial automated AI response
    if (complaint.aiAnalysis && complaint.aiAnalysis.automatedResponse) {
      this.data.responses.push({
        id: 'resp_' + Date.now(),
        complaintId: complaint.id,
        senderId: 'system',
        senderName: 'Gemini AI Assistant',
        senderRole: 'system',
        message: complaint.aiAnalysis.automatedResponse,
        timestamp: new Date().toISOString(),
        isAutomated: true,
      });
    }

    this.saveData(this.data);
    return complaint;
  }

  public updateComplaintStatus(
    id: string,
    newStatus: 'Pending' | 'Under Review' | 'Resolved' | 'Rejected',
    updatedBy: string,
    role: 'user' | 'admin' | 'system',
    note?: string
  ): Complaint | null {
    const idx = this.data.complaints.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const complaint = this.data.complaints[idx];
    complaint.status = newStatus;
    complaint.updatedAt = new Date().toISOString();

    const timelineEntry = {
      id: 'tl_' + Date.now(),
      status: newStatus,
      updatedBy,
      role,
      note: note || `Status updated to ${newStatus}`,
      timestamp: new Date().toISOString(),
    };

    complaint.statusTimeline.push(timelineEntry);

    // Notify user
    this.addNotification({
      id: 'notif_' + Date.now(),
      userId: complaint.userId,
      complaintId: complaint.id,
      title: `Complaint Status Updated: ${newStatus}`,
      message: `Your complaint ${complaint.ticketNumber} is now marked as ${newStatus}.${note ? ' Note: ' + note : ''}`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    this.saveData(this.data);
    return complaint;
  }

  public assignComplaint(
    id: string,
    department: string,
    staff?: string
  ): Complaint | null {
    const idx = this.data.complaints.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const complaint = this.data.complaints[idx];
    complaint.assignedDepartment = department;
    if (staff) complaint.assignedStaff = staff;
    complaint.updatedAt = new Date().toISOString();

    this.saveData(this.data);
    return complaint;
  }

  public deleteComplaint(id: string): boolean {
    const initialLen = this.data.complaints.length;
    this.data.complaints = this.data.complaints.filter((c) => c.id !== id);
    this.data.responses = this.data.responses.filter((r) => r.complaintId !== id);
    if (this.data.complaints.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public getResponses(complaintId: string): ComplaintResponse[] {
    return this.data.responses
      .filter((r) => r.complaintId === complaintId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public addResponse(response: ComplaintResponse): ComplaintResponse {
    this.data.responses.push(response);
    this.saveData(this.data);
    return response;
  }

  public getNotifications(userId: string): NotificationItem[] {
    return this.data.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(notification: NotificationItem) {
    this.data.notifications.unshift(notification);
    this.saveData(this.data);
  }

  public markNotificationAsRead(id: string, userId: string) {
    const n = this.data.notifications.find((notif) => notif.id === id && notif.userId === userId);
    if (n) {
      n.read = true;
      this.saveData(this.data);
    }
  }

  public getAnalytics(): AnalyticsData {
    const all = this.data.complaints;

    const stats = {
      totalUsers: this.data.users.length,
      totalComplaints: all.length,
      resolvedComplaints: all.filter((c) => c.status === 'Resolved').length,
      pendingComplaints: all.filter((c) => c.status === 'Pending').length,
      underReviewComplaints: all.filter((c) => c.status === 'Under Review').length,
      highPriorityComplaints: all.filter((c) => c.priority === 'High').length,
      emergencyComplaints: all.filter((c) => c.priority === 'Emergency').length,
    };

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    all.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Status Distribution
    const statusDistribution = [
      { name: 'Pending', value: all.filter((c) => c.status === 'Pending').length, color: '#f59e0b' },
      { name: 'Under Review', value: all.filter((c) => c.status === 'Under Review').length, color: '#3b82f6' },
      { name: 'Resolved', value: all.filter((c) => c.status === 'Resolved').length, color: '#10b981' },
      { name: 'Rejected', value: all.filter((c) => c.status === 'Rejected').length, color: '#ef4444' },
    ];

    // Priority Distribution
    const priorityDistribution = [
      { name: 'Low', value: all.filter((c) => c.priority === 'Low').length },
      { name: 'Medium', value: all.filter((c) => c.priority === 'Medium').length },
      { name: 'High', value: all.filter((c) => c.priority === 'High').length },
      { name: 'Emergency', value: all.filter((c) => c.priority === 'Emergency').length },
    ];

    // Monthly Trend (mock 6 month trend synced with real counts)
    const monthlyTrend = [
      { month: 'Feb', total: Math.max(3, Math.floor(all.length * 0.4)), resolved: 2 },
      { month: 'Mar', total: Math.max(5, Math.floor(all.length * 0.6)), resolved: 3 },
      { month: 'Apr', total: Math.max(7, Math.floor(all.length * 0.8)), resolved: 5 },
      { month: 'May', total: Math.max(6, Math.floor(all.length * 0.7)), resolved: 4 },
      { month: 'Jun', total: Math.max(8, Math.floor(all.length * 0.9)), resolved: 6 },
      { month: 'Jul', total: all.length, resolved: stats.resolvedComplaints },
    ];

    return {
      stats,
      categoryDistribution,
      monthlyTrend,
      statusDistribution,
      priorityDistribution,
    };
  }
}

export const db = new DBManager();
