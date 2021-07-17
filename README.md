
# Ratings & Reviews API for E-Commerce Website

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


## API Reference

#### Overview
This document should be utilized when interacting with the E-Commerce API and more specifically with the Ratings and Reviews routes. Use the documentation below you to retrieve data regarding the ratings, reviews, and associated metadata for any product within the E-Commerce API database as well as add and update any reviews and ratings. 

#### List Reviews
Returns all reviews for a given product ID

```http
  GET /reviews/
```

Query Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `product_id` | `uint` | **Required**. Specifies the product for which to retrieve reviews for |
| `page` | `uint` | **Optional**. Specifies the page of results to return. Default 1 |
| `count` | `uint` | **Optional**. Specifies the number of results per page to return. Default 5 |
| `sort` | `text` | **Optional**. Changes the sort order of reviews. Options - `newest`, `helpful`, `relevant` |

##### Response:
```http
Status: 200 OK
```

#### List Review Metadata
Returns metadata of reviews for a given product ID

```http
  GET /reviews/meta/
```

Query Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `product_id` | `uint` | **Required**. Specifies the product for which to retrieve reviews for |

##### Response:
```http
Status: 200 OK
```

#### Add New Review
Adds a new review for the given product ID

```http
  POST /reviews/
```

Body Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `product_id` | `uint` | **Required**. Specifies the product to add the review for |
| `rating` | `uint` | **Optional**. Unsigned integer (1-5) - indicating the review rating score |
| `summary` | `text` | **Optional**. Summary text of the review |
| `body` | `text` | **Optional**. Full text for the review being left |
| `recommend` | `bool` | **Optional**. Boolean value indicating if the reviewer recommends the product |
| `name` | `text` | **Optional**. Username for the individual leaving the review |
| `email` | `text` | **Optional**. Email address for the individual leaving the review |
| `photos` | `text[]` | **Optional**. Array of text urls that link to the images to be shown for each review |
| `characteristics` | `object` | **Optional**. Object of with keys representing a characteristic_id and values representing the score for that characteristics. Ie. { “14” : 3, “15” : 5 } |

##### Response:
```http
Status: 201 CREATED
```

#### Update Helpfulness of a Review
Updates the helpfulness score of the given review ID by the count of 1

```http
  PUT /reviews/:review_id/helpful/
```

Query Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `review_id` | `uint` | **Required**. Specifies the review for which you want to increase the helpfulness score |

##### Response:
```http
Status: 204 NO CONTENT
```

#### Update Reported value of a Review
Updates the helpfulness score of the given review ID by the count of 1

```http
  PUT /reviews/:review_id/report/
```

Query Parameters
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `review_id` | `uint` | **Required**. Specifies the review for which you want to report. This will result in this review no longer returning on any GET calls |

##### Response:
```http
Status: 204 NO CONTENT
```
  
## Testing Results

![App Screenshot](https://github.com/SDC-Jupiter/Ratings_Reviews_API/blob/main/readme_data/test_data.jpeg)

  
## Authors

- [@cjohansen11](https://www.github.com/cjohansen11)

  
