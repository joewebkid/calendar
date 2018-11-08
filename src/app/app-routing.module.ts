import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
