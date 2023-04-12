import { Injectable } from '@angular/core';
import { Enterprenuer } from '../models/enterprenuer';
import { InvestmentOpportunityJourney } from '../models/investment-opportunities';
import { Mentor } from '../models/mentors';


@Injectable({
  providedIn: 'root'
})
export class EnterprenuerService {

constructor() { }

getTrendingEnterprenuer(): Array<Enterprenuer> {
  return [{
    name: "Arcon Mathew",
    imageUrl: "https://material-ui.com/static/images/avatar/1.jpg",
    organisation: "Zerodha",
    designation: "CEO",
    status: "Active",
    portfolios: 10
  }, {
    name: "John Cooper",
    imageUrl: "https://material-ui.com/static/images/avatar/2.jpg",
    organisation: "Stello",
    designation: "CFO",
    status: "Active",
    portfolios: 12
  }, {
    name: "Julia Miller",
    imageUrl: "https://material-ui.com/static/images/avatar/3.jpg",
    organisation: "Netmindz",
    designation: "CMO",
    status: "Active",
    portfolios: 20
  }]
}

getRecommendedEntreprenuer(): Array<Enterprenuer> {
  return [{
    name: "Parmeet Joshi",
    imageUrl: "https://material-ui.com/static/images/avatar/1.jpg",
    organisation: "Venture Center",
    designation: "",
    status: "Active",
    portfolios: 10
  },
  {
    name: "Arcon Mathew",
    imageUrl: "https://material-ui.com/static/images/avatar/2.jpg",
    organisation: "Venture Center",
    designation: "CEO",
    status: "Active",
    portfolios: 10
  }, {
    name: "Mary James",
    imageUrl: "https://material-ui.com/static/images/avatar/3.jpg",
    organisation: "Venture Center",
    designation: "CEO",
    status: "Active",
    portfolios: 10
  },
  {
    name: "Pablo",
    imageUrl: "https://material-ui.com/static/images/avatar/4.jpg",
    organisation: "Venture Center",
    designation: "",
    status: "Active",
    portfolios: 10
  }]
}

getRecommendedMentors(): Array<Mentor> {
  return [{
    name: "MNT6784P",
    imageUrl: "https://material-ui.com/static/images/avatar/1.jpg",
    organisation: "Parmaset",
    designation: "CTO",
    workExperience: "Digital Media | Business",
    rating:4.5
  },
  {
    name: "MNT2736P",
    imageUrl: "https://material-ui.com/static/images/avatar/2.jpg",
    organisation: "Stark Indutries",
    designation: "CEO",
    workExperience: "Marketing | Business ",
    rating:3.5
  }, {
    name: "MNT9364P",
    imageUrl: "https://material-ui.com/static/images/avatar/3.jpg",
    organisation: "Halley",
    designation: "CEO",
    workExperience: "Digital Media | Business ",
    rating:4

  },
  {
    name: "MNT7392P",
    imageUrl: "https://material-ui.com/static/images/avatar/4.jpg",
    organisation: "Zolia Media",
    designation: "CTO",
    workExperience: "Marketing | Entertainment",
    rating:4.5

  }]
}

getInvestomentOpportunityJourney():Array<InvestmentOpportunityJourney>{
  return [{
    name: "Parmeet Joshi",
    imageUrl: "https://material-ui.com/static/images/avatar/1.jpg",
    stage:"SEED",
    date:new Date(),
    opportunity:"Business plan presentation"
  },{
    name: "Parmeet Joshi",
    imageUrl: "https://material-ui.com/static/images/avatar/2.jpg",
    stage:"SEED",
    date:new Date(),
    opportunity:"Business plan presentation"
  },{
    name: "Parmeet Joshi",
    imageUrl: "https://material-ui.com/static/images/avatar/3.jpg",
    stage:"SEED",
    date:new Date(),
    opportunity:"Business plan presentation"
  }]
}

}
