import { Component, Input, OnInit } from '@angular/core';


export interface News {
  icon: string;
  title: string;
  description: string;
}


@Component({
  selector: 'app-trending-news',
  templateUrl: './trending-news.component.html',
  styleUrls: ['./trending-news.component.scss']
})
export class TrendingNewsComponent implements OnInit {

  @Input() newsList:Array<News> = [] 

  constructor() { }

  ngOnInit(): void {
      this.newsList.push({
        icon: 'https://play-lh.googleusercontent.com/1JB_yUFt5gC6HAj9NHA_HuS4ja8kSpXq3KWApSZtAP6xc3WJpeERnv4n5ohdhbwdQEk=s180-rw',
        title: 'Start-up WUS ties up with GASP to enhance ‘AI Tech’',
        description: 'GASP and WUS will work jointly to deliver...'
      })
      this.newsList.push({
        icon: 'https://store-images.s-microsoft.com/image/apps.38416.9007199266250907.217cbcfc-4852-43d4-b3af-766d136f85fa.6ce717fa-8786-45ed-9bfc-ebc414691daa',
        title: 'Start-up WUS ties up with GASP to enhance ‘AI Tech’',
        description: 'GASP and WUS will work jointly to deliver...'
      })
      this.newsList.push({
        icon: 'https://play-lh.googleusercontent.com/1JB_yUFt5gC6HAj9NHA_HuS4ja8kSpXq3KWApSZtAP6xc3WJpeERnv4n5ohdhbwdQEk=s180-rw',
        title: 'Start-up WUS ties up with GASP to enhance ‘AI Tech’',
        description: 'GASP and WUS will work jointly to deliver...'
      })
  }

}
