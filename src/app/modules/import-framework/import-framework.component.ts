import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'teq-import-framework',
    templateUrl: './import-framework.component.html',
    styleUrls: ['./import-framework.component.scss']
})
export class ImportFrameworkComponent {
    public file?: File;

    constructor(private readonly _router: Router) {}

    fileDropped(file: File): void {
        this.file = file;

        setTimeout(() => {
            this._router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(async () => await this._router.navigate(['/create']))
                .catch(() => {
                    //
                });
        }, 2500);
    }
}
