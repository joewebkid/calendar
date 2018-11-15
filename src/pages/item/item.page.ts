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
  event = [];
  public halls = {
    1: "Красные ворота",
    2: "Чистые пруды",
    3: "Полянка",
    4: "НЕГЛИНКА",
  };

  public halls_theme = {
    1: "Игры",
    2: "Open Source",
    3: "Разное",
    4: "BIM-секция",
  };
  constructor(
    private route: ActivatedRoute,
    private databaseprovider: DatabaseProvider
  ) { 
   
    this.id = this.route.snapshot.paramMap.get('id');
    databaseprovider.getOneEvent(this.id)
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.event = databaseprovider.eventData[0]

        // alert(    "datas:"+JSON.stringify(  this.event  )     )
      }
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
