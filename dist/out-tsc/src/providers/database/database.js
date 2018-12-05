"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var ngx_1 = require("@ionic-native/sqlite/ngx");
var Rx_1 = require("rxjs/Rx");
var http_1 = require("@angular/http");
var DatabaseProvider = /** @class */ (function () {
    function DatabaseProvider(sqlite, http, plt) {
        var _this = this;
        this.sqlite = sqlite;
        this.http = http;
        this.plt = plt;
        this.eventsDatas = [];
        this.eventData = {};
        this.speakerData = {};
        this.themeDatas = {};
        this.halls = [];
        this.hallsTheme = [];
        this.hallsObject = {};
        this.hallsIds = {};
        this.readyBase = false;
        this.currentDate = "";
        this.url = 'http://event.lembos.ru/article/output-json';
        this.databaseReady = new Rx_1.BehaviorSubject(false);
        this.plt.ready().then(function () {
            _this.createDatabases();
        });
    }
    DatabaseProvider.prototype.getDB = function () {
        var _this = this;
        return this.sqlite.create({
            name: "Events.db",
            location: "default"
        }).then(function (db) {
            _this.database = db;
            return db;
        });
    };
    /**
     * Get all favorites rows from event
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.getAllFavorite = function () {
        var _this = this;
        return this.database.executeSql("SELECT * FROM favorite", []).then(function (data) {
            var favorites = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    favorites.push(data.rows.item(i).event_id);
                }
                _this.getAllevents(' WHERE `id` IN (' + favorites.join(',') + ')');
            }
        });
    };
    /**
     * Get all rows from event
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.getAllevents = function (sql) {
        var _this = this;
        if (sql === void 0) { sql = ''; }
        return this.database.executeSql("SELECT * FROM eventsTable" + sql, []).then(function (data) {
            if (Object.keys(_this.eventsDatas).length > 0) {
                return false;
            }
            var bool = false;
            var events = {};
            var hall = [];
            var hallTheme = [];
            var hallsIds = {};
            var hallsObject = {};
            var themeDatas = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    if (events[data.rows.item(i).time_start] == undefined || events == []) {
                        events[data.rows.item(i).time_start] = [];
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
                        themes: data.rows.item(i).themes,
                    });
                }
                _this.database.executeSql("SELECT * FROM halls", []).then(function (hallData) {
                    if (hallData.rows.length > 0) {
                        for (var i = 0; i < hallData.rows.length; i++) {
                            if (hallsObject[data.rows.item(i).id] == undefined || hallsObject == {}) {
                                hallsObject[data.rows.item(i).id] = {};
                            }
                            hallsObject[hallData.rows.item(i).id] = {
                                name: hallData.rows.item(i).name,
                                theme: hallData.rows.item(i).theme,
                            };
                            hall.push(hallData.rows.item(i).name);
                            hallTheme.push(hallData.rows.item(i).theme);
                            hallsIds[hallData.rows.item(i).name] = hallData.rows.item(i).id;
                        }
                    }
                    _this.database.executeSql("SELECT * FROM themes", []).then(function (themeData) {
                        if (themeData.rows.length > 0) {
                            for (var i = 0; i < themeData.rows.length; i++) {
                                themeDatas.push({
                                    id: themeData.rows.item(i).id,
                                    name: themeData.rows.item(i).name,
                                });
                            }
                        }
                        _this.themeDatas = themeDatas;
                        if (_this.eventsDatas != events)
                            bool = true;
                        _this.hallsObject = hallsObject;
                        _this.hallsIds = hallsIds;
                        _this.hallsTheme = hallTheme;
                        _this.halls = hall;
                        _this.eventsDatas = events;
                        if (bool)
                            _this.databaseReady.next(true);
                        return events;
                    });
                });
            }
            else {
                _this.getAllevents().then(function (data) {
                });
                return false;
            }
        })
            .catch(function (e) {
            // alert("e:"+JSON.stringify(  (e)  ))
            _this.getAllevents();
        });
    };
    /**
     * Get one row from event
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.getOneEvent = function (id) {
        var _this = this;
        return this.database.executeSql("SELECT * FROM eventsTable WHERE id=" + id, []).then(function (data) {
            return _this.database.executeSql("SELECT * FROM speakers WHERE id=" + data.rows.item(0).speaker_id, []).then(function (dataSpeaker) {
                var events = {};
                var speakers = {};
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
                _this.eventData = events;
                _this.speakerData = speakers;
                _this.databaseReady.next(true);
                return events;
            });
        });
    };
    /**
     * Init databases
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.createDatabases = function () {
        var _this = this;
        return this.getDB().then(function (db) {
            db.executeSql('CREATE TABLE IF NOT EXISTS eventsTable(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,' +
                'description TEXT,raiting INTEGER,date TEXT,speaker_id INTEGER,time_end TEXT,time_start TEXT,hall_id INTEGER,themes TEXT)', [])
                .then(function () {
                db.executeSql('CREATE TABLE IF NOT EXISTS halls(id INTEGER,name TEXT,' +
                    'theme TEXT, date TEXT)', [])
                    .then(function () {
                    db.executeSql('CREATE TABLE IF NOT EXISTS speakers(id INTEGER,name TEXT,' +
                        'description TEXT, prof TEXT, company TEXT, photo TEXT)', [])
                        .then(function () {
                        db.executeSql('CREATE TABLE IF NOT EXISTS themes(id INTEGER,name TEXT)', [])
                            .then(function () {
                            db.executeSql('CREATE TABLE IF NOT EXISTS favorites(event_id INTEGER)', [])
                                .then(function () {
                                // this.database.executeSql('DELETE FROM eventsTable;',[]).then(() => {
                                //   this.database.executeSql('DELETE FROM halls;',[]).then(() => {
                                //     this.database.executeSql('DELETE FROM speakers;',[]).then(() => {
                                //       this.database.executeSql('DELETE FROM themes;',[]).then(() => {
                                _this.fullEvents();
                                _this.getAllevents().then(function (data) {
                                    _this.databaseReady.next(true);
                                });
                                //       })
                                //     })
                                //   })
                                // })
                                // .catch(e => {alert("error2:"+JSON.stringify(  (e)  ))}  )
                            });
                        });
                    });
                });
            })
                .catch(function (e) { alert("error:" + JSON.stringify((e))); });
        })
            .catch(function (e) { return alert("error2:" + JSON.stringify(e)); });
    };
    /**
     * Get data from site, and add to database
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.fullEvents = function () {
        var _this = this;
        this.http.get('http://event.lembos.ru/article/output-json').map(function (res) { return res.json(); }).subscribe(function (data) {
            for (var i = 0; i < data.length; i++) {
                _this.addArticle([data[i].name, data[i].description, data[i].raiting, data[i].date, data[i].speaker_id, data[i].time_end, data[i].time_start, data[i].hall_id, data[i].themes]);
            }
            _this.http.get('http://event.lembos.ru/hall/output-json').map(function (res) { return res.json(); }).subscribe(function (data) {
                for (var i = 0; i < data.length; i++) {
                    _this.addHall([data[i].id, data[i].mainHall, data[i].theme, data[i].date]);
                }
                _this.http.get('http://event.lembos.ru/speaker/output-json').map(function (res) { return res.json(); }).subscribe(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        _this.addSpeaker([data[i].id, data[i].name, data[i].description, data[i].prof, data[i].company, data[i].photo]);
                    }
                    _this.http.get('http://event.lembos.ru/theme/output-json').map(function (res) { return res.json(); }).subscribe(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            _this.addTheme([data[i].id, data[i].name]);
                        }
                        // this.databaseReady.next(true);
                    });
                });
            });
        });
    };
    /**
     * Create new event
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.addArticle = function (datas) {
        var _this = this;
        this.database.executeSql("SELECT * FROM eventsTable WHERE `name`='" + datas[0] + "'", []).then(function (eventData) {
            if (eventData.rows.length == 0) {
                return _this.database.executeSql('INSERT INTO eventsTable(name ,description ,raiting ,date ,speaker_id ,time_end  ,time_start ,hall_id, themes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', datas).then(function (data) {
                    return data;
                }, function (err) {
                    return err;
                });
            }
        })
            .catch(function (e) {
            if (e.code == 5) {
            }
        });
    };
    /**
     * Adds in favorites
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.addFavorite = function (datas) {
        var _this = this;
        this.database.executeSql("SELECT * FROM favorites WHERE `event_id`='" + datas[0] + "'", []).then(function (favoritesData) {
            if (favoritesData.rows.length == 0) {
                return _this.database.executeSql('INSERT INTO favorites(event_id) VALUES (?)', datas).then(function (data) {
                    return data;
                }, function (err) {
                    return err;
                });
            }
        })
            .catch(function (e) {
            if (e.code == 5) {
            }
        });
    };
    /**
     * Create new theme
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.addTheme = function (datas) {
        var _this = this;
        this.database.executeSql("SELECT * FROM themes WHERE `name`='" + datas[1] + "'", []).then(function (themesData) {
            if (themesData.rows.length == 0) {
                return _this.database.executeSql('INSERT INTO themes(id ,name ) VALUES (?, ?)', datas).then(function (data) {
                    return data;
                }, function (err) {
                    return err;
                });
            }
        })
            .catch(function (e) {
            if (e.code == 5) {
            }
        });
    };
    /**
     * Create new hall
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.addHall = function (datas) {
        var _this = this;
        this.database.executeSql("SELECT * FROM halls WHERE `name`='" + datas[1] + "'", []).then(function (hallsData) {
            if (hallsData.rows.length == 0) {
                return _this.database.executeSql('INSERT INTO halls(id ,name ,theme ,date ) VALUES (?, ?, ?, ?)', datas).then(function (data) {
                    return data;
                }, function (err) {
                    return err;
                });
            }
        })
            .catch(function (e) {
            if (e.code == 5) {
            }
        });
    };
    /**
     * Create new speaker
     * @param datas
     * @return bool|array
     * @throws exception
     */
    DatabaseProvider.prototype.addSpeaker = function (datas) {
        var _this = this;
        this.database.executeSql("SELECT * FROM speakers WHERE `name`='" + datas[1] + "'", []).then(function (speakersData) {
            if (speakersData.rows.length == 0) {
                return _this.database.executeSql('INSERT INTO speakers(id ,name ,description ,prof  ,company  ,photo ) VALUES (?, ?, ?, ?, ?, ?)', datas).then(function (data) {
                    return data;
                }, function (err) {
                    return err;
                });
            }
            // alert(  "already exist: "+JSON.stringify(  (datas[1])  )   )
        })
            .catch(function (e) {
            if (e.code == 5) {
            }
        });
    };
    DatabaseProvider.prototype.getDatabaseState = function () {
        return this.databaseReady.asObservable();
    };
    DatabaseProvider = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [ngx_1.SQLite,
            http_1.Http,
            angular_1.Platform])
    ], DatabaseProvider);
    return DatabaseProvider;
}());
exports.DatabaseProvider = DatabaseProvider;
//# sourceMappingURL=database.js.map