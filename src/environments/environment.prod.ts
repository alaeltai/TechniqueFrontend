import { EnvironmentTypeModel } from 'environments/environment.type';

export const environment: EnvironmentTypeModel = {
    production: true,
    rootUrl: '',
    mock: {
        tree: false,
        faq: false,
        glossary: false
    },
    msalConfig: {
        auth: {
            clientId: '05321182-2629-434e-b593-d8272c535df9',
            authority: 'https://login.microsoftonline.com/4f3de4dd-5a63-4f78-badf-657bbe2f7107'
        }
    },
    apiConfig: {
        scopes: ['api://5959ac77-d979-4a98-a27c-b6d473649578/Read'],
        uri: 'https://technique.qa.spctrm.computacenter.com/api'
    }
};
