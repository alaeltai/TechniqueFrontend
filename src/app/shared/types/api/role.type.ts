export interface IAPIRole {
    id: string;
    name: string;
    description: string;
    skills: string;
    relatedJobs: IAPIRelatedJobs[];
}

export interface IAPIRelatedJobs {
    name: string;
    country: string[];
    serviceProvider: string;
}
