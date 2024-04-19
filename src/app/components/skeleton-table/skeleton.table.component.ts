import { Component, Input, OnInit } from '@angular/core';
@Component({
    selector: 'skeleton-table-component',
    templateUrl: './skeleton.table.component.html',
})
export class SkeletonTableComponent implements OnInit {
    @Input() title:string = "";
    fakeData: any[] = new Array(5);
    constructor() {}

    ngOnInit() {
    }
}