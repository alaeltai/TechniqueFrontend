import { MsalInterceptorConfiguration, ProtectedResourceScopes } from '@azure/msal-angular';
import { InteractionType } from '@azure/msal-browser';
import { environment } from 'environments/environment';

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();

    protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);
    protectedResourceMap.set(`${environment.apiConfig.uri}/phases`, [
        {
            httpMethod: 'GET',
            scopes: environment.apiConfig.scopes
        }
    ]);

    return {
        interactionType: InteractionType.Popup,
        protectedResourceMap
    };
}
