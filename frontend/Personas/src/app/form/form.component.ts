import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import {Router} from '@angular/router'
const Personas_Query = gql`
query($id: Int!){
  persona(id: $id){
    id
    nombre
    apellido
    edad
    telefono
    email
  }
}
`

const Persona_Update_Query = gql`
mutation Persona_Update_Query(
  $id: Int!
  $nombre: String!
  $apellido: String!
  $edad: String!
  $telefono: String!
  $email: String!
){
  updatePersona(id: $id, input: {
    nombre: $nombre
  	apellido: $apellido
    edad: $edad
    telefono: $telefono
    email: $email
  }) {
    ok
  }
}
`
const Persona_Insert_Query = gql`
mutation Persona_Insert_Query(
  $nombre: String!
  $apellido: String!
  $edad: String!
  $telefono: String!
  $email: String!
){
  createPersona(input: {
    nombre: $nombre
    apellido: $apellido
    edad: $edad
    telefono: $telefono
    email: $email
  }) {
    ok
  }
}
`
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  id: any;
  edit: boolean = false;
  icono: String = "add";
  personas: any = [];
  private query: any;

  nombre: string = "";
  apellido: string = "";
  edad: string = "";
  telefono: string = "";
  email: string = "";

  constructor(private apollo: Apollo, private activateRoute: ActivatedRoute, private location: Location, private router: Router) { 
  
    this.id = this.activateRoute.snapshot.params['id'];
    if(this.id){
      this.edit = true;
      this.icono = "create";
      //select por id

      this.query= this.apollo.watchQuery<any>({
        query: Personas_Query,
        variables:{
          id: this.id,
        }
      }).valueChanges.subscribe( (result) => {
       this.personas= result.data && result.data.persona;
        this.nombre = this.personas["nombre"]
        this.apellido = this.personas["apellido"]
        this.edad = this.personas["edad"]
        this.telefono = this.personas["telefono"]
        this.email = this.personas["email"]
      })

      // hasta aqui
    }else{
      this.edit = false;
      this.icono = "add";
    }
  }

  ngOnInit(): void {
  }

  Hacer() {

    if(this.edit){
      // Update
      console.log(this.nombre)
      this.apollo.mutate({
        mutation: Persona_Update_Query,
        variables: {
          id: this.id,
          nombre: this.nombre,
          apellido: this.apellido,
          edad: this.edad,
          telefono: this.telefono,
          email: this.email
        }
      }).subscribe(( data ) => {
        //let dato = data["data"]["updatePersona"]
          /*if(data["ok"]){
            this.location.back()
          }*/
          alert("Persona Actualizada");
          this.router.navigate(["/home"]);
          console.log(data);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });

    }else{
      // Insertar
    this.apollo.mutate({
      mutation: Persona_Insert_Query,
      variables: {
          nombre: this.nombre,
          apellido: this.apellido,
          edad: this.edad,
          telefono: this.telefono,
          email: this.email
      }
    }).subscribe(( data ) => {
      console.log(data)
        /*let dato = data["data"]["createPersona"]
        if(dato["ok"]){
          this.location.back()
        }*/
        alert("Persona Ingresada");
        this.router.navigate(["/home"]);
        console.log(data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
    }

  }

}
