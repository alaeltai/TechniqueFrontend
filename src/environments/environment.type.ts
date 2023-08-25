type MSALReadScope = 'api://5959ac77-d979-4a98-a27c-b6d473649578/Read';
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
