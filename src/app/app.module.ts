import { TeacherService } from './teacher.service';
import { StudentService } from './student.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Http, RequestOptions, HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { UserService } from './user.service';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { HomeComponent } from './home/home.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';
import * as M from "materialize-css";


const appRoutes : Routes = [
  { path: '', component: HomeComponent },
  { path: 'student/dashboard', component: StudentComponent },
  { path: 'teacher/dashboard', component: TeacherComponent }
]

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'token',
    headerPrefix: 'JWT',
		tokenGetter: (() => sessionStorage.getItem('token')),
		globalHeaders: [{'Content-Type':'application/json'}],
	}), http, options);
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StudentComponent,
    TeacherComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    UserService,
    StudentService,
    TeacherService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
