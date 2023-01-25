# **TAROT BACKEND**
This is the backend of Tarot App. 
<br><br><br>

# **REQUIREMENTS**:
Node : 16.13 (above) <br>
PostgreSQL: 14.6
<br><br><br>

# **START**
Clone the app by following statemnt:

```
$ git clone https://github.com/waiwong-nc/be-tarot.git
```
<br>
After the clone, please install the necessary packages by :

```
$ npm install
```
<br>


For development purpose, please refer to "Developing Section" <br><br><br><br>
# **DEVELOPMENT SECTION**

### Step 1 - **Create ".env" Files**

Before start, please create <u>**3**</u> .env file :
<br> <br>

#### **1) <u>.env.development**</u>
create a **".env.development"** file and type the following inside:
>PGDATABASE=tarot_development

<br>

#### **2) <u>.env.test**</u>
create a **".env.test"** file and type the following inside:
>PGDATABASE=tarot_test

<br>

#### <u>**3) .env.production**</u>
create a **".env.production"** file and type the following inside:
> PGDATABASE=tarot 

> DATABASE_URL=""

<br><br><br>
### Step 2 - **Data Seeding**
We have prepared sets of dummy data for development purpose.

Please work on the folloing commands in terminal
<br><br>

1) create database ***"tarot_test"*** & ***"tarot_development"***
```
$ npm run setup-dbs
```

2) Insert data into the database
```
$ npm run seed
```
<br><br><br>
### Step 3 - **Check If Data Inserted (Optional)**
Please work on the folloing commands in terminal
<br><br>
1) Enter to PostgreSQL
```
$ psql
```

2) Connect to database
```
$ \c tarot_development
```

3) Show if tables ***'users'*** and ***'enteries'*** created
```
$ \dt

(You should see something similar as below:)


           List of relations
 Schema |  Name   | Type  |    Owner    
--------+---------+-------+-------------
 public | entries | table | waishunwong
 public | users   | table | waishunwong
(2 rows)
````

4) Check the tables by ***SELECT*** command
```
$ SELECT * FROM users;
$ SELECT * FROM enteries;
```