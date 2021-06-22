/*

This file will lay out any requests that are needed to be made to the server and what parameters they take.


GET @ /reviews/
  Params:
    - page        - int   - Selects the page of results to return. Default 1
    - count       - int   - Specififes how many results per page to return. Default 5
    - sort        - text  - Changes the sort order of reviews to be based on "newest", "helpful", "relevant"
    - product_id  - int   - Specifies the product for which to retrieve reviews
  Response - 200 OK

GET @ /reviews/meta/
  Params:
    - product_id  - int   - Required ID of the product for which data should be returned
  Reponse - 200 OK

POST @ /reviews/
  Params:
    - product_id      - int     - REQUIRED ID of the product to post the review for
    - rating          - int     - Integer (1-5) indicating the review rating
    - summary         - text    - Summary text of the review
    - body            - text    - Continued or full text of the review
    - recommend       - bool    - Value indicating if the reviewer recommends the product
    - name            - text    - Username for question asker
    - email           - text    - Email address for question asker
    - photos          - [text]  - Array of text urls that link to images to be shown
    - characteristics - object  - Object of keys representing charactistic_id and values representing the review value for that characteristic. { "14" : 5, "15" : 5 //...}
  Response - 201 CREATED

PUT @ /reviews/:review_id/helpful/      INCREASES HELPFULNESS SCORE BY 1 ON OBJ W/ MATCHING review_id
  Params:
    - review_id - int - REQUIRED ID of the review to update
  Response - 204 NO CONTENT

PUT @ /reviews/:review_id/report        REMOVES OBJ W/ MATCHING review_id FROM RESPONSE RESULTS
  Params:
    - review_id - int - REQUIRED ID of the review to update
  Response - 204 NO CONTENT

*/