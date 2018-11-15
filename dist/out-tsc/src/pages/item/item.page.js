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
var database_1 = require("./../../providers/database/database");
var router_1 = require("@angular/router");
var ItemPage = /** @class */ (function () {
    function ItemPage(route, databaseprovider) {
        var _this = this;
        this.route = route;
        this.databaseprovider = databaseprovider;
        this.event = [];
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
        this.id = this.route.snapshot.paramMap.get('id');
        databaseprovider.getOneEvent(this.id);
        this.databaseprovider.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                _this.event = databaseprovider.eventData[0];
                // alert(    "datas:"+JSON.stringify(  this.event  )     )
            }
        });
    }
    ItemPage.prototype.ngOnInit = function () {
    };
    ItemPage = __decorate([
        core_1.Component({
            selector: 'app-item',
            templateUrl: 'item.page.html',
            styleUrls: ['item.page.scss']
        }),
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.ActivatedRoute,
            database_1.DatabaseProvider])
    ], ItemPage);
    return ItemPage;
}());
exports.ItemPage = ItemPage;
//# sourceMappingURL=item.page.js.map