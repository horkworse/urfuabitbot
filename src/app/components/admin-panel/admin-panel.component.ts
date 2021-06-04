import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {StudentSearchComponent} from './children/student-search.web/student-search.web.component';
import {MentorControlComponent} from './children/mentor-control/mentor-control.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) {}


  ngOnInit(): void {

  }

  public newMentor() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.panelClass = 'container';
    dialogConfig.minWidth = '726px';
    dialogConfig.maxWidth = '50vw';

    this.dialog.open(MentorControlComponent, dialogConfig)
  }

  public showAllStudent(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.panelClass = 'container';

    this.dialog.open(StudentSearchComponent, dialogConfig)
  }
}
