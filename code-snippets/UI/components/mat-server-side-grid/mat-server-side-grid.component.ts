import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GridColumn, ListResponse, Permission, SortDirection } from '@app/entities';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-mat-server-side-grid',
  templateUrl: './mat-server-side-grid.component.html',
  styleUrls: ['./mat-server-side-grid.component.scss'],
})
export class MatServerSideGridComponent implements OnInit {
  public displayedColumns: string[];
  public dataSource = new MatTableDataSource([]);
  public hasNextPage = true;
  public loadMore = false;

  @Input() rowEventEnabled = false;
  @Input() loaded = false;
  @Input() data$: Observable<ListResponse<object>>;
  @Input() sortColumn: string;
  @Input() sortDirection = SortDirection.Ascending;
  @Input() columns: Array<GridColumn>;
  @Input() allCheckboxChecked: boolean;
  @Input() currentPermission: Permission;
  @Input() hideDetailRow: (data: object) => boolean;
  @Input() detailRow?: TemplateRef<HTMLElement>;
  @Input() hasPermissions = false;
  @Input() customClass: string;

  @ViewChild(MatSort, { static: false }) sort;
  public config: PerfectScrollbarConfigInterface = {};

  @Output() onScroll = new EventEmitter<void>();
  @Output() onSort = new EventEmitter<any>();
  @Output() triggerRowEvent = new EventEmitter<any>();
  @Output() checkAll = new EventEmitter<boolean>();

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;

  private subscription = new Subscription();
  
  ngOnInit() {
    if (this.columns) {
      this.displayedColumns = this.columns.map((col) => col.name);
    }
    this.bindGrid();
  }

  bindGrid() {
    this.subscription.add(
      this.data$.subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.items);
        this.dataSource.sort = this.sort;
        this.hasNextPage = data.hasNext;
        this.loadMore = false;
      })
    );
  }

  onScrollDown(_event) {
    if (this.loadMore) return;

    this.loadMore = true;
    this.componentRef.directiveRef.position(true);

    this.onScroll.emit();
  }

  sortData(event) {
    this.onSort.emit(event);
  }

  rowClick(event) {
    if (this.rowEventEnabled) this.triggerRowEvent.emit(event);
  }

  toggleAllCheckbox(event) {
    this.checkAll.emit(event.checked);
  }

  get noDataFound() {
    return this.dataSource.data.length === 0;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
