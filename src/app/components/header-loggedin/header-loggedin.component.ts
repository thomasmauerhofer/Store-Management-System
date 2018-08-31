import {Component, OnInit} from '@angular/core';

import {Role, User} from '../../models/user';
import {AuthenticationService} from '../../services/authentification.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-header-loggedin',
  templateUrl: './header-loggedin.component.html',
  styleUrls: ['./header-loggedin.component.css']
})
export class HeaderLoggedinComponent implements OnInit {

  admin = Role.Admin;
  user: User;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  logout() {
    this.authenticationService.logout(this.user)
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error: any) => {
          const msg = 'An error occurred while logging out: ' + error.status + ' - ' + error.statusText;
          this.notifierService.notify( 'error', msg);
        });
  }
}
