export type EventType =
  | 'Cleanup'
  | 'Plantation'
  | 'Donation'
  | 'Food Relief'
  | 'Healthcare'
  | 'Education'
  | 'Blood Donation'
  | 'Disaster Relief';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface VolunteerInfo {
  name: string;
  email: string;
  photo?: string;
  joinedAt: string;
}

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  creatorName: string;
  creatorPhoto?: string;
  participantCount?: number;
  volunteers?: VolunteerInfo[];
  hasJoined?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JoinedEventItem {
  _id: string;
  eventId: string;
  eventTitle: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  eventDate: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  joinedAt: string;
}
