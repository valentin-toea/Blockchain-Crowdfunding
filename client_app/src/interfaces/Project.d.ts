interface Project {
  [key: string]: any;
  id?: string;
  userId: string;
  images: string[];
  mainImage: string;
  categories: string[];
  title: string;
  shortDescription: string;
  description: string;
  goal: string;
  minimumContribution: string;
  startDate: string;
  endDate: string;
  country: string;
  benefitType: "percentage" | "rewards";
  rewards: ProjectReward[];
  equityRule: EquityRule;
  user?: UserProfile;
  wallet: string;
  contractRef: string;
  backers?: number;
}

interface ProjectReward {
  [key: string]: any;
  title: string;
  threshold: number;
  description: string;
  isEditable: boolean;
}

interface EquityRule {
  [key: string]: any;
  allocatedPercentage: number | null;
  maxPercentagePerUser: number | null;
  minimumThreshold: number | null;
}