import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs/Rx';

import { Http } from '@angular/http';

@Injectable()
export class DatabaseProvider {

  private databaseReady: BehaviorSubject<boolean>;
  database: SQLiteObject;
  eventsDatas:any = {};
  eventData:any ={};
  speakerData:any ={};
  themeDatas:any ={};
  halls:any =[];
  hallsTheme:any =[];

  dataFavorites = []


  hallsObject:any ={};
  hallsIds:any ={};
  readyBase:any = false;
  currentDate = "";

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

 
  /**
   * Get all favorites ids
   * @param datas
   * @return bool|array
   * @throws exception
   */  
  getAllFavoritesIds():any {
    return this.database.executeSql("SELECT * FROM favorites", []).then((data) => {
      var favorites = []
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          favorites.push(data.rows.item(i).event_id)
        } 
        this.dataFavorites = favorites
        return favorites;
      }
    })
  }

  /**
   * Get all favorites rows from event
   * @param datas
   * @return bool|array
   * @throws exception
   */  
  getAllFavoritesEvents():any {
    return this.database.executeSql("SELECT * FROM favorites", []).then((data) => {
      var favorites = [];
      var events = {};
      // alert(JSON.stringify(data))
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          favorites.push(data.rows.item(i).event_id);
        }
        // alert("favorites: "+JSON.stringify(  (favorites)  ));
        return this.database.executeSql("SELECT * FROM eventsTable" + ' WHERE `id` IN ('+favorites.join(',')+')', []).then((data) => {
          this.eventsDatas = this.setEvents(data.rows)

        })
      }else{
        this.eventsDatas = [];
      }
    })
  }

  /**
   * Set all rows from event
   * @param datas
   * @return bool|array
   * @throws exception
   */ 
  public setEvents(data, dataFavorites=[]):any{ 
    let events = {};
    // alert("favorites: "+JSON.stringify(  (dataFavorites)  ))
    for (var i = 0; i < data.length; i++) {
        let evItem = data.item(i);
        if(events[evItem.time_start]==undefined||events==[]) { events[evItem.time_start]=[] }

        let favoriteBy = !(dataFavorites.indexOf( evItem.id ) != -1);
      
    // alert("favoriteBy: "+JSON.stringify(  (favoriteBy)  ))
        events[evItem.time_start].push({
          id          : evItem.id, 
          name        : evItem.name, 
          description : evItem.description,
          raiting     : evItem.raiting,
          date        : evItem.date,
          speaker_id  : evItem.speaker_id,
          time_end    : evItem.time_end,
          time_start  : evItem.time_start,
          hall_id     : evItem.hall_id,
          themes      : evItem.themes,
          favoriteBy  : favoriteBy,
        });
    }
    return events;
  }

  /**
   * Get all rows from event
   * @param datas
   * @return bool|array
   * @throws exception
   */ 
  public getAllevents():any{ 

    return this.database.executeSql("SELECT * FROM eventsTable", []).then((data) => {
      this.getAllFavoritesIds().then(() => {
        let bool = false;
        let events = [];
        let hall = [];
        let hallTheme = [];

        let hallsIds = {};
        let hallsObject = {};

        let themeDatas = [];

        if (data.rows.length > 0) {

          events = this.setEvents(data.rows, this.dataFavorites)

          // if(sql) {
          //   if(Object.keys(this.eventsDatas).length !== Object.keys(events).length){
          //     bool=true;
          //   }

          //   this.eventsDatas = events;

          //   // if(bool){
          //   //   this.databaseReady.next(true);
          //   // }
          //   return false;
          // }

          this.database.executeSql("SELECT * FROM halls", []).then((hallData) => {
            if (hallData.rows.length > 0) {
              for (var i = 0; i < hallData.rows.length; i++) {

                let hallRowItem = hallData.rows.item(i)

                if(hallsObject[hallRowItem.id]==undefined||hallsObject=={}) { hallsObject[hallRowItem.id]={} }

                hallsObject[hallRowItem.id] = {
                  name  : hallRowItem.name,
                  theme : hallRowItem.theme,
                };

                hall.push(hallRowItem.name);
                hallTheme.push(hallRowItem.theme);

                hallsIds[hallRowItem.name] = hallRowItem.id

              }
            }

            let themeDataTemp = {};
            this.database.executeSql("SELECT * FROM themes", []).then((themeData) => {
              if (themeData.rows.length > 0) {
                for (var i = 0; i < themeData.rows.length; i++) {
                  themeDatas.push({
                    id   : themeData.rows.item(i).id,
                    name : themeData.rows.item(i).name
                  });
                  themeDataTemp[themeData.rows.item(i).id]=themeData.rows.item(i).name
                }
              }


              for(var index in events) { 
                var ev = events[index]; 
                for (var i = ev.length - 1; i >= 0; i--) {
                  let themesTemp = ev[i].themes.split(",")
                  let themesTempNew = []
                  for (var y = themesTemp.length - 1; y >= 0; y--) {
                    if(themeDataTemp[themesTemp[y]]!=null)
                    themesTempNew.push(themeDataTemp[themesTemp[y]]);
                  }                
                  // alert("themesTempNew: "+JSON.stringify(  themesTempNew  ))
                  ev[i].themes = themesTempNew
                }
                events[index] = ev; 
              }
             

              this.themeDatas = themeDatas


              if(Object.keys(this.eventsDatas).length !== Object.keys(events).length){
                bool=true;
              }
              // alert(Object.keys(this.eventsDatas).length + " || " + Object.keys(events).length + " || " + bool)

              this.hallsObject = hallsObject;
              this.hallsIds = hallsIds;

              this.hallsTheme = hallTheme;
              this.halls = hall;

              this.eventsDatas = events;

              if(bool){
                this.databaseReady.next(true);
                this.databaseReady.next(true);
              }

              return events;

            }) 
          }).catch(e => {
            // alert("e:"+JSON.stringify(  e  ))
          })

        } else {
          this.getAllevents().then((data) => {
          })
          return false;
        }
      })
    })
    .catch(e => {
      // alert("e:"+JSON.stringify(  (e)  ))
      this.getAllevents() 
    })

  }

  /**
   * Get one row from event
   * @param datas
   * @return bool|array
   * @throws exception
   */ 
  public getOneEvent(id):any{ 

    return this.database.executeSql("SELECT * FROM eventsTable WHERE id="+id, []).then((data) => {
      return this.database.executeSql("SELECT * FROM speakers WHERE id="+data.rows.item(0).speaker_id, []).then((dataSpeaker) => {

        let events = {};
        let speakers = {};

        events = { 
          id: data.rows.item(0).id, 
          name: data.rows.item(0).name, 
          description: data.rows.item(0).description,
          raiting: data.rows.item(0).raiting,
          date: data.rows.item(0).date,
          speaker_id: data.rows.item(0).speaker_id,
          time_end: data.rows.item(0).time_end,
          time_start: data.rows.item(0).time_start,
          hall_id: data.rows.item(0).hall_id,
          themes: data.rows.item(0).themes,
        };

        speakers = { 
          id: dataSpeaker.rows.item(0).id, 
          name: dataSpeaker.rows.item(0).name, 
          description: dataSpeaker.rows.item(0).description,
          prof: dataSpeaker.rows.item(0).prof,
          company: dataSpeaker.rows.item(0).company,
          photo: dataSpeaker.rows.item(0).photo,
        };

        this.eventData = events;
        this.speakerData = speakers;
        this.databaseReady.next(true);
        return events;
      })
    })

  }

  /**
   * Init databases
   * @param datas
   * @return bool|array
   * @throws exception
   */ 
  public createDatabases():any{

    return this.getDB().then((db: SQLiteObject) => {

      db.executeSql('CREATE TABLE IF NOT EXISTS eventsTable(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,'+
        'description TEXT,raiting INTEGER,date TEXT,speaker_id INTEGER,time_end TEXT,time_start TEXT,hall_id INTEGER,themes TEXT)', [])
          .then(() => {

            db.executeSql('CREATE TABLE IF NOT EXISTS halls(id INTEGER,name TEXT,'+
            'theme TEXT, date TEXT)', [])
              .then(() => {
              db.executeSql('CREATE TABLE IF NOT EXISTS speakers(id INTEGER,name TEXT,'+
              'description TEXT, prof TEXT, company TEXT, photo TEXT)', [])
                .then(() => {
                db.executeSql('CREATE TABLE IF NOT EXISTS themes(id INTEGER,name TEXT)', [])
                  .then(() => {
                  db.executeSql('CREATE TABLE IF NOT EXISTS favorites(event_id INTEGER)', [])
                    .then(() => {


                  // this.database.executeSql('DELETE FROM favorites;',[]).then(() => {
                  //   this.database.executeSql('DELETE FROM eventsTable;',[]).then(() => {
                  //     this.database.executeSql('DELETE FROM halls;',[]).then(() => {
                  //       this.database.executeSql('DELETE FROM speakers;',[]).then(() => {
                  //         this.database.executeSql('DELETE FROM themes;',[]).then(() => {


                            this.fullEvents()
                            this.getAllevents().then((data) => {
                              this.databaseReady.next(true);
                            })

                  //         })
                  //       })
                  //     })
                  //   })
                  // })
                  // .catch(e => {alert("error2:"+JSON.stringify(  (e)  ))}  )


                  })
                })
              })
            })

        }

      )
      .catch(e => {alert("error:"+JSON.stringify(  (e)  ))}  );

    })
    .catch(e => alert("error2:"+JSON.stringify(e)));
  }

  /**
   * Get data from site, and add to database
   * @param datas
   * @return bool|array
   * @throws exception
   */ 
  public fullEvents() {

    this.http.get( 'http://event.lembos.ru/article/output-json' ).map(res => res.json()).subscribe(data => {

      for (var i = 0; i < data.length; i++) {

        this.addArticle([data[i].name ,data[i].description ,data[i].raiting ,data[i].date ,data[i].speaker_id ,data[i].time_end  ,data[i].time_start ,data[i].hall_id ,data[i].themes ])

      }
      this.http.get( 'http://event.lembos.ru/hall/output-json' ).map(res => res.json()).subscribe(data => {
        
        for (var i = 0; i < data.length; i++) {

          this.addHall([data[i].id ,data[i].mainHall ,data[i].theme ,data[i].date ])

        }


        this.http.get( 'http://event.lembos.ru/speaker/output-json' ).map(res => res.json()).subscribe(data => {
          
          for (var i = 0; i < data.length; i++) {

            this.addSpeaker([data[i].id ,data[i].name ,data[i].description ,data[i].prof  ,data[i].company  ,data[i].photo ])

          }

          this.http.get( 'http://event.lembos.ru/theme/output-json' ).map(res => res.json()).subscribe(data => {
            
            for (var i = 0; i < data.length; i++) {

              this.addTheme([data[i].id ,data[i].name])

            }
            // this.databaseReady.next(true);

          })
        })


      })

    });
  }

  /**
   * Create new event
   * @param datas
   * @return bool|array
   * @throws exception
   */
  public addArticle(datas) {
    this.database.executeSql("SELECT * FROM eventsTable WHERE `name`='"+datas[0]+"'", []).then((eventData) => {

      if (eventData.rows.length == 0) {

        return this.database.executeSql('INSERT INTO eventsTable(name ,description ,raiting ,date ,speaker_id ,time_end  ,time_start ,hall_id, themes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',datas).then(data => {
          return data;
        }, err => {
          return err;
        });

      }
    })
    .catch(e => {
      if(e.code==5) {
      }

    });
  }

  /**
   * Adds in favorites
   * @param datas
   * @return bool|array
   * @throws exception
   */
  public addFavorite(datas) {
    this.database.executeSql("SELECT * FROM favorites WHERE `event_id`='"+datas[0]+"'", []).then((favoritesData) => {

      if (favoritesData.rows.length == 0) {

        return this.database.executeSql('INSERT INTO favorites(event_id) VALUES (?)',datas).then(data => {
          return data;
        }, err => {
          return err;
        });

      }
    })
    .catch(e => {
      if(e.code==5) {
      }

    });
  } 

  /**
   * Adds in favorites
   * @param datas
   * @return bool|array
   * @throws exception
   */
  public removeFavorite(datas) {
    this.database.executeSql("SELECT * FROM favorites WHERE `event_id`='"+datas[0]+"'", []).then((favoritesData) => {

      if (favoritesData.rows.length != 0) {

        return this.database.executeSql("DELETE FROM favorites WHERE `event_id`='"+datas[0]+"'",[]).then(data => {
          return data;
        }, err => {
          return err;
        });

      }
    })
    .catch(e => {
      if(e.code==5) {
      }

    });
  } 

  /**
   * Create new theme
   * @param datas
   * @return bool|array
   * @throws exception
   */  
  public addTheme(datas) {
    this.database.executeSql("SELECT * FROM themes WHERE `name`='"+datas[1]+"'", []).then((themesData) => {

      if (themesData.rows.length == 0) {

        return this.database.executeSql('INSERT INTO themes(id ,name ) VALUES (?, ?)',datas).then(data => {
          return data;
        }, err => {
          return err;
        });

      }

    })
    .catch(e => {
      if(e.code==5) {
      }
    })
  }

  /**
   * Create new hall
   * @param datas
   * @return bool|array
   * @throws exception
   */  
  public addHall(datas) {
    this.database.executeSql("SELECT * FROM halls WHERE `name`='"+datas[1]+"'", []).then((hallsData) => {

      if (hallsData.rows.length == 0) {

        return this.database.executeSql('INSERT INTO halls(id ,name ,theme ,date ) VALUES (?, ?, ?, ?)',datas).then(data => {
          return data;
        }, err => {
          return err;
        });

      }

    })
    .catch(e => {
      if(e.code==5) {
      }
    })
  }

  /**
   * Create new speaker
   * @param datas
   * @return bool|array
   * @throws exception
   */
  public addSpeaker(datas) {
    this.database.executeSql("SELECT * FROM speakers WHERE `name`='"+datas[1]+"'", []).then((speakersData) => {

      if (speakersData.rows.length == 0) {
        return this.database.executeSql('INSERT INTO speakers(id ,name ,description ,prof  ,company  ,photo ) VALUES (?, ?, ?, ?, ?, ?)',datas).then(data => {
          return data;
        }, err => {
          return err;
        });
      }
        // alert(  "already exist: "+JSON.stringify(  (datas[1])  )   )
    })
    .catch(e => {
      if(e.code==5) {
      }
    })
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }


}
