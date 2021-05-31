import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-student-search.web',
  templateUrl: './student-search.web.component.html',
  styleUrls: ['./student-search.web.component.css']
})
export class StudentSearchComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StudentSearchComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
