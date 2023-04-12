import { Component, Input, OnInit } from '@angular/core';
import { Mentor } from 'src/app/entrepreneur/models/mentors';

@Component({
  selector: 'app-mentors',
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.scss']
})
export class MentorsComponent implements OnInit {
  @Input() recommendedMentors: Array<Mentor>;
  constructor() { }

  ngOnInit() {
  }

}
