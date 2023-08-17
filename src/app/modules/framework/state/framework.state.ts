/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IPhase } from '@teq/shared/types/phase.type';
import { LoadPhases, LoadPhasesError, LoadPhasesSuccess } from '@teq/modules/framework/state/framework.actions';
// import { phases } from '@teq/modules/framework/state/phases-data';
import { IPagination } from '@teq/shared/types/pagination.type';
import { FrameworkPagination } from './framework.pagination.actions';
import { ISVGRenderingOptions } from '@teq/shared/types/svg.type';
import { FrameworkSVGRenderer } from './framework.svg.actions';

export class IFrameworkStateModel {
    phases!: IPhase[];
    pagination!: IPagination;
    svgOptions!: ISVGRenderingOptions;
}

const initialFrameworkState: IFrameworkStateModel = {
    phases: [],
    pagination: { page: 1, zoom: 4 },
    svgOptions: { width: 1, height: 1, contents: [] }
};

@State<IFrameworkStateModel>({
    name: 'framework',
    defaults: initialFrameworkState
})
@Injectable()
export class FrameworkState {
    @Selector()
    static phases(state: IFrameworkStateModel): IPhase[] {
        return state.phases;
    }

    @Selector()
    static pagination(state: IFrameworkStateModel): IPagination {
        return state.pagination;
    }

    @Selector()
    static svgOptions(state: IFrameworkStateModel): ISVGRenderingOptions {
        return state.svgOptions;
    }

    @Action(LoadPhases)
    loadPhases({ dispatch }: StateContext<IFrameworkStateModel>): void {
        dispatch(new LoadPhasesSuccess([]));
    }

    @Action(LoadPhasesSuccess)
    loadPhasesSuccess({ patchState }: StateContext<IFrameworkStateModel>, { phases }: LoadPhasesSuccess): void {
        patchState({
            phases
        });
    }

    @Action(LoadPhasesError)
    loadPhasesError({ patchState }: StateContext<IFrameworkStateModel>): void {
        patchState({
            phases: []
        });
    }

    @Action(FrameworkPagination.Change)
    changePagination({ patchState }: StateContext<IFrameworkStateModel>, { pagination }: FrameworkPagination.Change): void {
        patchState({ pagination });
    }

    @Action(FrameworkSVGRenderer.Change)
    changeSVGOptions({ patchState }: StateContext<IFrameworkStateModel>, { options }: FrameworkSVGRenderer.Change): void {
        patchState({ svgOptions: options });
    }
}
