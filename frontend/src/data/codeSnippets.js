const codeSnippets = {
  javascript: [
    {
      name: "Hello World Function",
      code: "function helloWorld() {\n  console.log('Hello, World!');\n  return true;\n}",
      difficulty: "easy"
    },
    {
      name: "Array Map",
      code: "const doubled = numbers.map(num => num * 2);",
      difficulty: "easy"
    },
    {
      name: "Promise Chain",
      code: "fetch('/api/data')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));",
      difficulty: "medium"
    },
    {
      name: "Async Function",
      code: "async function fetchData() {\n  try {\n    const response = await fetch('/api/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(error);\n  }\n}",
      difficulty: "medium"
    },
    {
      name: "Class Definition",
      code: "class Person {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n\n  greet() {\n    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;\n  }\n}",
      difficulty: "hard"
    }
  ],
  python: [
    {
      name: "Hello World Function",
      code: "def hello_world():\n    print('Hello, World!')\n    return True",
      difficulty: "easy"
    },
    {
      name: "List Comprehension",
      code: "doubled = [num * 2 for num in numbers]",
      difficulty: "easy"
    },
    {
      name: "Context Manager",
      code: "with open('file.txt', 'r') as file:\n    content = file.read()\n    print(content)",
      difficulty: "medium"
    },
    {
      name: "Decorator",
      code: "def timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f'Function {func.__name__} took {end-start} seconds to run')\n        return result\n    return wrapper",
      difficulty: "hard"
    },
    {
      name: "Class Definition",
      code: "class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def greet(self):\n        return f'Hello, my name is {self.name} and I am {self.age} years old.'",
      difficulty: "medium"
    }
  ],
  html: [
    {
      name: "Basic HTML Structure",
      code: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>",
      difficulty: "easy"
    },
    {
      name: "Form Element",
      code: "<form action=\"/submit\" method=\"post\">\n  <label for=\"name\">Name:</label>\n  <input type=\"text\" id=\"name\" name=\"name\" required>\n  <button type=\"submit\">Submit</button>\n</form>",
      difficulty: "medium"
    },
    {
      name: "Table Structure",
      code: "<table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Age</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>John</td>\n      <td>25</td>\n    </tr>\n  </tbody>\n</table>",
      difficulty: "medium"
    }
  ],
  css: [
    {
      name: "Flexbox Layout",
      code: ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n}",
      difficulty: "medium"
    },
    {
      name: "Grid Layout",
      code: ".grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n}",
      difficulty: "medium"
    },
    {
      name: "Animation",
      code: "@keyframes slide {\n  from { transform: translateX(0); }\n  to { transform: translateX(100px); }\n}\n\n.box {\n  animation: slide 2s infinite alternate;\n}",
      difficulty: "hard"
    }
  ],
  sql: [
    {
      name: "Basic Select",
      code: "SELECT name, email\nFROM users\nWHERE age > 18\nORDER BY name ASC;",
      difficulty: "easy"
    },
    {
      name: "Join Query",
      code: "SELECT u.name, o.order_date, o.total\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.status = 'completed';",
      difficulty: "medium"
    },
    {
      name: "Subquery",
      code: "SELECT name\nFROM products\nWHERE price > (\n  SELECT AVG(price)\n  FROM products\n);",
      difficulty: "hard"
    }
  ]
};

export default codeSnippets; 