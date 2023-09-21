// import { Injectable } from '@angular/core';

// type RegistrationId = number;
// type OverlayData = Record<string | number, unknown>;

// enum OverlayType {
//     Loading = 1,
//     Data = 2
//     // etc if ever
// }

// interface IOverlay {
//     type: OverlayType;
//     extras?: OverlayData | null;
//     registration: RegistrationId;
// }

// // Can use BehavioralSubject in place of state
// export abstract class OverlayService extends Injectable {
//     public abstract add(type: OverlayType, extras?: OverlayData): RegistrationId;
//     public abstract remove(registration: RegistrationId): void;
//     public abstract clear(): void; // Clears all active overlays
//     abstract get active(): boolean; // Checks if there is any subscription/registration in the queue
//     abstract getOverlays(type: OverlayType): IOverlay[];
// }

// const overlayService: OverlayService;
// const hasLoadingOverlay = overlayService.getOverlays(OverlayType.Loading).length;
// const hasDataOverlay = overlayService.getOverlays(OverlayType.Data).length;

// if (hasDataOverlay) {
//     const modalData = overlayService.getOverlays(OverlayType.Data)[0];
// }
