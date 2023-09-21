import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class BaseControllerService {
    public readonly httpClient = inject(HttpClient);
}
