import { TeacherService } from './../teacher.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StudentService } from './../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {

  subjects: any;
  teacher: any;
  selectedSubject: any;
  assignments: any;
  submissions : any;
  selectedAssignment : any;
  selectedSubmission : any;
  viewData : any;


  constructor(private route: ActivatedRoute, public studentService: StudentService, private el: ElementRef,
    public sanitizer: DomSanitizer, public teacherService: TeacherService, public router: Router) { }

  ngOnInit() {
    var self = this;
    this.teacherService.dashboard().toPromise().then(data => {
      self.subjects = JSON.parse(data['_body'])['subjects'];
      self.teacher = JSON.parse(data['_body'])['user'];
    }) 
  }

  selectSubject(subject) {
    this.selectedSubject = subject;

    this.fetchAssignments(subject);
    //this.fetchSubmissions();

    this.initTabs();
  }

  fetchAssignments(subject) {
    var self = this;
    var params = {
      'feedback_id' : subject.feedback_id
    }
    this.teacherService.getAssignments(params).then(data => {
      console.log(data);
      self.assignments = JSON.parse(data['_body']);
    })
  }

  initTabs() {
    $(document).ready(function(){
      $('.tabs').tabs();
    });
  }

  initModals() {
    $(document).ready(function(){
      $('.modal').modal({
        opacity: 0.1
      });
    });  
  }

  fetchSubmissions(assignment) {
    this.selectedAssignment = assignment;
    var self = this;
    this.teacherService.getSubmissions({'assignment_id' : assignment['assignment_id'] }).then(data => {
  
      self.submissions = JSON.parse(data['_body'])['submissions'];
      console.log(self.submissions)
    })
  }

  submitAssignment() {
    var self = this;
    this.teacherService.editAssignment({'assignment' : self.selectedAssignment }).then(data => {
  
      self.fetchAssignments(this.selectedSubject);

    })
  }

  editAssignment(assignment) {
    this.selectedAssignment = assignment;
    this.initModals();
    $(document).ready(function() {
      $('#modal1').modal('open'); 
    })

    $(document).ready(function() {
      M.updateTextFields();
    })
  }

  close() {
    $(document).ready(function() {
      $('.modal').modal('close');
    })
  }

  deleteAssignment(assignment) {
    var self = this;
    this.teacherService.deleteAssignment({ aid: assignment.assignment_id }).then(data => {
      console.log(data);
      self.fetchAssignments(self.selectedSubject);
    })
  }

  createAssignment() {
    var self = this;

    var new_assignment = {
      'title' : '',
      'description' : '',
      'feedback_id' : self.selectedSubject.feedback_id
    }
    
    this.editAssignment(new_assignment)

  }

  editSubmission(submission) {
    var self = this;
    this.selectedSubmission = submission;

    this.initModals();
    $(document).ready(function() {
      $('#modal3').modal('open');
      M.updateTextFields();
    })
  }

  viewSubmission(submission) {
    var self = this;
    console.log(submission)
    this.teacherService.viewSubmission({ id: submission.submission_id , enrollment_no: submission.enrollment_no}).then(data => {
      console.log(data);
      self.viewData = JSON.parse(data['_body'])['content'];
      this.initModals();
      $(document).ready(function() {
        console.log('Open!')
        $('#modal2').modal('open');
      })
    })
  }
  
  evaluateSubmission(submission) {
    var self = this;
    this.teacherService.evaluate({ submission: self.selectedSubmission }).then(data => {
      console.log(data);
      console.log(this.selectedAssignment)
      self.fetchSubmissions(self.selectedAssignment);
    })
  }

  logout() {
    this.router.navigate(['',  {}]);
  }

}
