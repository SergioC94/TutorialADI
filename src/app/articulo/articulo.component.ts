import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit {

  @Input() ID: string;
  @Input() NOMBRE: string;
  @Input() PRECIO: string;

  constructor() { 
    this.ID =""
    this.NOMBRE = "";
    this.PRECIO = "";
  }

  ngOnInit(): void {
  }

}
