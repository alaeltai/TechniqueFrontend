import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IPhase } from '@teq/shared/types/phase.type';

@Component({
    selector: 'teq-import-framework',
    templateUrl: './import-framework.component.html',
    styleUrls: ['./import-framework.component.scss']
})
export class ImportFrameworkComponent {
    public file?: File;

    public progress = 0;

    constructor(private readonly _router: Router) {}

    fileDropped(file: File): void {
        this.file = file;

        const reader = new FileReader();
        const started = Date.now();

        reader.onload = async event => {
            const remaining = 1800 - (Date.now() - started);

            if (remaining > 0) {
                setTimeout(() => this._parseData(event), remaining);
            } else {
                this._parseData(event);
            }
        };

        reader.onprogress = data => {
            // Compute the progress of file uploading
            if (data.lengthComputable) {
                this.progress = (data.loaded / data.total) * 0.9 * 100; // Limit file upload progress to 90%
            }
        };

        reader.readAsText(file, 'utf-8');
    }

    private _parseData(event: ProgressEvent<FileReader>): void {
        let imported: IPhase[] = [];

        if (event.target && typeof event.target.result === 'string') {
            try {
                const parsed = JSON.parse(event.target.result) as IPhase[];

                if (parsed) {
                    imported = parsed;
                }
            } catch (e) {
                // Error parsing input data, invalidate the file
                console.error(e);
            }
        }

        this.progress = 100;

        // Redirect to create with the imported data once available
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => await this._router.navigate(['/create'], { state: { imported } }));
    }
}
