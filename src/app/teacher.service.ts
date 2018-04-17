import { AuthHttp } from 'angular2-jwt';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';


@Injectable()
export class TeacherService {

  loginUrl = environment.backend + '/teacher/login';
  dashboardUrl = environment.backend + '/teacher/dashboard';
  getAssignmentsUrl = environment.backend + '/teacher/assignments';
  getSubmissionsUrl = environment.backend + '/teacher/get/submissions';
  editAssignmentUrl = environment.backend + '/teacher/post/assignment';
  deleteAssignmentUrl = environment.backend + '/teacher/delete/assignment';
  viewSubmissionUrl = environment.backend + '/teacher/view/submission';
  evaluateUrl = environment.backend + '/teacher/evaluate/submission';
  

  constructor(private http: HttpClient, private authHttp: AuthHttp) { }

  login(req) {
    return this.http.post(this.loginUrl, req).toPromise().then(data => {
      sessionStorage.setItem('token', data['token'])
      return data;
    });
  }

  dashboard() {
    return this.authHttp.post(this.dashboardUrl, {});
  }

  getAssignments(req) : Promise<any> {
    return this.authHttp.post(this.getAssignmentsUrl, req).toPromise().then(data => {
      return data;
    });
  }


  getSubmissions(req) : Promise<any> {
    console.log(req);
    return this.authHttp.post(this.getSubmissionsUrl, req).toPromise().then(data => {
      return data;
    });
  }


  editAssignment(req) : Promise<any> {
    console.log(req);
    return this.authHttp.post(this.editAssignmentUrl, req).toPromise().then(data => {
      return data;
    });
  }

  deleteAssignment(req) : Promise <any> {
    return this.authHttp.post(this.deleteAssignmentUrl, req).toPromise().then(data => {
      return data;
    });
  }

  viewSubmission(req) : Promise<any> {
    return this.authHttp.post(this.viewSubmissionUrl, req).toPromise().then(data => {
      return data;
    });
  }

  evaluate(req) : Promise <any> {
    return this.authHttp.post(this.evaluateUrl, req).toPromise().then(data => {
      return data;
    });
  }
}
