import { HttpErrorResponse } from '@angular/common/http';
import { IPhase } from '@teq/shared/types/phase.type';

export class LoadPhases {
    static readonly type = '[Framework] Load phases';
}

export class LoadPhasesSuccess {
    static readonly type = '[Framework] Load phases success';
    constructor(public phases: IPhase[]) {}
}

export class LoadPhasesError {
    static readonly type = '[Framework] Load phases error';
    constructor(public error: HttpErrorResponse) {}
}
