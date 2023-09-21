import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CanLeaveRouteService {
    canLeaveRoute$ = new Subject<boolean>();
}
