import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'tgt-widget',
  templateUrl: './tgt-widget.component.html',
  styleUrls: ['./tgt-widget.component.scss']
})
export class TgtWidgetComponent implements OnInit {
  @Input() widgetDetail: any;
  @Input() widgetIndex = 0;
  loader = false;
 
  
  constructor(private loaderService:LoaderService) { }

  ngOnInit(): void {
    
    this.loaderService.loaderEvent.subscribe((isloading) => {
      this.loader = isloading;
    })

   
  }


}
