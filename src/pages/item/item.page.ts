import { Component, OnInit, Injectable } from '@angular/core';

import { DatabaseProvider } from './../../providers/database/database';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: 'item.page.html',
  styleUrls: ['item.page.scss']
})
@Injectable()
export class ItemPage implements OnInit {

  id: string;
  event = {
    id: "", 
    name: "", 
    description: "",
    raiting: 1,
    date: "",
    speaker_id: "",
    time_end: "",
    time_start: "",
    hall_id: "",
    themes: "",
  };
  speaker = {
    id: "", 
    name: "", 
    description: "",
    prof: "",
    company: "",
    photo: "",
  };

  public halls = []
  public halls_theme = []
  hallsIds = {};
  hallsObject = {};
  themeDatas = [];

  constructor(
    private route: ActivatedRoute,
    private databaseprovider: DatabaseProvider
  ) { 
   
    this.id = this.route.snapshot.paramMap.get('id');

    databaseprovider.getOneEvent(this.id).then((db) => {
      this.halls = databaseprovider.halls
      this.halls_theme = databaseprovider.hallsTheme
      this.hallsIds = databaseprovider.hallsIds
      this.hallsObject = databaseprovider.hallsObject

      this.themeDatas = databaseprovider.themeDatas

      this.event = databaseprovider.eventData
      this.event.date = this.event.date.split(".")[0]
      this.speaker = databaseprovider.speakerData
    })

  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/item', JSON.stringify(item)]);
  // }
    // for (let i = 1; i < 11; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }
  
}
