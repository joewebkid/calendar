"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: '../pages/home/home.module#HomePageModule'
    },
    {
        path: 'list',
        loadChildren: '../pages/list/list.module#ListPageModule'
    },
    {
        path: 'item/:id',
        loadChildren: '../pages/item/item.module#ItemPageModule'
    },
    {
        path: 'search',
        loadChildren: '../pages/search/search.module#SearchPageModule'
    },
    {
        path: 'about',
        loadChildren: '../pages/about/about.module#AboutPageModule'
    },
    { path: 'favorites', loadChildren: '../pages/favorites/favorites.module#FavoritesPageModule' },
    { path: 'map', loadChildren: '../pages/map/map.module#MapPageModule' },
    { path: 'snonsors', loadChildren: '../pages/snonsors/snonsors.module#SnonsorsPageModule' },
    { path: 'schema', loadChildren: '../pages/schema/schema.module#SchemaPageModule' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map