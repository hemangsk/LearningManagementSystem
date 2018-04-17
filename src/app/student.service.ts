import { AuthHttp } from 'angular2-jwt';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class StudentService {

  loginUrl = environment.backend + '/student/login';
  dashboardUrl = environment.backend + '/student/dashboard';
  getAssignmentsUrl = environment.backend + '/student/assignments';
  getSubmitUrl = environment.backend + '/student/upload/submission';
  getSubmissionsUrl = environment.backend + '/student/get/submissions';
  viewSubmissionsUrl = environment.backend + '/student/view/submission';
  deleteSubmissionUrl = environment.backend + '/student/delete/submission';

  
  constructor(private http: HttpClient, private authHttp: AuthHttp) { }

  login(req) {
    return this.http.post(this.loginUrl, req).toPromise().then(data => {
      sessionStorage.setItem('token', data['token'])
      return data;
    });
  }

  dashboard(req) {
    return this.authHttp.post(this.dashboardUrl, req);
  }

  testEndPoint() {
    return this.http.get('/api/users').toPromise().then(data => {
      return data;
    })
  }

  getAssignments(req) : Promise<any> {
    return this.authHttp.post(this.getAssignmentsUrl, req).toPromise().then(data => {
      return data;
    });
  }

  submit(req) : Promise<any> {
    return this.authHttp.post(this.getSubmitUrl, req).toPromise().then(data => {
      return data;
    });
  }

  getSubmissions(req) : Promise<any> {
    return this.authHttp.post(this.getSubmissionsUrl, req).toPromise().then(data => {
      return data;
    });
  }

  viewSubmission(req) : Promise<any> {
    return this.authHttp.post(this.viewSubmissionsUrl, req).toPromise().then(data => {
      return data;
    });
  }

  deleteSubmission(req) : Promise<any> {
    return this.authHttp.post(this.deleteSubmissionUrl, req).toPromise().then(data => {
      return data;
    });
  }
}
