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
        this.eventData = [];
        this.halls = [];
        this.hallsTheme = [];
        this.hallsIds = {};
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
    DatabaseProvider.prototype.getAllevents = function () {
        var _this = this;
        return this.database.executeSql("SELECT * FROM events", []).then(function (data) {
            var events = {};
            var hall = [];
            var hallTheme = [];
            var hallsIds = {};
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
                    });
                    // alert("get: "+data.rows.item(i).time_start+" "+JSON.stringify(events[data.rows.item(i).time_start]))
                }
            }
            _this.database.executeSql("SELECT * FROM halls", []).then(function (hallData) {
                if (hallData.rows.length > 0) {
                    for (var i = 0; i < hallData.rows.length; i++) {
                        hall.push(hallData.rows.item(i).name);
                        hallTheme.push(hallData.rows.item(i).theme);
                        hallsIds[hallData.rows.item(i).name] = hallData.rows.item(i).id;
                    }
                }
                // alert("hall: "+JSON.stringify(hall))
                _this.halls = hall;
                _this.hallsIds = hall;
                _this.hallsTheme = hallTheme;
                _this.eventsDatas = events;
                _this.databaseReady.next(true);
                return events;
            });
        });
    };
    DatabaseProvider.prototype.getOneEvent = function (id) {
        // alert("getAllevents")
        var _this = this;
        return this.database.executeSql("SELECT * FROM events WHERE id=" + id, []).then(function (data) {
            var events = [];
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
            _this.eventData = events;
            _this.databaseReady.next(true);
            return events;
        });
    };
    DatabaseProvider.prototype.createDatabases = function () {
        var _this = this;
        return this.getDB().then(function (db) {
            db.executeSql('CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,' +
                'description TEXT,raiting INTEGER,date TEXT,speaker_id INTEGER,time_end TEXT,time_start TEXT,hall_id INTEGER)', [])
                .then(function () {
                db.executeSql('CREATE TABLE IF NOT EXISTS halls(id INTEGER,name TEXT,' +
                    'theme TEXT, date TEXT)', [])
                    .then(function () {
                    _this.database.executeSql('DELETE FROM events;', []).then(function () {
                        _this.database.executeSql('DELETE FROM halls;', []).then(function () {
                            _this.fullEvents();
                        });
                    })
                        .catch(function (e) { alert("error2:" + JSON.stringify((e))); });
                });
            })
                .catch(function (e) { alert("error:" + JSON.stringify((e))); });
        })
            .catch(function (e) { return alert("error2:" + JSON.stringify(e)); });
    };
    DatabaseProvider.prototype.fullEvents = function () {
        var _this = this;
        this.databaseReady.next(false);
        this.http.get('http://event.lembos.ru/article/output-json').map(function (res) { return res.json(); }).subscribe(function (data) {
            for (var i = 0; i < data.length; i++) {
                _this.addArticle([data[i].name, data[i].description, data[i].raiting, 1111, data[i].speaker_id, data[i].time_end, data[i].time_start, data[i].hall_id]);
            }
            _this.http.get('http://event.lembos.ru/hall/output-json').map(function (res) { return res.json(); }).subscribe(function (data) {
                for (var i = 0; i < data.length; i++) {
                    _this.addHall([data[i].id, data[i].mainHall, data[i].theme, data[i].date]);
                }
                _this.getAllevents();
                _this.databaseReady.next(true);
            });
        });
    };
    DatabaseProvider.prototype.addArticle = function (datas) {
        return this.database.executeSql('INSERT INTO events(name ,description ,raiting ,date ,speaker_id ,time_end  ,time_start ,hall_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', datas).then(function (data) {
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
        }, function (err) {
            return err;
        });
    };
    DatabaseProvider.prototype.addHall = function (datas) {
        return this.database.executeSql('INSERT INTO hall(id ,name ,theme ,date ) VALUES (?, ?, ?, ?)', datas).then(function (data) {
            return data;
        }, function (err) {
            return err;
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