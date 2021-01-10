import { Component, OnInit, Input } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'tutorialAdi';
  isLoggedIn = false;
  username?: string;
  
  constructor(private tokenStorageService: TokenStorageService,private router: Router) { }
  ngOnInit(): void {

    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
       this.isLoggedIn = (!!this.tokenStorageService.getUser() )&&this.tokenStorageService.getUser().NOMBRE;
       if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        this.username = user.NOMBRE;
      }
      }
    });
  }
  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['']);
  }
}
