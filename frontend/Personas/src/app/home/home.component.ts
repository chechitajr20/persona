import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const Personas_Query = gql`
query {
  personas{
        id
        nombre
        apellido
        edad
    		telefono
    		email
      }
}

`
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  personas: any[] = [];
  private query: QueryRef<any>;
  constructor(private apollo: Apollo) {
    this.query = this.apollo.watchQuery({
      query: Personas_Query
    })

    this.query.valueChanges.subscribe( result => {
      console.log(result);
      this.personas = result.data && result.data.personas;
    })
    
   }

  ngOnInit(): void {
  }

}
