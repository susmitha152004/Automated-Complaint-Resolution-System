export type CategoryType =
  | 'Water Supply'
  | 'Electricity'
  | 'Roads'
  | 'Garbage'
  | 'Street Lights'
  | 'Internet'
  | 'Education'
  | 'Health'
  | 'Pollution'
  | 'Public Transport'
  | 'Others';

export type PriorityType = 'Low' | 'Medium' | 'High' | 'Emergency';

export type StatusType = 'Pending' | 'Under Review' | 'Resolved' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  department?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AIAnalysis {
  category: CategoryType;
  priority: PriorityType;
  summary: string;
  automatedResponse: string;
  suggestedDepartment: string;
  estimatedResolutionTime: string;
  possibleSolution: string;
  confidenceScore?: number;
  analyzedAt: string;
}

export interface StatusTimelineEntry {
  id: string;
  status: StatusType;
  updatedBy: string;
  role: 'user' | 'admin' | 'system';
  note?: string;
  timestamp: string;
}

export interface ComplaintResponse {
  id: string;
  complaintId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin' | 'system';
  message: string;
  timestamp: string;
  isAutomated?: boolean;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  location: string;
  address: string;
  title: string;
  description: string;
  category: CategoryType;
  priority: PriorityType;
  status: StatusType;
  assignedDepartment: string;
  assignedStaff?: string;
  imageUrl?: string;
  aiAnalysis: AIAnalysis;
  statusTimeline: StatusTimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  complaintId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  stats: {
    totalUsers: number;
    totalComplaints: number;
    resolvedComplaints: number;
    pendingComplaints: number;
    underReviewComplaints: number;
    highPriorityComplaints: number;
    emergencyComplaints: number;
  };
  categoryDistribution: Array<{ name: string; value: number }>;
  monthlyTrend: Array<{ month: string; total: number; resolved: number }>;
  statusDistribution: Array<{ name: string; value: number; color: string }>;
  priorityDistribution: Array<{ name: string; value: number }>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
