// ==UserScript==
// @name        Direção Concusos Subject to Csv
// @namespace   Violentmonkey Scripts
// @match       https://www.direcaoconcursos.com.br/cursos/*
// @grant       none
// @version     1.0
// @author      Luiz
// @inject-into content
// @description 21/10/2023, 15:00:00
// ==/UserScript==

const subjects = document.querySelectorAll("table > tbody > tr:not([class]");

function downloadCsv(csv, filename) {
  var link = window.document.createElement("a");
  link.setAttribute(
    "href",
    "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv)
  );
  link.setAttribute("download", `${filename}.csv`);
  link.click();
}

subjects.forEach(function (subject) {
  var subjectElement = subject.nextElementSibling;
  var titleCourse = subject.querySelector(".subtitleCourse").innerText;
  var buttonDownload = document.createElement("button");
  var csv = "Conteúdo programático\n";

  buttonDownload.classList.add("sc-60f79e5-8", "eLibHc");
  buttonDownload.innerHTML = "Download CSV";

  if (!subjectElement.classList.contains("sc-60f79e5-19")) {
    subject.querySelector(".sc-60f79e5-17").click();
    subjectElement = subject.nextElementSibling;
  }

  var subjectTopics = subjectElement.querySelectorAll(".sc-60f79e5-24");

  subjectTopics.forEach(function (subjectTopic) {
    if (subjectTopic != undefined) {
      csv += `"${subjectTopic.innerText.slice(5)}"\n`;
    }
  });
  buttonDownload.classList.add("downloadCsv");
  buttonDownload.setAttribute("csv", csv);
  buttonDownload.setAttribute("filename", titleCourse);

  subject.querySelector(".freeContentButton div").appendChild(buttonDownload);
});

document.querySelectorAll(".downloadCsv").forEach(function (button) {
  button.onclick = function (e) {
    console.log(e.target.getAttribute("csv"));
    downloadCsv(
      e.target.getAttribute("csv"),
      e.target.getAttribute("filename")
    );
  };
});
