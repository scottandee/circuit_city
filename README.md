# Circuit City: Electrical Equipment E-Commerce API

<br />
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#-introduction">Introduction</a></li>
    <li><a href="#-technologies-used">Technologies Used</a></li>
    <li><a href="#-project-structure">Project Structure</a></li>
    <li><a href="#-installation">Installation</a></li>
    <li><a href="#-usage">Usage</a></li>
    <li><a href="#-contributing">Contributing</a></li>
    <li><a href="#-licensing">Licensing</a></li>
  </ol>
</details>
<br />

## Introduction
Circuit City is an online market for the distribution of everything electrical, from hand tools to large machinery, circuit city aims to provide a comprehensive marketplace for professionals, resellers and consumers in the electrical industry.

### API Documentation
You can read the full API documentation at [link](https://documenter.getpostman.com/view/28166032/2sA35JzKhh).

### The Team
* **Olayinkascott Andee**
  * Role: Developer
  * [Andee's LinkedIn](https://www.linkedin.com/in/olayinkascott-andee/)
<br />

## 💻 Technologies Used
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
<br />

## Project Structure
* `/controllers`: These are functions that generate response to requests .
* `/middlewares`: These intercept requests before it gets to the controller.
* `/models`: Data declaration for each of the resources.
* `/routes`: These contains the available routes for each resource.
* `/tests`: Unittests for functions.
* `package.json`: This file contains the project's metadata.
* `server.js`: This is the entry point into the application.
<br />

## Installation
**Prerequisites**
- Create a Mongodb Atlas account at [link](https://www.mongodb.com/cloud/atlas/register). Afterwards, create a new database with the name `CircuitCity`
- Create a cloudinary account at [link](https://cloudinary.com/)

<br />

**Installation Steps**
1. Clone the Repository.
   ```bash
   git clone git@github.com:scottandee/circuit_city.git
   ```
2. Run `npm install`
   ```bash
   npm install
   ```
4. create a `.env` file and fill it with the data below:
   ```bash
   # Environment Variables
   PORT=5000

   # DB Config
   DB_USERNAME='value'
   DB_PASSWORD='value'

   # Bcrypt salt
   SALT=value

   # JWT Secret Key
   JWT_SECRET_KEY=secret key value

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=''
   CLOUDINARY_API_KEY=''
   CLOUDINARY_API_SECRET=''
   ```
   **Note**: `value` is only a placeholder and should be substituted with the actual values. 
<br />

5. run `npm server.js`.
<br />

## Contributing
Here are some steps to follow when contributing to this project:
1. Fork the repository
2. Clone the repository into your machine
3. Install all dependencies with `npm install`
5. Make your changes
6. Write tests for your changes and make sure they pass
7. Commit your changes
8. Push your changes to your fork
9. Create a pull request to the original repository
<br />

## Licensing
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

Copyright (c) 2024 Olayinkascott Andee.

See the LICENSE file for more information.
