export namespace Auth {
    export class GetToken {
        static readonly type = '[Auth] Get Token';
    }

    export class Refresh {
        static readonly type = '[Auth] Refresh Token';
        constructor(public readonly forceAuthenticate: boolean) {}
    }

    export class Deauthenticate {
        static readonly type = '[Auth] Deauthenticate';
    }
}
