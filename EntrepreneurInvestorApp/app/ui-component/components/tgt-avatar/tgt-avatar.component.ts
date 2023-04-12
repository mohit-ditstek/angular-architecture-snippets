import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'tgt-avatar',
  templateUrl: './tgt-avatar.component.html',
  styleUrls: ['./tgt-avatar.component.scss']
})
export class TgtAvatarComponent implements OnInit {

  @Input() size: string = 'md'
  @Input() avatarImageUrl: string = '/assets/images/default-avatar.jpeg'
  loader = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.loaderEvent.subscribe((isloading) => {
      this.loader = isloading;
    })
  }

}
