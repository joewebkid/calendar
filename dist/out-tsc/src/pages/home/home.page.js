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
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var database_1 = require("./../../providers/database/database");
var HomePage = /** @class */ (function () {
    function HomePage(http, databaseprovider, plt) {
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
        var _this = this;
        this.http = http;
        this.databaseprovider = databaseprovider;
        this.plt = plt;
        this.icons = {
            'игры': 1,
            'open-source': 2,
            'разное': 3,
            'bim-секция': 4,
        };
        this.halls = {
            1: "Красные ворота",
            2: "Чистые пруды",
            3: "Полянка",
            4: "НЕГЛИНКА",
        };
        this.halls_theme = {
            1: "Игры",
            2: "Open Source",
            3: "Разное",
            4: "BIM-секция",
        };
        this.events = [];
        this.eventsArr = {};
        this.eventsArrTemp = {};
        this.databaseprovider.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                _this.eventsArr = databaseprovider.eventsDatas;
                _this.eventsArrTemp = databaseprovider.eventsDatas;
                _this.events = Object.keys(databaseprovider.eventsDatas);
                // for (var i = 0; i < this.events.length; i++) {
                //   alert("keys {"+i+"} "+this.events[i])
                //   alert("values {"+i+"} "+JSON.stringify(this.eventsArr[this.events[i]]) )
                // }
                // alert(JSON.stringify(this.eventsArr))
            }
        });
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
    HomePage.prototype.changeCategory = function (ev) {
        var eventA = this.eventsArrTemp;
        var eventNewA = {};
        console.log(eventA);
        Object.keys(eventA).map(function (objectKey, index) {
            for (var i = 0; i < eventA[objectKey].length; i++) {
                var value = eventA[objectKey][i].hall_id;
                if (value == ev.target.value) {
                    if (eventNewA[objectKey] == undefined) {
                        eventNewA[objectKey] = [];
                    }
                    eventNewA[objectKey][i] = eventA[objectKey][i];
                }
            }
        });
        this.eventsArr = eventNewA;
    };
    HomePage.prototype.likeIt = function (th, id) {
        console.log(id);
        return false;
    };
    HomePage.prototype.doRefresh = function (refresher) {
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
    };
    HomePage.prototype.ngOnInit = function () {
    };
    HomePage = __decorate([
        core_1.Injectable(),
        core_1.Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
            providers: []
        }),
        __metadata("design:paramtypes", [http_1.Http,
            database_1.DatabaseProvider,
            angular_1.Platform])
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
//# sourceMappingURL=home.page.js.map