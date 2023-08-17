import { BrowserCacheLocation, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { environment } from 'environments/environment';

export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: environment.msalConfig.auth.clientId,
            authority: environment.msalConfig.auth.authority,
            redirectUri: '/',
            postLogoutRedirectUri: '/',
            clientCapabilities: ['CP1'] // This lets the resource server know that this client can handle claim challenges.
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: false
        },
        system: {
            allowNativeBroker: false, // Disables WAM Broker (enable for Windows AD user direct login?)
            loggerOptions: {
                loggerCallback: (logLevel: LogLevel, message: string) => {
                    console.log(logLevel, message);
                },
                logLevel: LogLevel.Info,
                piiLoggingEnabled: false
            }
        }
    });
}
