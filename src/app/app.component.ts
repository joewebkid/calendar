import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Splash } from '../pages/splash/splash';

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
    // {
    //   title: 'Расписание ver.2',
    //   url: '/home',
    //   icon: 'home'
    // },
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
      title: 'Избранное',
      url: '/favorites',
      icon: 'heart'
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
  
  showSplash = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalCtrl: ModalController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault(); 

      this.presentModal()
    });
  }

  async presentModal() {

    const modal = await this.modalCtrl.create({
      component: Splash,
      // componentProps: { value: 123 }
    });
    return await modal.present();

  }
}
