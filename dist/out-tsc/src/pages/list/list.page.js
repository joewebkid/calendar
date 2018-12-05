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
var router_1 = require("@angular/router");
var ListPage = /** @class */ (function () {
    function ListPage(http, databaseprovider, plt, route, loadingController) {
        var _this = this;
        this.http = http;
        this.databaseprovider = databaseprovider;
        this.plt = plt;
        this.route = route;
        this.loadingController = loadingController;
        // private icons = {
        //   'игры':1,
        //   'open-source':2,
        //   'разное':3,
        //   'bim-секция':4,
        // };
        this.halls = [];
        // {
        //   1: "Красные ворота1",
        //   2: "Чистые пруды1",
        //   3: "Полянка1",
        //   4: "НЕГЛИНКА1",
        // };
        this.halls_theme = [];
        //   1: "Игры1",
        //   2: "Open Source1",
        //   3: "Разное1",
        //   4: "BIM-секция1",
        // };
        this.events = [];
        this.eventsArr = {};
        this.eventsArrTemp = {};
        this.themeDatas = [];
        this.dataLoad = false;
        this.hallsIds = {};
        this.hallsObject = {};
        this.category = "Все";
        this.theme = "Все";
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
        this.databaseprovider.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                // alert("hui")
                _this.dateUrl = _this.dateUrl ? _this.dateUrl : "01.12.2018";
                databaseprovider.getAllevents(" WHERE `id` IN (106,107)").then(function (db) {
                    _this.halls = databaseprovider.halls;
                    _this.halls_theme = databaseprovider.hallsTheme;
                    _this.hallsIds = databaseprovider.hallsIds;
                    _this.hallsObject = databaseprovider.hallsObject;
                    _this.themeDatas = databaseprovider.themeDatas;
                    _this.eventsArr = databaseprovider.eventsDatas;
                    _this.eventsArrTemp = databaseprovider.eventsDatas;
                    _this.events = Object.keys(databaseprovider.eventsDatas);
                    _this.dataLoad = true;
                    _this.changeDate(_this.dateUrl);
                    // alert(JSON.stringify(this.eventsArrTemp))
                });
                // alert(JSON.stringify(this.hallsIds))
                // alert(JSON.stringify(this.hallsObject))
                // for (var i = 0; i < this.events.length; i++) {
                //   alert("keys {"+i+"} "+this.events[i])
                //   alert("values {"+i+"} "+JSON.stringify(this.eventsArr[this.events[i]]) )
                // }
                // alert(JSON.stringify(this.eventsArr))
            }
        });
    }
    ListPage.prototype.changeDate = function (date) {
        this.dateUrl = date;
        var eventA = this.eventsArrTemp;
        var eventNewA = {};
        console.log(eventA);
        this.themeselect = "Все";
        this.categoryselect = "Все";
        for (var objectKey in eventA) {
            for (var i = 0; i < eventA[objectKey].length; i++) {
                var value = eventA[objectKey][i].date;
                if (value == date) {
                    // alert("value==targetValue "+targetValue)
                    if (eventNewA[objectKey] == undefined) {
                        eventNewA[objectKey] = [];
                    }
                    eventNewA[objectKey].push(eventA[objectKey][i]);
                    // alert("[ " + objectKey + "] " + JSON.stringify(eventA[objectKey][i]))
                    // alert("[ OPEN-SOURCE ] " + JSON.stringify(eventNewA))
                }
            }
        }
        ;
        this.eventsArr = eventNewA;
        this.events = Object.keys(eventNewA);
    };
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
    ListPage.prototype.changeCategory = function (ev) {
        var eventA = this.eventsArrTemp;
        var eventNewA = {};
        var targetValue = ev.target.value;
        this.category = ev.target.value;
        console.log(eventA);
        for (var objectKey in eventA) {
            for (var i = 0; i < eventA[objectKey].length; i++) {
                var value = this.hallsObject[eventA[objectKey][i].hall_id].theme;
                var date = eventA[objectKey][i].date;
                var themesArr = eventA[objectKey][i].themes.split(",");
                var bool = (themesArr.indexOf(this.theme) != -1);
                if ((value == targetValue || targetValue == "Все") && this.dateUrl == date && !bool) {
                    // alert("value==targetValue "+targetValue)
                    if (eventNewA[objectKey] == undefined) {
                        eventNewA[objectKey] = [];
                    }
                    eventNewA[objectKey].push(eventA[objectKey][i]);
                    // alert("[ " + objectKey + "] " + JSON.stringify(eventA[objectKey][i]))
                    // alert("[ OPEN-SOURCE ] " + JSON.stringify(eventNewA))
                }
            }
        }
        ;
        this.eventsArr = eventNewA;
        this.events = Object.keys(eventNewA);
    };
    ListPage.prototype.changeTheme = function (ev) {
        var eventA = this.eventsArrTemp;
        var eventNewA = {};
        var targetValue = ev.target.value;
        this.theme = ev.target.value;
        console.log(eventA);
        for (var objectKey in eventA) {
            for (var i = 0; i < eventA[objectKey].length; i++) {
                var value = this.hallsObject[eventA[objectKey][i].hall_id].theme;
                var date = eventA[objectKey][i].date;
                var themesArr = eventA[objectKey][i].themes.split(",");
                // alert("this.themeSelect " + JSON.stringify(this.themeselect))
                // alert("eventA[objectKey][i].themes " + JSON.stringify(eventA[objectKey][i].themes))
                // alert("[ themesArr ] " + JSON.stringify(themesArr))
                var bool = (themesArr.indexOf(targetValue) != -1);
                if ((value == this.category || this.category == "Все") && this.dateUrl == date && !bool) {
                    // alert("value==targetValue "+targetValue)
                    if (eventNewA[objectKey] == undefined) {
                        eventNewA[objectKey] = [];
                    }
                    eventNewA[objectKey].push(eventA[objectKey][i]);
                    // alert("[ " + objectKey + "] " + JSON.stringify(eventA[objectKey][i]))
                    // alert("[ OPEN-SOURCE ] " + JSON.stringify(eventNewA))
                }
            }
        }
        ;
        this.eventsArr = eventNewA;
        this.events = Object.keys(eventNewA);
    };
    ListPage.prototype.likeIt = function (th, id) {
        alert(id);
        this.databaseprovider.addFavorite(id);
        alert(JSON.stringify(th));
        alert(JSON.stringify(th.target));
        // 
        return false;
    };
    ListPage.prototype.doRefresh = function (refresher) {
        // console.log('Begin async operation', refresher);
        var _this = this;
        this.databaseprovider.fullEvents();
        this.databaseprovider.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                _this.events = _this.databaseprovider.eventsDatas;
                // alert(JSON.stringify(this.events))
                refresher.target.complete();
            }
        });
        //  setTimeout(() => {
        //   console.log('Async operation has ended');
        // }, 2000);
    };
    ListPage.prototype.ngOnInit = function () {
    };
    ;
    ListPage = __decorate([
        core_1.Injectable(),
        core_1.Component({
            selector: 'app-list',
            templateUrl: 'list.page.html',
            styleUrls: ['list.page.scss'],
            providers: []
        }),
        __metadata("design:paramtypes", [http_1.Http,
            database_1.DatabaseProvider,
            angular_1.Platform,
            router_1.ActivatedRoute,
            angular_1.LoadingController])
    ], ListPage);
    return ListPage;
}());
exports.ListPage = ListPage;
//# sourceMappingURL=list.page.js.map