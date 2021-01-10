import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaArticulosComponent } from './lista-articulos/lista-articulos.component';
import { RutaDosComponent } from './ruta-dos/ruta-dos.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'lista', component: ListaArticulosComponent },
  { path: 'rutados', component: RutaDosComponent },
  {path:'login',component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
