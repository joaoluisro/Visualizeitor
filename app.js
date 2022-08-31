const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

const xmlFile = 'https://raw.githubusercontent.com/joaoluisro/joaoluisro.github.io/master/alunos.xml';

var disciplinas = document.getElementsByClassName("disciplina-element");

function getDisColors(situacao){
  if(situacao == 'Aprovado'){
    return('green');
  }else if(situacao == 'Reprovado' || situacao == 'Repr. Freq'){
    return('red');
  }else if(situacao == 'Equivale'){
    return('yellow');
  }else if(situacao == 'Matricula'){
    return('blue');
  }else{
    return('white');
  }
}

function getAlunos(xml, GRR){
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xml, "text/xml");
  let alunos = xmlDoc.getElementsByTagName("ALUNO");
  let alunosRA = xmlDoc.getElementsByTagName("MATR_ALUNO");
  let registros = [];

  for(let i = 0; i < alunosRA.length; i++){
    let aluno = alunosRA[i];
    if(aluno.textContent == GRR){
      let parent = aluno.parentNode;
      let codigoDisciplina = parent.childNodes[29].textContent;
      registros.push(parent);
    }
  }

}

function formatModal(aluno){
  //console.log(aluno);
  // codigo/nome/ultima vez cursada/nota/ freq
  // NOME_ATIV_CURRIC [31]
  // COD_ATIV_CURRIC [29]
  // ANO [19]
  // PERIODO [25]
  // FREQUENCIA [47]
  // MEDIA_FINAL [21]
  console.log(aluno);
  let nome = "Nome: " + aluno[31].textContent + "<br>";
  let codigo = "Codigo: " +  aluno[29].textContent + "<br>";
  let periodo = aluno[25].textContent;
  let ano = "Cursado em : " + aluno[19].textContent + "/" + periodo + "<br>";
  let freq = "Frequencia: " + aluno[47].textContent + "<br>";
  let media = "Média final: " + aluno[21].textContent + "<br>";

  return  ano + freq + media;

}
function formatPopover(aluno){
  //console.log(aluno);
  // codigo/nome/ultima vez cursada/nota/ freq
  // NOME_ATIV_CURRIC [31]
  // COD_ATIV_CURRIC [29]
  // ANO [19]
  // PERIODO [25]
  // FREQUENCIA [47]
  // MEDIA_FINAL [21]
  console.log(aluno);
  let nome = "Nome: " + aluno[31].textContent + "<br>";
  let codigo = "Codigo: " +  aluno[29].textContent + "<br>";
  let periodo = aluno[25].textContent;
  let ano = "Cursado em : " + aluno[19].textContent + "/" + periodo + "<br>";
  let freq = "Frequencia: " + aluno[47].textContent + "<br>";
  let media = "Média final: " + aluno[21].textContent + "<br>";

  return nome + codigo + ano + freq + media;

}

function loadAlunos(xmlFile, operation, GRR, materiaCurr) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(temp) {
    if (this.readyState === 4 && this.status === 200) {

      if(operation == 'consulta'){

        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(this.response, "text/xml");
        let disciplinasXML = xmlDoc.getElementsByTagName("COD_ATIV_CURRIC");

        for(let i = 0; i < disciplinas.length; i++){
          for(let j = 0; j < disciplinasXML.length; j++){
            let aluno = disciplinasXML[j].parentNode;
            if(disciplinas[i].textContent == disciplinasXML[j].textContent){
              //console.log(aluno.childNodes);
              if(aluno.childNodes[3].textContent == GRR){

                let situacao = aluno.childNodes[53].textContent;
                let color = getDisColors(situacao);
                disciplinas[i].style.backgroundColor = color;
                disciplinas[i].dataset.bsContent = formatPopover(aluno.childNodes);
                const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
                const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

              }
            }

          }
        }



      }
      else if(operation == 'showHistoricoDisciplina'){
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(this.response, "text/xml");
        let disciplinasXML = xmlDoc.getElementsByTagName("COD_ATIV_CURRIC");

        let modal_content = '';
        let modal = document.querySelector('.modal-body');
        let title = document.querySelector('.modal-title');
        title.innerHTML = materiaCurr;
        for(let i = 0; i < disciplinasXML.length; i++){
          let aluno = disciplinasXML[i].parentNode;
          if(disciplinasXML[i].textContent == materiaCurr){

            if(aluno.childNodes[3].textContent == GRR){
              modal_content += formatModal(aluno.childNodes);
            }
          }
        }

        modal.innerHTML = modal_content;
        $('#exampleModal').modal('show');
      }

    }
  };
  xhttp.open("GET", xmlFile, true);
  xhttp.send();
}



//console.log(alunos);
let submitBtn = document.getElementById("searchBtn");


// consulta, modal, disciplina

submitBtn.addEventListener('click', () =>{
  searchContent = document.querySelector(".form-control").value;

  for(let i = 0; i < disciplinas.length; i++){
    disciplinas[i].style.backgroundColor = 'white';
    disciplinas[i].dataset.bsContent = '';
  }
  loadAlunos(xmlFile, 'consulta', searchContent, '');

  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
});



for(let i = 0; i < disciplinas.length; i++){
  searchContent = document.querySelector(".form-control").value;
  disciplinas[i].addEventListener('contextmenu', (event) => {
    event.preventDefault();
    loadAlunos(xmlFile, 'showHistoricoDisciplina', searchContent, disciplinas[i].innerHTML);
  });

}

window.addEventListener('load', () => {
  $(document).ready(function(){
        $("#myModal").modal('show');
    });
});
