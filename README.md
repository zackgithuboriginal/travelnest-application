### Run application

Install dependencies
`npm i`

Run script
`npm start`

### Future/Potential improvements

This application was developed to meet the functional requirements of the assignment, however, if it was intended to be scaled up or more requirements were identified then some improvements could be implemented.

- DB Storage - This application meets the requirement of scraping an array of provided pages, however, if this was intended to be scaled up in any way it would be necessary to store the scraped data in a DB to prevent the need for re-running every time you needed to access the data.

- Frontend - If the data scraped by this application was intended to be accessible and visible to customers/non-developers it would be necessary to implement a frontend to accessibly display the data.

- Scheduled re-syncing - If the data was intended to be stored and used for a longer period it would be necessary to schedule the script to run at regular intervals to ensure that there is no discrepancy between potentially updated live data and stored data. In this case, it would need to have a way to report back any failing or no longer active pages.

- Rate limiting - If the requirements were scaled up and a large number of pages needed to be scraped it would be necessary to implement measures to avoid being identified and rate limited. These could be measures such as rotating IP addresses or self-limiting request rates.

