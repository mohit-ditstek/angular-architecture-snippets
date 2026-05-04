import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-skelton-loader',
  templateUrl: './tabs-skelton-loader.component.html',
  styleUrls: ['./tabs-skelton-loader.component.scss'],
})
export class TabsSkeltonLoaderComponent {

  items(i: number) {
    return new Array(i);
  }
  
}
