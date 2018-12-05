import { Component, OnInit, Injectable } from '@angular/core';
import { Platform,LoadingController } from '@ionic/angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from './../../providers/database/database';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  public halls = []
  public halls_theme = []

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

  		databaseprovider.getAllFavoritesEvents().then((db) => {
			this.halls = databaseprovider.halls
			this.halls_theme = databaseprovider.hallsTheme
			this.hallsIds = databaseprovider.hallsIds
			this.hallsObject = databaseprovider.hallsObject


			this.themeDatas = databaseprovider.themeDatas


			this.eventsArr = databaseprovider.eventsDatas
			this.eventsArrTemp = databaseprovider.eventsDatas
			this.events = Object.keys(databaseprovider.eventsDatas)
			
			// alert("favorites this.eventsArr: "+JSON.stringify(  (this.eventsArr)  ) )
			this.dataLoad = true;
  		})

     //  	this.databaseprovider.getDatabaseState().subscribe(rdy => {
	    //     if (rdy) {	          
	    //     }
    	// })
	} 

	ngOnInit() {
	}

}
