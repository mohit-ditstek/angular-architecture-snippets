import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'tgt-vertical-timeline',
  templateUrl: './tgt-vertical-timeline.component.html',
  styleUrls: ['./tgt-vertical-timeline.component.scss']
})
export class TgtVerticalTimelineComponent implements OnInit, OnChanges {

  @Input() timeLineTitle: string;
  @Input() investmentJourney;
  @Input() disabled: boolean = false
  completedSteps: Number;
  activeStepIndex: Number;
  constructor() { }

  ngOnInit() {
    this.initializeIJ()
  }

  ngOnChanges(){
   this.initializeIJ()
  }

  initializeIJ(){
    if(this.investmentJourney){
      this.completedSteps = this.investmentJourney.filter(x => x.isCompleted).length;
      this.activeStepIndex = this.investmentJourney.findIndex(x => !x.isCompleted)
      this.activeStepIndex = this.activeStepIndex === -1 ? this.investmentJourney.length - 1 : this.activeStepIndex;
    }
  }

  scroll() {
    setTimeout(() => {
      document.querySelector("tgt-vertical-timeline tgt-perfect-scroll .active").scrollIntoView();
    }, 1000);
  }

  getClassName(ij,i) {
    if (ij) {
      if ((ij?.isCompleted ) || (this.activeStepIndex === i)) {
        return 'verticalTimelineRow_completed'
      }  else if (!ij?.isCompleted) {
        return 'verticalTimelineRow_incomplete'
      }
    }
  }
}
