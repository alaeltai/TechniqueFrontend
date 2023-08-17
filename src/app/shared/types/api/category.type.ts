import type { IAPITask } from './task.type';

export interface IAPICategory {
    Id: string;
    Name: string;
    Tasks: IAPITask[];
}
