import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs/Rx';

import { Http } from '@angular/http';

@Injectable()
export class DatabaseProvider {

  private databaseReady: BehaviorSubject<boolean>;
  database: SQLiteObject;
  eventsDatas:any = [];
  eventData:any =[];
  halls:any =[];
  hallsTheme:any =[];


  hallsObject:any ={};
  hallsIds:any ={};
  readyBase:any = false;

  url: string = 'http://event.lembos.ru/article/output-json';
  constructor(
    private sqlite: SQLite,
    public http: Http,
    private plt: Platform) {

    this.databaseReady = new BehaviorSubject(false);
    this.plt.ready().then(() => {

      this.createDatabases()

    })

  }

  public getDB():any{
    return this.sqlite.create({
      name: "Events.db",
      location: "default"
    }).then((db: SQLiteObject) => {
      this.database = db;

      return db
    })
  }

  public getAllevents(date):any{ 
alert(3)
    return this.database.executeSql("SELECT * FROM events", []).then((data) => {

      let events = {};
      let hall = [];
      let hallTheme = [];

      let hallsIds ={};
      let hallsObject ={};

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          if(data.rows.item(i).date==date) {

            // alert( "date: " + data.rows.item(i).date + " ]" + data.rows.item(i).name + "[ " )
            if(events[data.rows.item(i).time_start]==undefined||events==[]) {
              events[data.rows.item(i).time_start]=[]
            }

            events[data.rows.item(i).time_start].push({
              id: data.rows.item(i).id, 
              name: data.rows.item(i).name, 
              description: data.rows.item(i).description,
              raiting: data.rows.item(i).raiting,
              date: data.rows.item(i).date,
              speaker_id: data.rows.item(i).speaker_id,
              time_end: data.rows.item(i).time_end,
              time_start: data.rows.item(i).time_start,
              hall_id: data.rows.item(i).hall_id,
            });
          }

          // alert("get: "+data.rows.item(i).time_start+" "+JSON.stringify(events[data.rows.item(i).time_start]))

        }
      }

      this.database.executeSql("SELECT * FROM halls", []).then((hallData) => {
        if (hallData.rows.length > 0) {
          for (var i = 0; i < hallData.rows.length; i++) {

            if(hallsObject[data.rows.item(i).id]==undefined||hallsObject=={}) {
              hallsObject[data.rows.item(i).id]={}
            }
            hallsObject[hallData.rows.item(i).id] = {
              name:hallData.rows.item(i).name,
              theme:hallData.rows.item(i).theme,
            };

            hall.push(hallData.rows.item(i).name);
            hallTheme.push(hallData.rows.item(i).theme);

            hallsIds[hallData.rows.item(i).name] = hallData.rows.item(i).id

          }
        }

        // alert("hall: "+JSON.stringify(hall))
        // alert("hallsObject: "+JSON.stringify(hallsObject))
        // alert("hallsTheme: "+JSON.stringify(hallTheme))
        // alert("hallsIds: "+JSON.stringify(hallsIds))
        // alert("eventsDatas: "+JSON.stringify(events))

        this.hallsObject = hallsObject;
        this.hallsIds = hallsIds;

        this.hallsTheme = hallTheme;
        this.halls = hall;

        this.eventsDatas = events;

        // this.databaseReady.next(true);
        return events;
      })

    })

  }

  public getOneEvent(id):any{ 

// alert("getAllevents")

    return this.database.executeSql("SELECT * FROM events WHERE id="+id, []).then((data) => {

      let events = [];

      events = [{ 
        id: data.rows.item(0).id, 
        name: data.rows.item(0).name, 
        description: data.rows.item(0).description,
        raiting: data.rows.item(0).raiting,
        date: data.rows.item(0).date,
        speaker_id: data.rows.item(0).speaker_id,
        time_end: data.rows.item(0).time_end,
        time_start: data.rows.item(0).time_start,
        hall_id: data.rows.item(0).hall_id,
      }];

      this.eventData = events;
      this.databaseReady.next(true);
      return events;
    })

  }
  public createDatabases():any{

    return this.getDB().then((db: SQLiteObject) => {

      db.executeSql('CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,'+
        'description TEXT,raiting INTEGER,date TEXT,speaker_id INTEGER,time_end TEXT,time_start TEXT,hall_id INTEGER)', [])
          .then(() => {

            db.executeSql('CREATE TABLE IF NOT EXISTS halls(id INTEGER,name TEXT,'+
            'theme TEXT, date TEXT)', [])
              .then(() => {


              this.database.executeSql('DELETE FROM events;',[]).then(() => {
                this.database.executeSql('DELETE FROM halls;',[]).then(() => {

                  this.fullEvents()
                  alert(2)
                  this.databaseReady.next(true);

                })
              })
              .catch(e => {alert("error2:"+JSON.stringify(  (e)  ))}  )


            })

        }

      )
      .catch(e => {alert("error:"+JSON.stringify(  (e)  ))}  );

    })
    .catch(e => alert("error2:"+JSON.stringify(e)));
  }

  public fullEvents() {

    this.http.get( 'http://event.lembos.ru/article/output-json' ).map(res => res.json()).subscribe(data => {

      for (var i = 0; i < data.length; i++) {

        this.addArticle([data[i].name ,data[i].description ,data[i].raiting ,data[i].date ,data[i].speaker_id ,data[i].time_end  ,data[i].time_start ,data[i].hall_id ])

      }
      this.http.get( 'http://event.lembos.ru/hall/output-json' ).map(res => res.json()).subscribe(data => {
        
        for (var i = 0; i < data.length; i++) {

          this.addHall([data[i].id ,data[i].mainHall ,data[i].theme ,data[i].date ])

        }
        alert(1)
        this.databaseReady.next(true);

      })

    });
  }
  public addArticle(datas) {
    return this.database.executeSql('INSERT INTO events(name ,description ,raiting ,date ,speaker_id ,time_end  ,time_start ,hall_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',datas).then(data => {
//       if(this.eventData[datas.time_start.split(':')[0]]==undefined||this.eventData==[]) {
//         //datas.time_start.split(':')[0]
//         this.eventData[datas.time_start.split(':')[0]]=[]
//       }

//       this.eventData[datas.time_start.split(':')[0]].push({ 
//         id: datas.id, 
//         name: datas.name, 
//         description: datas.description,
//         raiting: datas.raiting,
//         date: datas.date,
//         speaker_id: datas.speaker_id,
//         time_end: datas.speaker_id,
//         time_start: datas.speaker_id,
//       });

// alert("addArticle: "+JSON.stringify(this.eventData))
      return data;
    }, err => {
      return err;
    });
  } 
  public addHall(datas) {
    return this.database.executeSql('INSERT INTO halls(id ,name ,theme ,date ) VALUES (?, ?, ?, ?)',datas).then(data => {

      return data;
    }, err => {
      return err;
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }


}
