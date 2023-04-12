import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommonHttpService } from 'src/app/core/services/common-http.service';
import { Investor } from '../models/investor';

@Injectable({
  providedIn: 'root'
})
export class InvestorService {

  constructor(
    private commonHttpService: CommonHttpService,
    private authService: AuthenticationService
  ) { }

  getTrendingInvestor(): Array<Investor> {
    return [{
      name: "INV1234A",
      imageUrl: "https://material-ui.com/static/images/avatar/1.jpg",
      organisation: "Zerodha",
      designation: "CEO",
      status: "Active",
      portfolios: 10,
      amountInvested: 2,
      rating: 4.5
    }, {
      name: "INV6543M",
      imageUrl: "https://material-ui.com/static/images/avatar/2.jpg",
      organisation: "Stello",
      designation: "CFO",
      status: "Moderate",
      portfolios: 12,
      amountInvested: 1.5,
      rating: 4.5

    }, {
      name: "INV7856S",
      imageUrl: "https://material-ui.com/static/images/avatar/3.jpg",
      organisation: "Netmindz",
      designation: "CMO",
      status: "Sleeping",
      portfolios: 20,
      amountInvested: 4.1,
      rating: 4.5

    }]
  }

  getRecommendedInvestor(): Array<Investor> {
    return [{
      name: "INV1234A",
      imageUrl: "https://material-ui.com/static/images/avatar/1.jpg",
      organisation: "Venture Center",
      designation: "",
      status: "Active",
      portfolios: 10,
      amountInvested: 2,
      rating: 4.5


    },
    {
      name: "INV6543M",
      imageUrl: "https://material-ui.com/static/images/avatar/2.jpg",
      organisation: "Venture Center",
      designation: "CEO",
      status: "Moderate",
      portfolios: 10,
      amountInvested: 1.5,
      rating: 3


    }, {
      name: "INV7856S",
      imageUrl: "https://material-ui.com/static/images/avatar/3.jpg",
      organisation: "Venture Center",
      designation: "CEO",
      status: "Sleeping",
      portfolios: 10,
      amountInvested: 4.1,
      rating: 4.5


    },
    {
      name: "INV9876S",
      imageUrl: "https://material-ui.com/static/images/avatar/4.jpg",
      organisation: "Venture Center",
      designation: "",
      status: "Sleeping",
      portfolios: 10,
      amountInvested: 1.9,
      rating: 4
    }]
  }


  getInvestmentProfile(investmentProfleId) {
    return this.commonHttpService.get(`investmentProfile/${investmentProfleId}`)
  }

  getRecommendedCompanies(investmentProfleId: string, options = {
    sortBy: 'amount',
    sortOrder: 'ASC',
    pageSize: 5,
    pageNumber: 1
  }) {
    const {
      sortBy,
      sortOrder,
      pageSize,
      pageNumber
    } = options
    const fetchQuery = `investmentProfile/${investmentProfleId}/recommendedCompany`
    const sortQuery = sortBy && sortOrder ? `&sortBy=${sortBy}&sortOrder=${sortOrder}&pageSize=${pageSize}&pageNumber=${pageNumber}` : ''
    const userRole = this.authService.getSelectedRole()
    const userDetails = this.authService.getUserDetails()

    return this.commonHttpService.get(`${fetchQuery}?${sortQuery}`).pipe(map(res => {
      const companies = res?.data
      return {
        count: res?.count,
        data: companies.map(company => {
          let requestStatus = ''
          let requestSentByMe = false
          const ijDetails = company.rcIjDto
          if (ijDetails) {
            if (ijDetails.status === 'CONNECTION_REQUESTED') {
              if (ijDetails.createdByRole === userRole) {
                requestSentByMe = ijDetails.createdBy === userDetails.profileId
                requestStatus = 'REQUEST_SENT'
              } else {
                requestStatus = 'REQUEST_RECEVIED'
              }
            }
            if (ijDetails.status === 'IN_PROGRESS') {
              requestStatus = 'REQUEST_ACCEPTED'
            }
          }
          return {
            ...company,
            requestStatus,
            requestSentByMe
          }

        })
      }
    }))
  }

  getConnectedCompanies(investmentProfleId: string) {
    return this.commonHttpService.get(`investmentProfile/${investmentProfleId}/connectedCompany`)
  }
}

