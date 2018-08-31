import { Component, OnInit } from '@angular/core';

import {AuthenticationService} from '../../services/authentification.service';
import {User} from '../../models/user';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};

  constructor(private authenticationService: AuthenticationService,
              private notifierService: NotifierService,
              private router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/stores']);
    }
  }

  onSubmit() {
    this.authenticationService.login(this.model as User)
      .subscribe(
        (user: User) => {
          this.router.navigate(['/stores']);
        },
        (error: any) => {
          this.notifierService.notify( 'error', 'Incorrect username or password.');
          this.model.password = '';
        });
  }
}
