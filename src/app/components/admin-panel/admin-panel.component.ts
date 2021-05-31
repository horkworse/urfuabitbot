import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor() {

  }

  public getGovno(){
    return {
      text: "Shluha Helpopvna \n @id2982392(Zalupa Konskaya)"
    }
  }

  ngOnInit(): void {

  }

}
