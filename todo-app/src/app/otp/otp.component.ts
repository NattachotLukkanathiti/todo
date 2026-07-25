import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements OnInit, OnDestroy {

  timeLeft = 10 * 60; // 10 นาที = 600 วินาที
  timer: any;


  onlyNumber(event: any){
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }


  ngOnInit(){
    this.startTimer();
  }


  startTimer(){

    this.timer = setInterval(() => {

      if(this.timeLeft > 0){
        this.timeLeft--;
      }
      else{
        clearInterval(this.timer);
      }

    },1000);

  }


  get timerText(){

    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;

    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;

  }


  ngOnDestroy(){
    clearInterval(this.timer);
  }

}