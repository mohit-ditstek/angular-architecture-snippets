import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recommended-investor-details',
  templateUrl: './recommended-investor-details.component.html',
  styleUrls: ['./recommended-investor-details.component.scss']
})
export class RecommendedInvestorDetailsComponent implements OnInit {

  disableAnimation = true;
  @Input() investor: any;
  @Output() onConnect = new EventEmitter<any>()
  @Output() onWithdraw = new EventEmitter<any>()
  @Output() onAccept = new EventEmitter<any>()
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
      this.getTotalExperience()
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.disableAnimation = false);
    this.cdr.detectChanges();
  }

  connect() {
    const { ioId, investmentProfileId } = this.investor
    this.onConnect.emit({ ioId, ipId: investmentProfileId })
  }

  withdraw() {
    this.onWithdraw.emit(this.investor.riIjDto.ijId)
  }

  accept() {
    this.onAccept.emit(this.investor.riIjDto.ijId)
  }

  getTotalExperience(){
    let totalExperience = 0
    this.investor?.professionalHistories?.forEach(row => {
      totalExperience = totalExperience  + this.getExperience(row)
    })
    if(this.investor && totalExperience > 0)
      this.investor['totalExperience'] = totalExperience
    else
      this.investor['totalExperience'] = null
  }

  getExperience(experience) {
    let startYear = experience?.startYear
    let endYear = experience?.endYear
    let isCurrent = experience?.isCurrent
    if (isCurrent) {
      endYear = new Date().getFullYear().toString()
    }
    if (startYear != null && endYear != null) {
      return (parseInt(endYear) - parseInt(startYear))
    } 
    else return 0
  }
}
