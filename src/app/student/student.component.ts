import { StudentService } from './../student.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  semester:any;
  subjects : any;
  student: any = {};
  selectedSubject : any;
  assignments : any;
  submissions: any;
  selectedAssignment : any;
  viewData: any;


  constructor(private route: ActivatedRoute, public studentService: StudentService, private el: ElementRef,
    public sanitizer: DomSanitizer, public router: Router) {

  }

  ngOnInit() {

    // tabs
    this.initTabs();

    // modals
    this.initModals();

    var self = this;

    this.route.params.subscribe(navParams => {
      this.semester = +navParams['semester']; 
      var params = {
        'semester' : this.semester
      }
      this.studentService.dashboard(params).toPromise().then(data => {
        self.subjects = JSON.parse(data['_body'])['subjects'];
        self.student = JSON.parse(data['_body'])['user'];

      })
    });
  }

  fetchAssignments(subject) {
    var self = this;
    var params = {
      'feedback_id' : subject.feedback_id
    }
    this.studentService.getAssignments(params).then(data => {
      self.assignments = JSON.parse(data['_body']);
    })
  }

  selectSubject(subject) {
    this.selectedSubject = subject;

    this.fetchAssignments(subject);
    this.fetchSubmissions();

    this.initTabs();
  }

  fetchSubmissions() {
    var self = this;
    this.studentService.getSubmissions({'feedback_id' : self.selectedSubject['feedback_id'] }).then(data => {
      self.submissions = JSON.parse(data['_body'])['submissions'];
      console.log(self.submissions)
    })
  }

  initTabs() {
    $(document).ready(function(){
      $('.tabs').tabs();
    });
  }

  submitAssignment(assignment) {
    this.selectedAssignment = assignment;
    this.initModals();
    $(document).ready(function() {
      $('#modal1').modal('open'); 
    })
  }

  initModals() {
    $(document).ready(function(){
      $('.modal').modal({
        opacity: 0.1
      });
    });  
  }

  upload() {
    var self = this;
    
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#file');
    let fileCount: number = inputEl.files.length;

    if (fileCount > 0) {

      let fileToLoad = inputEl.files[0];

      let fileReader = new FileReader();
      let base64;

      fileReader.onload = function(fileLoadedEvent) {
        base64 = fileLoadedEvent.target['result'];
        self.studentService.submit( { content: base64, assignment: self.selectedAssignment } ).then(data => { 
          console.log(data) 
          self.fetchSubmissions();
        });
      };

      fileReader.readAsDataURL(fileToLoad);

    } else {
      self.studentService.submit( { assignment: self.selectedAssignment } ).then(data => { console.log(data) });

    }
  }

  close() {
    $(document).ready(function() {
      $('#modal1').modal('close');
    })
  }

  getSubmissions() {
    
  }

  editSubmission(submission) {
    this.submitAssignment(submission.assignment);
    this.selectedAssignment.notes = submission.notes;
    $(document).ready(function() {
      M.updateTextFields();
    })
  }

  viewSubmissions(submission) {
    var self = this;
    console.log(submission);
    this.studentService.viewSubmission({ id: submission.submission_id }).then(data => {
      console.log(data);
      self.viewData = JSON.parse(data['_body'])['content'];
      this.initModals();
      $(document).ready(function() {
        console.log('Open!')
        $('#modal2').modal('open');
      })
    })
  }

  deleteSubmission(submission) {
    this.studentService.deleteSubmission({ aid: submission.assignment.assignment_id, sid: submission.submission_id, fid: submission.assignment.feedback_id }).then(data => {
      console.log(data);

      this.fetchSubmissions();
    })
  }


}
