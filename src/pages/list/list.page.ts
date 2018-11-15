import { Component, OnInit, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from './../../providers/database/database';

@Injectable()
@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
  providers: [  ]
})

export class ListPage implements OnInit {

  // private icons = {
  //   'игры':1,
  //   'open-source':2,
  //   'разное':3,
  //   'bim-секция':4,
  // };

  public halls = []
  // {
  //   1: "Красные ворота1",
  //   2: "Чистые пруды1",
  //   3: "Полянка1",
  //   4: "НЕГЛИНКА1",
  // };

  public halls_theme = []
  //   1: "Игры1",
  //   2: "Open Source1",
  //   3: "Разное1",
  //   4: "BIM-секция1",
  // };

  events = [];
  eventsArr = {};
  eventsArrTemp = {};

  hallsIds = {};
  hallsObject = {};

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

          databaseprovider.getAllevents("01.12.2018").then((db) => {

            this.halls = databaseprovider.halls
            this.halls_theme = databaseprovider.hallsTheme
            this.hallsIds = databaseprovider.hallsIds
            this.hallsObject = databaseprovider.hallsObject


            this.eventsArr = databaseprovider.eventsDatas
            this.eventsArrTemp = databaseprovider.eventsDatas
            this.events = Object.keys(databaseprovider.eventsDatas)

            alert("halls_theme        : "+JSON.stringify( this.halls_theme))

          })


          // alert(JSON.stringify(this.hallsIds))
          // alert(JSON.stringify(this.hallsObject))

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
    let targetValue = ev.target.value
    console.log(eventA)


    for (var objectKey in eventA) {

      for (var i = 0; i < eventA[objectKey].length; i++) {
        var value = this.hallsObject[eventA[objectKey][i].hall_id].theme;

        if(value==targetValue) {
          // alert("value==targetValue "+targetValue)

          if(eventNewA[objectKey]==undefined) {
            eventNewA[objectKey]=[]
          }

          eventNewA[objectKey].push(eventA[objectKey][i]);
          // alert("[ " + objectKey + "] " + JSON.stringify(eventA[objectKey][i]))
          // alert("[ OPEN-SOURCE ] " + JSON.stringify(eventNewA))
        }
      }

    };
    
    this.eventsArr = eventNewA
    this.events = Object.keys(eventNewA)
  }

  likeIt(th,id) {
    console.log(id)
    return false
  }

  doRefresh(refresher) {
    // console.log('Begin async operation', refresher);

      this.databaseprovider.fullEvents()
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          this.events = this.databaseprovider.eventsDatas
          // alert(JSON.stringify(this.events))

          refresher.target.complete();
        }
      })

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


