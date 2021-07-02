db.getCollection("reviews").aggregate(
  [
      {
          "$lookup" : {
              "from" : "photos",
              "localField" : "product_id",
              "foreignField" : "product_id",
              "as" : "photos"
          }
      }
  ]
)