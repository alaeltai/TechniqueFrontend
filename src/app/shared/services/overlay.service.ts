/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type RegistrationId = number;

interface IOverlayDataMessage {
    message: string;
}
export interface IOverlayDataContent<T> {
    template: OverlayTemplate;
    data: T;
}

export type OverlayData = IOverlayDataMessage | IOverlayDataContent<unknown>;

export enum OverlayType {
    Loading = 1,
    Data = 2
}

export enum OverlayTemplate {
    TaskDetails = 'task',
    TailoringConfirmation = 'confirmation'
}

interface IOverlay<T> {
    type: OverlayType;
    extras?: T;
    registration: RegistrationId;
}

@Injectable()
export class OverlayService {
    private readonly _overlays = new BehaviorSubject<Array<IOverlay<OverlayData>>>([]);

    add(type: OverlayType.Loading, extras: IOverlayDataMessage): RegistrationId;
    add(type: OverlayType.Data, extras: IOverlayDataContent<unknown>): RegistrationId;
    add(type: OverlayType, extras: OverlayData): RegistrationId {
        const newOverlay: IOverlay<typeof extras> = {
            type,
            extras,
            registration: this.generateId()
        };

        this._overlays.next([...this._overlays.value, newOverlay]);

        return newOverlay.registration;
    }

    remove(registration: RegistrationId): void {
        setTimeout(() => {
            this._overlays.next(this._overlays.value.filter(overlay => overlay.registration !== registration));
        }, 100);
    }

    clear(): void {
        // Clears all active overlays
        this._overlays.next([]);
    }

    get active(): boolean {
        // Checks if there is any subscription/registration in the queue
        return !!this._overlays.value.length;
    }

    getOverlays(type: OverlayType.Loading): Array<IOverlay<IOverlayDataMessage>>;
    getOverlays(type: OverlayType.Data): Array<IOverlay<IOverlayDataContent<unknown>>>;
    getOverlays(type: OverlayType): Array<IOverlay<OverlayData>> {
        return this._overlays.value.filter(o => o.type === type);
    }

    generateId(): number {
        return Date.now();
    }
}
