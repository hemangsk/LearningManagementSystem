import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';


@Injectable()
export class UserService {

  loginUrl = environment.backend + '/login';
  dashboardUrl = environment.backend + '/dashboard';
  
  constructor(private http: HttpClient, private authHttp: AuthHttp) { }

  login(req) {
    return this.http.post(this.loginUrl, req).toPromise().then(data => {
      sessionStorage.setItem('token', data['token'])
      return data;
    });
  }

  dashboard(req) : Promise<any> {
    return this.authHttp.post(this.dashboardUrl, req).toPromise().then(data => {
      return data;
    });
  }

  testEndPoint() {
    return this.http.get('/api/users').toPromise().then(data => {
      return data;
    })
  }
}
