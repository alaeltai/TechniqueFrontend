import { BasePhase } from './phase.type';

export type RoleType =
    | 'Account Team'
    | 'Bid Manager'
    | 'Consultant (Business)'
    | 'Consultant (Change)'
    | 'Consultant (Innovation)'
    | 'Manager'
    | 'Opportunity Owner'
    | 'Project Lead'
    | 'Service Team'
    | 'Solution Architect'
    | 'Solution Lead'
    | 'Consultant (Testing)'
    | 'Unknown';

export interface IRole extends Omit<BasePhase, 'order' | '_locator'> {
    color?: string;
    count?: number;
    skills: string;
    related_jobs: IRelatedJob[];
    name: RoleType;
}

export interface IRoleRelatedJobs {
    role_id: string;
    jobs: IRelatedJob[];
}

export interface IRelatedJob {
    id: string;
    name: string;
    countries: string[];
    service_provider: string;
}
