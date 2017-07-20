import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LinkedIn, LinkedInLoginScopes } from '@ionic-native/linkedin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  scopes: LinkedInLoginScopes[] = ['r_basicprofile', 'r_emailaddress', 'rw_company_admin', 'w_share'];
  isLoggedIn: boolean = false;
  selfData = { id:"", firstName:"", lastName:"" };

  constructor(public navCtrl: NavController, private linkedin: LinkedIn) {}

  ionViewDidAppear() {
    this.linkedin.hasActiveSession().then((active) => {
      this.isLoggedIn = active;
      if(this.isLoggedIn === true) {
        this.getSelfData();
      }
    });
  }

  login() {
    this.linkedin.login(this.scopes, true)
      .then(() => {
        this.isLoggedIn = true;
        this.getSelfData();
      })
      .catch(e => console.log('Error logging in', e));
  }

  logout() {
    this.linkedin.logout();
    this.isLoggedIn = false;
    console.log(this.isLoggedIn);
  }

  getSelfData() {
    this.linkedin.getRequest('people/~')
      .then(res => {
        this.selfData = res;
        //this.openProfile(res.id);
      })
      .catch(e => console.log(e));
  }

  openProfile(memberId) {
    this.linkedin.openProfile(memberId)
      .then(res => console.log(res))
      .catch(e => console.log(e));
  }

  shareSomething() {
    const body = {
      comment: 'May I Share something on my profile?',
      visibility: {
        code: 'anyone'
      }
    };

    this.linkedin.postRequest('~/shares', body)
      .then(res => console.log(res))
      .catch(e => console.log(e));
  }
}
