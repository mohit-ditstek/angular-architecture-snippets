import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecommendedCompany } from 'src/app/investor/models/recommended-company';
import { InvestmentJourneyService } from 'src/app/shared/services/investment-journey.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  disableAnimation = true;
  @Input() company: RecommendedCompany
  @Output() onConnect = new EventEmitter<any>()
  @Output() onWithdraw = new EventEmitter<any>()
  @Output() onAccept = new EventEmitter<any>()


  constructor(private investmentJourneyService: InvestmentJourneyService,private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    setTimeout(() => this.disableAnimation = false);
    this.cdr.detectChanges();
  }
  getSectors() {
    const primarySector = this.company?.companySectors.find(sector => sector.isPrimary)
    let secondarySectors = [] 
    this.company?.companySectors.forEach(sector => {
        if(!sector.isPrimary) {secondarySectors.push(sector)}
    })
    secondarySectors?.sort((a,b) => a.name > b.name ? 1 : -1)
    let sectorString = primarySector?.name + (secondarySectors.length ? ', ': '') + secondarySectors?.map(sector => sector.name).join(', ')
    return sectorString
  }

  connect(){
    const {ioId, ipId} = this.company
    this.onConnect.emit({ioId, ipId})
  }

  withdraw() {
    this.onWithdraw.emit(this.company.rcIjDto.ijId)
  }

  accept() {
    this.onAccept.emit(this.company.rcIjDto.ijId)
  }

}
