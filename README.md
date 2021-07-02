
# System Design Capstone

Designed, built, and deployed an E-Commerce API backend. 

Maintained over 24 million lines of csv data.

Averaging 3ms response time locally and 15ms deployed.
## Tech Stack

**Server:** Node, Express, and Axios

**Database:** MongoDB

**Deployment:** 3x AWS EC2 - 20.04 Ubuntu - 8gb SDD 1gb RAM

**Unit Testing:** Mocha, Chai w/ Chai-HTTP

**Local Stress Testing:** New Relic w/ Artillery

**Cloud Stress Testing:** Loader.io
## Optimizations

Implemented MongoDB aggregation to streamline multiple collections and queries into a single collection and query. 

Utilized AWS Application load balancer to support upwards of 1400 rps of traffic with less than 1% error rate. 
  
## Testing Results

![App Screenshot](https://github.com/SDC-Jupiter/Ratings_Reviews_API/blob/main/readme_data/test_data.jpeg)

  
## Authors

- [@cjohansen11](https://www.github.com/cjohansen11)

  
