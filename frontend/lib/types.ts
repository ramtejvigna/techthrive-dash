export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";

export interface User {
  id: number;
  email: string;
}

export type MilestoneBucketStatus = "todo" | "in_progress" | "done";

export interface Milestone {
  id: string;
  title: string;
  target_date: string | null;
  bucket_status: MilestoneBucketStatus;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MilestoneComment {
  id: string;
  body: string;
  user: User;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  due_date: string | null;
  board: string | null;
  board_id: string | null;
  board_title?: string | null;
  milestones?: Milestone[];
  milestone_count?: number;
  completed_milestone_count?: number;
  todo_milestone_count?: number;
  in_progress_milestone_count?: number;
  done_milestone_count?: number;
  created_at: string;
  updated_at: string;
}

export type CardPriority = "low" | "medium" | "high";

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  priority: CardPriority;
  due_date: string | null;
  position: number;
  column: string;
  column_id: string;
  project: string | null;
  project_id: string | null;
  project_name?: string | null;
  milestone: string | null;
  milestone_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  position: number;
  cards: KanbanCard[];
}

export interface LinkedProject {
  id: string;
  name: string;
  status: ProjectStatus;
}

export interface Board {
  id: string;
  title: string;
  project: string | null;
  project_id: string | null;
  linked_projects?: LinkedProject[];
  column_count?: number;
  card_count?: number;
  columns?: KanbanColumn[];
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  active_projects: number;
  overdue_milestones: number;
  total_boards: number;
  total_projects: number;
  recent_activity: {
    id: string;
    title: string;
    board_id: string;
    board_title: string;
    column_name: string;
    updated_at: string;
  }[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
