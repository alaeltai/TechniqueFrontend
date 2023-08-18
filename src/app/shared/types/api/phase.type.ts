import type { IAPISubPhase } from './subphase.type';

export interface IAPIBasePhase {
    id: string;
    name: string;
    order: number;
    description: string;
}

export interface IAPIPhase extends IAPIBasePhase {
    subPhases: IAPISubPhase[];
}
