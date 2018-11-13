import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    // {
    //   title: 'Home',
    //   url: '/home',
    //   icon: 'home'
    // },
    {
      title: 'Расписание ver.2',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Расписание',
      url: '/list',
      icon: 'list'
    }
  ];

  public infoPages = [
    {
      title: 'Карта',
      url: '/map',
      icon: 'map'
    },
    {
      title: 'Спонсоры',
      url: '/sponsors',
      icon: 'ribbon'
    },
    {
      title: 'Схема проезда',
      url: '/schema',
      icon: 'navigate'
    },
    {
      title: 'О приложении',
      url: '/about',
      icon: 'information-circle'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
