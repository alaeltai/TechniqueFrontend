type MSALReadScope = 'api://70f4d3b4-24ee-4742-aea6-43808b2a391d/Read';
type MSALScope = MSALReadScope;

export interface EnvironmentTypeModel {
    production: boolean;
    rootUrl: string;
    msalConfig: {
        auth: {
            clientId: string;
            authority: string;
        };
    };
    apiConfig: {
        scopes: MSALScope[];
        uri: string;
    };
}
