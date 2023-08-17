import type { IAPISubPhase } from './subphase.type';

export interface IAPIBasePhase {
    Id: string;
    Name: string;
    Order: number;
    Description: string;
}

export interface IAPIPhase extends IAPIBasePhase {
    SubPhases: IAPISubPhase[];
}
