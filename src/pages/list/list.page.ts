import { Component, OnInit, Injectable } from '@angular/core';
import { Platform,LoadingController } from '@ionic/angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from './../../providers/database/database';
import { ActivatedRoute } from '@angular/router';

@Injectable()
@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
  providers: [  ]
})

export class ListPage implements OnInit {


  public halls = []
  public halls_theme = []
  // {
  //   1: "Красные ворота1",
  //   2: "Чистые пруды1",
  //   3: "Полянка1",
  //   4: "НЕГЛИНКА1",
  // };

  //   1: "Игры1",
  //   2: "Open Source1",
  //   3: "Разное1",
  //   4: "BIM-секция1",
  // };

  events = [];
  eventsArr = {};
  eventsArrTemp = {};
  themeDatas = [];
  dataLoad:boolean=false;
  hallsIds = {};
  hallsObject = {};
  dateUrl: string;
  category="Все";
  theme="Все";

  themeselect:any
  categoryselect:any

  constructor(
    public http: Http,
    private databaseprovider: DatabaseProvider,
    private plt: Platform,
    private route: ActivatedRoute,
    public loadingController: LoadingController
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
      this.dateUrl = this.route.snapshot.paramMap.get('id');
      this.databaseprovider.getDatabaseState().subscribe(rdy => {

        if (rdy) {
// alert("hui")
          this.dateUrl=this.dateUrl?this.dateUrl:"01.12.2018"

          setTimeout(() => {
          }, 2000);

            databaseprovider.getAllevents().then((db) => {


              this.halls = databaseprovider.halls
              this.halls_theme = databaseprovider.hallsTheme
              this.hallsIds = databaseprovider.hallsIds
              this.hallsObject = databaseprovider.hallsObject

              this.themeDatas = databaseprovider.themeDatas

              this.eventsArr = databaseprovider.eventsDatas
              this.eventsArrTemp = databaseprovider.eventsDatas
              this.events = Object.keys(databaseprovider.eventsDatas)
              this.dataLoad = true;

              this.changeDate(this.dateUrl)
              // alert("Меня вызывают!")
            // alert(JSON.stringify(this.eventsArrTemp))

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
  } 

  public changeDate(date: any) {
    this.dateUrl = date
    let eventA = this.eventsArrTemp
    let eventNewA = {}
    console.log(eventA)

    this.themeselect = "Все"
    this.categoryselect = "Все"

    for (var objectKey in eventA) {

      for (var i = 0; i < eventA[objectKey].length; i++) {
        var value = eventA[objectKey][i].date;

        if(value==date) {
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
    // alert(date)
    // this.databaseprovider.getAllevents(date).then((db) => {
    //   this.halls = this.databaseprovider.halls
    //   this.halls_theme = this.databaseprovider.hallsTheme
    //   this.hallsIds = this.databaseprovider.hallsIds
    //   this.hallsObject = this.databaseprovider.hallsObject

    //   this.eventsArr = this.databaseprovider.eventsDatas
    //   this.eventsArrTemp = this.databaseprovider.eventsDatas
    //   this.events = Object.keys(this.databaseprovider.eventsDatas)


    // alert(this.eventsArr)
    //   this.dataLoad = true;
    // })

  public changeCategory(ev: any) {

    let eventA = this.eventsArrTemp
    let eventNewA = {}
    let targetValue = ev.target.value
    this.category = ev.target.value
    console.log(eventA)


    for (var objectKey in eventA) {

      for (var i = 0; i < eventA[objectKey].length; i++) {
        var value = this.hallsObject[eventA[objectKey][i].hall_id].theme;
        var date = eventA[objectKey][i].date;

        var themesArr = eventA[objectKey][i].themes.split(",")
        var bool = (themesArr.indexOf( this.theme ) != -1)

        if( (value==targetValue||targetValue=="Все") && this.dateUrl==date && !bool ) {
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


  public changeTheme(ev: any) {

    let eventA = this.eventsArrTemp
    let eventNewA = {}
    let targetValue = ev.target.value
    this.theme = ev.target.value
    console.log(eventA)


    for (var objectKey in eventA) {

      for (var i = 0; i < eventA[objectKey].length; i++) {
        var value = this.hallsObject[eventA[objectKey][i].hall_id].theme;
        var date = eventA[objectKey][i].date;

        var themesArr = eventA[objectKey][i].themes.split(",")

          // alert("this.themeSelect " + JSON.stringify(this.themeselect))
          // alert("eventA[objectKey][i].themes " + JSON.stringify(eventA[objectKey][i].themes))
          // alert("[ themesArr ] " + JSON.stringify(themesArr))
        var bool = (themesArr.indexOf( targetValue ) != -1)

        if( (value==this.category||this.category=="Все") && this.dateUrl==date  && !bool ) {
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

  likeIt(ev: any,id) {
    if(ev.favoriteBy)
      this.databaseprovider.addFavorite([id])
    else
      this.databaseprovider.removeFavorite([id])

    ev.favoriteBy = !ev.favoriteBy
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

  };
  
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}


