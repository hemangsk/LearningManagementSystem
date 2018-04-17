import { TeacherService } from './../teacher.service';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  auth_mode = '';
  login = '';
  password = '';
  semester = '';

  constructor(public studentService : StudentService, public teacherService: TeacherService, public router: Router) { }

  ngOnInit() {

  }

  submit() : void {

    var params = {
      'login' : this.login,
      'password' : this.password
    }

    var self = this;

    switch(this.auth_mode) {
      case 'STUDENT' :  {

        params['semester'] = this.semester;

        this.studentService.login(params).then(response => {
          self.router.navigate(['/student/dashboard', { semester : self.semester }]);            
        })
        break;
      }

      case 'TEACHER' : {
    
        this.teacherService.login(params).then(response => {
          self.router.navigate(['/teacher/dashboard',  {}]);    
        })

        break;
      }
    }    
  }

}
