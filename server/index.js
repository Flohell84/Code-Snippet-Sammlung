import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const snippetSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  language: String,
  category: String
});

const Snippet = mongoose.model('Snippet', snippetSchema);

// Snippet-CRUD-API
app.get('/api/snippets', async (req, res) => {
  const { search, language, category } = req.query;
  let filter = {};
  if (search) filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { code: { $regex: search, $options: 'i' } }
  ];
  if (language) filter.language = language;
  if (category) filter.category = category;
  const snippets = await Snippet.find(filter);
  res.json(snippets);
});

app.post('/api/snippets', async (req, res) => {
  const snippet = new Snippet(req.body);
  await snippet.save();
  res.status(201).json(snippet);
});

app.put('/api/snippets/:id', async (req, res) => {
  const snippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(snippet);
});

app.delete('/api/snippets/:id', async (req, res) => {
  await Snippet.findByIdAndDelete(req.params.id);
  res.status(204).end();
});


const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/snippets';

// Seed-Route für Beispiel-Snippets (nur zu Demo-Zwecken)
app.post('/api/seed', async (req, res) => {
  await Snippet.deleteMany({});
  const snippets = [
    {
      title: 'Promise.all Beispiel',
      description: 'Mehrere Promises parallel abwarten.',
      code: 'Promise.all([fetch(url1), fetch(url2)]).then(([res1, res2]) => {/*...*/});',
      language: 'JavaScript',
      category: 'Frontend'
    },
    {
      title: 'Deep Clone (JavaScript)',
      description: 'Objekt tief kopieren mit JSON.',
      code: 'const clone = JSON.parse(JSON.stringify(obj));',
      language: 'JavaScript',
      category: 'Frontend'
    },
    {
      title: 'Dictionary Comprehension',
      description: 'Neues Dictionary mit Quadratwerten.',
      code: 'squares = {x: x*x for x in range(6)}',
      language: 'Python',
      category: 'Backend'
    },
    {
      title: 'Datei einlesen (Python)',
      description: 'Liest eine Datei zeilenweise ein.',
      code: 'with open("datei.txt") as f:\n    for line in f:\n        print(line)',
      language: 'Python',
      category: 'Backend'
    },
    {
      title: 'HashMap iterieren (Java)',
      description: 'Alle Schlüssel und Werte ausgeben.',
      code: 'for (Map.Entry<K,V> entry : map.entrySet()) {\n  System.out.println(entry.getKey() + ": " + entry.getValue());\n}',
      language: 'Java',
      category: 'Backend'
    },
    {
      title: 'Null-Coalescing Operator (C#)',
      description: 'Standardwert, falls Variable null ist.',
      code: 'string name = input ?? "Unbekannt";',
      language: 'C#',
      category: 'Backend'
    },
    {
      title: 'Vektor aufsteigend sortieren (C++)',
      description: 'Sortiert einen Vektor aufsteigend.',
      code: '#include <vector>\n#include <algorithm>\nstd::vector<int> v = {3,1,2};\nstd::sort(v.begin(), v.end());',
      language: 'C++',
      category: 'Backend'
    },
    {
      title: 'TypeScript Interface',
      description: 'Definiert ein Interface.',
      code: 'interface Person {\n  name: string;\n  age: number;\n}',
      language: 'TypeScript',
      category: 'Frontend'
    },
    {
      title: 'Go: Map iterieren',
      description: 'Alle Schlüssel und Werte ausgeben.',
      code: 'for k, v := range m {\n    fmt.Println(k, v)\n}',
      language: 'Go',
      category: 'Backend'
    },
    {
      title: 'Ruby: Array map',
      description: 'Jedes Element quadrieren.',
      code: 'arr = [1,2,3]\narr.map { |x| x**2 }',
      language: 'Ruby',
      category: 'Backend'
    },
    {
      title: 'PHP: Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: '$even = array_filter($arr, fn($x) => $x % 2 === 0);',
      language: 'PHP',
      category: 'Backend'
    },
    {
      title: 'SQL: COUNT',
      description: 'Zählt alle Einträge in einer Tabelle.',
      code: 'SELECT COUNT(*) FROM benutzer;',
      language: 'SQL',
      category: 'Datenbank'
    },
    {
      title: 'Bash: Dateien rekursiv suchen',
      description: 'Alle .js-Dateien im Verzeichnisbaum finden.',
      code: 'find . -name "*.js"',
      language: 'Bash',
      category: 'DevOps'
    },
    {
      title: 'HTML: Link öffnen',
      description: 'Öffnet einen Link in neuem Tab.',
      code: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>',
      language: 'HTML',
      category: 'Frontend'
    },
    {
      title: 'CSS: Hover-Effekt',
      description: 'Farbe beim Überfahren ändern.',
      code: 'button:hover {\n  background: #007bff;\n  color: #fff;\n}',
      language: 'CSS',
      category: 'Frontend'
    },
    {
      title: 'Swift: Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'let even = arr.filter { $0 % 2 == 0 }',
      language: 'Swift',
      category: 'Backend'
    },
    {
      title: 'Kotlin: List filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'val even = list.filter { it % 2 == 0 }',
      language: 'Kotlin',
      category: 'Backend'
    },
    {
      title: 'Rust: Vektor filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'let even: Vec<_> = v.into_iter().filter(|x| x % 2 == 0).collect();',
      language: 'Rust',
      category: 'Backend'
    },
    {
      title: 'R: Vektor filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'even <- v[v %% 2 == 0]',
      language: 'R',
      category: 'Datenanalyse'
    },
    {
      title: 'Matlab: Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'even = arr(mod(arr,2)==0);',
      language: 'Matlab',
      category: 'Datenanalyse'
    },
    {
      title: 'Scala: List filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'val even = list.filter(_ % 2 == 0)',
      language: 'Scala',
      category: 'Backend'
    },
    {
      title: 'Perl: Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: '@even = grep { $_ % 2 == 0 } @arr;',
      language: 'Perl',
      category: 'Backend'
    },
    {
      title: 'Shell: Zeilen zählen',
      description: 'Zählt Zeilen in einer Datei.',
      code: 'wc -l < datei.txt',
      language: 'Shell',
      category: 'DevOps'
    },
    // JavaScript
    {
      title: 'Array filtern',
      description: 'Filtert ein Array nach geraden Zahlen.',
      code: 'const even = arr.filter(x => x % 2 === 0);',
      language: 'JavaScript',
      category: 'Frontend'
    },
    {
      title: 'Debounce Funktion',
      description: 'Verhindert zu häufiges Ausführen einer Funktion.',
      code: 'function debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), ms);\n  };\n}',
      language: 'JavaScript',
      category: 'Frontend'
    },
    // Python
    {
      title: 'Liste sortieren',
      description: 'Sortiert eine Liste von Zahlen.',
      code: 'zahlen = [3,1,2]\nzahlen.sort()',
      language: 'Python',
      category: 'Backend'
    },
    {
      title: 'List Comprehension',
      description: 'Erstellt eine neue Liste mit Quadraten.',
      code: 'quadrate = [x**2 for x in range(10)]',
      language: 'Python',
      category: 'Backend'
    },
    // Java
    {
      title: 'Hello World',
      description: 'Klassisches Hello World in Java.',
      code: 'public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}',
      language: 'Java',
      category: 'Backend'
    },
    {
      title: 'Streams filtern',
      description: 'Filtert eine Liste mit Streams.',
      code: 'List<Integer> even = list.stream().filter(x -> x % 2 == 0).collect(Collectors.toList());',
      language: 'Java',
      category: 'Backend'
    },
    // C#
    {
      title: 'LINQ Query',
      description: 'Beispiel für LINQ in C#.',
      code: 'var result = list.Where(x => x.Aktive).ToList();',
      language: 'C#',
      category: 'Backend'
    },
    {
      title: 'String umdrehen',
      description: 'Dreht einen String um.',
      code: 'string input = "Hallo";\nstring reversed = new string(input.Reverse().ToArray());',
      language: 'C#',
      category: 'Backend'
    },
    // SQL
    {
      title: 'SQL SELECT',
      description: 'Alle Einträge aus einer Tabelle auswählen.',
      code: 'SELECT * FROM benutzer;',
      language: 'SQL',
      category: 'Datenbank'
    },
    {
      title: 'SQL JOIN',
      description: 'Verknüpft zwei Tabellen.',
      code: 'SELECT * FROM t1 JOIN t2 ON t1.id = t2.t1_id;',
      language: 'SQL',
      category: 'Datenbank'
    },
    // Bash
    {
      title: 'Alle Dateien zählen',
      description: 'Zählt alle Dateien im aktuellen Verzeichnis.',
      code: 'ls -1 | wc -l',
      language: 'Bash',
      category: 'DevOps'
    },
    {
      title: 'Find mit exec',
      description: 'Führt einen Befehl für jede gefundene Datei aus.',
      code: 'find . -name "*.js" -exec grep TODO {} +',
      language: 'Bash',
      category: 'DevOps'
    },
    // HTML
    {
      title: 'HTML Boilerplate',
      description: 'Minimales HTML5 Grundgerüst.',
      code: '<!DOCTYPE html>\n<html lang="de">\n<head>\n  <meta charset="UTF-8">\n  <title>Dokument</title>\n</head>\n<body>\n\n</body>\n</html>',
      language: 'HTML',
      category: 'Frontend'
    },
    {
      title: 'Link öffnen',
      description: 'Öffnet einen Link in neuem Tab.',
      code: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>',
      language: 'HTML',
      category: 'Frontend'
    },
    // CSS
    {
      title: 'Flexbox Centering',
      description: 'Zentriert ein Element mit Flexbox.',
      code: '.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
      language: 'CSS',
      category: 'Frontend'
    },
    {
      title: 'Hover-Effekt',
      description: 'Farbe beim Überfahren ändern.',
      code: 'button:hover {\n  background: #007bff;\n  color: #fff;\n}',
      language: 'CSS',
      category: 'Frontend'
    },
    // TypeScript
    {
      title: 'Interface definieren',
      description: 'Definiert ein Interface.',
      code: 'interface Person {\n  name: string;\n  age: number;\n}',
      language: 'TypeScript',
      category: 'Frontend'
    },
    // Go
    {
      title: 'Map iterieren',
      description: 'Alle Schlüssel und Werte ausgeben.',
      code: 'for k, v := range m {\n    fmt.Println(k, v)\n}',
      language: 'Go',
      category: 'Backend'
    },
    // Rust
    {
      title: 'Vektor filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'let even: Vec<_> = v.into_iter().filter(|x| x % 2 == 0).collect();',
      language: 'Rust',
      category: 'Backend'
    },
    // Swift
    {
      title: 'Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'let even = arr.filter { $0 % 2 == 0 }',
      language: 'Swift',
      category: 'Backend'
    },
    // Kotlin
    {
      title: 'List filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'val even = list.filter { it % 2 == 0 }',
      language: 'Kotlin',
      category: 'Backend'
    },
    // Ruby
    {
      title: 'Array map',
      description: 'Jedes Element quadrieren.',
      code: 'arr = [1,2,3]\narr.map { |x| x**2 }',
      language: 'Ruby',
      category: 'Backend'
    },
    // PHP
    {
      title: 'Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: '$even = array_filter($arr, fn($x) => $x % 2 === 0);',
      language: 'PHP',
      category: 'Backend'
    },
    // Scala
    {
      title: 'List filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'val even = list.filter(_ % 2 == 0)',
      language: 'Scala',
      category: 'Backend'
    },
    // Perl
    {
      title: 'Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: '@even = grep { $_ % 2 == 0 } @arr;',
      language: 'Perl',
      category: 'Backend'
    },
    // R
    {
      title: 'Vektor filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'even <- v[v %% 2 == 0]',
      language: 'R',
      category: 'Datenanalyse'
    },
    // Matlab
    {
      title: 'Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'even = arr(mod(arr,2)==0);',
      language: 'Matlab',
      category: 'Datenanalyse'
    },
    // Dart
    {
      title: 'List filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'var even = list.where((x) => x % 2 == 0).toList();',
      language: 'Dart',
      category: 'Frontend'
    },
    // C
    {
      title: 'Array summieren',
      description: 'Summe aller Elemente eines Arrays.',
      code: 'int sum = 0;\nfor(int i=0;i<n;i++){ sum += arr[i]; }',
      language: 'C',
      category: 'Backend'
    },
    // Clojure
    {
      title: 'Map filtern',
      description: 'Alle Werte größer 10.',
      code: '(filter #(> % 10) [5 15 20])',
      language: 'Clojure',
      category: 'Backend'
    },
    // Haskell
    {
      title: 'Liste filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'even = filter even [1..10]',
      language: 'Haskell',
      category: 'Backend'
    },
    // Julia
    {
      title: 'Array filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'even = filter(x -> x % 2 == 0, arr)',
      language: 'Julia',
      category: 'Datenanalyse'
    },
    // Objective-C
    {
      title: 'Array iterieren',
      description: 'Alle Elemente ausgeben.',
      code: 'for (NSNumber *n in array) {\n  NSLog(@"%@", n);\n}',
      language: 'Objective-C',
      category: 'Backend'
    },
    // Lua
    {
      title: 'Tabelle filtern',
      description: 'Alle Werte größer 10.',
      code: 'for i,v in ipairs(tbl) do\n  if v > 10 then print(v) end\nend',
      language: 'Lua',
      category: 'Backend'
    },
    // Groovy
    {
      title: 'List filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'def even = list.findAll { it % 2 == 0 }',
      language: 'Groovy',
      category: 'Backend'
    },
    // Powershell
    {
      title: 'Dateien zählen',
      description: 'Zählt alle Dateien im Verzeichnis.',
      code: '(Get-ChildItem | Measure-Object).Count',
      language: 'Powershell',
      category: 'DevOps'
    },
    // VBA
    {
      title: 'Zellen zählen',
      description: 'Zählt alle nicht-leeren Zellen in Spalte A.',
      code: 'Dim count As Integer\ncount = WorksheetFunction.CountA(Range("A:A"))',
      language: 'VBA',
      category: 'Office'
    },
    // Fortran
    {
      title: 'Array summieren',
      description: 'Summe aller Elemente eines Arrays.',
      code: 'sum = 0\nDO i = 1, n\n  sum = sum + arr(i)\nEND DO',
      language: 'Fortran',
      category: 'Backend'
    },
    // Erlang
    {
      title: 'Liste filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: '[X || X <- List, X rem 2 == 0]',
      language: 'Erlang',
      category: 'Backend'
    },
    // Elixir
    {
      title: 'Liste filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'Enum.filter(list, fn x -> rem(x, 2) == 0 end)',
      language: 'Elixir',
      category: 'Backend'
    },
    // F#
    {
      title: 'Liste filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'let even = List.filter (fun x -> x % 2 = 0) list',
      language: 'F#',
      category: 'Backend'
    },
    // OCaml
    {
      title: 'Liste filtern',
      description: 'Alle geraden Zahlen filtern.',
      code: 'let even = List.filter (fun x -> x mod 2 = 0) list',
      language: 'OCaml',
      category: 'Backend'
    },
    // Assembly (x86)
    {
      title: 'Register addieren',
      description: 'Addiert zwei Registerwerte.',
      code: 'mov eax, 5\nadd eax, 3',
      language: 'Assembly',
      category: 'Low-Level'
    },
    // PostgreSQL
    {
      title: 'Upsert (INSERT ... ON CONFLICT)',
      description: 'Fügt einen Datensatz ein oder aktualisiert ihn bei Konflikt.',
      code: 'INSERT INTO users (id, name) VALUES (1, \'Max\') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;',
      language: 'PostgreSQL',
      category: 'Datenbank'
    },
    // zsh
    {
      title: 'Alle .txt-Dateien zählen',
      description: 'Zählt alle .txt-Dateien im Verzeichnisbaum.',
      code: 'print $(find . -name "*.txt" | wc -l)',
      language: 'zsh',
      category: 'DevOps'
    },
    // Flask (Python)
    {
      title: 'Hello World Route',
      description: 'Einfache Route in Flask.',
      code: 'from flask import Flask\napp = Flask(__name__)\n@app.route("/")\ndef hello():\n    return "Hello, World!"',
      language: 'Python',
      category: 'Web'
    },
    // Pandas (Python)
    {
      title: 'DataFrame filtern',
      description: 'Zeilen mit Wert > 10 filtern.',
      code: 'import pandas as pd\ndf = pd.DataFrame({"a": [5, 15, 20]})\ndf2 = df[df["a"] > 10]',
      language: 'Python',
      category: 'Data Science'
    },
    // TensorFlow (Python)
    {
      title: 'Einfaches neuronales Netz',
      description: 'Kleines Keras Sequential-Modell.',
      code: 'import tensorflow as tf\nmodel = tf.keras.Sequential([tf.keras.layers.Dense(10, activation="relu"), tf.keras.layers.Dense(1)])',
      language: 'Python',
      category: 'Machine Learning'
    },
    // Regex
    {
      title: 'E-Mail validieren',
      description: 'Regulärer Ausdruck für E-Mail-Adressen.',
  code: '^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
      language: 'Regex',
      category: 'Validierung'
    },
    // Node.js
    {
      title: 'HTTP-Server',
      description: 'Einfacher HTTP-Server mit Node.js.',
      code: 'const http = require("http");\nhttp.createServer((req, res) => {\n  res.end("Hello World");\n}).listen(3000);',
      language: 'JavaScript',
      category: 'Backend'
    },
    // Netzwerk (Python)
    {
      title: 'TCP-Client',
      description: 'Verbindet sich zu einem TCP-Server.',
      code: 'import socket\ns = socket.socket()\ns.connect(("localhost", 1234))',
      language: 'Python',
      category: 'Netzwerk'
    },
    // Security (Bash)
    {
      title: 'Datei mit sha256 prüfen',
      description: 'Berechnet und prüft den SHA256-Hash einer Datei.',
      code: 'echo "<hash>  datei.txt" | sha256sum -c',
      language: 'Bash',
      category: 'Security'
    },
    // AWS CLI
    {
      title: 'S3 Bucket auflisten',
      description: 'Listet alle S3 Buckets auf.',
      code: 'aws s3 ls',
      language: 'AWS CLI',
      category: 'Cloud'
    },
    // Jest (JavaScript)
    {
      title: 'Test für eine Funktion',
      description: 'Einfacher Unit-Test mit Jest.',
      code: 'test("addiert zwei Zahlen", () => {\n  expect(1 + 2).toBe(3);\n});',
      language: 'JavaScript',
      category: 'Testing'
    },
    // Makefile
    {
      title: 'Build-Target',
      description: 'Ein einfaches Build-Target.',
      code: 'build:\n\tgcc main.c -o main',
      language: 'Makefile',
      category: 'Build'
    },
    // Docker
    {
      title: 'Dockerfile für Node.js',
      description: 'Einfaches Dockerfile für Node.js-App.',
      code: 'FROM node:18\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ["npm", "start"]',
      language: 'Docker',
      category: 'DevOps'
    },
    // Kubernetes
    {
      title: 'Deployment YAML',
      description: 'Kubernetes Deployment für eine App.',
      code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: my-app\n  template:\n    metadata:\n      labels:\n        app: my-app\n    spec:\n      containers:\n      - name: my-app\n        image: my-app:latest',
      language: 'YAML',
      category: 'DevOps'
    },
    // Ansible
    {
      title: 'Ansible Playbook',
      description: 'Installiert nginx auf Ubuntu.',
      code: '- hosts: all\n  become: yes\n  tasks:\n    - name: Install nginx\n      apt:\n        name: nginx\n        state: present',
      language: 'YAML',
      category: 'DevOps'
    },
    // React
    {
      title: 'useEffect Hook',
      description: 'Führt Code nach dem Rendern aus.',
      code: 'useEffect(() => {\n  // Code\n}, []);',
      language: 'JavaScript',
      category: 'Frontend'
    },
    // Vue
    {
      title: 'Reaktives Data Property',
      description: 'Definiert ein reaktives Property.',
      code: 'data() {\n  return { count: 0 }\n}',
      language: 'JavaScript',
      category: 'Frontend'
    },
    // Angular
    {
      title: 'Component Decorator',
      description: 'Definiert eine Angular-Komponente.',
      code: '@Component({\n  selector: "app-root",\n  templateUrl: "./app.component.html"\n})',
      language: 'TypeScript',
      category: 'Frontend'
    },
    // Svelte
    {
      title: 'Reaktive Variable',
      description: 'Reaktive Variable in Svelte.',
      code: 'let count = 0;\n$: doubled = count * 2;',
      language: 'JavaScript',
      category: 'Frontend'
    },
    // Spring Boot
    {
      title: 'REST Controller',
      description: 'Ein REST-Controller in Spring Boot.',
      code: '@RestController\npublic class HelloController {\n  @GetMapping("/")\n  public String hello() { return "Hello World"; }\n}',
      language: 'Java',
      category: 'Backend'
    },
    // Django
    {
      title: 'View-Funktion',
      description: 'Einfache View in Django.',
      code: 'from django.http import HttpResponse\ndef hello(request):\n    return HttpResponse("Hello World")',
      language: 'Python',
      category: 'Web'
    },
    // FastAPI
    {
      title: 'GET Endpoint',
      description: 'Ein GET-Endpoint mit FastAPI.',
      code: 'from fastapi import FastAPI\napp = FastAPI()\n@app.get("/")\ndef read_root():\n    return {"Hello": "World"}',
      language: 'Python',
      category: 'Web'
    },
    // Express
    {
      title: 'GET Route',
      description: 'Einfache GET-Route mit Express.',
      code: 'app.get("/", (req, res) => res.send("Hello World"));',
      language: 'JavaScript',
      category: 'Backend'
    },
    // Laravel
    {
      title: 'Route definieren',
      description: 'Definiert eine Route in Laravel.',
      code: 'Route::get("/", function () { return "Hello World"; });',
      language: 'PHP',
      category: 'Web'
    },
    // Symfony
    {
      title: 'Controller-Methode',
      description: 'Eine Controller-Methode in Symfony.',
      code: 'public function index(): Response {\n    return new Response("Hello World");\n}',
      language: 'PHP',
      category: 'Web'
    },
    // ASP.NET
    {
      title: 'Minimal API',
      description: 'Minimal API in ASP.NET Core.',
      code: 'var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\napp.MapGet("/", () => "Hello World");\napp.Run();',
      language: 'C#',
      category: 'Web'
    },
    // Unity
    {
      title: 'Bewegung eines Objekts',
      description: 'Bewegt ein Objekt in Unity.',
      code: 'transform.Translate(Vector3.forward * Time.deltaTime);',
      language: 'C#',
      category: 'GameDev'
    },
    // Unreal
    {
      title: 'Actor bewegen (Blueprint)',
      description: 'Bewegt einen Actor in Unreal Engine (Blueprint).',
      code: 'AddActorWorldOffset(DeltaLocation);',
      language: 'Blueprint',
      category: 'GameDev'
    },
    // OpenGL
    {
      title: 'Buffer erstellen',
      description: 'OpenGL Buffer-Objekt erstellen.',
      code: 'GLuint vbo;\nglGenBuffers(1, &vbo);',
      language: 'C',
      category: 'Graphics'
    },
    // WebGL
    {
      title: 'Shader kompilieren',
      description: 'Shader in WebGL kompilieren.',
      code: 'const shader = gl.createShader(gl.VERTEX_SHADER);\ngl.shaderSource(shader, src);\ngl.compileShader(shader);',
      language: 'JavaScript',
      category: 'Graphics'
    },
    // Three.js
    {
      title: 'Szene erstellen',
      description: 'Erstellt eine Three.js-Szene.',
      code: 'const scene = new THREE.Scene();',
      language: 'JavaScript',
      category: 'Graphics'
    },
    // PyTorch
    {
      title: 'Tensor erstellen',
      description: 'Erstellt einen PyTorch-Tensor.',
      code: 'import torch\nt = torch.tensor([1,2,3])',
      language: 'Python',
      category: 'Machine Learning'
    },
    // Scikit-learn
    {
      title: 'Lineares Modell fitten',
      description: 'Lineare Regression mit scikit-learn.',
      code: 'from sklearn.linear_model import LinearRegression\nmodel = LinearRegression().fit(X, y)',
      language: 'Python',
      category: 'Machine Learning'
    },
    // Matplotlib
    {
      title: 'Plot erstellen',
      description: 'Ein einfacher Plot mit Matplotlib.',
      code: 'import matplotlib.pyplot as plt\nplt.plot([1,2,3],[4,5,6])\nplt.show()',
      language: 'Python',
      category: 'Data Science'
    },
    // Plotly
    {
      title: 'Interaktiver Plot',
      description: 'Interaktiver Plot mit Plotly.',
      code: 'import plotly.express as px\nfig = px.line(x=[1,2,3], y=[4,5,6])\nfig.show()',
      language: 'Python',
      category: 'Data Science'
    },
    // D3.js
    {
      title: 'SVG-Element erstellen',
      description: 'Erstellt ein SVG mit D3.js.',
      code: 'd3.select("body").append("svg").attr("width",100).attr("height",100);',
      language: 'JavaScript',
      category: 'DataViz'
    },
    // Chart.js
    {
      title: 'Balkendiagramm',
      description: 'Erstellt ein Balkendiagramm mit Chart.js.',
      code: 'new Chart(ctx, { type: "bar", data: {...} });',
      language: 'JavaScript',
      category: 'DataViz'
    },
    // Selenium
    {
      title: 'Seite öffnen',
      description: 'Öffnet eine Webseite mit Selenium.',
      code: 'from selenium import webdriver\ndriver = webdriver.Chrome()\ndriver.get("https://example.com")',
      language: 'Python',
      category: 'Testing'
    },
    // Cypress
    {
      title: 'Seite testen',
      description: 'Testet eine Seite mit Cypress.',
      code: 'cy.visit("/")\ncy.contains("Hello World")',
      language: 'JavaScript',
      category: 'Testing'
    },
    // Playwright
    {
      title: 'Seite öffnen',
      description: 'Öffnet eine Seite mit Playwright.',
      code: 'const { chromium } = require("playwright");\n(async () => {\n  const browser = await chromium.launch();\n  const page = await browser.newPage();\n  await page.goto("https://example.com");\n})();',
      language: 'JavaScript',
      category: 'Testing'
    },
    // JUnit
    {
      title: 'Einfacher Test',
      description: 'JUnit-Testmethode.',
      code: '@Test\npublic void testAdd() {\n  assertEquals(3, 1+2);\n}',
      language: 'Java',
      category: 'Testing'
    },
    // Mocha
    {
      title: 'Test mit Mocha',
      description: 'Ein Testfall mit Mocha.',
      code: 'describe("add", () => {\n  it("should add", () => {\n    assert.equal(1+2, 3);\n  });\n});',
      language: 'JavaScript',
      category: 'Testing'
    },
    // Chai
    {
      title: 'Test mit Chai',
      description: 'Ein Testfall mit Chai.',
      code: 'expect(1+2).to.equal(3);',
      language: 'JavaScript',
      category: 'Testing'
    },
    // Pytest
    {
      title: 'Testfunktion',
      description: 'Ein Test mit pytest.',
      code: 'def test_add():\n    assert 1+2 == 3',
      language: 'Python',
      category: 'Testing'
    },
    // RSpec
    {
      title: 'Test mit RSpec',
      description: 'Ein Testfall mit RSpec.',
      code: 'expect(1+2).to eq(3)',
      language: 'Ruby',
      category: 'Testing'
    },
    // Jasmine
    {
      title: 'Test mit Jasmine',
      description: 'Ein Testfall mit Jasmine.',
      code: 'expect(1+2).toBe(3);',
      language: 'JavaScript',
      category: 'Testing'
    },
    // Bash Advanced
    {
      title: 'Dateien nach Größe sortieren',
      description: 'Listet Dateien nach Größe sortiert.',
      code: 'ls -lhS',
      language: 'Bash',
      category: 'DevOps'
    },
    // Powershell Advanced
    {
      title: 'Prozesse nach CPU sortieren',
      description: 'Listet Prozesse nach CPU-Auslastung.',
      code: 'Get-Process | Sort-Object CPU -Descending',
      language: 'Powershell',
      category: 'DevOps'
    },
    // Git
    {
      title: 'Branch erstellen',
      description: 'Erstellt einen neuen Branch.',
      code: 'git checkout -b feature-branch',
      language: 'Git',
      category: 'VCS'
    },
    // SVN
    {
      title: 'Checkout',
      description: 'Checkt ein Repository aus.',
      code: 'svn checkout https://example.com/repo',
      language: 'SVN',
      category: 'VCS'
    },
    // Mercurial
    {
      title: 'Clone',
      description: 'Klonen eines Repos mit Mercurial.',
      code: 'hg clone https://example.com/repo',
      language: 'Mercurial',
      category: 'VCS'
    },
    // CI/CD
    {
      title: 'GitHub Actions Workflow',
      description: 'Einfacher CI-Workflow.',
      code: 'name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Run Tests\n        run: npm test',
      language: 'YAML',
      category: 'CI/CD'
    },
    // GitLab CI
    {
      title: 'GitLab CI Pipeline',
      description: 'Einfaches .gitlab-ci.yml Beispiel.',
      code: 'stages:\n  - test\ntest_job:\n  stage: test\n  script:\n    - npm install\n    - npm test',
      language: 'YAML',
      category: 'CI/CD'
    },
    // Travis
    {
      title: 'Travis CI Config',
      description: 'Minimal .travis.yml.',
      code: 'language: node_js\nnode_js:\n  - "18"\nscript:\n  - npm test',
      language: 'YAML',
      category: 'CI/CD'
    },
    // CircleCI
    {
      title: 'CircleCI Config',
      description: 'Minimal .circleci/config.yml.',
      code: 'version: 2.1\njobs:\n  build:\n    docker:\n      - image: cimg/node:18.0\n    steps:\n      - checkout\n      - run: npm install\n      - run: npm test',
      language: 'YAML',
      category: 'CI/CD'
    },
    // Jenkins
    {
      title: 'Jenkinsfile',
      description: 'Minimal Jenkins Pipeline.',
      code: 'pipeline {\n  agent any\n  stages {\n    stage("Build") {\n      steps {\n        sh "npm install"\n      }\n    }\n  }\n}',
      language: 'Groovy',
      category: 'CI/CD'
    },
    // Azure DevOps
    {
      title: 'Azure Pipeline',
      description: 'Minimal azure-pipelines.yml.',
      code: 'trigger:\n- main\npool:\n  vmImage: ubuntu-latest\nsteps:\n- script: npm install\n- script: npm test',
      language: 'YAML',
      category: 'CI/CD'
    },
    // Google Cloud CLI
    {
      title: 'GCP Projekt setzen',
      description: 'Setzt das aktive GCP-Projekt.',
      code: 'gcloud config set project PROJECT_ID',
      language: 'Shell',
      category: 'Cloud'
    },
    // Azure CLI
    {
      title: 'Resource Group erstellen',
      description: 'Erstellt eine Azure Resource Group.',
      code: 'az group create --name myGroup --location westeurope',
      language: 'Shell',
      category: 'Cloud'
    },
    // Terraform
    {
      title: 'AWS Provider',
      description: 'Minimaler Terraform AWS Provider.',
      code: 'provider "aws" {\n  region = "eu-central-1"\n}',
      language: 'HCL',
      category: 'Cloud'
    },
    // Helm
    {
      title: 'Chart installieren',
      description: 'Installiert ein Helm-Chart.',
      code: 'helm install my-release bitnami/nginx',
      language: 'Shell',
      category: 'DevOps'
    }
    ,
    // JavaScript
    {
      title: 'Asynchrones File-Reading',
      description: 'Liest eine Datei asynchron ein (Node.js).',
      code: 'const fs = require("fs");\nfs.readFile("datei.txt", "utf8", (err, data) => {\n  if (err) throw err;\n  console.log(data);\n});',
      language: 'JavaScript',
      category: 'Backend'
    },
    {
      title: 'Array shufflen',
      description: 'Mischt ein Array mit Fisher-Yates.',
      code: 'function shuffle(arr) {\n  for (let i = arr.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [arr[i], arr[j]] = [arr[j], arr[i]];\n  }\n}',
      language: 'JavaScript',
      category: 'Algorithmus'
    },
    // Python
    {
      title: 'JSON serialisieren',
      description: 'Objekt als JSON speichern.',
      code: 'import json\ndata = {"a": 1}\nwith open("data.json", "w") as f:\n    json.dump(data, f)',
      language: 'Python',
      category: 'Backend'
    },
    {
      title: 'REST-API Call',
      description: 'HTTP-Request mit requests.',
      code: 'import requests\nr = requests.get("https://api.example.com")\nprint(r.json())',
      language: 'Python',
      category: 'Web'
    },
    // Java
    {
      title: 'Datei einlesen',
      description: 'Liest eine Datei zeilenweise ein.',
      code: 'try (BufferedReader br = new BufferedReader(new FileReader("datei.txt"))) {\n  String line;\n  while ((line = br.readLine()) != null) {\n    System.out.println(line);\n  }\n}',
      language: 'Java',
      category: 'Backend'
    },
    {
      title: 'Hash generieren',
      description: 'SHA-256 Hash eines Strings.',
      code: 'MessageDigest digest = MessageDigest.getInstance("SHA-256");\nbyte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));',
      language: 'Java',
      category: 'Security'
    },
    // C#
    {
      title: 'Datei schreiben',
      description: 'Textdatei schreiben.',
      code: 'File.WriteAllText("datei.txt", "Hallo Welt");',
      language: 'C#',
      category: 'Backend'
    },
    {
      title: 'HTTP-Request',
      description: 'GET-Request mit HttpClient.',
      code: 'var client = new HttpClient();\nvar result = await client.GetStringAsync("https://example.com");',
      language: 'C#',
      category: 'Web'
    },
    // C++
    {
      title: 'Datei schreiben',
      description: 'Schreibt Text in eine Datei.',
      code: '#include <fstream>\nstd::ofstream("datei.txt") << "Hallo Welt";',
      language: 'C++',
      category: 'Backend'
    },
    {
      title: 'Vektor umdrehen',
      description: 'Dreht einen Vektor um.',
      code: '#include <algorithm>\nstd::reverse(v.begin(), v.end());',
      language: 'C++',
      category: 'Algorithmus'
    },
    // Go
    {
      title: 'HTTP Server',
      description: 'Einfacher HTTP-Server in Go.',
      code: 'http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n  fmt.Fprintln(w, "Hello World")\n})\nlog.Fatal(http.ListenAndServe(":8080", nil))',
      language: 'Go',
      category: 'Web'
    },
    {
      title: 'Datei lesen',
      description: 'Liest eine Datei komplett ein.',
      code: 'data, err := ioutil.ReadFile("datei.txt")\nif err != nil { log.Fatal(err) }\nfmt.Println(string(data))',
      language: 'Go',
      category: 'Backend'
    },
    // Rust
    {
      title: 'Datei lesen',
      description: 'Liest eine Datei komplett ein.',
      code: 'let content = std::fs::read_to_string("datei.txt")?;',
      language: 'Rust',
      category: 'Backend'
    },
    {
      title: 'HashMap erstellen',
      description: 'Erstellt eine HashMap.',
      code: 'use std::collections::HashMap;\nlet mut map = HashMap::new();',
      language: 'Rust',
      category: 'Backend'
    },
    // PHP
    {
      title: 'cURL GET Request',
      description: 'HTTP-Request mit cURL.',
      code: '$ch = curl_init("https://example.com");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n$response = curl_exec($ch);\ncurl_close($ch);',
      language: 'PHP',
      category: 'Web'
    },
    {
      title: 'JSON dekodieren',
      description: 'JSON-String in Array umwandeln.',
      code: '$arr = json_decode($json, true);',
      language: 'PHP',
      category: 'Backend'
    },
    // Ruby
    {
      title: 'HTTP GET Request',
      description: 'GET-Request mit Net::HTTP.',
      code: 'require "net/http"\nNet::HTTP.get(URI("https://example.com"))',
      language: 'Ruby',
      category: 'Web'
    },
    {
      title: 'Hash zu JSON',
      description: 'Hash in JSON umwandeln.',
      code: 'require "json"\nhash = {a: 1}\njson = hash.to_json',
      language: 'Ruby',
      category: 'Backend'
    },
    // TypeScript
    {
      title: 'Promise mit async/await',
      description: 'Promise mit async/await auflösen.',
      code: 'async function foo() {\n  const res = await fetch("/api");\n  return res.json();\n}',
      language: 'TypeScript',
      category: 'Frontend'
    },
    {
      title: 'Readonly Array',
      description: 'Readonly Array in TypeScript.',
      code: 'const arr: ReadonlyArray<number> = [1,2,3];',
      language: 'TypeScript',
      category: 'Frontend'
    },
    // SQL
    {
      title: 'Inner Join',
      description: 'Verknüpft zwei Tabellen.',
      code: 'SELECT * FROM t1 INNER JOIN t2 ON t1.id = t2.t1_id;',
      language: 'SQL',
      category: 'Datenbank'
    },
    {
      title: 'Update mit WHERE',
      description: 'Aktualisiert einen Wert mit WHERE.',
      code: 'UPDATE users SET name = "Max" WHERE id = 1;',
      language: 'SQL',
      category: 'Datenbank'
    },
    // Bash
    {
      title: 'Datei Zeilen zählen',
      description: 'Zählt Zeilen in einer Datei.',
      code: 'wc -l < datei.txt',
      language: 'Bash',
      category: 'DevOps'
    },
    {
      title: 'Datei kopieren',
      description: 'Kopiert eine Datei.',
      code: 'cp quelle.txt ziel.txt',
      language: 'Bash',
      category: 'DevOps'
    },
    // HTML
    {
      title: 'Meta-Viewport',
      description: 'Responsive Viewport für Mobile.',
      code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      language: 'HTML',
      category: 'Frontend'
    },
    {
      title: 'Bild einbinden',
      description: 'Bild mit Alt-Text einbinden.',
      code: '<img src="bild.jpg" alt="Beschreibung">',
      language: 'HTML',
      category: 'Frontend'
    },
    // CSS
    {
      title: 'Media Query',
      description: 'Stile für kleine Bildschirme.',
      code: '@media (max-width: 600px) { body { font-size: 14px; } }',
      language: 'CSS',
      category: 'Frontend'
    },
    {
      title: 'Box-Shadow',
      description: 'Schatten für ein Element.',
      code: 'div { box-shadow: 0 2px 8px rgba(0,0,0,0.2); }',
      language: 'CSS',
      category: 'Frontend'
    },
    // Swift
    {
      title: 'Dictionary filtern',
      description: 'Filtert ein Dictionary nach Wert.',
      code: 'let filtered = dict.filter { $0.value > 10 }',
      language: 'Swift',
      category: 'Backend'
    },
    {
      title: 'String zu Int',
      description: 'Konvertiert String zu Int.',
      code: 'let num = Int("42")',
      language: 'Swift',
      category: 'Backend'
    },
    // Kotlin
    {
      title: 'Map filtern',
      description: 'Filtert eine Map nach Wert.',
      code: 'val filtered = map.filter { it.value > 10 }',
      language: 'Kotlin',
      category: 'Backend'
    },
    {
      title: 'String zu Int',
      description: 'Konvertiert String zu Int.',
      code: 'val num = "42".toInt()',
      language: 'Kotlin',
      category: 'Backend'
    }
  ];
  await Snippet.insertMany(snippets);
  res.json({ success: true, count: snippets.length });
});

mongoose.connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB-Verbindung fehlgeschlagen:', err));
