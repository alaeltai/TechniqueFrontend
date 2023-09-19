type MSALReadScope = 'api://70f4d3b4-24ee-4742-aea6-43808b2a391d/Read';
type MSALScope = MSALReadScope;

export interface EnvironmentTypeModel {
    production: boolean;
    rootUrl: string;
    mock: {
        tree: boolean;
        glossary: boolean;
        faq: boolean;
        relatedJobs: boolean;
    };
    msalConfig: {
        auth: {
            clientId: string;
            authority: string;
        };
    };
    exportService: {
        url: string;
    };
    apiConfig: {
        scopes: MSALScope[];
        uri: string;
    };
}
