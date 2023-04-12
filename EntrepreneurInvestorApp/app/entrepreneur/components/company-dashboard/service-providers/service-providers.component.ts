import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-providers',
  templateUrl: './service-providers.component.html',
  styleUrls: ['./service-providers.component.scss']
})
export class ServiceProvidersComponent implements OnInit {
  @Input() loader;
  serviceProviders: any = [{
    icon: "tgt_finance",
    service:"Finance",
    providers:20
  },{
    icon: "tgt_marketing",
    service:"Marketing",
    providers:15
  },{
    icon: "tgt_human_resource",
    service:"Human Resources",
    providers:25
  },{
    icon: "tgt_legal",
    service:"Legal",
    providers:10
  }]
  constructor() { }

  ngOnInit() {
  }

}
