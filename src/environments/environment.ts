import { EnvironmentTypeModel } from 'environments/environment.type';

export const environment: EnvironmentTypeModel = {
    production: false,
    rootUrl: '',
    mock: {
        tree: true,
        faq: true,
        glossary: true
    },
    msalConfig: {
        auth: {
               clientId: '70f4d3b4-24ee-4742-aea6-43808b2a391d',
               authority: 'https://login.microsoftonline.com/8e656664-5f36-4a5b-954c-c5405fd29206'
        }
    },
    apiConfig: {
        scopes: ['api://70f4d3b4-24ee-4742-aea6-43808b2a391d/Read'],
        uri: 'https://technique.qa.spctrm.computacenter.com/api'
    }
};
