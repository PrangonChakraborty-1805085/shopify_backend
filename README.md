

<div align="center">

![](images/shopify.png)

<h2 align="center">SHOPIFY</h3>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#libraries-used">Libraries Used</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#supervisor">Supervisor</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About the Project

This is the backend part the E-Commerce Site linked [here](https://github.com/PrangonChakraborty-1805085/shopify_frontend). This part contains the database queries and rest-api 

### Libraries Used

This whole frontend is built with the following libraries:

1. Node Js
2. OracleDB  

Here Nodejs is providing the backend server and OracleDB library is used for database query


<!-- GETTING STARTED -->
## Getting Started

Follow the step by step installation procedure to install and run this on your machine

### Prerequisites

Make sure you have node and oracle installed in your device.

**`NodeJs`**: Install Nodejs from [here](https://nodejs.org/en/download/)

**`Oracle`**:Install Oracle from [here](http://www.oracle.com/index.html) and register for an account of to complete the installation

**`Yarn`**:Go to terminal and run the following command
            ```
              npm install --global yarn
             ```
          To check if it is installed properly, run the following command 
             ```
             yarn --version
             ```
          If you see the version properly, you are ready to go to the next section
   
**`VS Code Setup`**:(Not mandatory..But very useful for web projects)Install VS Code from [here](https://code.visualstudio.com/download) and setup                    accordingly

### Installation

#### Getting the repository

1. Clone the repository
   ```
   git clone https://github.com/PrangonChakraborty-1805085/shopify_backend.git
   ```

2. you can also download the zip if you don't have git installed

3. After installation or download go to the repository and open command line.

4. Install yarn packages and node modules

   ```
   yarn
   ```



#### Setting up the database

1. Go to sql plus

2. Enter credentials

   ```sh
   username: sys as sysdba
   password: password
   ```

3.  Create a new user c##username

   ```sh
   create user c##your_prefered_username identified by youer_prefered_password;
   grant dba to c##username
   ```
   here 'your_prefered_username' will be replaced with any username you prefer and same for your_prefered_password


4. The SQL DUMP file is located in `Shopify_Database_Dump.sql`

5. Move to a DATABASE GUI ( Datagrip/ Navicat ) according to your preference and Connect to the user you created in step 3

6. Import data from sql file depending upon the GUI or run the sql codes in a new query. This will create an entire database for you ♥️ 

7. We are ready now for backend action



#### Setting up the environment variables

create a new file `.env` in the root directory. And the file should have the followings

```
DB_USER= YOUR_DB_USER 
DB_PASS= YOUR_DB_PASS
DB_CONNECTSTRING=localhost/orcl
PORT=YOUR_FABOURITE_PORT
JWT_SECRET_KEY= a random secret key

```

If you followed the above then the `.env` should look like this

```
DB_USER= c##your_prefered_username 
DB_PASS= youer_prefered_password
DB_CONNECTSTRING=localhost/orcl
PORT= 8800
JWT_SECRET_KEY=asdfajj45o239b

```



#### Run the project

Go to your favourite code editor and run

```
yarn start
```

You should find a line in the console..backend server is running at port (the port you provided)..All set 




## Contributors

- **Fazle Alahi Mukim** - 1805083

- **Prangon Chakraborty** - 1805085

  

## Supervisor

- Tahmid Hasan (তাহমিদ হাসান)

  - **Lecturer**
  
    ▶ **Telephone:**
    
    Cell: +8801718-765876

    ▶ **Contact:**
 
    Department of Computer Science and Engineering
    Bangladesh University of Engineering and Technology
    Dhaka-1000, Bangladesh

    ▶   **Homepage:**

    [https://tahmid04.github.io/](https://tahmid04.github.io/)




<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* http://oracle.github.io/node-oracledb/doc/api.html)


