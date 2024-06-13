
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
         <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
    <li><a href="#preview">Preview</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About the Project

Restaurant-Hotel Management App made with NodeJS, Express, MySQL, ReactJS y Redux.

App para la Administración de Restaurante-Hotel desarrollada con NodeJS, Express, MySQL, ReactJS y Redux.

### Built With

-   [ReactJS](https://es.reactjs.org/)
-   [Express](https://expressjs.com/es/)
-   [NodeJS](https://nodejs.org/es/)
-   [Redux](https://redux.js.org/)
-   [Sequelize](https://sequelize.org/)
-   [MySQL](https://www.mysql.com/)
-   [AdminLTE](https://adminlte.io/)

<!-- GETTING STARTED -->

## Getting Started

### Installation

1. Clone the repo

    ```sh
    git clone https://github.com/mono789/hotel-restaurante-bar-guacari.git
    ```

2. You will need to install a [Mysql Server](https://www.mysql.com/), [WAMP](https://www.wampserver.com/en/) is also an easy tool to get started. Then create a database.

3. Go to "backend", install the dependencies.

    ```sh
    npm install
    ```

    Open ".env.example", set the database variables, then change the file name to ".env"

    ```
     NODE_ENV=development
     PORT=5000
     JWT_SECRET=[YOUR SECRET]
     DB_USER=[DATABASE USER]
     DB_NAME=[DATABASE NAME]
     DB_PASSWORD=[DATABASE PASSWORD]
     DB_HOST=[DATABASE HOST]
     DB_DIALECT=mysql
    ```

    Fill the database. These commands will make the work. The first one creates the structure, the second fills the database with some initial data.

    ```sh
        npx sequelize-cli db:migrate
        npx sequelize-cli db:seed:all
    ```

4. RUN
    ```sh
    npm run dev
    ```
5. Now, go to "frontend". Install the dependencies
    ```sh
    npm install
    ```
    You will need to set a proxy, open package.json and write this. More information about proxies [here](https://create-react-app.dev/docs/proxying-api-requests-in-development/).
    ```sh
    "proxy": "http://localhost:5000"
    ```
6. RUN
    ```sh
    npm start
    ```
<!-- CONTACT -->

## Contact

Juan Andrés Rivera - juanandresrivera0@gmail.com 
Phone: 3243219890

Kevin Estrada Del Valle - estradak325@gmail.com Phone: 3005771152

Project Link: [https://github.com/mono789/hotel-restaurante-bar-guacari](https://github.com/mono789/hotel-restaurante-bar-guacari)

<!-- ACKNOWLEDGEMENTS -->

<!-- PREVIEW -->
