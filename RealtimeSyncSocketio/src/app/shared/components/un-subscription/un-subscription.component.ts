import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-un-subscription',
  templateUrl: './un-subscription.component.html',
  styleUrls: ['./un-subscription.component.scss']
})
export class UnSubscriptionComponent implements OnDestroy  {
  subscription = new Subscription()

  constructor() { }

  ngOnDestroy() {
    this.subscription.unsubscribe()
}

}
