import type { IAPIBasePhase } from './phase.type';
import type { IAPICategory } from './category.type';
import type { IAPIRole } from './role.type';
import { IAPIArtefact } from './artefact.type';

export interface IAPITask extends Omit<IAPIBasePhase, 'Description'> {
    purpose: string;
    how: string;
    responsible: IAPIRole;
    category: IAPICategory;
    artefactsOutput: IAPIArtefact[];
    artefactsInput: IAPIArtefact[];
    inputDescription: string;
    outputDescription: string;
}
