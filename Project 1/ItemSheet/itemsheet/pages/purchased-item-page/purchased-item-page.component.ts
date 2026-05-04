import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@app/shared/services';
import { WorksheetFacade } from '@app/store/deal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-purchased-unit-page',
  templateUrl: './purchased-unit-page.component.html',
  styleUrls: ['./purchased-unit-page.component.scss'],
})
export class PurchasedUnitPageComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public loading = false;

  constructor(
    private route: ActivatedRoute,
    private worksheetFacade: WorksheetFacade,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.eventService.dealTypeChanged$.subscribe(() => {
        this.reloadUnitForm();
      })
    );

    this.subscription.add(
      this.route.params.subscribe(() => {
        this.worksheetFacade.getActiveUnit();
        this.reloadUnitForm();
      })
    );
  }

  reloadUnitForm() {
    this.loading = true;
    setTimeout(() => (this.loading = false), 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
