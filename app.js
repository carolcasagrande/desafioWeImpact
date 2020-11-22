const express = require("express");
const hbs = require("handlebars");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");

let dataGlobal = {};

const compile = async function (templateName, data) {
  const filePath = path.join(
    process.cwd(),
    "views",
    `${templateName}.handlebars`
  );
  const html = await fs.readFile(filePath, "utf-8");
  return hbs.compile(html)(data);
};

const createPdf = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(dataGlobal);
    const content = await compile("certificado", { dataGlobal });

    await page.setContent(content);
    await page.emulateMediaType("screen");

    await page.pdf({
      path: "pdf/certificado.pdf",
      format: "A4",
      printBackground: true,
    });
    await browser.close();
  } catch (e) {
    console.log("Erro: ", e);
  }
};

const app = express();

app.use(express.static("public"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "handlebars");

app.get("/gerarcertificado", function (req, res) {
  res.render("gerarcertificado");
});

app.post("/certificado", function (req, res) {
  dataGlobal = req.body;
  res.render("certificado", { dataGlobal });
});

app.get("/imprimircertificado", function (req, res) {
  createPdf();
});

const porta = process.env.PORT || 8080;
app.listen(porta);