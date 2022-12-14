# Project Report

## ScreenShots

#### List items
<kbd>![List items](./screenshots/01_list_reports.png)</kbd>

#### Display filter dropdown
<kbd>![Display filter dropdown](./screenshots/02_display_filter_dropdown.png)</kbd>

#### Display columns selection
<kbd>![Display columns selection](./screenshots/03_display_columns_selection.png)</kbd>

## Goal - Task Analysis, Planning and Team Discussion and pick up Basic Web Application, Django model, UI/UX, API, JSON, Data Manipulation

1. A web application which able to display data of TMS, server and projector, allow user to do filtering of data and download the data in CSV format.
2. Basic functionality:

   1. Requirement:
      1. Analyze and load the data of TMS, server and projector into Django model
      2. Display the data of TMS, server and projector in 3 different web UI
      3. Use Bootstrap and JQuery framework
      4. **Web GUI design must be using Flat design and consider user experience**
      5. Clear cut of frontend (Javascript) and backend (Python), only allow to use Tastypie API to communicate between frontend and backend
   2. Able to load the data of TMS, server and projector in 3 different web UI
   3. Able to allow user to do filtering based on the following criteria:
      1. TMS 
         1. Circuit
         2. Contact person
         3. TMS Version
      2. Server
         1. Cinema
         2. Server Type
         3. Software
      3. Projector
         1. Cinema
         2. Projector Type
   4. Able to let user to export the data (before filter or after filter) into CSV format
   5. Able to show when the data is being retrieved
3. Code styling need to comply with PEP8, JSHint and JSLint
4. Before actual implementation, you need to carried out the following actions:
   1. Task analysis
   2. Planning
   3. Propose your solution to your mentor and get your mentor approval


## Startup

1. Run web-report as backend
   - Create VirtualEnv and install dependencies
      ```
      cd web-report
      python -m venv venv
      .\venv\Scripts\activate.bat
      pip install -r requirements.txt
      ```
   - Start server
      ```
      python manage.py runserver
      ```

1. Run web-report-front-end as frontend
   - Install dependencies
      ```
      npm i
      ```
   - Start frontend server
      ```
      npm start
      ```
1. Run http://localhost:3000/ to serve the web page.