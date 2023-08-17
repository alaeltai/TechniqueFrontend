import type { IAPIBasePhase } from './phase.type';
import type { IAPICategory } from './category.type';
import type { IAPIRole } from './role.type';
import { IAPIArtefactUrl } from './artefactUrl.type';

export interface IAPITask extends Omit<IAPIBasePhase, 'Description'> {
    Purpose: string;
    How: string;
    Responsible: IAPIRole;
    Category: IAPICategory;
    TaskArtefactOutputUrls: IAPIArtefactUrl[];
    TaskArtefactInputUrls: IAPIArtefactUrl[];
}
