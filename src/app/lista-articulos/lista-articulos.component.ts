import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-lista-articulos',
  templateUrl: './lista-articulos.component.html',
  styleUrls: ['./lista-articulos.component.css']
})
export class ListaArticulosComponent implements OnInit {

  nombre: string;
  precio: string;
  lista: any[];

  constructor(private UserService: UserService) {  
    this.nombre = "";
    this.precio = ""; 
    this.lista=[];
  }

  ngOnInit(): void {
    this.UserService.getProductos().subscribe(
      resultado =>  this.lista = resultado);
  }

}
