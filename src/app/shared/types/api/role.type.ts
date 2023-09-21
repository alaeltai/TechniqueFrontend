export interface IAPIRole {
    id: string;
    name: string;
    description: string;
    skills: string;
    relatedJobs: IAPIRelatedJob[];
}

export interface IAPIRelatedJob {
    id: string;
    name: string;
    country: string[];
    serviceProvider: string;
}
