import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-lista-articulos',
  templateUrl: './lista-articulos.component.html',
  styleUrls: ['./lista-articulos.component.css']
})
export class ListaArticulosComponent implements OnInit {

  nombre: string;
  precio: string;
  lista: any[];

  constructor() {  
    this.nombre = "P1";
    this.precio = "5"; 
    this.lista=[
    ];
  }

  ngOnInit(): void {
  }

}
