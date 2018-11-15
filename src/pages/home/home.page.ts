import { Component, OnInit, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from './../../providers/database/database';

@Injectable()
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [  ]
})

export class HomePage implements OnInit {

  private icons = {
    'игры':1,
    'open-source':2,
    'разное':3,
    'bim-секция':4,
  };

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

  events = [];
  eventsArr = {};
  eventsArrTemp = {};

  constructor(
    public http: Http,
    private databaseprovider: DatabaseProvider,
    private plt: Platform
   ) { 
    // this.eventsArr = {
    //   18:[{name:"Техническая сторона левел-дизайна, или Как сэкономить деньги и время при разработке локаций",hall_id:1,id:1}],
    //   19:[{name:"m2",hall_id:2,id:2}],
    //   20:[{name:"m",hall_id:1,id:3}],
    // }
    // this.eventsArrTemp = {
    //   18:[{name:"Техническая сторона левел-дизайна, или Как сэкономить деньги и время при разработке локаций",hall_id:1,id:1}],
    //   19:[{name:"m2",hall_id:2,id:2}],
    //   20:[{name:"m",hall_id:1,id:3}],
    // }
    // this.events = Object.keys({
    //   18:[{name:"m",hall_id:1,id:1}],
    //   19:[{name:"m2",hall_id:2,id:2}],
    //   20:[{name:"m",hall_id:1,id:3}],
    // })

      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.eventsArr = databaseprovider.eventsDatas
          this.eventsArrTemp = databaseprovider.eventsDatas
          this.events = Object.keys(databaseprovider.eventsDatas)

          // for (var i = 0; i < this.events.length; i++) {
          //   alert("keys {"+i+"} "+this.events[i])
          //   alert("values {"+i+"} "+JSON.stringify(this.eventsArr[this.events[i]]) )
          // }

          // alert(JSON.stringify(this.eventsArr))
        }
    })


    // this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(data => {
    //   console.log(data.data.children);
    // });
    // this.http.get('http://event.lembos.ru/article/output-json').map(res => res.json()).subscribe(data => {
    //   console.log(data);
    //   for (var i = 0; i < data.length; i++) {

    //     databaseprovider.addArticle((data[i].name ,data[i].description ,data[i].raiting ,1111 ,data[i].speaker_id ,data[i].time_end  ,data[i].time_start ))
    //       // articles.push({ name: data[i].name, skill: data.item(i).text });
    //     }

    // });
  } 

  public changeCategory(ev: any) {
    let eventA = this.eventsArrTemp
    let eventNewA = {}
    console.log(eventA)

    Object.keys(eventA).map(function(objectKey, index) {

      for (var i = 0; i < eventA[objectKey].length; i++) {
        var value = eventA[objectKey][i].hall_id;

        if(value==ev.target.value) {

          if(eventNewA[objectKey]==undefined) {
            eventNewA[objectKey]=[]
          }

          eventNewA[objectKey][i] = eventA[objectKey][i]
        }
      }
    });
    
    this.eventsArr = eventNewA
  }

  likeIt(th,id) {
    console.log(id)
    return false
  }

  doRefresh(refresher) {
    // console.log('Begin async operation', refresher);

    //   this.databaseprovider.fullEvents()
    //   this.databaseprovider.getDatabaseState().subscribe(rdy => {
    //     if (rdy) {
    //       this.events = this.databaseprovider.eventsDatas
    //       alert(JSON.stringify(this.events))

    //       refresher.target.complete();
    //     }
    //   })

    //  setTimeout(() => {
    //   console.log('Async operation has ended');
    // }, 2000);
  }
  ngOnInit() {

  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}


