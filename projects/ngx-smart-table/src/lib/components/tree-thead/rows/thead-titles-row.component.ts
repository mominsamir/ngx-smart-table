import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {Grid} from '../../../lib/grid';
import {DataSource} from '../../../lib/data-source/data-source';
import {Column} from '../../../lib/data-set/column';

@Component({
  selector: '[ng2-st-thead-titles-row]',
  styleUrls: ['./thead-row.component.scss'],
  template: `
    <th ng2-st-checkbox-select-all *ngIf="isMultiSelectVisible"
        [grid]="grid"
        [source]="source"
        [isAllSelected]="isAllSelected"
        (click)="selectAllRows.emit($event)">
    </th>
    <th *ngIf="isSingleSelectVisible"></th>
    <th ng2-st-actions-title *ngIf="showActionColumnLeft" [grid]="grid"></th>
    <th *ngFor="let column of getVisibleColumns(grid.getColumns()) let i=index"
        class="ng2-smart-th {{ column.id }} {{column.class}}"
        [style.width]="column.width"
        [ngClass]="!column.isScrollable ? 'col-'+ (i+1) : 'title'"
    >
      <ng2-st-column-title [source]="source" [column]="column" (sort)="sort.emit($event)"></ng2-st-column-title>
    </th>
    <th ng2-st-actions-title *ngIf="showActionColumnRight" [grid]="grid"></th>
  `,
})
export class TheadTitlesRowComponent implements OnChanges {

  @Input() grid: Grid;
  @Input() isAllSelected: boolean;
  @Input() source: DataSource;

  @Output() sort = new EventEmitter<any>();
  @Output() selectAllRows = new EventEmitter<any>();

  isSingleSelectVisible: boolean;
  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;

  fixedColClassName(i) {
    console.log(i * 100);
    return i * 100;
  }

  ngOnChanges() {
    this.isSingleSelectVisible = this.grid.isSingleSelectVisible();
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.showActionColumnRight = this.grid.showActionColumn('right');
  }

  getVisibleColumns(columns: Array<Column>): Array<Column> {
    return (columns || []).filter((column: Column) => !column.hide);
  }
}
