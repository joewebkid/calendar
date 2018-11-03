import { Component, OnInit, Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-item',
  templateUrl: 'item.page.html',
  styleUrls: ['item.page.scss']
})
@Injectable()
export class ItemPage implements OnInit {
  // private selectedItem: any;
  // private icons = [
  //   'flask',
  //   'wifi',
  //   'beer',
  //   'football',
  //   'basketball',
  //   'paper-plane',
  //   'american-football',
  //   'boat',
  //   'bluetooth',
  //   'build'
  // ];
  // public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(private sqlite: SQLite,
    public plt: Platform) {
console.log(plt);
    this.plt.ready().then(() => {
      console.log(1)
        // this.
    })

  }
  
  // public getDB(){
  //   return this.sqlite.create({
  //     name: "articles",
  //     location: "default"
  //   })
  // }

  // public createDatabases(){
  //   return this.getDB().then((db: SQLiteObject) => {
  //     console.log()
  //       // this.
  //   })
  //   .catch(e => console.log(e));
  // }

  // private createTables(db: SQLiteObject){

  // }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/item', JSON.stringify(item)]);
  // }
    // for (let i = 1; i < 11; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }
  
}
