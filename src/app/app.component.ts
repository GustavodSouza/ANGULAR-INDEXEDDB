import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tasks';

  public nome: string = '';
  public sobrenome: string = '';
  public idade: number = 0;
  public retorno: any;

  public request = indexedDB.open("MeuBanco", 1);

  public ngOnInit(): void {
    this.criarBanco();
    this.buscarDados();
  }

  public criarBanco(): void {
    this.request.onupgradeneeded = function (event: any) {
      //fazer a criação das tabelas, indices e popular o banco se necessário

      const db = event.target.result;

      db.createObjectStore("store1", { autoIncrement: true });
    }
  }

  public incluirDados(): void {
    const dados = {
      nome: this.nome,
      sobrenome: this.sobrenome,
      idade: this.idade,
    };

    const request = indexedDB.open("MeuBanco", 1);

    request.onsuccess = function (event: any) {

      const db = event.target.result;
      var transaction = db.transaction(["store1"], "readwrite");
      var objectStore = transaction.objectStore("store1");
      objectStore.add(dados);
    };
    this.buscarDados();
  }

  public buscarDados(): any {
    const request = indexedDB.open("MeuBanco", 1);

    let dados = [];

    request.onsuccess = function (event: any) {

      const db = event.target.result;
      var transaction = db.transaction(["store1"], "readonly");
      var store = transaction.objectStore('store1');

      let cursor = store.openCursor();

      cursor.onsuccess = e => {

        let atual = e.target.result;

        if (atual) {

          dados.push(atual.value);
          atual.continue();

        } else {

          // quando não há mais objects em nossa store.
          // Isso significa que já terminados de popular negociacoes
          console.log('************************ Lista de objetos no banco de dados **************************************');
          console.log(dados);
          console.log('**************************************************************************************************');

        }
      }
    }

    this.retorno = dados;
  }
}
