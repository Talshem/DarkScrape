# DarkScrape

## Features:
- Delays search requests to the server using debounce library
- Can filter tickets from a specific date
- Normalized title,content,date and author parameters
- Data saved in Mongo database using a web scraper
- App served with a docker-compose environment
- Data is analyzed to represent positive & negative words used in each ticket, using sentiment library
- Two charts representing the usage of positive & negative words daily and number of tickets posted daily

### Challenges I've faced
- Using puppeteer inside a docker-container aswell as scraping a tor browser in it
- Serving the app in a docker-compose environment


### Lessons I've learned
- The efficiency of using a web scraper code for any recurring activity we are doing in the web
- The convenience of using a docker-compose environment, especially with easing the communication between app's services


-------------------------------------------------------


![image](/image_1.png)

-------------------------------------------------------

![image](/image_2.png)

-------------------------------------------------------

# Docker-compose environment
![image](/image_3.png)

-------------------------------------------------------

# Scraper navigates through pages
![gif](/scraper/test.gif)
