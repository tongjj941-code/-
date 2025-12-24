
export type ViewState = 'LOGIN' | 'HOTEL_SELECT' | 'HOME' | 'ROOM_ENTRY' | 'INSPECTION' | 'SUCCESS' | 'HISTORY' | 'HISTORY_DETAIL' | 'CONFIG' | 'MAINTENANCE' | 'USER_MANAGEMENT' | 'MARKETING_CONFIG' | 'COUPON_CONFIG' | 'REVIEW_CONFIG' | 'REWARD_RULES' | 'STAFF_MARKETING' | 'STAFF_COUPON' | 'STAFF_REVIEW' | 'ME' | 'MARKETING_HISTORY' | 'ADMIN_ME' | 'MARKETING_AUDIT' | 'MARKETING_DETAIL';

export type UserRole = 'STAFF' | 'ADMIN';

export interface AuthorizedUser {
  id: string;
  name: string;
  employeeId: string; // Acts as login ID/WeChat ID
  role: UserRole;
  hotelName?: string; // Associated hotel for the user
  avatarColor?: string; // For UI decoration
}

export type CheckCategory = 'MATERIAL' | 'EQUIPMENT';

export interface CheckItemDefinition {
  id: string;
  title: string;
  category: CheckCategory;
  description: string;
  referenceImage: string;
}

export interface RoomTypeDefinition {
  id: string;
  name: string; // e.g., "Standard Room", "Suite"
  items: CheckItemDefinition[];
}

export interface RoomConfig {
  number: string;
  typeId: string;
}

export type IssueType = 'FAULT' | 'RESTOCK' | 'OTHER';
export type IssueStatus = 'OPEN' | 'RESOLVED';

export interface IssueReport {
  id: string;
  type: IssueType;
  description: string;
  attachment?: string; // DataURL for image
  isVideo?: boolean;
  status: IssueStatus; // New field
  resolvedAt?: string; // New field
}

export interface InspectionStepData {
  photo: string | null; // Watermarked DataURL
  timestamp: string | null;
  issues: IssueReport[];
}

export interface InspectionState {
  roomNumber: string;
  roomTypeId: string; // Added to track which checklist was used
  hotelName: string; // Added to track which hotel this belongs to
  steps: Record<string, InspectionStepData>;
}

export interface CompletedInspection extends InspectionState {
  id: string;
  completedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: string;
}

// New Interface for Marketing
export interface MarketingTask {
  id: string;
  title: string;
  description: string; // Explanation/Instructions
  images: string[]; // Arbitrary number of screenshots/schematics
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  rewardAmount?: string; // Optional reward text (e.g., "5元/次")
  notes?: string; // Admin configured notes
}

// Coupon Config logic is identical to Marketing
export interface CouponTask extends MarketingTask {}

// Review Config adds Channel info
export interface ReviewTask extends MarketingTask {
  channels: string; // e.g., "携程, 美团, 飞猪"
}

export interface CompletedMarketingTask {
  id: string;
  taskId: string;
  taskTitle: string;
  submittedAt: string;
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: string;      // Added to track who submitted
  userName: string;    // Added for display
  userAvatarColor?: string; // Added for display
  notes?: string;      // Optional employee notes (deprecated in favor of admin notes display)
  userRemarks?: string; // User submitted remarks
  selectedChannel?: string; // For Review tasks
}
