import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'app-btn',
    template: `
    <a href="javascript:void(0);" class="btn">
            <span>
                <i class="material-icons small" style="vertical-align:bottom; margin-left: -8px;">{{icon}}</i>
                <label style="vertical-align:text-top; padding-left: 8px; cursor: pointer;">{{text}}</label>
            </span>
        </a>
  `,
    styleUrls: ['../app/app.component.scss']
})
export class BtnComponent implements AfterViewInit {
    @Input('icon') icon: string;
    @Input('text') text: string;
    constructor() {

    }

    ngAfterViewInit() {

    }
}